import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { nodeTypes } from '../nodes';
import NodeSidebar from './NodeSidebar';
import SubmitButton from './SubmitButton';
import EdgeDeleteButton from './EdgeDeleteButton';
import HistoryControls from './HistoryControls';
import KeyboardShortcutsHelp from './KeyboardShortcutsHelp';
import { useHistory } from '../hooks/useHistory';

/**
 * Initial nodes configuration for the editor
 * These nodes are loaded when the editor first starts
 */
const initialNodes = [
  {
    id: '1',
    type: 'inputNode',
    position: { x: 100, y: 100 },
    data: { label: 'Input Node' },
  },
  {
    id: '2',
    type: 'textNode',
    position: { x: 400, y: 100 },
    data: { text: 'Hello {{input}}!' },
  },
  {
    id: '3',
    type: 'outputNode',
    position: { x: 700, y: 100 },
    data: { label: 'Output Node' },
  },
];

/**
 * Initial edges configuration
 * These connections are established when the editor first starts
 */
const initialEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    sourceHandle: 'output',
    targetHandle: 'input',
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    sourceHandle: 'output',
    targetHandle: 'input',
  },
];

/**
 * Initial state for the editor
 */
const initialState = {
  nodes: initialNodes,
  edges: initialEdges,
  nodeIdCounter: 4,
};

/**
 * NodeEditor Component
 * 
 * This is the main component that manages the entire node editing interface.
 * It handles:
 * - Node and edge state management with undo/redo functionality
 * - Adding new nodes to the canvas (both click and drag & drop)
 * - Connecting nodes together
 * - Deleting selected edges and nodes
 * - Updating node data when users interact with node controls
 * - Drag and drop functionality from sidebar to canvas
 * - Complete history management for all operations
 * - Comprehensive keyboard shortcuts for all operations
 * 
 * The component uses a custom useHistory hook for undo/redo functionality
 * and ReactFlow hooks for the actual rendering and interaction.
 */
