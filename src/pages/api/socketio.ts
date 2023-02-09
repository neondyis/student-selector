import { Block } from '@/lib/models/RoomModel';
import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "src/types/next";
import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";
import dbConnect from "@/lib/dbConnect";
import Room from "@/lib/models/RoomModel";

export const config = {
    api: {
        bodyParser: false,
    },
};
// TODO : Complete Typing of everything to align with typescript
// TODO : add logging for online monitor reporting

// type Room = {
//     _id: String,
//     code: String,
//     blocks: [{
//         info : String,
//         user : String,
//         isShown: Boolean
//     }],
//     users: [String],
//     currentTurn: String,
// }

export default async function handler (req: NextApiRequest, res: NextApiResponseServerIO)  {
    if (!res.socket.server.io) {
        console.log("New Socket.io server...");
        // adapt Next's net Server to http Server
        const httpServer: NetServer = res.socket.server as any;
        const io = new ServerIO(httpServer, {
            path: "/api/socketio",
        });

        await dbConnect();

        io.on('connection', (socket) => {
            console.log('Client Connect')

            socket.on("joinRoom", async (payload) => {
                const room = await Room.findOne({code: payload.code})
                if(room === null){
                    socket.emit('joinFailed')
                }else{
                    socket.join(payload.code)
                    socket.emit('joinSuccess', room)
                }
            });

            socket.on("getCurrentTurn", async (payload)=> {
              const room = await Room.findOne({code:payload.code},{currentTurn: 1})
              socket.emit('InitiateCurrentTurn', room);
              console.log('gave current turn')
            })

            socket.on("setName", async (payload) => {
                console.log(payload)
                const room = await Room.findOneAndUpdate({code: payload.code, users: { $nin:  [payload.name] }}, {$push: {users: payload.name}})
                if(room === null){
                    socket.emit('nameSetFailed')
                }else{
                    socket.emit('nameSetSuccess', {roomData : room, name: payload.name})
                }
            })

            socket.on('startSelection', async (payload)=> {
                const room  = await Room.findOneAndUpdate({code: payload.code, 'users.0': {$exists: true}},
                    [
                        {
                      "$set": {
                        "currentTurn": {  // Fetch last element from `plonks` array
                          "$arrayElemAt": [
                            "$users",
                            -1
                          ]
                        },
                        "users": {
                          "$slice": [  // Get elements from array till n-1
                            "$users",
                            {
                              "$subtract": [
                                {
                                  "$size": "$users"  // Fetches size of `users` array
                                },
                                1
                              ]
                            },
                          ],
                        },
                      }}],{new: true, returnDocument: 'after'});
                      console.log(payload)
                if(room){
                    if(payload.admin === true){
                      socket.join(payload.code)
                      socket.emit('setCurrentTurn', room)
                    }
                    socket.to(payload.code).emit('setCurrentTurn', room)
                    console.log('emitting ', room.currentTurn)
                }else{
                    socket.emit('startFailed')
                }
            })
            socket.on('revealBlock', async (payload)=> {
                const blockList = (await Room.findOne({_id: payload.id, code: payload.code})).blocks.filter((block:Block) => !block.user);
                if(blockList.length > 0){
                    const randomBlock = blockList[Math.floor(Math.random() * blockList.length)];
                    const room = await Room.findOneAndUpdate({code: payload.code, 'users': {$exists: true},
                    },
                    {
                        $set: 
                        {
                            'blocks.$[elem].user': payload.name,
                            'blocks.$[elem].isShown': true  
                        }
                      },
                      {
                        arrayFilters: [ { "elem.info": { $eq: randomBlock.info } } ] ,
                        new: true, returnDocument: 'after'
                      },
                    )
                    io.to(payload.code).emit("BlockRevealSuccess",room)
                }else{
                    io.to(payload.code).emit("BlockRevealFailed", "Possibly no more blocks to reveal");
                } 
            })
        })
        // append SocketIO server to Next.js socket server response
        res.socket.server.io = io;
    }
    res.end();
}
