import express from "express"; //access express
// import socket from "socket.io";
import { Server } from "socket.io";

const app = express(); //initializing the server
app.use(express.static("public"));

let port = 5000;

// running express server
let server = app.listen(port, ()=>{
    console.log("listening on port " + port)
})

let io = new Server(server);
io.on("connection", (socket)=>{
    console.log("socket connection successful");
    socket.on("beginPath", (data)=>{ //received data from one computer : front-end

        // transfer data to other computers
        io.sockets.emit("beginPath", data);
    })

    socket.on("drawStroke", (data)=>{ //received data from one computer : front-end

        // transfer data to other computers
        io.sockets.emit("drawStroke", data);
    })

    socket.on("undoredo", (data)=>{ //received data from one computer : front-end

        // transfer data to other computers
        io.sockets.emit("undoredo", data);
    })
})
