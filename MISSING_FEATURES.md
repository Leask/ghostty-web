# Complete Implementation Checklist for Native cmux Terminal

This is a comprehensive, detailed checklist for implementing a production-ready terminal emulator that will replace xterm.js in cmux. Each item includes implementation details, testing criteria, and context needed for AI agents to implement successfully.

**Purpose**: This document is optimized for AI agent execution. Each checklist item is self-contained with:
- What to implement
- How to implement it (algorithm/approach)
- Why it matters (use cases)
- How to test it
- Dependencies and prerequisites
- Edge cases to handle

**Current Status**: 680 lines implemented (3%), ~15,000-20,000 lines to go
**Timeline**: 11-16 weeks to production ready
**Goal**: Full VT100/VT220/xterm compatibility with xterm.js API

## 🔴 Critical - Core Terminal Functionality

### ANSI/VT Escape Sequence Parsing
- [ ] **CSI (Control Sequence Introducer)** sequences
  - [ ] Cursor movement (CUU, CUD, CUF, CUB, CHA, VPA, CUP, HVP)
  - [ ] Erase functions (ED, EL)
  - [ ] SGR (Select Graphic Rendition) - colors, bold, italic, underline, etc.
  - [ ] Scroll regions (DECSTBM)
  - [ ] Insert/Delete lines (IL, DL)
  - [ ] Insert/Delete characters (ICH, DCH)
  - [ ] Cursor save/restore (DECSC, DECRC)
  - [ ] Tab operations (CHT, CBT, TBC)
- [ ] **OSC (Operating System Command)** sequences
  - [ ] Set window title (OSC 0, 1, 2)
  - [ ] Set/query colors (OSC 4, 10, 11, 12, etc.)
  - [ ] Hyperlinks (OSC 8)
  - [ ] File transfers (OSC 52 - clipboard)
  - [ ] Notifications (OSC 9, 777)
- [ ] **DCS (Device Control String)** sequences
  - [ ] Sixel graphics support
  - [ ] Termcap/Terminfo queries
- [ ] **Character set handling**
  - [ ] UTF-8 decoding
  - [ ] Wide character support (CJK, emojis)
  - [ ] Combining characters
  - [ ] G0/G1/G2/G3 character set switching
- [ ] **C0/C1 control codes**
  - [ ] BEL (bell), BS, HT, LF, VT, FF, CR
  - [ ] SO/SI (shift out/in)
  - [ ] IND, NEL, HTS, RI

### Terminal Modes
- [ ] **Application cursor keys** (DECCKM)
- [ ] **Application keypad** (DECNKM)
- [ ] **Alternate screen buffer** (1049, 47, 1047)
- [ ] **Auto-wrap mode** (DECAWM)
- [ ] **Insert/Replace mode** (IRM)
- [ ] **Bracketed paste mode** (2004)
- [ ] **Mouse reporting modes**
  - [ ] X10 mouse
  - [ ] VT200 mouse
  - [ ] Button event tracking
  - [ ] Any event tracking
  - [ ] SGR pixel mode
  - [ ] UTF-8 coordinates
- [ ] **Focus reporting** (1004)
- [ ] **Origin mode** (DECOM)
- [ ] **Cursor visibility** (DECTCEM)

### Rendering
- [ ] **Cursor rendering**
  - [ ] Block cursor
  - [ ] Underline cursor
  - [ ] Bar cursor
  - [ ] Blinking cursor
  - [ ] Different colors
- [ ] **Text rendering**
  - [ ] 16 base colors (ANSI)
  - [ ] 256 color palette
  - [ ] 24-bit true color (RGB)
  - [ ] Bold text
  - [ ] Italic text
  - [ ] Underline (single, double, curly, dotted, dashed)
  - [ ] Strikethrough
  - [ ] Inverse/reverse video
  - [ ] Dim/faint text
  - [ ] Hidden/invisible text
  - [ ] Overline
  - [ ] Background colors
