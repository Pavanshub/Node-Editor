import React, { useState, useEffect } from 'react';
import { Position } from 'reactflow';
import { FileOutput as Output } from 'lucide-react';
import BaseNode from './BaseNode';

/**
 * OutputNode Component
 * 
 * Represents a data output destination in the pipeline.
 * Output nodes typically serve as endpoints for data flow,
 * receiving processed data from other nodes in the pipeline.
 * 
 * Features:
 * - Single input handle on the left side
 * - Configurable label for identifying the output
 * - Red color theme to indicate data destination
 * 
 * @param {object} data - Node data containing label and other properties
 * @param {function} updateNodeData - Function to update this node's data
 */
export default function OutputNode({ data, updateNodeData, ...props }) {
  // Define the handles for this node type
  // Output nodes only have an input handle since they receive data
  const handles = [
    {
      id: 'input',
      type: 'target', // This handle can receive connections FROM other nodes
      position: Position.Left,
      color: '#ef4444', // Red color for output/destination
    },
  ];

  // Local state for label
  const [label, setLabel] = useState(data.label || '');

  // Sync local state with prop changes
  useEffect(() => {
    setLabel(data.label || '');
  }, [data.label]);

  /**
   * Handle changes to the output label
   * Updates the node data when user types in the input field
   */
  const handleLabelChange = (e) => {
    setLabel(e.target.value);
  };

  // Update parent node data only when input loses focus
  const handleLabelBlur = () => {
    if (updateNodeData) {
      updateNodeData(props.id, { label });
    }
  };

  return (
    <BaseNode
      handles={handles}
      color="#ef4444"
      icon={Output}
      title="Output"
      data={data}
      updateNodeData={updateNodeData}
      {...props}
    >
      {/* Output configuration form */}
      <div className="output-field">
        <label>Output Name:</label>
        <input
          type="text"
          value={label}
          onChange={handleLabelChange}
          onBlur={handleLabelBlur}
          placeholder="Enter output name"
        />
      </div>
      
      {/* Scoped CSS styles for output node */}
      <style jsx>{`
        .output-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .output-field label {
          font-size: 12px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .output-field input {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.2s ease;
        }

        .output-field input:focus {
          outline: none;
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }
      `}</style>
    </BaseNode>
  );
}