// filepath: /trip-app/trip-app/app/trip/components/AddTripModal.tsx
"use client"
import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { addTrip } from '../actions';

const AddTripModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [tripName, setTripName] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tripData = { tripName, destination, date };
    await addTrip(tripData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Add New Trip</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="tripName">Trip Name:</label>
          <input
            type="text"
            id="tripName"
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="destination">Destination:</label>
          <input
            type="text"
            id="destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Trip</button>
      </form>
    </Modal>
  );
};

export default AddTripModal;