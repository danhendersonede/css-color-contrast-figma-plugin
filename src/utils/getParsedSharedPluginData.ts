export function getParsedSharedPluginData(node: BaseNode, key: string) {
  const data = node.getSharedPluginData("color_contrast", key);
  return data !== '' ? JSON.parse(data) : null;
}