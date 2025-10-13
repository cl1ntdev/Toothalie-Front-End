import React, { useState, useEffect } from 'react';
import DeleteAppointmentAPI from '@/API/Authenticated/appointment/DeleteAppointmentAPI';
type AppointmentProps = {
  appointmentID: string | null;
  onClose: () => void;
  // onDeleteSuccess: () => void;
  deleteSuccess: () => void;
};

export default function DeleteAppointmentModal({ appointmentID, onClose, deleteSuccess }: AppointmentProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDelete,setIsDelete] = useState<boolean>(true)

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);
    const delStatus = await DeleteAppointmentAPI(appointmentID)
    if(delStatus.status == "ok"){
      // onDeleteSuccess()
      deleteSuccess()
      onClose()
    }
  };

  const handleCancel = () => {
    onClose();
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-gray-800/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          aria-label="Close modal"
        >
          ✖
        </button>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Confirm Deletion</h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this appointment? This action cannot be undone.
        </p>
        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}