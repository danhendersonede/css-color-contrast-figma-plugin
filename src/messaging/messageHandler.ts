import { NodeStateChangeEvent } from '../types/nodes';
import { PluginToUIMessage } from '../types/messages';
import { showUI } from '../utils/showUI';

/**
 * Centralized message handler for plugin-to-UI communication.
 * This ensures consistent message formatting and reduces duplicate code.
 */
export class MessageHandler {
  private static instance: MessageHandler;

  private constructor() {}

  public static getInstance(): MessageHandler {
    if (!MessageHandler.instance) {
      MessageHandler.instance = new MessageHandler();
    }
    return MessageHandler.instance;
  }

  /**
   * Handles state changes and routes to appropriate UI
   */
  public handleStateChange(stateEvent: NodeStateChangeEvent): void {
    switch (stateEvent.type) {
      case 'TEXT_NODE':
        if (stateEvent.data.textNodeData) {
          showUI(__uiFiles__['editor-active']);
          this.postMessage({
            type: 'SELECTION_CHANGE_TEXT_NODE',
            textNodeData: stateEvent.data.textNodeData,
            containerNodeData: stateEvent.data.containerNodeData
          });
        }
        break;

      case 'CONTAINER_NODE':
        if (stateEvent.data.containerNodeData) {
          showUI(__uiFiles__['editor-active']);
          this.postMessage({
            type: 'SELECTION_CHANGE_CONTAINER_NODE',
            textNodeData: [],
            containerNodeData: stateEvent.data.containerNodeData
          });
        }
        break;

      case 'TEXT_NODE_NO_CONTAINER':
      case 'NO_SELECTION':
      case 'UNSUPPORTED_NODE':
        showUI(__uiFiles__['editor-empty']);
        break;
    }
  }

  /**
   * Posts a message to the UI with proper typing
   */
  private postMessage(message: PluginToUIMessage): void {
    figma.ui.postMessage(message);
  }
} 