import { NodeState, NodeStateChangeEvent, isTextNode, isContainerNode } from '../types/nodes';
import { getTextNodeData, getContainerNodeData } from '../utils/getNodeData';
import { findParentWithSolidFill } from '../utils/paint';
import { calculateContrastRatio } from '../utils/color';

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
    try {
      // Ensure current page is available
      if (!figma.currentPage) {
        console.error('No current page available');
        this.currentState = {
          type: 'NO_SELECTION',
          textNodeData: null,
          containerNodeData: null
        };
        return { type: 'NO_SELECTION', data: this.currentState };
      }

      const selection = figma.currentPage.selection;
      
      if (!selection || selection.length === 0) {
        this.currentState = {
          type: 'NO_SELECTION',
          textNodeData: null,
          containerNodeData: null
        };
        return { type: 'NO_SELECTION', data: this.currentState };
      }

      const node = selection[0];
      if (!node) {
        this.currentState = {
          type: 'NO_SELECTION',
          textNodeData: null,
          containerNodeData: null
        };
        return { type: 'NO_SELECTION', data: this.currentState };
      }

      if (isTextNode(node)) {
        const textNodeData = await getTextNodeData(node);
        
        const parentWithFill = findParentWithSolidFill(node);
        
        if (!parentWithFill) {
          this.currentState = {
            type: 'TEXT_NODE_NO_CONTAINER',
            textNodeData,
            containerNodeData: null
          };
          return { type: 'TEXT_NODE_NO_CONTAINER', data: this.currentState };
        }

        const containerNodeData = await getContainerNodeData(parentWithFill);
        
        if (textNodeData.fillColor.rgb && containerNodeData.fillColor.rgb) {
          const currentTextContrast = calculateContrastRatio(
            textNodeData.fillColor.rgb, 
            containerNodeData.fillColor.rgb
          );
          containerNodeData.colorContrast.currentTextContrast = currentTextContrast;
        }

        this.currentState = {
          type: 'TEXT_NODE',
          textNodeData,
          containerNodeData
        };
        return { type: 'TEXT_NODE', data: this.currentState };
      }

      if (isContainerNode(node)) {
        const containerNodeData = await getContainerNodeData(node);
        
        this.currentState = {
          type: 'CONTAINER_NODE',
          textNodeData: null,
          containerNodeData
        };
        return { type: 'CONTAINER_NODE', data: this.currentState };
      }

      this.currentState = {
        type: 'UNSUPPORTED_NODE',
        textNodeData: null,
        containerNodeData: null
      };
      return { type: 'UNSUPPORTED_NODE', data: this.currentState };
    } catch (error) {
      console.error('Error in handleSelectionChange:', error);
      this.currentState = {
        type: 'NO_SELECTION',
        textNodeData: null,
        containerNodeData: null
      };
      return { type: 'NO_SELECTION', data: this.currentState };
    }
  }

  getCurrentState(): NodeState {
    return this.currentState;
  }
} 