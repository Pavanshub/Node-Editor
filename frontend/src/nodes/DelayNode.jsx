import React, { useState, useEffect } from 'react';
import { Position } from 'reactflow';
import { Clock } from 'lucide-react';
import BaseNode from './BaseNode';

/**
 * DelayNode Component
 * 
 * A timing control node that introduces delays in data processing pipelines.
 * This node demonstrates how to handle numeric inputs with validation.
 * 
 * Features:
 * - Input and output handles for data flow
 * - Configurable delay time in milliseconds
 * - Number input with validation and step controls
 * - Gray color theme for utility operations
 * 
 * @param {object} data - Node data containing delay and other properties
 * @param {function} updateNodeData - Function to update this node's data
 */
export default function DelayNode({ data, updateNodeData, ...props }) {
  // Define handles for data input and output
  const handles = [
    {
      id: 'input',
      type: 'target',
      position: Position.Left,
      color: '#6b7280',
    },
    {
      id: 'output',
      type: 'source',
      position: Position.Right,
      color: '#6b7280',
    },
  ];

  // Local state for delay value
  const [delay, setDelay] = useState(data.delay ?? 1000);

  // Sync local state with prop changes
  useEffect(() => {
    setDelay(data.delay ?? 1000);
  }, [data.delay]);

  /**
   * Handle delay value changes with validation
   */
  const handleDelayChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0) {
      setDelay(value);
    }
  };

  // Update parent node data only when input loses focus
  const handleDelayBlur = () => {
    if (updateNodeData && !isNaN(delay) && delay >= 0) {
      updateNodeData(props.id, { delay });
    }
  };

  return (
    <BaseNode
      handles={handles}
      color="#6b7280"
      icon={Clock}
      title="Delay"
      data={data}
      updateNodeData={updateNodeData}
      {...props}
    >
      {/* Delay configuration form */}
      <div className="delay-config">
        <div className="field">
          <label>Delay (ms):</label>
          <input
            type="number"
            value={delay}
            onChange={handleDelayChange}
            onBlur={handleDelayBlur}
            min="0"
            step="100"
            placeholder="1000"
          />
        </div>
      </div>
      
      {/* Scoped CSS styles for delay node */}
      <style jsx>{`
        .delay-config {
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

        .field input {
          padding: 6px 8px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-size: 13px;
        }
      `}</style>
    </BaseNode>
  );
}