'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Basic Project</h1>
        <Link href="/carts">
          <div className="cursor-pointer border border-blue-500 rounded-md p-2 bg-blue-500 text-white">
            장바구니
          </div>
        </Link>
      </div>
    </>
  );
}
