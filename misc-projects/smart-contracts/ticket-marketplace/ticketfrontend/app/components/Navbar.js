import Link from 'next/link';
import React from 'react';

const Navbar = () => {
  return (
    <nav className="flex items-center justify-center gap-6 p-4 bg-green-100 shadow-md">
      <Link href="/pages/tickets/create">
        <div className="px-4 py-2 rounded-full bg-white text-green-900 border border-green-500 hover:bg-green-200 transition">
          🎫 Create Ticket
        </div>
      </Link>
      <Link href="/pages/tickets/my-tickets">
        <div className="px-4 py-2 rounded-full bg-white text-green-900 border border-green-500 hover:bg-green-200 transition">
          🎟️ My Tickets
        </div>
      </Link>
      <Link href="/">
        <div className="px-4 py-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition">
          🏠 Home
        </div>
      </Link>
    </nav>
  );
};

export default Navbar;
