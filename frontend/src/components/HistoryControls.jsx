import React from 'react';
import { Undo, Redo, RotateCcw, Keyboard } from 'lucide-react';

/**
 * HistoryControls Component
 * 
 * Provides undo/redo controls for the node editor with visual feedback
 * about the current state of the history stack and keyboard shortcuts.
 * 
 * Features:
 * - Undo/Redo buttons with keyboard shortcut hints
 * - Visual feedback for available actions (disabled states)
 * - History position indicator
 * - Clear history option
 * - Keyboard shortcut support with visual hints
 * - Cross-platform shortcut display (Ctrl/Cmd)
 * 
 * @param {function} onUndo - Callback for undo action
 * @param {function} onRedo - Callback for redo action
 * @param {function} onClearHistory - Callback for clearing history
 * @param {boolean} canUndo - Whether undo is available
 * @param {boolean} canRedo - Whether redo is available
 * @param {number} historySize - Total number of history entries
 * @param {number} currentIndex - Current position in history
 */
export default function HistoryControls({ 
  onUndo, 
  onRedo, 
  onClearHistory,
  canUndo, 
  canRedo, 
  historySize, 
  currentIndex 
}) {
  // Detect if user is on Mac for keyboard shortcut display
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modKey = isMac ? '⌘' : 'Ctrl';

  return (
    <div className="history-controls">
      {/* Keyboard shortcuts indicator */}
      <div className="shortcuts-indicator" title="Keyboard Shortcuts Available">
        <Keyboard size={12} />
      </div>

      {/* Undo button */}
      <button
        className="history-button"
        onClick={onUndo}
        disabled={!canUndo}
        title={`Undo (${modKey}+Z) - Position: ${currentIndex + 1}/${historySize}`}
      >
        <Undo size={16} />
        <span className="shortcut-hint">{modKey}+Z</span>
      </button>

      {/* Redo button */}
      <button
        className="history-button"
        onClick={onRedo}
        disabled={!canRedo}
        title={`Redo (${modKey}+Y or ${modKey}+Shift+Z) - Position: ${currentIndex + 1}/${historySize}`}
      >
        <Redo size={16} />
        <span className="shortcut-hint">{modKey}+Y</span>
      </button>

      {/* History position indicator */}
      <div className="history-indicator">
        <span className="position">{currentIndex + 1}</span>
        <span className="separator">/</span>
        <span className="total">{historySize}</span>
      </div>

      {/* Clear history button */}
      <button
        className="history-button clear-button"
        onClick={onClearHistory}
        title="Clear History - Reset to initial state"
        disabled={historySize <= 1}
      >
        <RotateCcw size={14} />
      </button>

      {/* Scoped CSS styles */}
      <style jsx>{`
        .history-controls {
          display: flex;
          align-items: center;
          gap: 6px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .shortcuts-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          color: #6b7280;
          margin-right: 4px;
        }

        .history-button {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 32px;
          height: 32px;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #374151;
          position: relative;
          padding: 0 6px;
          gap: 4px;
        }

        .history-button:hover:not(:disabled) {
          background: #f3f4f6;
          border-color: #9ca3af;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .history-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .history-button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          background: #f9fafb;
        }

        .shortcut-hint {
          font-size: 10px;
          color: #6b7280;
          font-weight: 500;
          margin-left: 2px;
          opacity: 0.8;
        }

        .history-button:disabled .shortcut-hint {
          opacity: 0.3;
        }

        .clear-button {
          margin-left: 4px;
          border-color: #fca5a5;
          color: #dc2626;
        }

        .clear-button:hover:not(:disabled) {
          background: #fef2f2;
          border-color: #f87171;
        }

        .clear-button:disabled {
          border-color: #e5e7eb;
          color: #9ca3af;
        }

        .history-indicator {
          display: flex;
          align-items: center;
          font-size: 12px;
          font-weight: 500;
          min-width: 45px;
          text-align: center;
          padding: 0 6px;
          margin: 0 2px;
          background: #f9fafb;
          border-radius: 4px;
          height: 24px;
        }

        .position {
          color: #3b82f6;
          font-weight: 600;
        }

        .separator {
          color: #d1d5db;
          margin: 0 2px;
        }

        .total {
          color: #6b7280;
        }

        /* Enhanced tooltips */
        .history-button[title]:hover::after {
          content: attr(title);
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.9);
          color: white;
          padding: 6px 8px;
          border-radius: 4px;
          font-size: 11px;
          white-space: nowrap;
          z-index: 1000;
          margin-bottom: 4px;
          pointer-events: none;
        }

        /* Responsive design for smaller screens */
        @media (max-width: 768px) {
          .shortcut-hint {
            display: none;
          }
          
          .history-controls {
            gap: 4px;
            padding: 6px;
          }
          
          .history-button {
            min-width: 28px;
            height: 28px;
          }
        }
      `}</style>
    </div>
  );
}