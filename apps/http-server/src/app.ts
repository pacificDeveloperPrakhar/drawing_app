import dotenv from "dotenv";
import express,{type Request,type Response,type NextFunction,type Application} from "express"

dotenv.config();

let sequence_count = 1;

const  app:Application = express();
app.use("/sign",(req:Request,res:Response,next:NextFunction)=>{})
app.use("/login",(req:Request,res:Response,next:NextFunction)=>{})
app.use("/create_room",(req:Request,res:Response,next:NextFunction)=>{})


// export default app
export default app