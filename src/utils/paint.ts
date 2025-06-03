import { FillColorData } from "../types/nodes";
import { RGBToHex } from "./color";

export function hasSolidFill(node: BaseNode): boolean {
    const fills = (node as { fills: readonly Paint[] }).fills;
    return fills.length > 0 && fills[0].type === 'SOLID';
}

export async function getNodeFillColor(node: BaseNode): Promise<FillColorData> {
    if (!hasSolidFill(node)) {
        return {
            hex: null,
            rgb: null,
            variableName: null
        };
    }

    const fill = (node as { fills: readonly Paint[] }).fills[0] as SolidPaint;

    let variableName = null;
    if (fill.boundVariables && fill.boundVariables.color && fill.boundVariables.color.id) {
        const variable = await figma.variables.getVariableByIdAsync(fill.boundVariables.color.id);
        if (variable) {
            variableName = variable.name;
        }
    }

    return {
        hex: RGBToHex(fill.color),
        rgb: fill.color,
        variableName: variableName
    };
}