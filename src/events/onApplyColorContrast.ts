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
    }
}