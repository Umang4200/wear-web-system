import React from "react";
import { MdClose } from "react-icons/md";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* MODAL CONTENT */}
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-xl p-6 z-10">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose}>
            <MdClose className="text-xl text-gray-500 hover:text-black" />
          </button>
        </div>

        {/* BODY */}
        {children}
      </div>
    </div>
  );
};

export default Modal;