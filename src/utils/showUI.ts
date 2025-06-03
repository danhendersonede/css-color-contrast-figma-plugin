// Show the UI in a standard way
export function showUI(ui: string) {
    figma.showUI(ui, {
      width: 300,
      height: 600,
      themeColors: true,
    });
  }