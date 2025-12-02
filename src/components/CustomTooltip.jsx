import React from "react";

export default function CustomTooltip(props) {
  return (
    <div
      className="bg-black text-white px-3 py-2 rounded-md shadow-lg text-sm animate-fadeIn"
      style={{ maxWidth: '220px', whiteSpace: 'normal' }}
    >
      {props.value}
    </div>
  );
}
