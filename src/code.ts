import { calculateContrastRatio, clone, RGBToHex } from "./utils";

function hexToRGB(hex: string): RGB {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return { r, g, b };
}

showUI(__uiFiles__.welcome);

// Handle messages from the UI
figma.ui.onmessage = async (msg: { type: string; count: number, data: unknown }) => {
  if (msg.type === 'start') {
    showUI(__uiFiles__.selectNode);
    handleSelectionChange();
  }
  if (msg.type === 'APPLY_COLOR_CONTRAST') {
    const data = msg.data as {nodeId: string, nodeType: string, fillColor: string};
    const node = await figma.getNodeByIdAsync(data.nodeId);
    if (node && 'fills' in node) {
      const fills = clone(node.fills) as Array<SolidPaint & { color: RGB }>;
      if (fills.length > 0 && fills[0].type === 'SOLID') {
        fills[0].color = hexToRGB(data.fillColor);
        node.fills = fills;
      }
    }
  }

  if (msg.type === 'closePlugin') {
    figma.closePlugin();
  }
};

// Handle on changes
figma.on('selectionchange', () => {
  handleSelectionChange();
});

// Show the UI in a standard way
function showUI(ui: string) {
  figma.showUI(ui, {
    width: 300,
    height: 600,
    themeColors: true,
  });
}

function parentHasFills(node: BaseNode): node is (FrameNode | RectangleNode | ComponentNode) & { fills: readonly Paint[] } {
  return (node.type === 'FRAME' || node.type === 'RECTANGLE' || node.type === 'COMPONENT') && 
         'fills' in node && 
         Array.isArray((node as { fills: readonly Paint[] }).fills);
}

function handleSelectionChange(): SceneNode | null {
  const node = figma.currentPage.selection[0];

  const nodeId = node ? node.id : null;
  const nodeType = node ? node.type : null;

  const parentNode = node ? node.parent : null;
  const parentNodeId = parentNode ? parentNode.id : null;
  const parentNodeType = parentNode ? parentNode.type : null;

  let parentNodeFillColor = null;
  const parentNodeColorContrast: { white: number | null; black: number | null } = {
    white: null,
    black: null
  };
  if (parentNode && parentHasFills(parentNode)) {
    const fill = parentNode.fills[0];
    if (fill.type === 'SOLID') {
      parentNodeFillColor = RGBToHex(fill.color.r, fill.color.g, fill.color.b);
      parentNodeColorContrast.white = calculateContrastRatio({ r: fill.color.r, g: fill.color.g, b: fill.color.b }, { r: 1, g: 1, b: 1 });
      parentNodeColorContrast.black = calculateContrastRatio({ r: fill.color.r, g: fill.color.g, b: fill.color.b }, { r: 0, g: 0, b: 0 });
    }
  }

  figma.ui.postMessage({ type: 'SELECTION_CHANGE',
    selectedNode: {
      id: nodeId,
      type: nodeType
    },
    parentNode: {
      id: parentNodeId,
      type: parentNodeType,
      fillColor: parentNodeFillColor,
      colorContrast: parentNodeColorContrast
    }
  });
  
  return node;
}