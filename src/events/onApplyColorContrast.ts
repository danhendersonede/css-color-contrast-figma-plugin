import { ContainerNodeData, isTextNode, TextNodeData } from "../types/nodes";
import { getBestContrastColor } from "../utils/color";
import { onAddAnnotation } from "./onAddAnnotation";

export async function applyColorContrastToSelectedNode(textNodeData: TextNodeData, containerNodeData: ContainerNodeData) {
    const node = await figma.getNodeByIdAsync(textNodeData.id);

    if (node && isTextNode(node)) {
      const bestContrastColor = getBestContrastColor(containerNodeData.colorContrast);

      node.fills = [{
        type: 'SOLID',
        color: bestContrastColor
      }];

      node.setSharedPluginData('color_contrast', 'enabled', 'true');
      
      // Add developer annotation
      await onAddAnnotation(textNodeData, containerNodeData);

      // Create updated text node data
      const updatedTextNodeData: TextNodeData = {
        id: textNodeData.id,
        type: textNodeData.type,
        fillColor: textNodeData.fillColor,
        pluginData: {
          enabled: true,
          containerNodeData: containerNodeData
        }
      };

      // Update the UI to reflect the changes
      figma.ui.postMessage({
        type: 'SELECTION_CHANGE_TEXT_NODE',
        textNodeData: updatedTextNodeData,
        containerNodeData
      });
    }
}