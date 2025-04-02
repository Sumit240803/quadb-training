import Image from "next/image";
import MessageApp from "./components/MessageApp";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <MessageApp/>
    </div>
  );
}
