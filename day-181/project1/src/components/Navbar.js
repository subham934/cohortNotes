import Link from 'next/link';
import React from 'react';

const Navbar = () => {
  return (
    <div>
      <div className="flex gap-5">
        <Link href="/">Start</Link>
        <Link href="/home">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
      </div>
    </div>
  );
};

export default Navbar;
