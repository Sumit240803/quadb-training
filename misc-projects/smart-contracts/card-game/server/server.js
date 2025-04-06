const express = require("express");
const cors = require("cors");
const http = require("http");
const {Server} = require("socket.io");
const app = express();

app.use(cors());
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin : "*",
        methods : ["GET", "POST"]
    },
})
io.on("connection",(socket)=>{
    console.log("Player Connected" , socket.id);
    socket.on("join-game",(roomId)=>{
        socket.join(roomId);
        console.log(`Player Joined ${socket.id} with room id ${roomId}`);

        socket.to(roomId).emit("player-joined", socket.id);
    })
    socket.on("play-card",({roomId,cardData})=>{
        console.log(`Player with id ${socket.id} played a card with data ${cardData.value}`);
        socket.to(roomId).emit("opponent-played", cardData.suit);
    })
    socket.on("game-result", ({ roomId, result }) => {
        console.log(`🏆 Game finished in ${roomId}`);
        socket.to(roomId).emit("game-result", result);
    });
    socket.on("disconnect", () => {
        console.log("❌ Player disconnected:", socket.id);
    });
});
const PORT = 3001;
server.listen(PORT,()=>{
    console.log(`Web Socket Running on port ${PORT}`)
})