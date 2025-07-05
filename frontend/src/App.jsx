import React from 'react';
import NodeEditor from './components/NodeEditor';
import './App.css';

/**
 * Main App Component
 * 
 * This is the root component of the VectorShift Node Editor application.
 * It renders the NodeEditor component which contains all the main functionality.
 * 
 * The App component is kept minimal to maintain separation of concerns,
 * with all editor logic contained within the NodeEditor component.
 */
function App() {
  return (
    <div className="App">
      <NodeEditor />
    </div>
  );
}

export default App;