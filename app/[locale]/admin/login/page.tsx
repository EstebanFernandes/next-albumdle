"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { handleLogin } from "@/src/lib/admin";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // This function calls the server action
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      const success = await handleLogin(password); // async server action
      if (success) {
        router.push("/admin"); // redirect to admin dashboard
      } else {
        setError("Wrong password");
      }
    } catch (err) {
      console.error(err);
      setError("Unexpected error, please try again");
    }
  }

  return (
    <div className="max-w-sm mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Admin Login</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <input
          type="password"
          placeholder="Enter admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <button
          type="submit"
          className="bg-black text-white rounded px-3 py-2 hover:bg-gray-800"
        >
          Login
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
