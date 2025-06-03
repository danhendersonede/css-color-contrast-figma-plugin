// Show the UI in a standard way
export function showUI(ui: string) {
    figma.showUI(ui, {
      width: 330,
      height: 450,
      themeColors: true,
    });
  }