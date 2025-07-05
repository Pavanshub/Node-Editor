import React from 'react';
import { FileInput as Input, FileOutput as Output, Brain, Type, Filter, RotateCcw, Plus, GitBranch, Clock } from 'lucide-react';

/**
 * Node categories configuration
 * This defines the structure of the sidebar, organizing nodes into logical groups
 * Each node has:
 * - type: the node type identifier used by ReactFlow
 * - label: display name in the sidebar
 * - icon: Lucide React icon component
 * - color: theme color for the node type
 */
const nodeCategories = [
  {
    title: 'Basic Nodes',
    nodes: [
      { type: 'inputNode', label: 'Input', icon: Input, color: '#10b981' },
      { type: 'outputNode', label: 'Output', icon: Output, color: '#ef4444' },
      { type: 'textNode', label: 'Text', icon: Type, color: '#3b82f6' },
    ]
  },
  {
    title: 'AI Nodes',
    nodes: [
      { type: 'llmNode', label: 'LLM', icon: Brain, color: '#8b5cf6' },
    ]
  },
  {
    title: 'Processing Nodes',
    nodes: [
      { type: 'filterNode', label: 'Filter', icon: Filter, color: '#f59e0b' },
      { type: 'transformNode', label: 'Transform', icon: RotateCcw, color: '#06b6d4' },
      { type: 'aggregateNode', label: 'Aggregate', icon: Plus, color: '#84cc16' },
      { type: 'conditionalNode', label: 'Conditional', icon: GitBranch, color: '#f97316' },
      { type: 'delayNode', label: 'Delay', icon: Clock, color: '#6b7280' },
    ]
  }
];

/**
 * NodeSidebar Component
 * 
 * Renders a sidebar containing all available node types organized by category.
 * Users can either click on any node button to add that type of node to the canvas,
 * or drag and drop nodes directly onto the canvas for precise positioning.
 * 
 * Drag and Drop Implementation:
 * - Each node button is draggable with the HTML5 drag API
 * - The node type is stored in the dataTransfer object during drag
 * - Visual feedback is provided during drag operations
 * - Supports both click-to-add and drag-to-position workflows
 * 
 * @param {function} onAddNode - Callback function to add a new node to the canvas
 */
export default function NodeSidebar({ onAddNode }) {
  /**
   * Handle the start of a drag operation
   * Stores the node type in the dataTransfer object so the drop zone can access it
   * Also adds visual feedback by changing the cursor and opacity
   * 
   * @param {DragEvent} event - The drag start event
   * @param {string} nodeType - The type of node being dragged
   */
  const onDragStart = (event, nodeType) => {
    // Store the node type in the drag data
    // This will be retrieved when the node is dropped on the canvas
    event.dataTransfer.setData('application/reactflow', nodeType);
    
    // Set the drag effect to 'move' to show appropriate cursor
    event.dataTransfer.effectAllowed = 'move';
    
    // Add visual feedback during drag
    event.target.style.opacity = '0.5';
  };

  /**
   * Handle the end of a drag operation
   * Restores the visual state of the dragged element
   * 
   * @param {DragEvent} event - The drag end event
   */
  const onDragEnd = (event) => {
    // Restore the original opacity
    event.target.style.opacity = '1';
  };

  return (
    <div className="node-sidebar">
      {/* Sidebar header */}
      <div className="sidebar-header">
        <h2>Node Library</h2>
        <p className="sidebar-subtitle">Click or drag nodes to canvas</p>
      </div>
      
      {/* Scrollable content area */}
      <div className="sidebar-content">
        {nodeCategories.map((category) => (
          <div key={category.title} className="node-category">
            {/* Category title */}
            <h3>{category.title}</h3>
            
            {/* List of nodes in this category */}
            <div className="node-list">
              {category.nodes.map((node) => {
                const IconComponent = node.icon;
                return (
                  <button
                    key={node.type}
                    className="node-button"
                    onClick={() => onAddNode(node.type)}
                    style={{ '--node-color': node.color }}
                    // Drag and drop attributes
                    draggable={true}
                    onDragStart={(event) => onDragStart(event, node.type)}
                    onDragEnd={onDragEnd}
                    // Accessibility attributes for drag and drop
                    role="button"
                    tabIndex={0}
                    aria-label={`Add ${node.label} node - draggable`}
                  >
                    <IconComponent size={16} />
                    <span>{node.label}</span>
                    {/* Drag indicator icon */}
                    <div className="drag-indicator">⋮⋮</div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      {/* Scoped CSS styles for the sidebar */}
      <style jsx>{`
        .node-sidebar {
          width: 280px;
          background: white;
          border-right: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
          height: 100vh;
        }

        .sidebar-header {
          padding: 20px;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
        }

        .sidebar-header h2 {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 4px 0;
        }

        .sidebar-subtitle {
          font-size: 12px;
          color: #6b7280;
          margin: 0;
          font-style: italic;
        }

        .sidebar-content {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
        }

        .node-category {
          margin-bottom: 24px;
        }

        .node-category h3 {
          font-size: 14px;
          font-weight: 600;
          color: #6b7280;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .node-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .node-button {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          cursor: grab;
          transition: all 0.2s ease;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          width: 100%;
          text-align: left;
          position: relative;
        }

        .node-button:hover {
          background: #f9fafb;
          border-color: var(--node-color);
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .node-button:active {
          cursor: grabbing;
          transform: translateY(0);
        }

        /* Visual feedback during drag */
        .node-button:hover .drag-indicator {
          opacity: 1;
        }

        .node-button svg {
          color: var(--node-color);
          flex-shrink: 0;
        }

        .drag-indicator {
          position: absolute;
          right: 8px;
          font-size: 12px;
          color: #9ca3af;
          opacity: 0;
          transition: opacity 0.2s ease;
          pointer-events: none;
          line-height: 1;
          letter-spacing: -1px;
        }

        /* Drag state styling */
        .node-button[draggable="true"]:active {
          cursor: grabbing;
          opacity: 0.8;
        }

        /* Focus styles for accessibility */
        .node-button:focus {
          outline: 2px solid var(--node-color);
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}