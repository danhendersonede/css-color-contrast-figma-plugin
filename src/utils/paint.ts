import { ContainerNode, FillColorData } from "../types/nodes";
import { RGBToHex } from "./color";

export function parentHasFills(node: ContainerNode) {
    return 'fills' in node && Array.isArray((node as { fills: readonly Paint[] }).fills);
}

export function textNodeHasFill(node: TextNode) {
    return 'fills' in node && Array.isArray((node as { fills: readonly Paint[] }).fills);
}

export function hasSolidFill(node: ContainerNode): boolean {
    if (!parentHasFills(node)) return false;
    const fills = (node as { fills: readonly Paint[] }).fills;
    return fills.length > 0 && fills[0].type === 'SOLID';
}

export function getContainerNodeFillColor(node: ContainerNode): FillColorData {
    if (!hasSolidFill(node)) {
        return {
            hex: null,
            rgb: null
        };
    }

    const fill = (node as { fills: readonly Paint[] }).fills[0] as SolidPaint;
    return {
        hex: RGBToHex(fill.color),
        rgb: fill.color
    };
}