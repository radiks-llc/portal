import React, { useState } from "react";

export default function CopyToClipboard({ path }) {
  const [hasFailed, setHasFailed] = useState(false);
  const [text, setText] = useState("Copy 📋");

  const handleClick = async (e) => {
    e.preventDefault();
    const result = await navigator.permissions.query({
      name: "clipboard-write",
    });
    if (result.state === "granted" || result.state === "prompt") {
      await navigator.clipboard.writeText(window.location.origin + path);
      setText("Copied 👍");
    } else {
      setHasFailed(true);
    }
  };
  return hasFailed ? (
    <div>Failed to copy. Use this instead: {path}</div>
  ) : (
    <button onClick={handleClick}>{text}</button>
  );
}
