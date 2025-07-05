import React from 'react';
import { Play } from 'lucide-react';

/**
 * SubmitButton Component
 * 
 * This component handles submitting the current pipeline to the backend for analysis.
 * It sends the nodes and edges data to the FastAPI backend and displays the results
 * in a user-friendly alert.
 * 
 * The backend analyzes:
 * - Number of nodes in the pipeline
 * - Number of edges (connections) in the pipeline  
 * - Whether the pipeline forms a valid Directed Acyclic Graph (DAG)
 * 
 * @param {Array} nodes - Array of all nodes in the current pipeline
 * @param {Array} edges - Array of all edges (connections) in the current pipeline
 */
export default function SubmitButton({ nodes, edges }) {
  /**
   * Handle the submit button click
   * Sends pipeline data to backend and shows results to user
   */
  const handleSubmit = async () => {
    try {
      // Send POST request to backend with pipeline data
      const response = await fetch('http://localhost:8000/pipelines/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nodes, edges }),
      });

      // Check if request was successful
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Parse the JSON response from backend
      const data = await response.json();
      
      // Display results in a user-friendly alert
      // Shows node count, edge count, and DAG validation status
      alert(
        `Pipeline Analysis Results:\n\n` +
        `Number of Nodes: ${data.num_nodes}\n` +
        `Number of Edges: ${data.num_edges}\n` +
        `Is DAG: ${data.is_dag ? 'Yes' : 'No'}\n\n` +
        `${data.is_dag ? '✅ Valid pipeline structure' : '❌ Pipeline contains cycles'}`
      );
    } catch (error) {
      // Handle any errors that occur during the request
      console.error('Error submitting pipeline:', error);
      alert('Error submitting pipeline. Make sure the backend server is running.');
    }
  };

  return (
    <button className="submit-button" onClick={handleSubmit}>
      <Play size={16} />
      Submit Pipeline
      
      {/* Scoped CSS styles for the submit button */}
      <style jsx>{`
        .submit-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .submit-button:hover {
          background: linear-gradient(135deg, #2563eb, #1e40af);
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
        }

        .submit-button:active {
          transform: translateY(0);
        }
      `}</style>
    </button>
  );
}