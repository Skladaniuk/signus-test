import AssignmentForm from "@/components/AssignmentsForm";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6">Assignment Submission</h1>
        <AssignmentForm />
      </div>
    </main>
  );
}
