// app/ui/modal.tsx

import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
        <p>ARE YOU SURE YOU WANT TO DELETE THIS CLIENT?</p>
        <div className="mt-4 flex justify-end">
          <button
            className="mr-2 rounded-md bg-gray-200 px-4 py-2 hover:bg-gray-300 transition duration-150"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="rounded-md bg-red-600 text-white px-4 py-2 hover:bg-red-700 transition duration-150"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
