
import { ContainerNodeData, isContainerNode, TextNodeData } from "../../types/nodes";
import { getContainerNodeData } from "../../utils/getContainerNodeData";
import { PluginToUIMessage } from "../../types/messages";

export async function handleTextNodeSelection(node: TextNode) {
  const selectedTextNodeData: TextNodeData = {
    id: node.id,
    type: node.type,
    pluginData: {
      enabled: node.getSharedPluginData('color_contrast', 'enabled')
    }
  };

  let selectedContainerNodeData: ContainerNodeData = {
    id: "",
    type: "",
    fillColor: {
      hex: null,
      rgb: null
    },
    colorContrast: {
      white: null,
      black: null
    }
  };

  if (isContainerNode(node.parent)) {
    selectedContainerNodeData = getContainerNodeData(node.parent);
  }

  const message: PluginToUIMessage = {
    type: 'SELECTION_CHANGE_TEXT_NODE',
    textNodeData: selectedTextNodeData,
    containerNodeData: selectedContainerNodeData
  };

  figma.ui.postMessage(message);
}
  