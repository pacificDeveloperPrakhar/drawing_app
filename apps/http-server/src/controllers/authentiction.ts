import {type Request, type Response,type NextFunction} from "express"
import {db} from "common_backend/drizzle_connection"
import {users,type users as userType,insertUserSchema, loginUser} from "common_backend/schema"
import jwt from "jsonwebtoken"
import {eq} from "drizzle-orm"
import catchAsync from "common_backend/CatchAsync";
import AppError from "common_backend/AppError";
// signin controller
export const signin=catchAsync(async function(req:Request,res:Response,next:NextFunction){
    const {success,data}=insertUserSchema.safeParse(req.body)
    if(!success)
        throw new AppError("unable to resolve the data",400)
    // checking if the user already exists if yes the return the 411 error
    const [existing_user]:userType[]=await db.select().from(users).where(eq(users.email,req.body.email))
    if(existing_user)
        throw new AppError(`user with email ${existing_user.email} already exists`,411)
    const updated_at=new Date(Date.now())
    const response_data:userType[]=await db.insert(users).values({...req.body,updated_at}).returning();
    // generated token that will be send as the cookie
    const token=jwt.sign({email:response_data[0]!.email,id:response_data[0]!.id},process.env.SECRET_KEY!)
    // sending the authentication cookie
    res.cookie("authentication_cookie",token)
    res.status(201).json({
        status:"registered",
        data
    })
    
})

//now the login controller
export const login=catchAsync(async function(req:Request,res:Response,next:NextFunction){
  const{data,success,error} =loginUser.safeParse(req.body)
  if(!success)
    throw new AppError("login credential format is incorrect",400)
// getting the user form the database
  const user:users[]=await db.select().from(users).where(eq(users.email,req.body.email))
  if(!user.length)
    throw new AppError(`user with the email ${user[0]!.email} does not exists`,403)
const token=await jwt.sign({id:user[0]!.id,email:user[0]!.email},process.env.SECRET_KEY!)
//  now generate token and then send it over the cookie
res.cookie("authentication_cookie",token)
// now send the response back
res.status(200).json({
    status:"logged in",
    data:user
})
})


// now we will create the authenticate request token middleware
export const  authenticateRequest=catchAsync(async function (req:Request,res:Response,next:NextFunction) {
    const token=res.cookie.authentication_cookie
    const {email,id}=await jwt.verify(token,process.env.SECRET_KEY!)
    // see if the user exists
    const existing_user=await db.select().from(users).where(eq(users.email,email))
    if(!existing_user.length)
        throw new AppError("authentication failed",403)
    return next()
})