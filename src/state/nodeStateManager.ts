import { NodeState, NodeStateChangeEvent, isTextNode, isContainerNode } from '../types/nodes';
import { getTextNodeData, getContainerNodeData } from '../utils/getNodeData';

export class NodeStateManager {
  private static instance: NodeStateManager;
  private currentState: NodeState = {
    type: 'NO_SELECTION',
    textNodeData: null,
    containerNodeData: null
  };

  private constructor() {}

  public static getInstance(): NodeStateManager {
    if (!NodeStateManager.instance) {
      NodeStateManager.instance = new NodeStateManager();
    }
    return NodeStateManager.instance;
  }

  async handleSelectionChange(): Promise<NodeStateChangeEvent> {
    const selection = figma.currentPage.selection;
    
    // Handle no selection
    if (selection.length === 0) {
      this.currentState = {
        type: 'NO_SELECTION',
        textNodeData: null,
        containerNodeData: null
      };
      return { type: 'NO_SELECTION', data: this.currentState };
    }

    const node = selection[0];

    // Handle text node selection
    if (isTextNode(node)) {
      const textNodeData = await getTextNodeData(node);
      let containerNodeData = null;
      
      if (node.parent && isContainerNode(node.parent)) {
        containerNodeData = await getContainerNodeData(node.parent);
      }

      this.currentState = {
        type: 'TEXT_NODE',
        textNodeData,
        containerNodeData
      };
      return { type: 'TEXT_NODE', data: this.currentState };
    }

    // Handle container node selection
    if (isContainerNode(node)) {
      const containerNodeData = await getContainerNodeData(node);
      
      this.currentState = {
        type: 'CONTAINER_NODE',
        textNodeData: null,
        containerNodeData
      };
      return { type: 'CONTAINER_NODE', data: this.currentState };
    }

    // Handle unsupported node types
    this.currentState = {
      type: 'UNSUPPORTED_NODE',
      textNodeData: null,
      containerNodeData: null
    };
    return { type: 'UNSUPPORTED_NODE', data: this.currentState };
  }

  getCurrentState(): NodeState {
    return this.currentState;
  }
} 