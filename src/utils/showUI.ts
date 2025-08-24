// Show the UI in a standard way
export function showUI(ui: string) {
  figma.showUI(ui, {
    width: 375,
    height: 525,
    themeColors: false,
  });
}