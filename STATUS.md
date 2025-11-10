# WASM Terminal - Handoff Status

## What Has Been Done

A **proof-of-concept terminal emulator** with xterm.js-compatible API. This is the foundation for replacing xterm.js as the native terminal in cmux.

### Current Implementation (680 lines, 3% complete)

#### 1. Zig WASM Module ✅
**Location**: `wasm-terminal/zig/`
- Compiled 7KB WASM binary using Zig 0.13.0
- Exports test functions (add, isEscape, isCSIByte, isCSIFinal)
- Build system configured (`build.zig`)
- Successfully compiles to wasm32-freestanding target

**Files**:
- `zig/build.zig` - Zig build configuration
- `zig/main.zig` - WASM exports (21 lines)
- `zig/zig-out/bin/ghostty-terminal.wasm` - Compiled binary

#### 2. TypeScript Terminal Implementation ✅
**Location**: `wasm-terminal/src/terminal.ts` (298 lines)

**Implemented**:
- Terminal class with xterm.js-compatible API
- Basic screen buffer (2D array of cells)
- Cell structure: `{ char, fg, bg, bold, italic, underline }`
- Cursor tracking (x, y position)
- Event emitters (onData, onResize)
- Basic control character handling (newline, carriage return, backspace)
- Terminal resize with buffer reallocation
- DOM-based rendering (textContent)

**API Methods Working**:
- ✅ `constructor(options)` - cols, rows, scrollback options
- ✅ `open(parent)` - Attach to DOM
- ✅ `write(data)` - Write text to terminal
- ✅ `resize(cols, rows)` - Resize buffer
- ✅ `clear()` - Clear screen
- ✅ `reset()` - Reset state
- ✅ `dispose()` - Cleanup
- ✅ `onData` - Event for user input
- ✅ `onResize` - Event for size changes
- ✅ `cols`, `rows` - Public properties

