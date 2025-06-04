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

export type ContainerNode = 
  | FrameNode 
  | ComponentNode 
  | InstanceNode 
  | GroupNode 
  | SectionNode;

export function isContainerNode(node: BaseNode | null): node is ContainerNode {
  if (!node) return false;
  return (
    node.type === 'FRAME' ||
    node.type === 'COMPONENT' ||
    node.type === 'INSTANCE' ||
    node.type === 'GROUP' ||
    node.type === 'SECTION'
  );
}

export type NodeState = {
  type: 'NO_SELECTION' | 'TEXT_NODE' | 'CONTAINER_NODE' | 'UNSUPPORTED_NODE' | 'TEXT_NODE_NO_CONTAINER';
  textNodeData: TextNodeData | null;
  containerNodeData: ContainerNodeData | null;
};

export type NodeStateChangeEvent = {
  type: NodeState['type'];
  data: NodeState;
};

export function isTextNode(node: BaseNode | null): node is TextNode {
  if (!node) return false;
  return node.type === 'TEXT';
}