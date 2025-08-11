import {Server, Socket} from "socket.io"
const io=new Server({
    cors: {
        origin: ['*'],
        methods: ["GET", "POST"],
        optionsSuccessStatus: 200,
        credentials:true
    },
    path: "/"
})

//creating the middleware to handle the incomming handshake request
io.use((Socket,next)=>{
console.log(Socket.request.headers)
 next()
})
io.on("connection",(Socket)=>{
    console.log(`${Socket.id} has been connected to the server`)
})

// now the port that it will listen to
io.listen(3004)