**Stub Methods** (exist but don't do anything):
- focus(), blur(), scroll methods, selection methods

#### 3. HTML Demo ✅
**Location**: `wasm-terminal/index.html` (361 lines)
- Interactive demo page
- Input box for testing
- Buttons (write, clear, resize, test colors)
- Status indicators
- WASM loading with graceful fallback
- Inline JS implementation for standalone demo

**To Test**:
```bash
cd wasm-terminal
./test-server.sh
# Visit http://localhost:8000
```

### Current Capabilities

**What Works**:
- ✅ Display plain text (80x24 default)
- ✅ Handle newlines and carriage returns
- ✅ Cursor tracking (not rendered, but tracked)
- ✅ Terminal resize
- ✅ Basic scrolling (shifts lines up)
- ✅ WASM module loads and calls work
- ✅ Event system functioning
- ✅ xterm.js API shape matches (method signatures)

**What Doesn't Work**:
- ❌ No ANSI color parsing
- ❌ No escape sequence parsing (CSI, OSC, DCS)
- ❌ No cursor rendering
- ❌ No selection
- ❌ No clipboard integration
- ❌ No keyboard input handling
- ❌ No PTY connection
- ❌ No canvas rendering (still using DOM)
- ❌ No scrollback buffer (only current screen)
- ❌ No alternate screen buffer

---

## Architecture Decisions Made

### 1. Why Not Using libghostty-vt Yet?
**Decision**: Use custom TypeScript implementation for now

**Reason**: libghostty-vt's WASM API is extremely minimal:
- Only exports: key encoding, OSC parsing, SGR parsing
- Does NOT export Terminal/Screen/Parser APIs
- API marked as "extremely unstable, will definitely change"

**Approach**: 
- Build terminal state machine in TypeScript
- Use Zig/WASM for performance-critical helpers later
- Integrate real libghostty-vt when API stabilizes

### 2. DOM vs Canvas Rendering
**Decision**: Started with DOM, will migrate to Canvas

**Reason**: DOM was faster to prototype, but too slow for production
- Current: using `textContent` to update entire screen
- Next: Canvas-based cell rendering
- Future: Optional WebGL renderer

### 3. xterm.js API Compatibility
**Decision**: Match xterm.js API exactly

**Reason**: Drop-in replacement for cmux
- Same method names, signatures
- Same event system
- Same buffer access API (to be implemented)
- Easier migration path

---

## File Structure

```
wasm-terminal/
├── README.md                    # Project overview, build instructions
├── MVP_CHECKLIST.md            # 7 features needed for MVP (3-4 weeks)
├── MISSING_FEATURES.md         # Complete feature list (416 items)
├── ROADMAP.md                  # 4-phase implementation plan
├── IMPLEMENTATION_SUMMARY.md   # Technical details
├── STATUS.md                   # This file
├── index.html                  # Demo page (361 lines)
├── test-server.sh             # HTTP server for testing
├── src/
│   └── terminal.ts            # Terminal implementation (298 lines)
└── zig/
    ├── build.zig              # Zig build config
    ├── main.zig               # WASM exports (21 lines)
    └── zig-out/bin/
        └── ghostty-terminal.wasm  # 7KB compiled binary
```

**Total Code**: 680 lines
**Total Documentation**: 672 lines
**Total**: 1,352 lines

---

## MVP Feature Checklist (What to Build Next)

The next agent should focus on these **7 features** to make the terminal usable in cmux:

### Week 1: Core Rendering
1. **ANSI Color Support**
   - Parse SGR sequences (`ESC [ ... m`)
   - 16 ANSI colors (30-37, 90-97 foreground; 40-47, 100-107 background)
   - Bold, italic, underline attributes
   - Apply colors to cells
   
2. **Canvas Rendering**
   - Replace DOM with `<canvas>`
   - Measure font metrics (character width/height)
   - Render cells with fillRect() + fillText()
   - Render blinking cursor

**Validation**: Run `ls --color=always` and see colored output

### Week 2: Cursor Control
3. **CSI Cursor Commands**
   - Parse `ESC [ ... [A-Z]` sequences
   - Implement: CUU, CUD, CUF, CUB, CUP (cursor movement)
   - Implement: ED, EL (erase display/line)
   
4. **Alternate Screen Buffer**
   - Create second buffer
   - Implement mode 1049 (`ESC[?1049h` / `ESC[?1049l`)
   - Save/restore cursor on switch
   - Clear alt screen on entry

**Validation**: Run `vim test.txt`, edit, quit - shell prompt still visible

### Week 3: Input & Selection
5. **Mouse Selection**
   - Click and drag to select
   - Render selection highlight
   - Extract selected text
   - Copy to clipboard (Cmd/Ctrl+C)
   
6. **Keyboard Input**
   - Capture keyboard events
   - Encode normal characters
   - Encode arrow keys (ESC[A/B/C/D)
   - Encode Ctrl+letter (0x01-0x1A)
   - Connect to PTY via IPC

**Validation**: Type `echo hello`, select output, copy it

### Week 4: Scrollback
7. **Scrollback Buffer**
   - Array of lines above screen (max 1000)
   - Mouse wheel scrolling
   - Auto-scroll to bottom on new output
   - Render viewport offset

**Validation**: Run `cat /usr/share/dict/words`, scroll up to beginning

---

## Technical Context for Next Agent

### Current Architecture

```
┌─────────────────────────────────────┐
│  Terminal (TypeScript)              │
│  - Screen buffer (Cell[][])         │
│  - Cursor state (x, y)              │
│  - Event emitters                   │
│  - write() → writeChar() loop       │
│  - DOM rendering (textContent)      │
└─────────────────────────────────────┘
         ↓ (optional)
┌─────────────────────────────────────┐
│  WASM Module (Zig)                  │
│  - Helper functions (minimal)       │
│  - 7KB binary                       │
└─────────────────────────────────────┘
```

### Data Structures

**Cell**:
```typescript
{
  char: string;      // Single character
  fg: number;        // Foreground color (0-15, will expand to 0-255 + RGB)
  bg: number;        // Background color
  bold: boolean;     // Attribute flags
  italic: boolean;
  underline: boolean;
}
```

**Buffer**: `Cell[][]` - 2D array, `buffer[row][col]`

**Cursor**: `{ x: number, y: number }` - 0-indexed

### Key Limitations to Fix

1. **No Parsing**: Currently only handles raw text + basic control chars (newline, CR, backspace)
   - Need CSI parser for `ESC [ ... X` sequences
   - Need OSC parser for `ESC ] ... BEL` sequences
   
2. **DOM Rendering**: Too slow
   - Currently: `element.textContent = stringifyBuffer()`
   - Need: Canvas rendering with dirty region tracking
   
3. **No Color**: Cell has fg/bg fields but they're not used
   - Need to parse SGR sequences
   - Need to actually render colors on canvas
   
4. **No Input**: No keyboard handling yet
   - Need KeyboardEvent listener
   - Need encoding logic (special keys → escape sequences)
   - Need IPC to send to backend PTY

### Code Hotspots

**To Modify**:
- `terminal.ts` - Add parser between write() and writeChar()
- `terminal.ts` - Replace render() with canvas implementation
- `terminal.ts` - Add keyboard event handler

**To Create**:
- `parser.ts` - ANSI escape sequence parser
- `renderer.ts` - Canvas rendering engine
- `input.ts` - Keyboard input encoder

### Dependencies

**Build Tools**:
- Zig 0.13.0 (for WASM compilation) - downloaded to `/tmp/zig-linux-x86_64-0.13.0/`
- TypeScript (already in cmux)
- Bun (already in cmux)

**Runtime**:
- Browser Canvas API
- Clipboard API (for copy)
- RequestAnimationFrame (for rendering)

**Not Needed Yet**:
- libghostty-vt (API too minimal)
- WebGL
- Web Workers

### Testing Strategy

**Manual Testing** (current):
```bash
cd wasm-terminal
./test-server.sh
# Open http://localhost:8000
# Type in input box, click buttons
```

**Validation Tests** (to add):
1. Color test: `printf '\e[31mRed\e[0m'` → see red text
2. Cursor test: `printf '\e[5;10H'` → cursor at (5,10)
3. Vim test: Open vim, see interface, quit, shell prompt intact
4. Selection test: Drag mouse, see highlight, Cmd+C works

---

## Known Issues / TODOs

### Bug Fixes Needed
- [ ] Fix duplicate `cols`, `rows` properties (defined twice in Terminal class)
- [ ] Cursor goes out of bounds on resize (need clamping)
- [ ] No error handling for invalid options

### Immediate Next Steps
1. **Implement CSI parser** (most critical)
   - Start with cursor movement (CUU, CUD, CUF, CUB, CUP)
   - Then erase commands (ED, EL)
   - Then SGR (colors)
   
2. **Canvas renderer**
   - Measure font metrics on open()
   - Replace render() to use canvas
   - Implement renderCell(x, y, cell)
   
3. **Test with real data**
   - Mock PTY output in demo
   - Send escape sequences to write()
   - Verify colors/cursor work

---

## Resources for Implementation

### References Created
- `MVP_CHECKLIST.md` - 7 features for MVP (most important!)
- `MISSING_FEATURES.md` - Complete feature list (416 line items)
- `ROADMAP.md` - Phased plan with estimates
- `IMPLEMENTATION_SUMMARY.md` - Technical deep dive
- `README.md` - User-facing docs

### External Resources
- xterm.js source: https://github.com/xtermjs/xterm.js
- xterm.js API docs: https://xtermjs.org/docs/api/terminal/classes/terminal/
- VT100 sequences: https://vt100.net/docs/vt100-ug/chapter3.html
- ANSI escape codes: https://en.wikipedia.org/wiki/ANSI_escape_code
- Ghostty repo (for libghostty-vt reference): `/tmp/ghostty/`

### Code Examples to Study
- `/tmp/ghostty/example/zig-vt/` - How to use libghostty-vt API
- `/tmp/ghostty/src/terminal/` - Full terminal implementation in Zig
- xterm.js renderer: https://github.com/xtermjs/xterm.js/tree/master/src/browser/renderer

---

## Build Commands

### Build WASM
```bash
cd wasm-terminal/zig
/tmp/zig-linux-x86_64-0.13.0/zig build
# Output: zig-out/bin/ghostty-terminal.wasm
```

### Test Demo
```bash
cd wasm-terminal
./test-server.sh
# Visit http://localhost:8000
```

### Future: Integrate into cmux
```bash
# Will add to cmux Makefile
make build-terminal  # Build WASM + compile TS
# Import in cmux: import { Terminal } from './wasm-terminal/src/terminal'
```

---

## Context for Next Work

### Immediate Priority: MVP (3-4 weeks)
Follow `MVP_CHECKLIST.md` - 7 features to make terminal usable:
1. ANSI colors
2. Canvas rendering
3. Cursor movement (CSI)
4. Alternate screen
5. Selection & copy
6. Keyboard input
7. Scrollback

After MVP: Terminal works for `git diff`, `vim`, `less`, basic shell usage

### Long-term Goal: Full xterm.js Replacement (3-4 months)
Follow `ROADMAP.md` for phased approach to production

### Key Decision: TypeScript-Heavy vs WASM-Heavy
**Current**: TypeScript-heavy (WASM is minimal helpers)
**Reason**: libghostty-vt WASM API doesn't export Terminal/Screen yet
**Future**: May integrate more libghostty-vt as their WASM API matures

---

## Git Branch

Working in: `wasm` branch (worktree at `/home/coder/cmux/cmux/wasm`)
Base: `main` branch
Changes: All in `wasm-terminal/` directory (not committed yet)

---

## Summary for Next Agent

**You have**:
- Working PoC (680 lines)
- xterm.js API skeleton
- WASM build system
- Comprehensive docs and checklists

**You need to build**:
- ANSI escape sequence parser
- Canvas renderer
- Keyboard input encoder
- Selection system
- Alternate screen buffer
- Scrollback buffer

**Start with**: `MVP_CHECKLIST.md` - Focus on 7 MVP features

**Goal**: Terminal that can run vim, git, less within 3-4 weeks

**Current status**: Foundation laid, ready for feature implementation ✅
