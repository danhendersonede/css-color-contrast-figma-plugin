import { PluginToUIMessage } from "../../types/messages";

export function handleNoNodeSelected() {
    const message: PluginToUIMessage = {
        type: 'SELECTION_CHANGE_NO_NODE_SELECTED',
    };

    figma.ui.postMessage(message);
}