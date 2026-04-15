import React from "react";

const StatsCard = ({ title, value, icon, colorClass = "text-teal-600 bg-teal-50" }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      </div>
      <div className={`p-4 rounded-xl ${colorClass}`}>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  );
};

export default StatsCard;
