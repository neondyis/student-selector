import mongoose from 'mongoose'


export type Block = {
    info: string,
    user: string
}

export const RoomSchema = new mongoose.Schema({
    code: String,
    blocks: [{
        info : String,
        user : String,
        isShown: Boolean
    }],
    users: [String],
    currentTurn: String,
});

const Room = mongoose.models.Room || mongoose.model('Room', RoomSchema)

export default Room;
