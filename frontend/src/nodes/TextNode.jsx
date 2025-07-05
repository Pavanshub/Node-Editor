import React, { useState, useEffect, useMemo } from 'react';
import { Position } from 'reactflow';
import { Type } from 'lucide-react';
import BaseNode from './BaseNode';

/**
 * TextNode Component
 * 
 * An enhanced text processing node with advanced features:
 * 1. Dynamic resizing based on text content
 * 2. Variable detection using {{variable}} syntax
 * 3. Automatic handle generation for detected variables
 * 4. Real-time preview of variables
 * 
 * This node demonstrates the power of the BaseNode abstraction
 * by implementing complex functionality while maintaining
 * consistent styling and behavior.
 * 
 * @param {object} data - Node data containing text and other properties
 * @param {function} updateNodeData - Function to update this node's data
 */
export default function TextNode({ data, updateNodeData, ...props }) {
  // Local state for text content (allows for immediate UI updates)
  const [text, setText] = useState(data.text || '');
  const [textareaHeight, setTextareaHeight] = useState('auto');

  /**
   * Extract variables from text using regex
   * Looks for patterns like {{variableName}} and extracts unique variable names
   */
  const variables = useMemo(() => {
    const regex = /\{\{([^}]+)\}\}/g; // Regex to match {{anything}}
    const matches = [];
    let match;
    
    // Find all matches and extract variable names
    while ((match = regex.exec(text)) !== null) {
      const varName = match[1].trim(); // Remove whitespace
      if (varName && !matches.includes(varName)) {
        matches.push(varName);
      }
    }
    return matches;
  }, [text]);

  /**
   * Create handles dynamically based on detected variables
   * Each variable gets its own input handle on the left side
   */
  const handles = useMemo(() => {
    // Create input handles for each detected variable
    const inputHandles = variables.map((variable, index) => ({
      id: variable,
      type: 'target',
      position: Position.Left,
      color: '#3b82f6',
      // Distribute handles vertically, starting at 30% from top
      style: { top: `${30 + (index * 20)}%` },
    }));

    // Always include an output handle
    return [
      ...inputHandles,
      {
        id: 'output',
        type: 'source',
        position: Position.Right,
        color: '#3b82f6',
      },
    ];
  }, [variables]);

  /**
   * Auto-resize textarea based on content
   * Calculates height based on number of lines
   */
  useEffect(() => {
    const lines = text.split('\n').length;
    const minHeight = 60;
    const lineHeight = 20;
    const newHeight = Math.max(minHeight, lines * lineHeight);
    setTextareaHeight(`${newHeight}px`);
  }, [text]);

  /**
   * Handle text changes
   * Updates only local state for immediate UI feedback
   * Parent data is updated only on blur
   */
  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  // Update parent node data only when textarea loses focus
  const handleTextBlur = () => {
    if (updateNodeData) {
      updateNodeData(props.id, { text });
    }
  };

  // Sync local state with prop changes (important for initial load)
  useEffect(() => {
    setText(data.text || '');
  }, [data.text]);

  return (
    <BaseNode
      handles={handles}
      color="#3b82f6"
      icon={Type}
      title="Text"
      data={data}
      updateNodeData={updateNodeData}
      style={{
        // Dynamic width based on text content length
        minWidth: Math.max(200, text.length * 8 + 100),
      }}
      {...props}
    >
      {/* Text configuration form */}
      <div className="text-config">
        {/* Main text input area */}
        <div className="field">
          <label>Text Content:</label>
          <textarea
            value={text}
            onChange={handleTextChange}
            onBlur={handleTextBlur}
            placeholder="Enter text... Use {{variable}} for dynamic content"
            style={{ height: textareaHeight }}
          />
        </div>
        
        {/* Variables detection display */}
        {variables.length > 0 && (
          <div className="variables-info">
            <label>Variables detected:</label>
            <div className="variables-list">
              {variables.map((variable) => (
                <span key={variable} className="variable-tag">
                  {variable}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Scoped CSS styles for text node */}
      <style jsx>{`
        .text-config {
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

        .field textarea {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          font-family: inherit;
          resize: none;
          transition: border-color 0.2s ease;
          min-height: 60px;
        }

        .field textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .variables-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .variables-info label {
          font-size: 12px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .variables-list {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }

        .variable-tag {
          background: #dbeafe;
          color: #1e40af;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 500;
        }
      `}</style>
    </BaseNode>
  );
}