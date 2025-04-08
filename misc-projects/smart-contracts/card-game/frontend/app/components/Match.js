"use client";
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socketServerURL = "http://localhost:5000";

const Match = ({roomId}) => {
  const socket = useRef(null);
  const [connected, setConnected] = useState(false);
  const [deck, setDeck] = useState([]);
  //const [roomId, setRoomId] = useState("room123");
  const [playerId, setPlayerId] = useState("");
  const [turn, setTurn] = useState("");
  const [opponentPlayed, setOpponentPlayed] = useState(null);
  const [scores, setScores] = useState({});
  const [currentRound, setCurrentRound] = useState(1);
  const [opponentLastCard, setOpponentLastCard] = useState(null);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    socket.current = io(socketServerURL);

    socket.current.on("connect", () => {
      setConnected(true);
      setPlayerId(socket.current.id);
      console.log("✅ Connected:", socket.current.id);
      socket.current.emit("join-game", roomId);
    });

    socket.current.on("your-deck", (deck) => {
      setDeck(deck);
      console.log("🎴 Your Deck:", deck);
    });

    socket.current.on("player-joined", (joinedId) => {
      console.log("👥 Player Joined:", joinedId);
    });

    socket.current.on("turn-change", (turnId) => {
      setTurn(turnId);
    });

    socket.current.on("opponent-played", ({ playerId, cardData }) => {
      console.log("⚔️ Opponent played:", playerId, cardData);
      setOpponentPlayed({ playerId, cardData });
     
    });

    socket.current.on("round-result", ({ round, scores }) => {
      console.log(`🏁 Round ${round} result:`, scores);
      setScores(scores);
    
      if (round + 1 > 5) {
        const entries = Object.entries(scores);
        if (entries.length === 2) {
          const [id1, score1] = entries[0];
          const [id2, score2] = entries[1];
    
          if (score1 > score2) {
            setWinner(socket.current.id === id1 ? "You Win!" : "Opponent Wins!");
          } else if (score2 > score1) {
            setWinner(socket.current.id === id2 ? "You Win!" : "Opponent Wins!");
          } else {
            setWinner("It's a Draw!");
          }
        }
      } else {
        setCurrentRound(round + 1);
      }
    });
    
    
    return () => {
      socket.current.disconnect();
    };
  }, []);

  const playCard = (card) => {
    if (!socket.current?.id || !turn) {
      alert("⏳ Socket not ready yet.");
      return;
    }

    if (turn !== socket.current.id) {
      alert("⛔ Not your turn!");
      return;
    }

    socket.current.emit("play-card", {
      roomId,
      cardData: card,
    });

    setDeck((prev) => prev.filter((c) => c !== card));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-6 flex flex-col items-center">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-4xl font-extrabold text-center text-purple-700 mb-6">
          🎮 Socket.IO Card Battle
        </h1>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg shadow">
            <p className="font-semibold">🪪 Your ID: <span className="text-blue-700">{playerId}</span></p>
            <p className="font-semibold">🏠 Room ID: <span className="text-blue-700">{roomId}</span></p>
          </div>
  
          <div className="bg-purple-50 p-4 rounded-lg shadow">
            <p className="font-semibold">🔢 Round: <span className="text-purple-700">{currentRound}</span></p>
            <p className="font-semibold">
              🎯 Turn:{" "}
              <span className={turn === playerId ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                {turn === playerId ? "Your turn" : "Opponent's turn"}
              </span>
            </p>
          </div>
        </div>
  
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">🃏 Your Deck</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {deck.map((card, index) => (
              <div key={index} className="bg-white border border-gray-300 p-4 rounded-xl shadow-md text-center">
                <p className="text-lg font-bold">⚔️ {card.attack}</p>
                <p className="text-lg font-bold">🛡️ {card.defense}</p>
                <button
                  className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full"
                  onClick={() => playCard(card)}
                >
                  Play Card
                </button>
              </div>
            ))}
          </div>
        </div>
  
        {opponentPlayed && (
          <div className="bg-yellow-100 p-4 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-2">🧍 Opponent Played:</h2>
            <p className="text-lg">⚔️ Attack: {opponentPlayed.cardData.attack}</p>
            <p className="text-lg">🛡️ Defense: {opponentPlayed.cardData.defense}</p>
          </div>
        )}
  
  {scores && (
  <div className="bg-gray-100 p-4 rounded-lg shadow mt-6">
    <h2 className="text-xl font-semibold mb-4">📊 Scoreboard</h2>
    <div className="space-y-2">
      {Object.entries(scores).map(([id, score]) => (
        <div
          key={id}
          className={`flex justify-between items-center p-3 rounded shadow ${
            id === playerId ? "bg-blue-100" : "bg-white"
          }`}
        >
          <span className="font-medium text-gray-700">
            {id === playerId ? "🧑 You" : "🧍 Opponent"}
          </span>
          <span className="text-xl font-bold text-blue-700">{score}</span>
        </div>
      ))}
    </div>
  </div>
)}

  
        {winner && (
          <div className="mt-6 p-6 bg-green-100 border border-green-400 rounded-xl text-center shadow-lg">
            <h2 className="text-3xl font-bold text-green-700">🏆 {winner}</h2>
            <p className="mt-2 text-lg text-green-600">Game Over</p>
          </div>
        )}
      </div>
    </div>
  );
  
};

export default Match;
