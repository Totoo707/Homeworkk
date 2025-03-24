"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function Page() {
  const [showImage, setShowImage] = useState(false);

  const handleButtonClick = () => {
    setShowImage(!showImage);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col items-center justify-center text-white">
        <h1 className="text-5xl font-extrabold">Next.js App</h1>
    </div>
  );
}