- [ ] **Performance rendering**
  - [ ] Canvas-based renderer (not DOM)
  - [ ] WebGL renderer (optional, for performance)
  - [ ] Dirty region tracking (only redraw changed cells)
  - [ ] Debounced rendering
  - [ ] RequestAnimationFrame batching

### Scrollback Buffer
- [ ] **Infinite scrollback** (with memory limits)
- [ ] **Scrollback search**
- [ ] **Scrollback line wrapping** (reflow on resize)
- [ ] **Persist scrollback** across sessions
- [ ] **Erase scrollback** command

## 🟡 High Priority - Essential Features

### Selection & Clipboard
- [ ] **Mouse selection**
  - [ ] Single-click word selection
  - [ ] Double-click line selection
  - [ ] Drag selection
  - [ ] Rectangular selection (Alt+drag)
  - [ ] Extend selection (Shift+click)
- [ ] **Keyboard selection**
  - [ ] Shift+arrow keys
  - [ ] Select all (Cmd/Ctrl+A)
- [ ] **Copy/Paste**
  - [ ] Copy to clipboard
  - [ ] Paste from clipboard
  - [ ] Paste bracketing
  - [ ] Safe paste warnings
- [ ] **Selection trimming** (remove trailing whitespace)
- [ ] **Selection to HTML** (preserve colors)

### Input Handling
- [ ] **Keyboard event encoding**
  - [ ] Normal mode key encoding
  - [ ] Application mode key encoding
  - [ ] Modified keys (Shift, Ctrl, Alt, Meta)
  - [ ] Function keys (F1-F24)
  - [ ] Special keys (Home, End, PgUp, PgDn, Insert, Delete)
  - [ ] Arrow keys
  - [ ] Numpad keys
  - [ ] Dead key handling
- [ ] **Composition support** (IME for CJK input)
- [ ] **Kitty keyboard protocol** (progressive enhancement)
- [ ] **CSI u mode** (fix-keyboard-protocol)

