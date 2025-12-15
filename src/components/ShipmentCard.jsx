import React from "react";

const ShipmentCard = ({ title, count, onView }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm max-w-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-base text-gray-500 mb-4">
        Total:&nbsp;<span className="text-gray-700 font-bold">{count}</span>
      </p>
      <button
        onClick={onView}
        className="px-4 py-2 bg-blue-600 cursor-pointer text-white rounded-tr-lg rounded-bl-lg text-sm font-medium hover:bg-blue-700 transition"
      >
        View
      </button>
    </div>
  );
};

export default ShipmentCard;
