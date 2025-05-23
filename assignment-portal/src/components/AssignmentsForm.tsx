"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AxiosError } from "axios";

const schema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().email("Invalid email."),
  assignment_description: z
    .string()
    .min(10, "Description must be at least 10 characters."),
  github_repo_url: z.string().url("Invalid GitHub URL."),
  candidate_level: z.enum(["Junior", "Middle", "Senior", "Principal"], {
    required_error: "Candidate level is required.",
  }),
});

type FormData = z.infer<typeof schema>;

export default function AssignmentForm() {
  const [levels, setLevels] = useState<string[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    axios
      .get("https://tools.qa.ale.ai/api/tools/candidates/levels")
      .then((res) => setLevels(res.data.levels))
      .catch(() => setFetchError("Failed to load candidate levels."));
  }, []);

  const onSubmit = async (data: FormData) => {
    setServerError(null);

    try {
      await axios.post(
        "https://tools.qa.ale.ai/api/tools/candidates/assignments",
        data
      );
      router.push("/thank-you");
    } catch (error) {
      const axiosError = error as AxiosError<{
        message?: string;
        errors?: string[];
      }>;

      const errorMsg =
        axiosError.response?.data?.errors?.[0] ||
        axiosError.response?.data?.message ||
        "Unexpected error occurred.";

      setServerError(errorMsg);
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 ${
      hasError
        ? "border-red-500 focus:ring-red-500"
        : "border-gray-300 focus:ring-blue-500"
    }`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {serverError && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded">
          {serverError}
        </div>
      )}

      <div>
        <label className="block font-medium">Name</label>
        <input
          {...register("name")}
          placeholder="John Doe"
          className={inputClass(!!errors.name)}
        />
        {errors.name && <p className="text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block font-medium">Email</label>
        <input
          {...register("email")}
          placeholder="you@example.com"
          className={inputClass(!!errors.email)}
        />
        {errors.email && <p className="text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block font-medium">Assignment Description</label>
        <textarea
          {...register("assignment_description")}
          placeholder="Brief description of your solution"
          className={`${inputClass(
            !!errors.assignment_description
          )} h-24 resize-none`}
        />
        {errors.assignment_description && (
          <p className="text-red-600">
            {errors.assignment_description.message}
          </p>
        )}
      </div>

      <div>
        <label className="block font-medium">GitHub Repo URL</label>
        <input
          {...register("github_repo_url")}
          placeholder="https://github.com/your-repo"
          className={inputClass(!!errors.github_repo_url)}
        />
        {errors.github_repo_url && (
          <p className="text-red-600">{errors.github_repo_url.message}</p>
        )}
      </div>

      <div>
        <label className="block font-medium">Candidate Level</label>
        {fetchError ? (
          <p className="text-red-600">{fetchError}</p>
        ) : (
          <select
            {...register("candidate_level")}
            className={inputClass(!!errors.candidate_level)}
          >
            <option value="">Select level</option>
            {levels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        )}
        {errors.candidate_level && (
          <p className="text-red-600">{errors.candidate_level.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full px-4 py-2 rounded font-medium text-white transition ${
          isSubmitting
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
