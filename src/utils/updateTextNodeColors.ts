import { ContainerNode, ContainerNodeData, TextNodeData } from "../types/nodes";
import { getBestContrastColor } from "./color";

export function updateTextNodeColors(containerNode: ContainerNode, containerNodeData: ContainerNodeData): TextNodeData[] {
    const bestContrastColor = getBestContrastColor(containerNodeData.colorContrast);

    const textNodes = containerNode.findAllWithCriteria({
      types: ['TEXT'],
      sharedPluginData: {
        namespace: "color_contrast",
        keys: ["enabled"]
      }
    }).filter(node => node.getSharedPluginData("color_contrast", "enabled") === "true");
  

    const textNodeData: TextNodeData[] = [];
    textNodes.forEach(textNode => {
      const newChild = textNode.clone();
  
      newChild.fills = [{
        type: 'SOLID',
        color: bestContrastColor
      }];
  
      const index = containerNode.children.indexOf(textNode);
      textNode.remove();
      containerNode.insertChild(index, newChild);

      textNodeData.push({
        id: textNode.id,
        type: textNode.type,
        pluginData: {
          enabled: "true"
        }
      });
    });

    return textNodeData;
}