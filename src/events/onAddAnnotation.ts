import { ContainerNodeData, TextNodeData } from "../types/nodes";

/**
 * Adds a developer annotation to a text node indicating it uses color-contrast()
 * This helps developers understand that the text color is dynamically determined
 * rather than being a static color or token.
 */
export async function onAddAnnotation(textNodeData: TextNodeData, containerNodeData: ContainerNodeData) {
  const node = await figma.getNodeByIdAsync(textNodeData.id);
  
  if (!node || node.type !== 'TEXT') {
    console.error('Node not found or not a text node:', textNodeData.id);
    return;
  }

  // Create a markdown annotation with detailed information
  const annotationMarkdown = `# The text color is controlled by color-contrast()
    Use the following CSS function to automatically determine the text color based on the background color:
    
    \`color: color-contrast(${containerNodeData.fillColor.variableName ? containerNodeData.fillColor.variableName : containerNodeData.fillColor.hex})\`
  `;

  // Add the annotation to the node
  node.annotations = [{
    labelMarkdown: annotationMarkdown,
  }];

  // Notify the UI that an annotation was added
  figma.ui.postMessage({ 
    type: 'ANNOTATION_ADDED',
    nodeId: node.id,
    message: 'Developer annotation added for color-contrast usage'
  });
}
