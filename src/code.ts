import { onSelectionChange } from "./events/onSelectionChange";
import { onPluginStart } from "./events/onPluginStart";
import { UIToPluginMessage } from "./types/messages";
import { applyColorContrastToSelectedNode } from "./events/onApplyColorContrast";
import { onNavigate } from "./events/onNavigate";
import { disableColorContrastOnSelectedNode } from "./events/onDisableColorContrast";

// Show the most relevant UI on plugin load
onPluginStart();

// Direct messages from the plugin UI
figma.ui.onmessage = async (msg: UIToPluginMessage) => {
  switch (msg.type) {
    case 'NAVIGATE':
      onNavigate(msg.route, msg.fromRoute);
      break;
      
    case 'ENABLE_COLOR_CONTRAST_ON_SELECTED_NODE': {
      applyColorContrastToSelectedNode(msg.textNodeData, msg.containerNodeData);
      break;
    }

    case 'DISABLE_COLOR_CONTRAST_ON_SELECTED_NODE': {
      disableColorContrastOnSelectedNode(msg.textNodeData, msg.containerNodeData);
      break;
    }
  }
};

// Handle events from the editor
figma.on('selectionchange', () => {
  onSelectionChange();
});


