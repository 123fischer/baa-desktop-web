'use client';

import Link from 'next/link';

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-1">
      <div className="flex items-center">
        <span className="font-bold text-xl tracking-tight">CAR</span>
        <span className="font-bold text-xl tracking-tight text-red-600">
          AUKTION
        </span>
      </div>
      <span className="text-xs text-gray-500 font-medium mt-1">DIRECT</span>
    </Link>
  );
};

export default Logo;
