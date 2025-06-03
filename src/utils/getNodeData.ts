import { ColorContrastData, ContainerNode, ContainerNodeData, FillColorData, TextNodeData } from "../types/nodes";
import { getNodeFillColor } from "./paint";
import { getColorContrastData } from "./color";
import { getParsedSharedPluginData } from "./getParsedSharedPluginData";

export async function getContainerNodeData(node: ContainerNode): Promise<ContainerNodeData> {
    let fillColor: FillColorData = {
        hex: null,
        rgb: null,
        variableName: null
    };
    let colorContrastData: ColorContrastData = {
        white: null,
        black: null
    };

    fillColor = await getNodeFillColor(node);
    if (fillColor.rgb) {
    colorContrastData = getColorContrastData(fillColor.rgb);
    }

    return {
        id: node.id,
        type: node.type,
        fillColor: fillColor,
        colorContrast: colorContrastData
    };
}

export async function getTextNodeData(node: TextNode): Promise<TextNodeData> {
    let fillColor: FillColorData = {
        hex: null,
        rgb: null,
        variableName: null
    };

    fillColor = await getNodeFillColor(node);

    return {
        id: node.id,
        type: node.type,
        fillColor: fillColor,
        pluginData: {
            enabled: getParsedSharedPluginData(node, 'enabled'),
            containerNodeData: getParsedSharedPluginData(node, 'containerNodeData')
        }
    };
}