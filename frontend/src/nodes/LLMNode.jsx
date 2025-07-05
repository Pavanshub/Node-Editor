import React from 'react';
import { Position } from 'reactflow';
import { Brain } from 'lucide-react';
import BaseNode from './BaseNode';

/**
 * LLMNode Component
 * 
 * Represents a Large Language Model (AI) processing node in the pipeline.
 * This node can receive system prompts and user prompts, then generate
 * AI-powered responses using various language models.
 * 
 * Features:
 * - Two input handles: system (for system prompts) and prompt (for user input)
 * - One output handle for the generated response
 * - Configurable model selection (GPT-3.5, GPT-4, Claude, etc.)
 * - Adjustable temperature parameter for response creativity
 * - Purple color theme to indicate AI processing
 * 
 * @param {object} data - Node data containing model, temperature, and other properties
 * @param {function} updateNodeData - Function to update this node's data
 */
export default function LLMNode({ data, updateNodeData, ...props }) {
  // Define the handles for this node type
  const handles = [
    {
      id: 'system',
      type: 'target',
      position: Position.Left,
      color: '#8b5cf6',
      style: { top: '30%' }, // Position at 30% from top for system input
    },
    {
      id: 'prompt',
      type: 'target',
      position: Position.Left,
      color: '#8b5cf6',
      style: { top: '70%' }, // Position at 70% from top for prompt input
    },
    {
      id: 'output',
      type: 'source',
      position: Position.Right,
      color: '#8b5cf6',
    },
  ];

  /**
   * Handle model selection changes
   */
  const handleModelChange = (e) => {
    if (updateNodeData) {
      updateNodeData(props.id, { model: e.target.value });
    }
  };

  /**
   * Handle temperature slider changes
   */
  const handleTemperatureChange = (e) => {
    if (updateNodeData) {
      updateNodeData(props.id, { temperature: parseFloat(e.target.value) });
    }
  };

  return (
    <BaseNode
      handles={handles}
      color="#8b5cf6"
      icon={Brain}
      title="LLM"
      data={data}
      updateNodeData={updateNodeData}
      {...props}
    >
      {/* LLM configuration form */}
      <div className="llm-config">
        {/* Model selection dropdown */}
        <div className="field">
          <label>Model:</label>
          <select 
            value={data.model || 'gpt-3.5-turbo'}
            onChange={handleModelChange}
          >
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            <option value="gpt-4">GPT-4</option>
            <option value="claude-3">Claude 3</option>
          </select>
        </div>
        
        {/* Temperature slider for controlling response creativity */}
        <div className="field">
          <label>Temperature:</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={data.temperature || 0.7}
            onChange={handleTemperatureChange}
          />
          <span>{data.temperature || 0.7}</span>
        </div>
      </div>
      
      {/* Scoped CSS styles for LLM node */}
      <style jsx>{`
        .llm-config {
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

        .field input[type="range"] {
          padding: 0;
        }

        .field span {
          font-size: 12px;
          color: #6b7280;
          text-align: center;
        }
      `}</style>
    </BaseNode>
  );
}