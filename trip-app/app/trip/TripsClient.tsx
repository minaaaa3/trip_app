'use client';

import { useState } from 'react';
import AddTripModal from './components/AddTripModal';

export default function TripsClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    console.log('Opening modal');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log('Closing modal');
    setIsModalOpen(false);
  };

  return (
    <div className="p-4">
      <button
        onClick={handleOpenModal}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        新しい旅行を作成
      </button>

      <AddTripModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </div>
  );
}