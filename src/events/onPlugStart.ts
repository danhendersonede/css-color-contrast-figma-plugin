import { onSelectionChange } from "./onSelectionChange";
import { showUI } from "../utils/showUI";

export function onPluginStart() {
    showUI(__uiFiles__.selectNode);
    onSelectionChange();
}