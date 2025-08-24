// Show the UI in a standard way
export function showUI(ui: string) {
  figma.showUI(ui, {
    width: 350,
    height: 500,
    themeColors: false,
  });
}