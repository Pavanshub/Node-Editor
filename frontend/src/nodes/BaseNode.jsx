import React from 'react';
import { Handle, Position } from 'reactflow';
import clsx from 'clsx';

/**
 * BaseNode Component
 * 
 * This is the foundational component that all other nodes extend from.
 * It provides a consistent structure and styling system that eliminates
 * code duplication across different node types.
 * 
 * Key features:
 * - Consistent visual design with customizable colors
 * - Dynamic handle rendering based on configuration
 * - Flexible content area for node-specific controls
 * - Hover effects and professional styling
 * - Icon support for visual node identification
 * 
 * This abstraction makes it easy to create new node types by simply
 * defining their handles, content, and configuration.
 * 
 * @param {object} data - Node data from ReactFlow
 * @param {ReactNode} children - Content to render inside the node
 * @param {string} className - Additional CSS classes
 * @param {object} style - Additional inline styles
 * @param {Array} handles - Array of handle configurations
 * @param {string} color - Primary color for the node theme
 * @param {Component} icon - Lucide React icon component
 * @param {string} title - Display title for the node header
 * @param {function} updateNodeData - Function to update node data
 */
export default function BaseNode({
  data,
  children,
  className,
  style,
  handles = [],
  color = '#3b82f6',
  icon: Icon,
  title,
  updateNodeData,
  ...props
}) {
  return (
    <div
      className={clsx('base-node', className)}
      style={{
        ...style,
        '--node-color': color, // CSS custom property for theming
      }}
      {...props}
    >
      {/* Render all handles based on configuration */}
      {handles.map((handle) => (
        <Handle
          key={handle.id}
          type={handle.type} // 'source' or 'target'
          position={handle.position} // Position.Left, Position.Right, etc.
          id={handle.id}
          style={{
            backgroundColor: handle.color || color,
            ...handle.style, // Allow custom positioning and styling
          }}
        />
      ))}

      {/* Node header with icon and title */}
      <div className="node-header">
        {Icon && <Icon size={16} />}
        <span className="node-title">{title}</span>
      </div>

      {/* Node content area - this is where each node type renders its specific controls */}
      <div className="node-content">
        {children}
      </div>

      {/* Scoped CSS styles for the base node */}
      <style jsx>{`
        .base-node {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          min-width: 200px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
          overflow: hidden;
        }

        /* Hover effect changes border color to match node theme */
        .base-node:hover {
          border-color: var(--node-color);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }

        /* Header styling with theme color background */
        .node-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: var(--node-color);
          color: white;
          font-weight: 600;
          font-size: 14px;
        }

        .node-title {
          flex: 1;
        }

        /* Content area styling */
        .node-content {
          padding: 16px;
        }

        /* Hide content area if no children are provided */
        .node-content:empty {
          display: none;
        }
      `}</style>
    </div>
  );
}