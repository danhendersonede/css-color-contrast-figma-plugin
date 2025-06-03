import { ColorContrastData, ContainerNode, ContainerNodeData, FillColorData } from "../types/nodes";
import { getContainerNodeFillColor } from "./paint";
import { getColorContrastData } from "./color";

export function getContainerNodeData(node: ContainerNode): ContainerNodeData {
    let fillColor: FillColorData = {
        hex: null,
        rgb: null
    };
    let colorContrastData: ColorContrastData = {
        white: null,
        black: null
    };

    fillColor = getContainerNodeFillColor(node);
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