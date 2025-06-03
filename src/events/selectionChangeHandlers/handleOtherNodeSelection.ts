import { PluginToUIMessage } from "../../types/messages";
import { BaseNodeData } from "../../types/nodes";

export function handleOtherNodeSelection(node: BaseNodeData) {
    const message: PluginToUIMessage = {
        type: 'SELECTION_CHANGE_OTHER_NODE',
        nodeData: {
            id: node.id,
            type: node.type,
        }
    };

    figma.ui.postMessage(message);
}