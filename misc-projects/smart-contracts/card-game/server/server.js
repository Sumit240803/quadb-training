const express = require("express");
const cors = require("cors");
const http = require("http");
const {Server} = require("socket.io");
const { generate } = require("./generateDeck");
const app = express();

app.use(cors());
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin : "*",
        methods : ["GET", "POST"]
    },
})
const roomDecks = {};
const roomState = {};
var card1={
    rarity : "common",
    attack : 45,
    defense : 35
}
var card2={
    rarity : "common",
    attack : 55,
    defense : 15
}
io.on("connection",(socket)=>{
    console.log("Player Connected" , socket.id);

    //Joining the game
    socket.on("join-game",(roomId)=>{
        socket.join(roomId);

        console.log(`Player Joined ${socket.id} with room id ${roomId}`);
        const deck = generate();
        socket.emit("your-deck" , deck);
        console.log(deck);
        if(!roomDecks[roomId]){
            roomDecks[roomId] = {}
        }

        roomDecks[roomId][socket.id] = deck;
        if(!roomState[roomId]){
            roomState[roomId] ={
                turn : socket.id
            }
        }
        console.log(roomDecks[roomId]);
        console.log(`Deck with player ${socket.id} is ${roomDecks[roomId][socket.id]}`) 
        socket.to(roomId).emit("player-joined", socket.id);
        
        
    })
    socket.on("attack", (roomId) => {
        if (roomDecks[roomId] && roomDecks[roomId][socket.id] && roomState[roomId]?.turn === socket.id) {
            const msg = `Player ${socket.id} attacked with ${card1.attack} points`;
            socket.emit("action", msg);
            socket.to(roomId).emit("opponent-action", msg);
            console.log("Attacked");
            const players = Object.keys(roomDecks[roomId]);
            const newPlayer = players.find(p => p!==socket.id);
            roomState[roomId].turn = newPlayer;
            io.to(roomId).emit("turn-change",newPlayer);
        }else{
            socket.emit("error","Not your turn or Some other error")
        }
    });
    
    socket.on("defend", (roomId) => {
        if (roomDecks[roomId] && roomDecks[roomId][socket.id] && roomState[roomId]?.turn === socket.id) {
        const msg = `Player ${socket.id} defended with ${card2.defense} points`;
        socket.emit("action", msg);
        socket.to(roomId).emit("opponent-action", msg);
        console.log("Defended");
        const players = Object.keys(roomDecks[roomId]);
        const newPlayer = players.find(p => p!==socket.id);
        roomState[roomId].turn = newPlayer;
        io.to(roomId).emit("turn-change",newPlayer);
        }else{
            socket.emit("error","Not your turn or Some other error")
        }
    });
    

    //Playing The Card
    socket.on("play-card",({roomId,cardData})=>{
        console.log(`Player with id ${socket.id} played ${cardData.name} with attribute ${cardData.value}`);
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