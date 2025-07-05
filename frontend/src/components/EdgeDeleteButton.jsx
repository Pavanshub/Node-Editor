import React from 'react';
import { Trash2 } from 'lucide-react';

/**
 * EdgeDeleteButton Component
 * 
 * This component provides a user-friendly way to delete selected edges in the pipeline.
 * It only appears when one or more edges are selected, providing clear visual feedback
 * about what will be deleted.
 * 
 * Features:
 * - Only visible when edges are selected
 * - Shows count of selected edges
 * - Provides clear visual feedback with red color scheme
 * - Includes keyboard shortcut hint in tooltip
 * - Smooth animations for appearance/disappearance
 * 
 * @param {Array} selectedEdges - Array of selected edge IDs
 * @param {function} onDeleteEdges - Callback function to delete the selected edges
 */
export default function EdgeDeleteButton({ selectedEdges, onDeleteEdges }) {
  // Don't render the button if no edges are selected
  if (!selectedEdges || selectedEdges.length === 0) {
    return null;
  }

  /**
   * Handle the delete button click
   * Calls the parent's delete function and provides user feedback
   */
  const handleDelete = () => {
    if (selectedEdges.length > 0) {
      onDeleteEdges();
    }
  };

  return (
    <button 
      className="edge-delete-button" 
      onClick={handleDelete}
      title={`Delete ${selectedEdges.length} selected edge${selectedEdges.length > 1 ? 's' : ''} (Delete/Backspace)`}
    >
      <Trash2 size={16} />
      <span>
        Delete Edge{selectedEdges.length > 1 ? 's' : ''} ({selectedEdges.length})
      </span>
      
      {/* Scoped CSS styles for the edge delete button */}
      <style jsx>{`
        .edge-delete-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
          animation: slideIn 0.2s ease-out;
        }

        .edge-delete-button:hover {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
        }

        .edge-delete-button:active {
          transform: translateY(0);
        }

        /* Smooth slide-in animation */
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Icon styling */
        .edge-delete-button svg {
          flex-shrink: 0;
        }

        /* Text styling */
        .edge-delete-button span {
          white-space: nowrap;
        }
      `}</style>
    </button>
  );
}