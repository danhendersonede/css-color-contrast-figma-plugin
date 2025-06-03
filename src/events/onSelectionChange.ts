import { handleContainerNodeSelection } from "./selectionChangeHandlers/handleContainerNodeSelection";
import { handleTextNodeSelection } from "./selectionChangeHandlers/handleTextNodeSelection";
import { handleNoNodeSelected } from "./selectionChangeHandlers/handleNoNodeSelected";
import { isContainerNode, isTextNode } from "../types/nodes";

export function onSelectionChange(): void {
    const node = figma.currentPage.selection[0] as SceneNode;

    if (!node) {
        handleNoNodeSelected();
        return;
    }

    if (isTextNode(node)) {
        handleTextNodeSelection(node);
        return;
    } 
    
    if (isContainerNode(node)) {
        handleContainerNodeSelection(node);
        return;
    } 
}