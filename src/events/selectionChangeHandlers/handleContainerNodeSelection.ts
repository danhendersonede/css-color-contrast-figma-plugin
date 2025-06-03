import { ContainerNode } from "../../types/nodes";
import { getContainerNodeData } from "../../utils/getNodeData";
import { updateTextNodeColors } from "../../utils/updateTextNodeColors";
import { PluginToUIMessage } from "../../types/messages";

export async function handleContainerNodeSelection(containerNode: ContainerNode) {
  const containerNodeData = await getContainerNodeData(containerNode);

  const textNodeData = updateTextNodeColors(containerNode, containerNodeData);

  const message: PluginToUIMessage = {
    type: 'SELECTION_CHANGE_CONTAINER_NODE',
    containerNodeData: containerNodeData,
    textNodeData: textNodeData
  };

  figma.ui.postMessage(message);
}
