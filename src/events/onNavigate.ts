import { showUI } from "../utils/showUI";

export function onNavigate(route: string, fromRoute?: string) {
    showUI(__uiFiles__[route]);

    if (route === 'editor' && fromRoute === 'intro4') {
        figma.root.setPluginData('color-contrast-introduction-complete', 'true');
    }
}