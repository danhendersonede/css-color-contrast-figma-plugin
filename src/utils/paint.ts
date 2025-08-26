import { FillColorData, isContainerNode, ContainerNode } from "../types/nodes";
import { RGBToHex } from "./color";

export function hasSolidFill(node: BaseNode): boolean {
    const fills = (node as { fills?: readonly Paint[] }).fills;
    return !!(fills && fills.length > 0 && fills[0].type === 'SOLID');
}

/**
 * Recursively searches up the parent hierarchy to find the first container node with a solid fill
 * @param node - The starting node to search from
 * @returns The first parent container node with a solid fill, or null if none found
 */
export function findParentWithSolidFill(node: BaseNode): ContainerNode | null {
    let currentNode: BaseNode | null = node.parent;
    
    while (currentNode) {
        if (isContainerNode(currentNode) && hasSolidFill(currentNode)) {
            return currentNode;
        }
        currentNode = currentNode.parent;
    }
    
    return null;
}

export async function getNodeFillColor(node: BaseNode): Promise<FillColorData> {
    if (!hasSolidFill(node)) {
        return {
            hex: null,
            rgb: null,
            variableName: null
        };
    }

    const fill = (node as { fills?: readonly Paint[] }).fills![0] as SolidPaint;

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