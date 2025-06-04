import { onPluginStart } from "./events/onPluginStart";
import { UIToPluginMessage } from "./types/messages";
import { applyColorContrastToSelectedNode } from "./events/onApplyColorContrast";
import { onNavigate } from "./events/onNavigate";
import { disableColorContrastOnSelectedNode } from "./events/onDisableColorContrast";
import { NodeStateManager } from "./state/nodeStateManager";
import { MessageHandler } from "./messaging/messageHandler";

// Initialize singletons
const stateManager = NodeStateManager.getInstance();
const messageHandler = MessageHandler.getInstance();

// Show the most relevant UI on plugin load
onPluginStart();

// Direct messages from the plugin UI
figma.ui.onmessage = async (msg: UIToPluginMessage) => {
  switch (msg.type) {
    case 'NAVIGATE':
      onNavigate(msg.route, msg.fromRoute);
      break;
      
    case 'ENABLE_COLOR_CONTRAST_ON_SELECTED_NODE': {
      await applyColorContrastToSelectedNode(msg.textNodeData, msg.containerNodeData);
      // Update state after enabling color contrast
      const stateEvent = await stateManager.handleSelectionChange();
      messageHandler.handleStateChange(stateEvent);
      break;
    }

    case 'DISABLE_COLOR_CONTRAST_ON_SELECTED_NODE': {
      await disableColorContrastOnSelectedNode(msg.textNodeData, msg.containerNodeData);
      // Update state after disabling color contrast
      const stateEvent = await stateManager.handleSelectionChange();
      messageHandler.handleStateChange(stateEvent);
      break;
    }
  }
};

// Handle events from the editor
figma.on('selectionchange', async () => {
  const stateEvent = await stateManager.handleSelectionChange();
  messageHandler.handleStateChange(stateEvent);
});