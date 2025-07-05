/**
 * useHistory Hook
 * 
 * A custom React hook that provides undo/redo functionality for any state.
 * This hook maintains a history stack of state changes and provides
 * functions to navigate through the history.
 * 
 * Features:
 * - Maintains a configurable history limit
 * - Provides undo/redo functions
 * - Tracks current position in history
 * - Automatically manages history when state changes
 * - Prevents infinite loops when applying history changes
 * 
 * @param {any} initialState - The initial state value
 * @param {number} maxHistorySize - Maximum number of history entries to keep
 * @returns {object} Object containing state, setState, undo, redo, and history info
 */
import { useState, useCallback, useRef } from 'react';

export function useHistory(initialState, maxHistorySize = 50) {
  // History stack to store previous states
  const [history, setHistory] = useState([initialState]);
  
  // Current position in the history stack
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Flag to prevent adding to history when applying undo/redo
  const isApplyingHistory = useRef(false);
  
  // Current state value
  const currentState = history[currentIndex];

  /**
   * Set new state and add to history
   * @param {any} newState - The new state value or function
   */
  const setState = useCallback((newState) => {
    // Don't add to history if we're applying an undo/redo operation
    if (isApplyingHistory.current) {
      return;
    }

    setHistory(prevHistory => {
      const newHistory = [...prevHistory];
      
      // Remove any "future" history if we're not at the end
      if (currentIndex < newHistory.length - 1) {
        newHistory.splice(currentIndex + 1);
      }
      
      // Calculate the actual new state value
      const actualNewState = typeof newState === 'function' 
        ? newState(newHistory[currentIndex])
        : newState;
      
      // Only add to history if the state actually changed
      const currentStateStr = JSON.stringify(newHistory[currentIndex]);
      const newStateStr = JSON.stringify(actualNewState);
      
      if (currentStateStr === newStateStr) {
        return prevHistory; // No change, don't add to history
      }
      
      // Add the new state to history
      newHistory.push(actualNewState);
      
      // Limit history size
      if (newHistory.length > maxHistorySize) {
        newHistory.shift();
        // Update currentIndex to point to the last element after shifting
        setCurrentIndex(newHistory.length - 1);
      } else {
        // Update currentIndex to point to the new state
        setCurrentIndex(newHistory.length - 1);
      }
      
      return newHistory;
    });
  }, [currentIndex, maxHistorySize]);

  /**
   * Undo the last change
   * @returns {boolean} True if undo was successful, false if at beginning
   */
  const undo = useCallback(() => {
    if (currentIndex > 0) {
      isApplyingHistory.current = true;
      setCurrentIndex(prev => prev - 1);
      
      // Reset the flag after state updates complete
      setTimeout(() => {
        isApplyingHistory.current = false;
      }, 0);
      
      return true;
    }
    return false;
  }, [currentIndex]);

  /**
   * Redo the next change
   * @returns {boolean} True if redo was successful, false if at end
   */
  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      isApplyingHistory.current = true;
      setCurrentIndex(prev => prev + 1);
      
      // Reset the flag after state updates complete
      setTimeout(() => {
        isApplyingHistory.current = false;
      }, 0);
      
      return true;
    }
    return false;
  }, [currentIndex, history.length]);

  /**
   * Clear all history and reset to initial state
   */
  const clearHistory = useCallback(() => {
    setHistory([initialState]);
    setCurrentIndex(0);
  }, [initialState]);

  return {
    state: currentState,
    setState,
    undo,
    redo,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
    historySize: history.length,
    currentIndex,
    clearHistory
  };
}