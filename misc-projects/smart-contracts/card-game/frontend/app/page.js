"use client"
import Image from "next/image";
import Match from "./components/Match";
import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [roomId, setRoomId] = useState("");
  return (
    <div>
      <input value={roomId} onChange={(e)=>setRoomId(e.target.value)} placeholder="Enter Room ID"/>
      {roomId !== "" && <Link href={`/pages/${roomId}`}>Join Room {roomId} now </Link>}
    </div>
  );
}
