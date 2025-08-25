import { onPluginStart } from "./events/onPluginStart";
import { UIToPluginMessage } from "./types/messages";
import { applyColorContrastToSelectedNode } from "./events/onApplyColorContrast";
import { onNavigate } from "./events/onNavigate";
import { disableColorContrastOnSelectedNode } from "./events/onDisableColorContrast";
import { NodeStateManager } from "./state/nodeStateManager";
import { MessageHandler } from "./messaging/messageHandler";

const stateManager = NodeStateManager.getInstance();
const messageHandler = MessageHandler.getInstance();

onPluginStart();
figma.ui.onmessage = async (msg: UIToPluginMessage) => {
  switch (msg.type) {
    case 'NAVIGATE':
      onNavigate(msg.route, msg.fromRoute);
      break;
      
    case 'ENABLE_COLOR_CONTRAST_ON_SELECTED_NODE': {
      await applyColorContrastToSelectedNode(msg.textNodeData, msg.containerNodeData);
      const stateEvent = await stateManager.handleSelectionChange();
      messageHandler.handleStateChange(stateEvent);
      break;
    }

    case 'DISABLE_COLOR_CONTRAST_ON_SELECTED_NODE': {
      await disableColorContrastOnSelectedNode(msg.textNodeData, msg.containerNodeData);
      const stateEvent = await stateManager.handleSelectionChange();
      messageHandler.handleStateChange(stateEvent);
      break;
    }
  }
};

figma.on('selectionchange', async () => {
  const stateEvent = await stateManager.handleSelectionChange();
  messageHandler.handleStateChange(stateEvent);
});