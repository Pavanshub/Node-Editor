import React, { useState, useEffect } from 'react';
import { Keyboard, X } from 'lucide-react';

/**
 * KeyboardShortcutsHelp Component
 * 
 * Displays a helpful overlay showing all available keyboard shortcuts.
 * Can be toggled on/off and provides a comprehensive reference for users.
 * 
 * Features:
 * - Toggle visibility with keyboard shortcut (?)
 * - Comprehensive list of all shortcuts
 * - Cross-platform support (Ctrl/Cmd detection)
 * - Smooth animations and professional styling
 * - Escape key to close
 * 
 * @param {boolean} isVisible - Whether the help overlay is visible
 * @param {function} onClose - Callback to close the help overlay
 */
export default function KeyboardShortcutsHelp({ isVisible, onClose }) {
  // Detect if user is on Mac for keyboard shortcut display
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modKey = isMac ? '⌘' : 'Ctrl';

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isVisible) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const shortcuts = [
    {
      category: 'History',
      items: [
        { keys: [`${modKey}+Z`], description: 'Undo last action' },
        { keys: [`${modKey}+Y`, `${modKey}+Shift+Z`], description: 'Redo next action' },
      ]
    },
    {
      category: 'Selection & Deletion',
      items: [
        { keys: ['Delete', 'Backspace'], description: 'Delete selected edges or nodes' },
        { keys: ['Shift+Click'], description: 'Multi-select edges or nodes' },
        { keys: ['Escape'], description: 'Clear all selections' },
      ]
    },
    {
      category: 'Navigation',
      items: [
        { keys: ['Mouse Wheel'], description: 'Zoom in/out' },
        { keys: ['Click+Drag'], description: 'Pan canvas' },
        { keys: ['?'], description: 'Show/hide this help' },
      ]
    },
    {
      category: 'Node Operations',
      items: [
        { keys: ['Click'], description: 'Add node from sidebar' },
        { keys: ['Drag+Drop'], description: 'Position node precisely' },
        { keys: ['Drag Handle'], description: 'Connect nodes' },
      ]
    }
  ];

  return (
    <div className="keyboard-help-overlay">
      <div className="keyboard-help-modal">
        {/* Header */}
        <div className="help-header">
          <div className="help-title">
            <Keyboard size={20} />
            <h2>Keyboard Shortcuts</h2>
          </div>
          <button className="close-button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="help-content">
          {shortcuts.map((category) => (
            <div key={category.category} className="shortcut-category">
              <h3>{category.category}</h3>
              <div className="shortcut-list">
                {category.items.map((item, index) => (
                  <div key={index} className="shortcut-item">
                    <div className="shortcut-keys">
                      {item.keys.map((key, keyIndex) => (
                        <React.Fragment key={keyIndex}>
                          {keyIndex > 0 && <span className="or-separator">or</span>}
                          <kbd className="key">{key}</kbd>
                        </React.Fragment>
                      ))}
                    </div>
                    <span className="shortcut-description">{item.description}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="help-footer">
          <p>Press <kbd className="key">Escape</kbd> or click outside to close</p>
        </div>
      </div>

      {/* Scoped CSS styles */}
      <style jsx>{`
        .keyboard-help-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          animation: fadeIn 0.2s ease-out;
        }

        .keyboard-help-modal {
          background: white;
          border-radius: 12px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          max-width: 600px;
          width: 90vw;
          max-height: 80vh;
          overflow: hidden;
          animation: slideIn 0.3s ease-out;
        }

        .help-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
        }

        .help-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .help-title h2 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          color: #111827;
        }

        .close-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: none;
          background: none;
          border-radius: 6px;
          cursor: pointer;
          color: #6b7280;
          transition: all 0.2s ease;
        }

        .close-button:hover {
          background: #e5e7eb;
          color: #374151;
        }

        .help-content {
          padding: 24px;
          overflow-y: auto;
          max-height: calc(80vh - 140px);
        }

        .shortcut-category {
          margin-bottom: 32px;
        }

        .shortcut-category:last-child {
          margin-bottom: 0;
        }

        .shortcut-category h3 {
          font-size: 16px;
          font-weight: 600;
          color: #374151;
          margin: 0 0 16px 0;
          padding-bottom: 8px;
          border-bottom: 1px solid #f3f4f6;
        }

        .shortcut-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .shortcut-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .shortcut-keys {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .key {
          background: #f3f4f6;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          padding: 4px 8px;
          font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
          font-size: 12px;
          font-weight: 500;
          color: #374151;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .or-separator {
          font-size: 12px;
          color: #9ca3af;
          font-style: italic;
        }

        .shortcut-description {
          color: #6b7280;
          font-size: 14px;
          text-align: right;
          flex: 1;
        }

        .help-footer {
          padding: 16px 24px;
          border-top: 1px solid #e5e7eb;
          background: #f9fafb;
          text-align: center;
        }

        .help-footer p {
          margin: 0;
          font-size: 13px;
          color: #6b7280;
        }

        .help-footer .key {
          margin: 0 4px;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .keyboard-help-modal {
            width: 95vw;
            max-height: 90vh;
          }

          .shortcut-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .shortcut-description {
            text-align: left;
          }

          .help-content {
            padding: 16px;
          }

          .help-header {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
}