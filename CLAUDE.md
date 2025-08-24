# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Build and Development:**
- `npm run build` - Build the plugin for production using Webpack
- `npm run dev` - Watch mode development build with source maps
- `npm run lint` - Run ESLint on TypeScript files 
- `npm run lint:fix` - Run ESLint with automatic fixes

**Project Setup:**
- `npm install` - Install dependencies
- The plugin uses Webpack with custom HTML processing that inlines CSS into HTML files

## Architecture Overview

This is a Figma plugin for automated color contrast adjustment, built with TypeScript and using a singleton-based architecture for state management.

### Core Architecture Patterns

**Singleton Pattern:** The application uses singletons for centralized management:
- `NodeStateManager` - Manages selection state and node type classification
- `MessageHandler` - Handles all plugin-to-UI communication

**Event-Driven Architecture:** The plugin operates through event handlers:
- Selection changes trigger state updates via `NodeStateManager.handleSelectionChange()`
- UI actions are processed through message handlers in `code.ts`
- State changes are communicated to UI via `MessageHandler.handleStateChange()`

**Type-Safe Messaging:** Strict TypeScript interfaces for plugin ↔ UI communication:
- `UIToPluginMessage` - Messages from UI to plugin
- `PluginToUIMessage` - Messages from plugin to UI

### Key Components Structure

**Entry Point (`src/code.ts`):**
- Initializes singletons and sets up message handlers
- Handles `figma.ui.onmessage` for UI interactions
- Manages selection change events with state updates

**State Management (`src/state/nodeStateManager.ts`):**
- Classifies selected nodes (text, container, unsupported)
- Determines valid parent-child relationships for text nodes
- Returns typed state change events for UI updates

**Message Layer (`src/messaging/messageHandler.ts`):**
- Centralizes all plugin-to-UI communication
- Maps state change events to appropriate UI messages
- Ensures consistent message formatting

**Event Handlers (`src/events/`):**
- `onPluginStart.ts` - Determines initial UI to show
- `onApplyColorContrast.ts` - Applies contrast adjustments
- `onDisableColorContrast.ts` - Removes contrast adjustments
- `onNavigate.ts` - Handles UI navigation

### Node Type System

The plugin works with a specific node hierarchy:
- **Text Nodes**: Must have a valid container parent (frame, component, instance, group, section)
- **Container Nodes**: Can contain multiple text nodes for batch processing
- **Unsupported Nodes**: All other Figma node types

### Color Contrast Logic

**Core Algorithm (`src/utils/color.ts`):**
- Uses WCAG luminance calculation for contrast ratios
- Compares against both black and white to find best contrast
- Handles both 0-1 and 0-255 RGB value ranges

**Data Flow:**
1. User selects node(s) → State change event
2. State manager classifies node type → UI update message
3. User triggers contrast action → Apply/disable color contrast
4. Color calculations determine optimal text color → Visual update

### UI System

**Multi-Screen Interface:**
- Welcome, intro sequence, editor, and help screens
- HTML files in `/ui/` are processed by Webpack to inline CSS
- Uses custom `UIWatcherPlugin` for hot reloading during development

**Build Process:**
- Webpack automatically inlines `styles.css` into all HTML files
- TypeScript compiled to `/dist/code.js`
- HTML files copied to `/dist/ui/` with CSS inlined

## Development Notes

**Node Selection Logic:**
- Text nodes must be inside valid containers (frame, component, instance, group, section)
- Selection of container nodes enables batch processing of child text nodes
- Invalid selections trigger appropriate user feedback messages

**State Synchronization:**
- After applying/disabling color contrast, state is immediately refreshed
- UI receives updated state to reflect current node status
- Message handler ensures consistent state communication

**Plugin Data Storage:**
- Uses Figma's shared plugin data for persistence
- Stores color contrast state on nodes for later retrieval
- Data structure defined in `src/types/nodes.ts`