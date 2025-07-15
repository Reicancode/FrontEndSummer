import React from "react";

export default function EmojiDisplay({ emoji }) {
  return (
    <div className="emoji-display">
      <span>{emoji}</span>
    </div>
  );
}
