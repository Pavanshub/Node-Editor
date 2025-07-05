import React from 'react';
import { Position } from 'reactflow';
import { Plus } from 'lucide-react';
import BaseNode from './BaseNode';

/**
 * AggregateNode Component
 * 
 * A data aggregation node that can perform mathematical operations
 * on datasets (sum, average, count, min, max).
 * 
 * This node showcases how the BaseNode abstraction enables rapid
 * development of specialized processing nodes.
 * 
 * Features:
 * - Input and output handles for data flow
 * - Multiple aggregation operations
 * - Green color theme for aggregation operations
 * 
 * @param {object} data - Node data containing operation and other properties
 * @param {function} updateNodeData - Function to update this node's data
 */
export default function AggregateNode({ data, updateNodeData, ...props }) {
  // Define handles for data input and output
  const handles = [
    {
      id: 'input',
      type: 'target',
      position: Position.Left,
      color: '#84cc16',
    },
    {
      id: 'output',
      type: 'source',
      position: Position.Right,
      color: '#84cc16',
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
      color="#84cc16"
      icon={Plus}
      title="Aggregate"
      data={data}
      updateNodeData={updateNodeData}
      {...props}
    >
      {/* Aggregate configuration form */}
      <div className="aggregate-config">
        <div className="field">
          <label>Operation:</label>
          <select 
            value={data.operation || 'sum'}
            onChange={handleOperationChange}
          >
            <option value="sum">Sum</option>
            <option value="average">Average</option>
            <option value="count">Count</option>
            <option value="min">Minimum</option>
            <option value="max">Maximum</option>
          </select>
        </div>
      </div>
      
      {/* Scoped CSS styles for aggregate node */}
      <style jsx>{`
        .aggregate-config {
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