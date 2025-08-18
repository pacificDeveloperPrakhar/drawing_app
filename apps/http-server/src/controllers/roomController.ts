import {insertRoomParticipant, roomParticipants, rooms, users} from "common_backend/schema"
import {type Request, type Response,type NextFunction} from "express"
import {db} from "common_backend/drizzle_connection"
import jwt from "jsonwebtoken"
import {eq,and} from "drizzle-orm"
import catchAsync from "common_backend/CatchAsync";
import AppError from "common_backend/AppError";
import { createRoomSchema } from "common_backend/schema"
// room creating controller
export const createRoom=catchAsync(async function name(req:Request,res:Response,next:NextFunction){
    const {success,data}=createRoomSchema.safeParse(req.body)
    if(!success)
        throw new AppError("unable to parse the incoming data",400)

    const existing_room=await db.select().from(rooms).where(eq(rooms.name,data.name))
    if(!existing_room.length)
        throw new AppError("room already exists",400)
    const room=await db.insert(rooms).values(data).returning()
    res.status(201).json({
        status:"created",
        data
    })
})
//adding participant to the room
export const addParticipant=catchAsync(async function (req:Request,res:Response,next:NextFunction) {
    const{success,data}= insertRoomParticipant.safeParse(req.body)
    if(!success)
        throw new AppError("unable to parse the data",400)
    const roomParticipant=await db.select().from(roomParticipants).where(and(eq(roomParticipants.roomId,data.roomId),eq(roomParticipants.userId,data.userId)))
    if(roomParticipant.length)
       return res.status(201).json({
        status:"added",
        data:roomParticipant
    })
    const response=await db.insert(roomParticipants).values(data).returning()
    res.status(201).json({
        status:"added",
        data:response
    })
})