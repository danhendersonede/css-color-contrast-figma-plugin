import { ContainerNodeData, TextNodeData } from "./nodes";

// Message types that can be sent from UI to plugin
export type UIToPluginMessage = 
  | { type: 'NAVIGATE'; route: string; fromRoute?: string }
  | { 
      type: 'ENABLE_COLOR_CONTRAST_ON_SELECTED_NODE';
      textNodeData: TextNodeData;
      containerNodeData: ContainerNodeData;
    }
  | {
      type: 'DISABLE_COLOR_CONTRAST_ON_SELECTED_NODE';
      textNodeData: TextNodeData;
      containerNodeData: ContainerNodeData;
    };

// Message types that can be sent from plugin to UI
export type PluginToUIMessage = 
  | {
      type: 'SELECTION_CHANGE_TEXT_NODE';
      textNodeData: TextNodeData;
      containerNodeData: ContainerNodeData;
    }
  | {
      type: 'SELECTION_CHANGE_CONTAINER_NODE';
      containerNodeData: ContainerNodeData;
      textNodeData: TextNodeData[];
    }
  | {
      type: 'SELECTION_CHANGE_NO_NODE_SELECTED';
    }
  | {
      type: 'UPDATE_COMPLETE';
      updatedNodes: number;
      disabledNodes: number;
      totalNodes: number;
      error?: string;
    };