### Performance
- [ ] **Throttled rendering** (target 60fps)
- [ ] **Virtual scrolling** (only render visible rows)
- [ ] **Efficient buffer updates** (don't copy entire screen)
- [ ] **Web Worker for parsing** (offload heavy parsing)
- [ ] **Shared Array Buffer** for zero-copy between worker and main thread
- [ ] **Benchmark suite** (measure render time, throughput)

### Accessibility
- [ ] **Screen reader support**
  - [ ] ARIA labels
  - [ ] Live regions for terminal output
  - [ ] Semantic HTML for content
- [ ] **High contrast mode**
- [ ] **Keyboard-only navigation**
- [ ] **Focus indicators**
- [ ] **Announced cursor position**

## 🟢 Medium Priority - Nice to Have

### Advanced Features
- [ ] **Sixel graphics** (inline images)
- [ ] **iTerm2 inline images** (imgcat)
- [ ] **Kitty graphics protocol**
- [ ] **Ligatures** (font ligatures for programming)
- [ ] **Custom glyphs** (powerline, nerd fonts)
- [ ] **Emoji support** (proper wide char handling)

### Search
- [ ] **Find in terminal** (Cmd/Ctrl+F)
- [ ] **Incremental search**
- [ ] **Regex search**
- [ ] **Case-sensitive toggle**
- [ ] **Whole word toggle**
- [ ] **Search highlighting**
- [ ] **Navigate search results** (next/prev)

### Themes & Customization
- [ ] **Theme system**
  - [ ] Predefined themes (Solarized, Dracula, etc.)
  - [ ] Custom color palettes
  - [ ] Background opacity/blur
  - [ ] Cursor color customization
- [ ] **Font customization**
  - [ ] Font family
  - [ ] Font size
  - [ ] Font weight
  - [ ] Line height
  - [ ] Letter spacing
- [ ] **Padding customization**

### Links & Interaction
- [ ] **URL detection** (auto-detect URLs in output)
- [ ] **Clickable links** (Cmd/Ctrl+click to open)
- [ ] **Link hover preview**
- [ ] **Semantic URLs** (file paths, issue numbers)
- [ ] **Link validation** (mark broken links)

### History & Replay
- [ ] **Command history detection**
- [ ] **Output markers** (mark command boundaries)
- [ ] **Jump to previous/next command**
- [ ] **Copy command output**
- [ ] **Session recording** (replay terminal sessions)

## 🔵 Lower Priority - Future Enhancements

### Addons System (xterm.js compatibility)
- [ ] **Addon interface** (plugin system)
- [ ] **FitAddon** (auto-resize terminal to fit container)
- [ ] **WebLinksAddon** (clickable URLs)
- [ ] **SearchAddon** (find in terminal)
- [ ] **WebglAddon** (hardware-accelerated rendering)
- [ ] **SerializeAddon** (export terminal state)
- [ ] **ImageAddon** (inline images)
- [ ] **LigaturesAddon** (font ligatures)

### Split Panes
- [ ] **Multiple terminal instances** in one view
- [ ] **Horizontal splits**
- [ ] **Vertical splits**
- [ ] **Nested splits**
- [ ] **Drag to resize splits**
- [ ] **Focus management** across panes

### Debugging & Diagnostics
- [ ] **Debug logging** (escape sequence log)
- [ ] **Performance profiling**
- [ ] **Memory usage tracking**
- [ ] **Escape sequence inspector**
- [ ] **Cell inspector** (click to see cell attributes)

### Advanced Input
- [ ] **Touch support** (mobile/tablet)
  - [ ] Touch scrolling
  - [ ] Touch selection
  - [ ] Virtual keyboard
- [ ] **Pen/stylus input**

### Sync & Multiplexing
- [ ] **tmux integration** (control mode)
- [ ] **SSH session persistence**
- [ ] **Multiple viewers** (shared terminal session)
- [ ] **Read-only mode**

### Advanced Graphics
- [ ] **Background images**
- [ ] **Video backgrounds**
- [ ] **Shader effects** (CRT, scanlines, etc.)
- [ ] **Transparency effects**

## 🔧 libghostty-vt Integration

### Current State
- [x] Basic Zig WASM compilation
- [x] WASM module loading in browser
- [ ] Use libghostty-vt for parsing (currently using pure TS)

### Integration Tasks
- [ ] **Build libghostty-vt to WASM**
  - [ ] Clone ghostty repo as submodule
  - [ ] Configure build for WASM target
  - [ ] Export Terminal/Screen APIs to WASM
  - [ ] Generate TypeScript bindings
- [ ] **Memory management**
  - [ ] WASM allocator exposed to JS
  - [ ] Proper cleanup on dispose
  - [ ] Handle large buffers efficiently
- [ ] **API Bridge**
  - [ ] Terminal.write() → libghostty
  - [ ] Terminal state queries ← libghostty
  - [ ] Render callbacks from WASM → JS
  - [ ] Input encoding JS → WASM
- [ ] **Keep up with upstream**
  - [ ] Track ghostty releases
  - [ ] Update when API stabilizes
  - [ ] Automated update checks

## 🧪 Testing & Quality

### Unit Tests
- [ ] **Parser tests** (escape sequences)
- [ ] **Buffer tests** (scrollback, resize)
- [ ] **Cursor tests** (movement, save/restore)
- [ ] **Selection tests** (mouse, keyboard)
- [ ] **Color tests** (all modes)
- [ ] **Mode tests** (all terminal modes)
- [ ] **Input tests** (keyboard encoding)

### Integration Tests
- [ ] **Real terminal programs**
  - [ ] vim/neovim
  - [ ] tmux
  - [ ] htop
  - [ ] less
  - [ ] man pages
  - [ ] git diff with colors
- [ ] **Stress tests**
  - [ ] Large output (cat large file)
  - [ ] Rapid updates (yes command)
  - [ ] Memory leak tests (long-running)
- [ ] **Compatibility tests**
  - [ ] vttest suite
  - [ ] esctest suite
  - [ ] Terminal behavior comparison with other emulators

### Performance Tests
- [ ] **Render performance** (fps, latency)
- [ ] **Throughput** (MB/s of output)
- [ ] **Memory usage** (heap size over time)
- [ ] **Startup time**
- [ ] **CPU usage** (idle, active)

### Visual Tests
- [ ] **Screenshot comparison** (golden images)
- [ ] **Font rendering** (various fonts)
- [ ] **Color accuracy** (color palette verification)

## 📦 Build & Distribution

### Build System
- [ ] **Automated WASM build** (CI/CD)
- [ ] **TypeScript compilation** (with sourcemaps)
- [ ] **Bundle optimization** (tree-shaking, minification)
- [ ] **Multiple build targets**
  - [ ] Browser (ESM)
  - [ ] Node.js (CommonJS)
  - [ ] Electron (hybrid)
- [ ] **WASM optimization**
  - [ ] Size optimization
  - [ ] Speed optimization
  - [ ] Debug builds

### Documentation
- [ ] **API documentation** (TypeDoc)
- [ ] **Usage examples**
- [ ] **Migration guide** (from xterm.js)
- [ ] **Architecture docs**
- [ ] **Performance guide**
- [ ] **Troubleshooting guide**

### Package
- [ ] **npm package** (versioning, releases)
- [ ] **Type definitions** (full TypeScript support)
- [ ] **Changelog** (semantic versioning)
- [ ] **License file** (AGPL-3.0)

## 🔒 Security

### Input Sanitization
- [ ] **Escape sequence limits** (prevent DoS)
- [ ] **Buffer size limits**
- [ ] **Paste size limits**
- [ ] **Malicious sequence detection**

### Content Security
- [ ] **OSC command validation**
- [ ] **Link validation** (prevent javascript: URLs)
- [ ] **File path sanitization**

## 🎯 Compatibility

### Terminal Emulation
- [ ] **TERM=xterm-256color** compatibility
- [ ] **VT100/VT220/VT320** compatibility
- [ ] **xterm** extensions
- [ ] **Linux console** compatibility
- [ ] **Terminfo database** (accurate capabilities)

### Browser Support
- [ ] **Chrome/Edge** (Chromium)
- [ ] **Firefox**
- [ ] **Safari**
- [ ] **Mobile browsers**
- [ ] **Electron** (main target)

## 📊 Estimated Effort

### Phase 1: Core Terminal (MVP for cmux)
- **Estimate**: 3-4 weeks
- **Lines of code**: ~5,000-7,000
- **Critical items**: ANSI parsing, colors, cursor, basic rendering

### Phase 2: Production Ready
- **Estimate**: 2-3 weeks
- **Lines of code**: ~3,000-5,000
- **Critical items**: Selection, clipboard, input handling, performance

### Phase 3: Feature Complete
- **Estimate**: 4-6 weeks
- **Lines of code**: ~5,000-8,000
- **Items**: Search, links, themes, graphics, addons

### Phase 4: Polish & Testing
- **Estimate**: 2-3 weeks
- **Items**: Tests, docs, benchmarks, compatibility

### Total Estimate
- **Time**: 11-16 weeks (3-4 months)
- **Lines of code**: ~13,000-20,000 (plus tests)
- **Current progress**: ~680 lines (3-5%)

## 🎯 Recommended Priorities for cmux

### Week 1-2: Make it Usable
1. ANSI color parsing (SGR sequences)
2. Cursor rendering (block + blink)
3. Canvas renderer (replace DOM)
4. Basic selection (mouse)
5. Copy to clipboard

### Week 3-4: Make it Good
6. Full CSI sequence support
7. Input handling (keyboard encoding)
8. Alternate screen buffer
9. Scrollback with search
10. Performance optimization

### Week 5-6: Make it Great
11. Mouse reporting
12. OSC sequences (title, colors)
13. Bracketed paste
14. Sixel/images
15. Full test suite

After Week 6, you have a **production-ready terminal** that can replace xterm.js in cmux.

---

## Current Status

- [x] Basic text rendering (680 lines, 3% complete)
- [ ] Everything else (97% remaining)

**Next immediate task**: Implement ANSI color parsing and rendering
