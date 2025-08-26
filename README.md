# CSS color-contrast() Figma Plugin

> Explore the future of accessible design with the experimental CSS `color-contrast()` function

## Overview

This educational Figma plugin emulates the behavior of the experimental CSS `color-contrast()` function, helping designers understand how automatic color contrast selection will work in future browsers. The plugin demonstrates how this CSS feature can simplify accessible design decisions by automatically choosing between black or white text based on background colors.

### What is `color-contrast()`?

The `color-contrast()` function is an experimental CSS feature that will automatically select the most readable text color (black or white) based on a background color, using WCAG contrast algorithms:

```css
/* Automatically returns black or white */
color: color-contrast(#903030);

/* Works with CSS-based design tokens */
color: color-contrast(var(--background-color));
```

## Features

- 🎓 **Tutorial** - 4-step introduction to the `color-contrast()` concept
- ⚡ **Live Emulation** - See how the function would behave in your designs today
- 🎯 **WCAG Algorithms** - Uses the same contrast calculations the CSS function will use
- 📦 **Batch Processing** - Apply to multiple text layers or entire frames at once
- 🔍 **Smart Selection** - Works with text nodes and container frames

## Installation

### From Figma Community

1. Visit the plugin page (coming soon) in Figma Community
2. Click "Try it out" to install
3. Access via Plugins menu in any Figma file

### Development Setup

```bash
# Install dependencies
npm install

# Development mode with hot reload
npm run dev

# Build for production
npm run build
```

## Usage

### Basic Workflow

1. **Select a text layer** 
2. **Apply color-contrast()** to automatically set text to black or white
3. **Add annotations in DevMode**
4. **Disable if needed**

### Supported Node Types

- **Text Nodes** - Must be inside a valid container (frame, component, instance, group, or section)

## How It Works

The plugin emulates upcoming browser support for color-contrast() by using the WCAG 2.x luminance formula to calculate contrast ratios:

1. Extracts the background color from the parent container
2. Calculates contrast ratios for both black and white
3. Selects the color with the higher contrast ratio
4. Applies the optimal color to text nodes

### Example Calculation

For a background color of `#903030`:
- White text: 7.92:1 contrast ratio ✅
- Black text: 2.65:1 contrast ratio

Result: White text is applied

## Development

### Project Structure

```
color-contrast/
├── src/
│   ├── code.ts              # Plugin main entry point
│   ├── state/               # State management
│   ├── events/              # Event handlers
│   ├── messaging/           # Plugin-UI communication
│   └── utils/               # Color calculations
├── ui/                      # HTML interface files
├── dist/                    # Build output
└── webpack.config.js        # Build configuration
```

### Architecture

- **Singleton Pattern** for state management (`NodeStateManager`)
- **Event-driven** message passing between plugin and UI
- **Type-safe** messaging with TypeScript interfaces
- **Hot-reload** support for UI development

### Commands

```bash
# Lint TypeScript files
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Watch mode for development
npm run dev

# Production build
npm run build
```

## Learn More

- [CSS color-contrast() Specification](https://www.w3.org/TR/css-color-5/#colorcontrast)
- [MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-contrast)
- [WCAG Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [Can I Use: color-contrast()](https://caniuse.com/css-color-contrast)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

- 🐛 [Report bugs](https://github.com/danhendersonede/color-contrast/issues)
- 💡 [Request features](https://github.com/danhendersonede/color-contrast/issues)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Disclaimer:** This plugin is for educational purposes to explore an experimental CSS feature. The `color-contrast()` function is not yet suitable for production use in web development.