export default function NodeEditor() {
  // Use custom history hook for undo/redo functionality
  const {
    state: editorState,
    setState: setEditorState,
    undo,
    redo,
    canUndo,
    canRedo,
    historySize,
    currentIndex,
    clearHistory
  } = useHistory(initialState, 100); // Keep 100 history entries

  // Extract current state values
  const { nodes, edges, nodeIdCounter } = editorState;

  // ReactFlow state hooks - these are used for rendering
  const [reactFlowNodes, setReactFlowNodes, onNodesChange] = useNodesState(nodes);
  const [reactFlowEdges, setReactFlowEdges, onEdgesChange] = useEdgesState(edges);
  
  // Track selected edges for deletion functionality
  const [selectedEdges, setSelectedEdges] = useState([]);
  
  // Track keyboard shortcuts help visibility
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  
  // Ref to access ReactFlow instance for coordinate conversion
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  // Flag to prevent infinite loops during state sync
  const isSyncingState = useRef(false);

  // Sync ReactFlow state with our history state only when history changes
  useEffect(() => {
    if (!isSyncingState.current) {
      console.log('🔄 Syncing ReactFlow state with history state');
      setReactFlowNodes(nodes);
      setReactFlowEdges(edges);
    }
  }, [nodes, edges, setReactFlowNodes, setReactFlowEdges]);

  /**
   * Update the editor state and add to history
   * This is the main function for making changes that should be tracked in history
   * 
   * @param {object} updates - Object containing updates to apply to the state
   */
  const updateEditorState = useCallback((updates) => {
    console.log('💾 Updating editor state:', updates);
    setEditorState(prevState => ({
      ...prevState,
      ...updates
    }));
  }, [setEditorState]);

  /**
   * Handle new connections between nodes
   * This callback is triggered when a user drags from one handle to another
   */
  const onConnect = useCallback(
    (params) => {
      const newEdge = {
        ...params,
        id: `e${params.source}-${params.target}-${Date.now()}`, // Ensure unique ID
      };
      console.log('🔗 Creating new connection:', newEdge);
      updateEditorState({
        edges: [...edges, newEdge]
      });
    },
    [edges, updateEditorState]
  );

  /**
   * Handle edge selection changes
   * Updates the selectedEdges state when users click on edges
   */
  const onSelectionChange = useCallback(({ edges: selectedEdgeElements }) => {
    const edgeIds = selectedEdgeElements ? selectedEdgeElements.map(edge => edge.id) : [];
    setSelectedEdges(edgeIds);
  }, []);

  /**
   * Delete selected edges
   * Removes all currently selected edges from the pipeline
   */
  const deleteSelectedEdges = useCallback(() => {
    if (selectedEdges.length > 0) {
      console.log('🗑️ Deleting selected edges:', selectedEdges);
      updateEditorState({
        edges: edges.filter(edge => !selectedEdges.includes(edge.id))
      });
      setSelectedEdges([]); // Clear selection after deletion
    }
  }, [selectedEdges, edges, updateEditorState]);

  /**
   * Delete selected nodes
   * Removes all currently selected nodes and their connected edges
   */
  const deleteSelectedNodes = useCallback(() => {
    const selectedNodes = reactFlowNodes.filter(node => node.selected);
    if (selectedNodes.length > 0) {
      const selectedNodeIds = selectedNodes.map(node => node.id);
      console.log('🗑️ Deleting selected nodes:', selectedNodeIds);
      
      // Remove selected nodes and their connected edges
      updateEditorState({
        nodes: nodes.filter(node => !selectedNodeIds.includes(node.id)),
        edges: edges.filter(edge => 
          !selectedNodeIds.includes(edge.source) && 
          !selectedNodeIds.includes(edge.target)
        )
      });
    }
  }, [reactFlowNodes, nodes, edges, updateEditorState]);

  /**
   * Clear all selections
   * Deselects all nodes and edges
   */
  const clearSelection = useCallback(() => {
    setSelectedEdges([]);
    // Clear node selections by updating ReactFlow state
    setReactFlowNodes(nodes => 
      nodes.map(node => ({ ...node, selected: false }))
    );
    setReactFlowEdges(edges => 
      edges.map(edge => ({ ...edge, selected: false }))
    );
  }, [setReactFlowNodes, setReactFlowEdges]);

  /**
   * Show brief visual feedback for actions
   * @param {string} message - The message to show
   */
  const showActionFeedback = useCallback((message) => {
    // Create a temporary toast notification
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      z-index: 10000;
      animation: slideInRight 0.3s ease-out;
    `;
    
    // Add animation keyframes if not already added
    if (!document.querySelector('#toast-animations')) {
      const style = document.createElement('style');
      style.id = 'toast-animations';
      style.textContent = `
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    
    // Remove after 2 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => {
          if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
          }
        }, 300);
      }
    }, 2000);
  }, []);

  /**
   * Enhanced keyboard shortcuts handler
   */
  const onKeyDown = useCallback((event) => {
    // Check if we're typing in an input field
    const isTyping = event.target.tagName === 'INPUT' || 
                     event.target.tagName === 'TEXTAREA' || 
                     event.target.contentEditable === 'true';
    
    // Handle undo/redo shortcuts (work even when typing for better UX)
    const isCtrlOrCmd = event.ctrlKey || event.metaKey;
    
    if (isCtrlOrCmd) {
      // Undo: Ctrl+Z (but not Ctrl+Shift+Z)
      if (event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        const success = undo();
        if (success) {
          console.log('✅ Undo performed - History position:', currentIndex - 1);
          showActionFeedback('Undo');
        } else {
          console.log('❌ Cannot undo - at beginning of history');
        }
        return;
      }
      
      // Redo: Ctrl+Y or Ctrl+Shift+Z
      if (event.key === 'y' || (event.key === 'z' && event.shiftKey)) {
        event.preventDefault();
        const success = redo();
        if (success) {
          console.log('✅ Redo performed - History position:', currentIndex + 1);
          showActionFeedback('Redo');
        } else {
          console.log('❌ Cannot redo - at end of history');
        }
        return;
      }
    }

    // Don't handle other shortcuts if typing in input fields
    if (isTyping) {
      return;
    }

    // Handle help toggle
    if (event.key === '?' && !event.shiftKey) {
      event.preventDefault();
      setShowKeyboardHelp(prev => !prev);
      console.log('🔍 Keyboard help toggled');
      return;
    }

    // Handle delete shortcuts for edges and nodes
    if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault();
      
      // Delete selected edges first, then nodes if no edges selected
      if (selectedEdges.length > 0) {
        console.log('🗑️ Deleting selected edges:', selectedEdges);
        deleteSelectedEdges();
        showActionFeedback(`Deleted ${selectedEdges.length} edge${selectedEdges.length > 1 ? 's' : ''}`);
      } else {
        const selectedNodes = reactFlowNodes.filter(node => node.selected);
        if (selectedNodes.length > 0) {
          console.log('🗑️ Deleting selected nodes:', selectedNodes.map(n => n.id));
          deleteSelectedNodes();
          showActionFeedback(`Deleted ${selectedNodes.length} node${selectedNodes.length > 1 ? 's' : ''}`);
        }
      }
      return;
    }

    // Handle escape key to clear selection
    if (event.key === 'Escape') {
      event.preventDefault();
      if (showKeyboardHelp) {
        setShowKeyboardHelp(false);
        console.log('❌ Keyboard help closed');
      } else {
        clearSelection();
        console.log('🔄 Selection cleared');
        showActionFeedback('Selection cleared');
      }
      return;
    }
  }, [
    undo, 
    redo, 
    currentIndex,
    selectedEdges, 
    deleteSelectedEdges, 
    deleteSelectedNodes, 
    clearSelection,
    reactFlowNodes,
    showKeyboardHelp,
    showActionFeedback
  ]);

  // Add global keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onKeyDown]);

  /**
   * Add a new node to the canvas at a specific position
   */
  const addNode = useCallback((type, position = null) => {
    const nodePosition = position || { 
      x: Math.random() * 400 + 100, 
      y: Math.random() * 400 + 100 
    };

    const newNode = {
      id: `${nodeIdCounter}`,
      type,
      position: nodePosition,
      data: getDefaultNodeData(type),
    };
    
    console.log('➕ Adding new node:', { type, position: nodePosition, id: newNode.id });
    
    updateEditorState({
      nodes: [...nodes, newNode],
      nodeIdCounter: nodeIdCounter + 1
    });
  }, [nodeIdCounter, nodes, updateEditorState]);

  /**
   * Handle drag over events for the drop zone
   */
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  /**
   * Handle drop events when a node is dropped onto the canvas
   */
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const nodeType = event.dataTransfer.getData('application/reactflow');

      if (typeof nodeType === 'undefined' || !nodeType || !reactFlowInstance) {
        return;
      }

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      console.log('🎯 Node dropped at position:', position);
      addNode(nodeType, position);
    },
    [reactFlowInstance, addNode]
  );

  /**
   * Handle ReactFlow nodes change events
   * Only save position changes to history when dragging is complete
   */
  const handleNodesChange = useCallback((changes) => {
    isSyncingState.current = true;
    onNodesChange(changes);
    
    // Check if this is a position change that should be saved to history
    const hasPositionChange = changes.some(change => 
      change.type === 'position' && change.dragging === false
    );
    
    if (hasPositionChange) {
      // Get the updated nodes from ReactFlow and save to history
      setTimeout(() => {
        setReactFlowNodes(currentNodes => {
          console.log('💾 Saving node position changes to history');
          updateEditorState({ nodes: currentNodes });
          isSyncingState.current = false;
          return currentNodes;
        });
      }, 0);
    } else {
      isSyncingState.current = false;
    }
  }, [onNodesChange, setReactFlowNodes, updateEditorState]);

  /**
   * Handle ReactFlow edges change events
   */
  const handleEdgesChange = useCallback((changes) => {
    isSyncingState.current = true;
    onEdgesChange(changes);
    
    // Sync edge changes back to history if needed
    const hasRemoval = changes.some(change => change.type === 'remove');
    if (hasRemoval) {
      setTimeout(() => {
        setReactFlowEdges(currentEdges => {
          console.log('💾 Saving edge changes to history');
          updateEditorState({ edges: currentEdges });
          isSyncingState.current = false;
          return currentEdges;
        });
      }, 0);
    } else {
      isSyncingState.current = false;
    }
  }, [onEdgesChange, setReactFlowEdges, updateEditorState]);

  /**
   * Update node data when user interacts with node controls
   */
  const updateNodeData = useCallback((nodeId, newData) => {
    const updatedNodes = nodes.map((node) =>
      node.id === nodeId
        ? { ...node, data: { ...node.data, ...newData } }
        : node
    );
    
    console.log('📝 Updating node data:', { nodeId, newData });
    updateEditorState({ nodes: updatedNodes });
  }, [nodes, updateEditorState]);

  /**
   * Get default data for different node types
   */
  const getDefaultNodeData = (type) => {
    switch (type) {
      case 'inputNode':
        return { label: 'Input Node' };
      case 'outputNode':
        return { label: 'Output Node' };
      case 'llmNode':
        return { model: 'gpt-3.5-turbo', temperature: 0.7 };
      case 'textNode':
        return { text: 'Enter your text here...' };
      case 'filterNode':
        return { condition: 'contains', value: '' };
      case 'transformNode':
        return { operation: 'uppercase' };
      case 'aggregateNode':
        return { operation: 'sum' };
      case 'conditionalNode':
        return { condition: 'if-then-else' };
      case 'delayNode':
        return { delay: 1000 };
      default:
        return {};
    }
  };

  /**
   * Enhanced node types with update functionality
   */
  const enhancedNodeTypes = useMemo(() => {
    const enhanced = {};
    Object.keys(nodeTypes).forEach((key) => {
      const OriginalComponent = nodeTypes[key];
      enhanced[key] = (props) => (
        <OriginalComponent
          {...props}
          updateNodeData={updateNodeData}
        />
      );
    });
    return enhanced;
  }, [updateNodeData]);

  return (
    <div 
      style={{ width: '100vw', height: '100vh', display: 'flex' }}
      tabIndex={0}
    >
      {/* Left sidebar with node library */}
      <NodeSidebar onAddNode={addNode} />
      
      {/* Main ReactFlow canvas area */}
      <div 
        className="reactflow-wrapper" 
        ref={reactFlowWrapper}
        style={{ flex: 1 }}
      >
        <ReactFlow
          nodes={reactFlowNodes}
          edges={reactFlowEdges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onSelectionChange={onSelectionChange}
          nodeTypes={enhancedNodeTypes}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
          multiSelectionKeyCode="Shift"
          selectNodesOnDrag={false}
          deleteKeyCode={null}
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
          
          {/* Top-left panel with history controls */}
          <Panel position="top-left">
            <HistoryControls
              onUndo={undo}
              onRedo={redo}
              onClearHistory={clearHistory}
              canUndo={canUndo}
              canRedo={canRedo}
              historySize={historySize}
              currentIndex={currentIndex}
            />
          </Panel>
          
          {/* Top-right panel with submit button and edge delete button */}
          <Panel position="top-right">
            <div className="panel-buttons">
              <SubmitButton nodes={nodes} edges={edges} />
              <EdgeDeleteButton 
                selectedEdges={selectedEdges}
                onDeleteEdges={deleteSelectedEdges}
              />
            </div>
          </Panel>

          {/* Bottom-right panel with help button */}
          <Panel position="bottom-right">
            <button 
              className="help-button"
              onClick={() => setShowKeyboardHelp(true)}
              title="Show keyboard shortcuts (?)"
            >
              <span>?</span>
            </button>
          </Panel>
        </ReactFlow>
      </div>

      {/* Keyboard shortcuts help overlay */}
      <KeyboardShortcutsHelp 
        isVisible={showKeyboardHelp}
        onClose={() => setShowKeyboardHelp(false)}
      />
      
      {/* Global styles */}
      <style jsx global>{`
        .reactflow-wrapper {
          position: relative;
        }

        .panel-buttons {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .help-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #6b7280;
          font-weight: 600;
          font-size: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .help-button:hover {
          background: #f3f4f6;
          border-color: #9ca3af;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          color: #374151;
        }

        .help-button:active {
          transform: translateY(0);
        }

        .react-flow__node {
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border: 2px solid transparent;
          transition: all 0.2s ease;
        }

        .react-flow__node:hover {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          transform: translateY(-1px);
        }

        .react-flow__node.selected {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .react-flow__handle {
          width: 12px;
          height: 12px;
          border: 2px solid #fff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: all 0.2s ease;
        }

        .react-flow__handle:hover {
          transform: scale(1.2);
        }

        .react-flow__handle-left {
          left: -6px;
        }

        .react-flow__handle-right {
          right: -6px;
        }

        .react-flow__edge {
          stroke-width: 2;
          transition: all 0.2s ease;
        }

        .react-flow__edge.selected {
          stroke: #ef4444;
          stroke-width: 3;
          filter: drop-shadow(0 0 6px rgba(239, 68, 68, 0.4));
        }

        .react-flow__edge:hover {
          stroke-width: 3;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}