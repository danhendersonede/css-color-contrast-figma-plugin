import { TextNodeData, ContainerNodeData } from "../types/nodes";

export async function disableColorContrastOnSelectedNode(
  textNodeData: TextNodeData,
  containerNodeData: ContainerNodeData
) {
  const node = await figma.getNodeByIdAsync(textNodeData.id);
  if (!node || node.type !== 'TEXT') {
    console.error('Node not found or not a text node');
    return;
  }

  // Update the shared plugin data
  node.setSharedPluginData('color_contrast', 'enabled', 'false');
  node.setSharedPluginData('color_contrast', 'containerNodeData', '');

  const newAnnotation = node.annotations;

  const newAnnotations = newAnnotation.filter((annotation) => {
    if (!annotation.labelMarkdown) {
      return true;
    }
    return !annotation.labelMarkdown.includes('color-contrast()');
  });

  node.annotations = newAnnotations;

  // Create updated text node data
  const updatedTextNodeData: TextNodeData = {
    id: textNodeData.id,
    type: textNodeData.type,
    fillColor: textNodeData.fillColor,
    pluginData: {
      enabled: false,
      containerNodeData: null
    }
  };

  // Update the UI to reflect the changes
  figma.ui.postMessage({
    type: 'SELECTION_CHANGE_TEXT_NODE',
    textNodeData: updatedTextNodeData,
    containerNodeData
  });
} 