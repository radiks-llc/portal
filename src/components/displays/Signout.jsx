import React from "react";

export default function Signout() {
  const handleClick = async () => {
    await fetch("/login/api/auth/signout", { method: "DELETE" });
    window.location = "/";
  };
  return (
    <button
      className="py-1 px-2 bg-gray-200 border-l-gray-500 border-b-gray-500 border-t-gray-100 border-r-gray-100 border-2 hover:bg-gray-300 active:bg-gray-400 active:border-l-gray-100 active:border-b-gray-100 active:border-t-gray-500 active:border-r-gray-500"
      onClick={() => handleClick()}
    >
      Sign Out
    </button>
  );
}
