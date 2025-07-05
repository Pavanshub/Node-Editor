import React from 'react';
import { Position } from 'reactflow';
import { GitBranch } from 'lucide-react';
import BaseNode from './BaseNode';

/**
 * ConditionalNode Component
 * 
 * A branching logic node that can split data flow based on conditions.
 * This node demonstrates advanced handle positioning with multiple outputs.
 * 
 * Features:
 * - Single input handle for data
 * - Two output handles: 'true' and 'false' branches
 * - Multiple condition types for branching logic
 * - Orange color theme for conditional operations
 * - Custom handle positioning for visual clarity
 * 
 * @param {object} data - Node data containing condition and other properties
 * @param {function} updateNodeData - Function to update this node's data
 */
export default function ConditionalNode({ data, updateNodeData, ...props }) {
  // Define handles with custom positioning for branching
  const handles = [
    {
      id: 'input',
      type: 'target',
      position: Position.Left,
      color: '#f97316',
    },
    {
      id: 'true',
      type: 'source',
      position: Position.Right,
      color: '#10b981', // Green for 'true' branch
      style: { top: '30%' }, // Position at 30% from top
    },
    {
      id: 'false',
      type: 'source',
      position: Position.Right,
      color: '#ef4444', // Red for 'false' branch
      style: { top: '70%' }, // Position at 70% from top
    },
  ];

  /**
   * Handle condition type changes
   */
  const handleConditionChange = (e) => {
    if (updateNodeData) {
      updateNodeData(props.id, { condition: e.target.value });
    }
  };

  return (
    <BaseNode
      handles={handles}
      color="#f97316"
      icon={GitBranch}
      title="Conditional"
      data={data}
      updateNodeData={updateNodeData}
      {...props}
    >
      {/* Conditional configuration form */}
      <div className="conditional-config">
        <div className="field">
          <label>Condition:</label>
          <select 
            value={data.condition || 'if-then-else'}
            onChange={handleConditionChange}
          >
            <option value="if-then-else">If-Then-Else</option>
            <option value="switch">Switch</option>
            <option value="exists">Exists</option>
            <option value="empty">Is Empty</option>
          </select>
        </div>
      </div>
      
      {/* Scoped CSS styles for conditional node */}
      <style jsx>{`
        .conditional-config {
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