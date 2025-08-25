import { onSelectionChange } from "./onSelectionChange";
import { showUI } from "../utils/showUI";
import { onUpdateEnabledNodes } from "./onUpdateEnabledNodes";

export async function onPluginStart() {
    const introductionComplete = figma.root.getPluginData('color-contrast-introduction-complete');

    showUI(__uiFiles__.loading);

    try {
        await onUpdateEnabledNodes();
    } catch (error) {
        console.error('Error updating enabled nodes:', error);
        // Continue with plugin startup even if update fails
    }
    
    if (introductionComplete) {
        showUI(__uiFiles__['editor-empty']);
    } else {
        showUI(__uiFiles__.welcome);
    }

    try {
        await onSelectionChange();
    } catch (error) {
        console.error('Error handling initial selection:', error);
        // Continue with plugin startup
    }
}