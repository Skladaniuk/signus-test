"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error caught:", error);
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-red-100 text-red-700">
      <h1 className="text-3xl font-bold mb-4">Something went wrong!</h1>
      <p className="mb-6">{error.message}</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800"
      >
        Try again
      </button>
    </main>
  );
}
