import { onSelectionChange } from "./onSelectionChange";
import { showUI } from "../utils/showUI";

export function onPluginStart() {
    const introductionComplete = figma.root.getPluginData('color-contrast-introduction-complete');

    if (introductionComplete) {
        showUI(__uiFiles__.editor);
    } else {
        showUI(__uiFiles__.welcome);
    }

    onSelectionChange();
}