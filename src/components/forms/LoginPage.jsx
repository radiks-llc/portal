import { signIn } from "@astro-auth/client";
import React, { useState } from "react";

const signInWithEmailAndPassword = (email, password) => {
  signIn({
    provider: "credential",
    login: { email, password },
  });
};

export default function LoginPage() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = (email, password) => {
    signInWithEmailAndPassword(email, password);
  };

  return (
    <div className="w-full ml-12 my-8 max-w-xs">
      <h1>Shareholder Login</h1>
      <form>
        <div className="mb-4">
          <label className="flex flex-col block text-gray-700 text-sm font-bold mb-2">
            Email
            <input
              className="py-1 px-2 border-l-gray-500 border-b-gray-500 border-t-gray-100 border-r-gray-100 border-2 active:border-l-gray-100 active:border-b-gray-100 active:border-t-gray-500 active:border-r-gray-500"
              type="text"
              placeholder="Email"
              value={email}
              onChange={({ target: { value } }) => setEmail(value)}
            />
          </label>
        </div>
        <div className="mb-6">
          <label className="flex flex-col block text-gray-700 text-sm font-bold mb-2">
            Password:
            <input
              className="py-1 px-2 border-l-gray-500 border-b-gray-500 border-t-gray-100 border-r-gray-100 border-2 active:border-l-gray-100 active:border-b-gray-100 active:border-t-gray-500 active:border-r-gray-500"
              type="password"
              placeholder="******************"
              value={password}
              onChange={({ target: { value } }) => setPassword(value)}
            />
          </label>
        </div>
        <div className="flex items-center justify-between">
          <button
            className="py-1 px-2 bg-gray-200 border-l-gray-500 border-b-gray-500 border-t-gray-100 border-r-gray-100 border-2 hover:bg-gray-300 active:bg-gray-400 active:border-l-gray-100 active:border-b-gray-100 active:border-t-gray-500 active:border-r-gray-500"
            type="button"
            onClick={() => handleSubmit(email, password)}
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
}
