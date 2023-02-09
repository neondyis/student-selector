import {NextApiRequest, NextApiResponse} from "next";
import dbConnect from "@/lib/dbConnect";
import Room from "@/lib/models/RoomModel";



export default async function handler(req: NextApiRequest, res: NextApiResponse):Promise<void> {
    const { method } = req

    await dbConnect();

    switch (method) {
        case 'GET':
            try {
                const rooms = await Room.find({})
                res.status(200).json({ success: true, rooms })
            } catch (error) {
                res.status(400).json({ success: false })
            }
            break
        case 'POST':
            try {
                const room = await Room.create(req.body)
                res.status(201).json({ success: true, data: room })
            } catch (error) {
                res.status(400).json({ success: false })
            }
            break
        case 'PUT':
            try {
                const {blockId,roomId,info,user,code} = req.body;
                const filter = blockId ? {'blocks':{$elemMatch: {_id:blockId}}} : roomId ? {_id : roomId } : {};
                const updateSet = code ? {'code': code} : info ? {'blocks.$.info': info} : user ? {'blocks.$.user': user} : {};
                const room = await Room.findOneAndUpdate(filter,{$set:updateSet}, {new: true})
                res.status(201).json({ success: true, data: room })
            } catch (error) {
                console.log(error)
                res.status(400).json({ success: false })
            }
            break
        default:
            res.status(400).json({ success: false })
            break
    }
}