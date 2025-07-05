import React, { useState, useEffect } from 'react';
import { Position } from 'reactflow';
import { FileInput as Input } from 'lucide-react';
import BaseNode from './BaseNode';

/**
 * InputNode Component
 * 
 * Represents a data input source in the pipeline.
 */
export default function InputNode({ data, updateNodeData, ...props }) {
  const handles = [
    {
      id: 'output',
      type: 'source',
      position: Position.Right,
      color: '#10b981',
    },
  ];

  // Local state for the input value
  const [label, setLabel] = useState(data.label || '');

  // Keep local state in sync if data.label changes from outside
  useEffect(() => {
    setLabel(data.label || '');
  }, [data.label]);

  // Update local state as user types
  const handleChange = (e) => {
    setLabel(e.target.value);
  };

  // Only update parent data when input loses focus
  const handleBlur = () => {
    if (updateNodeData) {
      updateNodeData(props.id, { label });
    }
  };

  return (
    <BaseNode
      handles={handles}
      color="#10b981"
      icon={Input}
      title="Input"
      data={data}
      updateNodeData={updateNodeData}
      {...props}
    >
      {/* Input configuration form */}
      <div className="input-field">
        <label>Input Name:</label>
        <input
          type="text"
          value={label}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter input name"
        />
      </div>
      
      {/* Scoped CSS styles for input node */}
      <style jsx>{`
        .input-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-field label {
          font-size: 12px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .input-field input {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.2s ease;
        }

        .input-field input:focus {
          outline: none;
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }
      `}</style>
    </BaseNode>
  );
}