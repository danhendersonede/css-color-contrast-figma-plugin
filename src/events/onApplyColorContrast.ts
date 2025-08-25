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
      
      await onAddAnnotation(textNodeData, containerNodeData);

      const updatedTextNodeData: TextNodeData = {
        id: textNodeData.id,
        type: textNodeData.type,
        fillColor: textNodeData.fillColor,
        pluginData: {
          enabled: true,
          containerNodeData: containerNodeData
        }
      };

      figma.ui.postMessage({
        type: 'SELECTION_CHANGE_TEXT_NODE',
        textNodeData: updatedTextNodeData,
        containerNodeData
      });
    }
}