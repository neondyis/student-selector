import mongoose from 'mongoose'
import {string} from "prop-types";

export type Block = {
    info: string,
    user: string
}

export const RoomSchema = new mongoose.Schema({
    code: String,
    blocks: [{
        info : String,
        user : String
    }],
    users: [String]
});

const Room = mongoose.models.Room || mongoose.model('Room', RoomSchema)

export default Room;
