import React, { useState, useEffect } from 'react';
import { Position } from 'reactflow';
import { Filter } from 'lucide-react';
import BaseNode from './BaseNode';

/**
 * FilterNode Component
 * 
 * A data filtering node that can apply various conditions to filter data.
 * This demonstrates how the BaseNode abstraction makes it easy to create
 * specialized processing nodes with minimal code duplication.
 * 
 * Features:
 * - Input and output handles for data flow
 * - Multiple filter condition types (contains, equals, regex, etc.)
 * - Configurable filter value
 * - Orange color theme for processing operations
 * 
 * @param {object} data - Node data containing condition, value, and other properties
 * @param {function} updateNodeData - Function to update this node's data
 */
export default function FilterNode({ data, updateNodeData, ...props }) {
  // Define handles for data input and output
  const handles = [
    {
      id: 'input',
      type: 'target',
      position: Position.Left,
      color: '#f59e0b',
    },
    {
      id: 'output',
      type: 'source',
      position: Position.Right,
      color: '#f59e0b',
    },
  ];

  // Local state for condition and value
  const [condition, setCondition] = useState(data.condition || 'contains');
  const [value, setValue] = useState(data.value || '');

  // Sync local state with prop changes
  useEffect(() => {
    setCondition(data.condition || 'contains');
  }, [data.condition]);
  useEffect(() => {
    setValue(data.value || '');
  }, [data.value]);

  /**
   * Handle filter condition changes
   */
  const handleConditionChange = (e) => {
    setCondition(e.target.value);
    if (updateNodeData) {
      updateNodeData(props.id, { condition: e.target.value });
    }
  };

  /**
   * Handle filter value changes
   */
  const handleValueChange = (e) => {
    setValue(e.target.value);
  };

  // Update parent node data only when input loses focus
  const handleValueBlur = () => {
    if (updateNodeData) {
      updateNodeData(props.id, { value });
    }
  };

  return (
    <BaseNode
      handles={handles}
      color="#f59e0b"
      icon={Filter}
      title="Filter"
      data={data}
      updateNodeData={updateNodeData}
      {...props}
    >
      {/* Filter configuration form */}
      <div className="filter-config">
        {/* Condition selection dropdown */}
        <div className="field">
          <label>Condition:</label>
          <select 
            value={condition}
            onChange={handleConditionChange}
          >
            <option value="contains">Contains</option>
            <option value="equals">Equals</option>
            <option value="starts_with">Starts With</option>
            <option value="ends_with">Ends With</option>
            <option value="regex">Regex</option>
          </select>
        </div>
        
        {/* Filter value input */}
        <div className="field">
          <label>Value:</label>
          <input
            type="text"
            value={value}
            onChange={handleValueChange}
            onBlur={handleValueBlur}
            placeholder="Filter value"
          />
        </div>
      </div>
      
      {/* Scoped CSS styles for filter node */}
      <style jsx>{`
        .filter-config {
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

        .field select,
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