export type BaseNodeData = {
  id: string;
  type: string;
}

export type TextNodeData = {
  id: string;
  type: string;
  fillColor: FillColorData;
  pluginData: PluginData;
}

export type ContainerNodeData = {
  id: string;
  type: string;
  fillColor: FillColorData;
  colorContrast: ColorContrastData;
}

export type FillColorData = {
  hex: string | null;
  rgb: RGB | null;
  variableName: string | null;
}

export type ColorContrastData = {
  white: number | null;
  black: number | null;
}

export type PluginData = {
  enabled: boolean;
  containerNodeData: ContainerNodeData | null;
}

export type ContainerNode = (FrameNode | ComponentNode | InstanceNode)

export function isContainerNode(node: BaseNode | null): node is ContainerNode {
  return node !== null && ['FRAME', 'COMPONENT', 'INSTANCE'].includes(node.type);
}

export function isTextNode(node: BaseNode | null): node is TextNode {
  return node !== null && node.type === 'TEXT';
}