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
  
  if (!containerNodeData.fillColor || (!containerNodeData.fillColor.variableName && !containerNodeData.fillColor.hex)) {
    console.error('Container node data missing fill color information');
    return;
  }

  const annotationMarkdown = `# The text color is controlled by color-contrast()
    Use the following CSS property to automatically determine the text color based on the background color:
    
\`\`\`css
color: color-contrast(
    ${containerNodeData.fillColor.variableName ? containerNodeData.fillColor.variableName : containerNodeData.fillColor.hex}
)
\`\`\`
  `;

  node.annotations = [{
    labelMarkdown: annotationMarkdown,
  }];

  figma.ui.postMessage({ 
    type: 'ANNOTATION_ADDED',
    nodeId: node.id,
    message: 'Developer annotation added for color-contrast usage'
  });
}
