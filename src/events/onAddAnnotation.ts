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
  const annotationMarkdown = `# Color Contrast Enabled
This text uses \`color-contrast()\` to automatically choose between black and white based on the background color.

## Details
- **Background Color**: \`${JSON.stringify(containerNodeData.fillColor) || 'unknown'}\`
- **Added**: ${new Date().toLocaleString()}
- **Status**: Active

## How it works
The text color will automatically switch between black (#000000) and white (#FFFFFF) to maintain optimal contrast with the background color.`;

  // Add the annotation to the node
  node.annotations = [{
    labelMarkdown: annotationMarkdown,
    properties: [
      { type: 'fills' } // Pin the fill property since it's dynamically determined
    ]
  }];

  // Notify the UI that an annotation was added
  figma.ui.postMessage({ 
    type: 'ANNOTATION_ADDED',
    nodeId: node.id,
    message: 'Developer annotation added for color-contrast usage'
  });
}
