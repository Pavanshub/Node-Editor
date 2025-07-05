import React from 'react';
import { Position } from 'reactflow';
import { RotateCcw } from 'lucide-react';
import BaseNode from './BaseNode';

/**
 * TransformNode Component
 * 
 * A data transformation node that can apply various operations to modify data.
 * This node demonstrates how easy it is to create new node types using
 * the BaseNode abstraction.
 * 
 * Features:
 * - Input and output handles for data flow
 * - Multiple transformation operations (uppercase, lowercase, trim, etc.)
 * - Cyan color theme for transformation operations
 * 
 * @param {object} data - Node data containing operation and other properties
 * @param {function} updateNodeData - Function to update this node's data
 */
export default function TransformNode({ data, updateNodeData, ...props }) {
  // Define handles for data input and output
  const handles = [
    {
      id: 'input',
      type: 'target',
      position: Position.Left,
      color: '#06b6d4',
    },
    {
      id: 'output',
      type: 'source',
      position: Position.Right,
      color: '#06b6d4',
    },
  ];

  /**
   * Handle operation selection changes
   */
  const handleOperationChange = (e) => {
    if (updateNodeData) {
      updateNodeData(props.id, { operation: e.target.value });
    }
  };

  return (
    <BaseNode
      handles={handles}
      color="#06b6d4"
      icon={RotateCcw}
      title="Transform"
      data={data}
      updateNodeData={updateNodeData}
      {...props}
    >
      {/* Transform configuration form */}
      <div className="transform-config">
        <div className="field">
          <label>Operation:</label>
          <select 
            value={data.operation || 'uppercase'}
            onChange={handleOperationChange}
          >
            <option value="uppercase">Uppercase</option>
            <option value="lowercase">Lowercase</option>
            <option value="trim">Trim</option>
            <option value="reverse">Reverse</option>
            <option value="replace">Replace</option>
          </select>
        </div>
      </div>
      
      {/* Scoped CSS styles for transform node */}
      <style jsx>{`
        .transform-config {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .field label {
          font-size: 12px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .field select {
          padding: 6px 8px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-size: 13px;
        }
      `}</style>
    </BaseNode>
  );
}