import Link from "next/link";

export default function ThankYouPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-green-50">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">
          Thank you for submitting your assignment!
        </h1>
        <p className="text-gray-700">Your submission has been received.</p>

        <Link
          href="/"
          className="inline-block mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Back to Form
        </Link>
      </div>
    </main>
  );
}
