import express,{type Request,type Response,type NextFunction,type Application} from "express"
import cookieParser from "cookie-parser"
import {signin,login,authenticateRequest} from "./controllers/authentiction"

let sequence_count = 1;

const  app:Application = express(); 
app.use(cookieParser())
app.use("/sign",signin)
app.use("/login",login)
app.use("/create_room",authenticateRequest,(req:Request,res:Response,next:NextFunction)=>{
    console.log("room has been created")
})


// export default app
export default app