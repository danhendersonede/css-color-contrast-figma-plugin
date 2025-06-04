import { NodeStateChangeEvent } from '../types/nodes';
import { PluginToUIMessage } from '../types/messages';

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
   * Handles state changes and sends appropriate messages to the UI
   */
  public handleStateChange(stateEvent: NodeStateChangeEvent): void {
    switch (stateEvent.type) {
      case 'TEXT_NODE':
        if (stateEvent.data.textNodeData) {
          this.postMessage({
            type: 'SELECTION_CHANGE_TEXT_NODE',
            textNodeData: stateEvent.data.textNodeData,
            containerNodeData: stateEvent.data.containerNodeData
          });
        }
        break;

      case 'CONTAINER_NODE':
        if (stateEvent.data.containerNodeData) {
          this.postMessage({
            type: 'SELECTION_CHANGE_CONTAINER_NODE',
            containerNodeData: stateEvent.data.containerNodeData,
            textNodeData: []
          });
        }
        break;

      case 'NO_SELECTION':
      case 'UNSUPPORTED_NODE':
        this.postMessage({
          type: 'SELECTION_CHANGE_NO_NODE_SELECTED',
          message: stateEvent.type === 'UNSUPPORTED_NODE'
            ? 'Select a text layer to get started.'
            : 'Select a text layer to get started.'
        });
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