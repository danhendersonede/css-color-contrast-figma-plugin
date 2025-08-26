import { isContainerNode } from "../types/nodes";
import { getContainerNodeData } from "../utils/getNodeData";
import { updateTextNodeColors } from "../utils/updateTextNodeColors";

export async function onUpdateEnabledNodes() {
    try {
        // Ensure we have a current page before attempting to load it
        if (!figma.currentPage) {
            console.log('No current page available');
            figma.ui.postMessage({ type: 'UPDATE_COMPLETE', updatedNodes: 0, totalNodes: 0 });
            return;
        }

        await figma.currentPage.loadAsync();
        console.log('Current page loaded');

        const textNodes = figma.currentPage.findAllWithCriteria({
            types: ['TEXT'],
            sharedPluginData: {
                namespace: "color_contrast",
                keys: ["enabled"]
            }
        }).filter(node => node.getSharedPluginData("color_contrast", "enabled") === "true");

        if (textNodes.length === 0) {
            console.log('No nodes to update');
            figma.ui.postMessage({ type: 'UPDATE_COMPLETE', updatedNodes: 0, totalNodes: 0 });
            return;
        }
    
        let updatedNodes = 0;
        let disabledNodes = 0;
    
        for (const textNode of textNodes) {
            try {
                const parent = textNode.parent;
                if (!parent) {
                    console.log('Disabling color-contrast for node without parent:', textNode.id);
                    textNode.setSharedPluginData("color_contrast", "enabled", "false");
                    disabledNodes++;
                    continue;
                }

                if (!isContainerNode(parent)) {
                    console.log('Disabling color-contrast for node with non-container parent:', textNode.id);
                    textNode.setSharedPluginData("color_contrast", "enabled", "false");
                    disabledNodes++;
                    continue;
                }

                if (parent.type === 'INSTANCE') {
                    console.log('Disabling color-contrast for node in component/instance:', textNode.id);
                    textNode.setSharedPluginData("color_contrast", "enabled", "false");
                    disabledNodes++;
                    continue;
                }

                const containerNodeData = await getContainerNodeData(parent);
                const updatedTextNodes = updateTextNodeColors(parent, containerNodeData);
                updatedNodes += updatedTextNodes.length;

            } catch (error) {
                console.error('Error processing node:', textNode.id, error);
                try {
                    textNode.setSharedPluginData("color_contrast", "enabled", "false");
                    disabledNodes++;
                } catch (e) {
                    console.error('Could not disable color-contrast for node:', textNode.id);
                }
            }
        }
    
        const totalNodes = textNodes.length;
        console.log(`Update complete. Total: ${totalNodes}, Updated: ${updatedNodes}, Disabled: ${disabledNodes}`);

        figma.notify(`Updated the color contrast for ${updatedNodes} text nodes on this page.`);
        figma.ui.postMessage({ 
            type: 'UPDATE_COMPLETE', 
            updatedNodes,
            disabledNodes,
            totalNodes
        });
    } catch (error: unknown) {
        console.error('Error in update process:', error);
        figma.ui.postMessage({ 
            type: 'UPDATE_COMPLETE', 
            updatedNodes: 0,
            disabledNodes: 0,
            totalNodes: 0,
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}