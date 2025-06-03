import { showUI } from "./utils/showUI";
import { onSelectionChange } from "./events/onSelectionChange";
import { onPluginStart } from "./events/onPlugStart";
import { UIToPluginMessage } from "./types/messages";
import { applyColorContrastToSelectedNode } from "./events/onApplyColorContrast";

// Show the welcome screen on plugin load
showUI(__uiFiles__.welcome);

// Direct messages from the plugin UI
figma.ui.onmessage = async (msg: UIToPluginMessage) => {
  switch (msg.type) {
    case 'START_PLUGIN':
      onPluginStart();
      break;
      
    case 'ENABLE_COLOR_CONTRAST_ON_SELECTED_NODE': {
      applyColorContrastToSelectedNode(msg.textNodeData, msg.containerNodeData);
      break;
    }
  }
};

// Handle events from the editor
figma.on('selectionchange', () => {
  onSelectionChange();
});


