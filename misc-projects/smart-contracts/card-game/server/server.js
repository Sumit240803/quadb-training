const express = require("express");
const cors = require("cors");
const http = require("http");
const {Server} = require("socket.io");
const { generate } = require("./generateDeck");
const { result } = require("./gameLogic");
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
const points = {};
const scores = {};
io.on("connection",(socket)=>{
    console.log("Player Connected" , socket.id);

    //Joining the game
    socket.on("join-game",(roomId)=>{
        socket.join(roomId);

        console.log(`Player Joined ${socket.id} with room id ${roomId}`);
        const deck = generate();
        socket.emit("your-deck" ,deck);
        console.log(JSON.stringify(deck));
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
  

    //Playing The Card
    socket.on("play-card", ({ roomId, cardData, round }) => {
        const playerId = socket.id;
        const room = roomDecks[roomId];
        if (room && room[playerId] && roomState[roomId]?.turn === playerId) {
            const [player1, player2] = Object.keys(room);
    
            if (!points[roomId]) points[roomId] = {};
            if (!points[roomId][round]) points[roomId][round] = {};
    
            const cardStats = {
                attack: cardData.attack || 0,
                defense: cardData.defense || 0
            };
            points[roomId][round][playerId] = cardStats;
    
            socket.to(roomId).emit("opponent-played", { playerId, cardData });
    
            const nextTurn = playerId === player1 ? player2 : player1;
            roomState[roomId].turn = nextTurn;
            io.to(roomId).emit("turn-change", nextTurn);
    
            console.log(`✅ Round ${round}: ${playerId} played card`, cardStats);
            console.log("Points:", JSON.stringify(points));
    
            // Only evaluate result if both players have played
            if (
                points[roomId][round][player1] &&
                points[roomId][round][player2]
            ) {
                if (!scores[roomId]) scores[roomId] = {};
                if (!scores[roomId][player1]) scores[roomId][player1] = 0;
                if (!scores[roomId][player2]) scores[roomId][player2] = 0;
    
                const score = result(points[roomId][round], player1, player2, scores, roomId);
                console.log("✅ Round result calculated:", JSON.stringify(score));
    
             
                delete points[roomId][round];
            }
        }
    });
    
    socket.on("game-result", ({ roomId, round }) => {
        console.log(`🏆 Game finished in ${roomId}`);
        
        io.to(roomId).emit("round-result", {
            round,
            scores: {
              [player1]: scores[roomId][player1],
              [player2]: scores[roomId][player2]
            }
          });
          
    });
    socket.on("disconnect", () => {
        console.log("❌ Player disconnected:", socket.id);
    });
});
const PORT = 3001;
server.listen(PORT,()=>{
    console.log(`Web Socket Running on port ${PORT}`)
})

/*  socket.on("attack", (roomId,card) => {
        if (roomDecks[roomId] && roomDecks[roomId][socket.id] && roomState[roomId]?.turn === socket.id) {
            const msg = `Player ${socket.id} attacked with ${card.attack} points`;
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
    
    socket.on("defend", (roomId,card) => {
        if (roomDecks[roomId] && roomDecks[roomId][socket.id] && roomState[roomId]?.turn === socket.id) {
        const msg = `Player ${socket.id} defended with ${card.defense} points`;
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
    */