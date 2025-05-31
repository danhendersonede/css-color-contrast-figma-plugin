import { RGBToHex } from "./utils";

showUI(__uiFiles__.welcome);

// Handle messages from the UI
figma.ui.onmessage = (msg: { type: string; count: number }) => {
  if (msg.type === 'start') {
    showUI(__uiFiles__.selectNode);
    handleSelectionChange();
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

// Convert hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

// Calculate relative luminance
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function calculateContrastRatio(color: string, backgroundColor: string): number {
  const colorRgb = hexToRgb(color);
  const bgRgb = hexToRgb(backgroundColor);
  
  const colorLuminance = getLuminance(colorRgb.r, colorRgb.g, colorRgb.b);
  const bgLuminance = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
  
  const lighter = Math.max(colorLuminance, bgLuminance);
  const darker = Math.min(colorLuminance, bgLuminance);
  
  return (lighter + 0.05) / (darker + 0.05);
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
      parentNodeColorContrast.white = calculateContrastRatio(parentNodeFillColor, '#FFFFFF');
      parentNodeColorContrast.black = calculateContrastRatio(parentNodeFillColor, '#000000');
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