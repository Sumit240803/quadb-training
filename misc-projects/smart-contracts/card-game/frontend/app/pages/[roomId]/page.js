"use client"
import Match from '@/app/components/Match'
import { useParams } from 'next/navigation'
import React from 'react'

const GamePage = () => {
  const {roomId} = useParams();
  return (
    <div>
      {roomId ? <Match roomId={roomId}/> : "Joining"}
    </div>
  )
}

export default GamePage