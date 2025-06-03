import { onSelectionChange } from "./onSelectionChange";
import { showUI } from "../utils/showUI";
import { onUpdateEnabledNodes } from "./onUpdateEnabledNodes";

export async function onPluginStart() {
    const introductionComplete = figma.root.getPluginData('color-contrast-introduction-complete');

    // Show loading UI first
    showUI(__uiFiles__.loading);

    onUpdateEnabledNodes();
    
    if (introductionComplete) {
        showUI(__uiFiles__.editor);
    } else {
        showUI(__uiFiles__.welcome);
    }

    onSelectionChange();
}