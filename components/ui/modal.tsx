import * as React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

function ModalContent({ children }: { children: React.ReactNode }) {
  return <div className="p-6">{children}</div>;
}

function ModalHeader({ children }: { children: React.ReactNode }) {
  return <div className="border-b p-4 text-lg font-semibold">{children}</div>;
}

function ModalTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-bold">{children}</h2>;
}

function ModalFooter({ children }: { children: React.ReactNode }) {
  return <div className="border-t p-4 flex justify-end">{children}</div>;
}

export { Modal, ModalContent, ModalHeader, ModalTitle, ModalFooter };
