
import { ContainerNodeData, isContainerNode } from "../../types/nodes";
import { getContainerNodeData, getTextNodeData } from "../../utils/getNodeData";
import { PluginToUIMessage } from "../../types/messages";

export async function handleTextNodeSelection(node: TextNode) {
  const selectedTextNodeData = await getTextNodeData(node);

  let selectedContainerNodeData: ContainerNodeData = {
    id: "",
    type: "",
    fillColor: {
      hex: null,
      rgb: null,
      variableName: null
    },
    colorContrast: {
      white: null,
      black: null
    }
  };

  if (isContainerNode(node.parent)) {
    selectedContainerNodeData = await getContainerNodeData(node.parent);
  }

  const message: PluginToUIMessage = {
    type: 'SELECTION_CHANGE_TEXT_NODE',
    textNodeData: selectedTextNodeData,
    containerNodeData: selectedContainerNodeData
  };

  figma.ui.postMessage(message);
}
  