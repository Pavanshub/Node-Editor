# VectorShift Node Editor

A comprehensive, React-based node editor implementation with backend integration for pipeline analysis. This project demonstrates modern web development practices with a focus on component abstraction, professional styling, and full-stack integration.

## Features

### Part 1: Node Abstraction ✅
- **BaseNode Component**: Reusable abstraction that eliminates code duplication across node types
- **Flexible Handle System**: Dynamic input/output connections with custom positioning
- **Consistent Styling**: Unified design system across all nodes with theme colors
- **Easy Extension**: Simple to create new node types by extending BaseNode
- **Input Handling**: Full support for user interactions and data updates

### Part 2: Professional Styling ✅
- **Modern Design**: Clean, professional interface with hover effects and micro-interactions
- **Color-Coded System**: Each node type has its own distinctive color scheme
- **Responsive Layout**: Optimized for different screen sizes and devices
- **Smooth Animations**: Subtle transitions and visual feedback throughout the interface
- **Apple-Level Aesthetics**: Attention to detail with premium visual design

### Part 3: Enhanced Text Node ✅
- **Dynamic Sizing**: Node automatically resizes based on text content length and height
- **Variable Detection**: Real-time detection of `{{variable}}` syntax in text
- **Dynamic Handles**: Automatically creates input handles for each detected variable
- **Live Preview**: Shows detected variables as tags with real-time updates
- **Smart Positioning**: Handles are positioned intelligently to avoid overlap

### Part 4: Backend Integration ✅
- **FastAPI Backend**: Python backend with comprehensive CORS support
- **Pipeline Analysis**: Calculates nodes, edges, and validates DAG structure
- **NetworkX Integration**: Uses advanced graph theory for cycle detection
- **User Feedback**: Professional alert system with detailed analysis results
- **Error Handling**: Robust error handling with user-friendly messages

##  Node Types

### Basic Nodes
1. **Input Node** - Data input sources with customizable labels
2. **Output Node** - Data output destinations with customizable labels
3. **Text Node** - Enhanced text processing with variable support and dynamic sizing

### AI Nodes
4. **LLM Node** - AI language model integration with configurable parameters

### Processing Nodes
5. **Filter Node** - Data filtering with multiple condition types
6. **Transform Node** - Data transformation operations (uppercase, lowercase, etc.)
7. **Aggregate Node** - Mathematical aggregation functions (sum, average, count, etc.)
8. **Conditional Node** - Branching logic with true/false output paths
9. **Delay Node** - Time-based delays in processing pipelines

##  Architecture

### Frontend Architecture
```
src/
├── components/          # React components
│   ├── NodeEditor.jsx   # Main editor component with state management
│   ├── NodeSidebar.jsx  # Node library sidebar with categories
│   └── SubmitButton.jsx # Pipeline submission and analysis
├── nodes/              # Node type definitions
│   ├── BaseNode.jsx    # Abstract base component for all nodes
│   ├── InputNode.jsx   # Data input node
│   ├── OutputNode.jsx  # Data output node
│   ├── TextNode.jsx    # Enhanced text node with variables
│   ├── LLMNode.jsx     # AI language model node
│   └── [Other nodes]   # Processing and utility nodes
└── App.jsx             # Root application component
```

### Backend Architecture
```
backend/
├── main.py             # FastAPI application with pipeline analysis
├── requirements.txt    # Python dependencies
└── [Future additions]  # Database, authentication, etc.
```

##  Getting Started

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+ and pip

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start the FastAPI server
python main.py
```

The backend will run on `http://localhost:8000` and the frontend on `http://localhost:5173`.

##  Usage Guide

### Creating Pipelines
1. **Add Nodes**: Click any node type in the sidebar to add it to the canvas
2. **Connect Nodes**: Drag from output handles (right side) to input handles (left side)
3. **Configure Nodes**: Edit properties directly in each node's interface
4. **Use Variables**: In text nodes, use `{{variableName}}` syntax to create dynamic inputs

### Text Node Variables
The Text node supports dynamic variable detection:
- Type `{{input}}` to create an input handle named "input"
- Type `{{userName}}` to create an input handle named "userName"
- Variables are detected in real-time and handles are created automatically
- The node resizes dynamically based on content

### Pipeline Analysis
1. **Create Your Pipeline**: Add and connect nodes as desired
2. **Submit for Analysis**: Click the "Submit Pipeline" button
3. **View Results**: See node count, edge count, and DAG validation status
4. **Iterate**: Modify your pipeline and resubmit for analysis

##  Technical Implementation

### Node Abstraction System
The `BaseNode` component provides:
- **Consistent Styling**: Unified visual design across all node types
- **Dynamic Handles**: Flexible input/output connection system
- **Theme Support**: Color-coded node types with CSS custom properties
- **Input Handling**: Built-in support for user interactions and data updates
- **Extensibility**: Easy creation of new node types with minimal code

### State Management
- **ReactFlow Integration**: Uses ReactFlow hooks for node and edge state
- **Unidirectional Data Flow**: Clean data flow from parent to child components
- **Real-time Updates**: Immediate UI updates when users interact with controls
- **Persistent State**: Node configurations are maintained throughout the session

### Backend Analysis
- **Graph Theory**: Uses NetworkX for sophisticated graph analysis
- **DAG Validation**: Ensures pipelines don't contain infinite loops
- **RESTful API**: Clean, documented API endpoints
- **Type Safety**: Pydantic models for request/response validation

##  Design Philosophy

### Visual Design
- **Professional Aesthetics**: Clean, modern interface inspired by industry-leading tools
- **Consistent Theming**: Each node type has a distinctive color that appears throughout the interface
- **Micro-interactions**: Subtle animations and hover effects for enhanced user experience
- **Responsive Design**: Optimized for various screen sizes and devices

### Code Quality
- **Comprehensive Comments**: Every component and function is thoroughly documented
- **Separation of Concerns**: Clear boundaries between components and responsibilities
- **Reusable Components**: DRY principles applied throughout the codebase
- **Type Safety**: Proper prop validation and error handling

##  Future Enhancements

### Planned Features
- **Node Templates**: Save and reuse common node configurations
- **Pipeline Validation**: Real-time validation with visual feedback
- **Export/Import**: Save pipelines as JSON files
- **Collaborative Editing**: Multi-user pipeline editing
- **Advanced Analytics**: Performance metrics and optimization suggestions

### Technical Improvements
- **TypeScript Migration**: Full type safety throughout the application
- **Testing Suite**: Comprehensive unit and integration tests
- **Performance Optimization**: Virtualization for large pipelines
- **Accessibility**: Full WCAG compliance for inclusive design

##  Learning Resources

This project demonstrates several advanced concepts:
- **Component Abstraction**: How to create reusable, extensible components
- **State Management**: Effective patterns for complex application state
- **Graph Theory**: Practical application of DAG validation
- **Full-Stack Integration**: Seamless frontend-backend communication
- **Modern React Patterns**: Hooks, context, and performance optimization

##  Contributing

This codebase is designed to be educational and extensible. Key areas for contribution:
- **New Node Types**: Add specialized processing nodes
- **Enhanced Styling**: Improve visual design and animations
- **Backend Features**: Add authentication, persistence, or advanced analysis
- **Documentation**: Improve code comments and user guides

##  License

This project is created for educational purposes and demonstrates modern web development practices.
