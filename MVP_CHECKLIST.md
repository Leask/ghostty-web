# MVP Feature Checklist - Start Using in cmux

This is the **minimal** feature set needed to actually use this terminal in cmux for real development work.

## Goal
Run basic shell commands, navigate with vim/less, see colorized output (git diff, ls --color).

---

## Phase 1: Core Text & Colors (Week 1)

### 1. ANSI Color Support
**Why**: 90% of terminal output uses colors (git, ls, syntax highlighting)

- [ ] Parse SGR (Select Graphic Rendition) sequences `ESC [ ... m`
  - Implementation: State machine in TypeScript
  - Extract color codes from CSI parameters
  - Update current cell attributes
  
- [ ] Implement 16 ANSI colors (30-37, 90-97 for fg; 40-47, 100-107 for bg)
  - Store color palette in terminal instance
  - Map color codes to RGB values
  - Apply to cell.fg and cell.bg
  
- [ ] Implement bold, italic, underline attributes
  - Store as flags in cell
  - Actually render them in canvas
  
- [ ] Render colors on canvas
  - Currently using textContent (DOM)
  - Switch to canvas.fillText()
  - Use cell.fg/bg colors

**Test**: Run `ls --color=always` and see colored output

---

## Phase 2: Canvas Rendering (Week 1)

### 2. Replace DOM with Canvas
**Why**: DOM is slow for 80x24 cells, canvas is 10x faster

- [ ] Create canvas element
  - Replace current div with <canvas>
  - Calculate canvas size: cols * cellWidth, rows * cellHeight
  
- [ ] Measure font metrics
  - Use measureText() to get character width
  - Calculate line height from font size
  - Cache measurements
  
- [ ] Implement renderCell(x, y, cell)
  - Clear cell area
  - fillRect() for background
  - fillText() for character
  - Apply bold/italic font if needed
  
- [ ] Render cursor
  - Draw blinking block cursor
  - Use setInterval for blink (500ms)
  - Clear and redraw cursor area

**Test**: Terminal should look identical but render faster

---

## Phase 3: Cursor Movement (Week 2)

### 3. CSI Cursor Commands
**Why**: vim, less, and most TUIs need to move cursor

- [ ] Parse CSI sequences `ESC [ ... [A-Z]`
  - Extract numeric parameters
  - Identify final character
  - Route to handler
  
- [ ] Implement cursor movement:
  - `CUU` (ESC[nA) - Cursor up n lines
  - `CUD` (ESC[nB) - Cursor down n lines  
  - `CUF` (ESC[nC) - Cursor forward n columns
  - `CUB` (ESC[nD) - Cursor back n columns
  - `CUP` (ESC[n;mH) - Cursor position (row, col)
  
- [ ] Implement erase commands:
  - `ED` (ESC[nJ) - Erase display (0=cursor to end, 1=start to cursor, 2=entire screen)
  - `EL` (ESC[nK) - Erase line (0=cursor to end, 1=start to cursor, 2=entire line)

**Test**: Run `vim test.txt` - should see vim interface render correctly

---

## Phase 4: Alternate Screen Buffer (Week 2)

### 4. Alternate Screen for vim/less
**Why**: vim/less/tmux need alternate screen to not clobber shell output

- [ ] Create second buffer (same structure as primary)
  - Don't share references
  - No scrollback in alternate buffer
  
- [ ] Implement mode 1049 (ESC[?1049h / ESC[?1049l)
  - Save cursor position
  - Switch to alternate buffer
  - Clear alternate buffer
  - On exit: restore cursor, switch back
  
- [ ] Track which buffer is active
  - All write operations go to active buffer
  - Rendering uses active buffer

**Test**: Run `vim test.txt`, edit file, `:q` - shell prompt should still be visible

---

## Phase 5: Basic Selection & Copy (Week 3)

### 5. Mouse Selection
**Why**: Need to copy error messages, command output

- [ ] Click and drag to select text
  - MouseDown: start selection
  - MouseMove: extend selection
  - MouseUp: end selection
  
- [ ] Render selection highlight
  - Draw blue background on selected cells
  - Before drawing text
  
- [ ] Extract selected text
  - Loop through selected cells
  - Build string with newlines
  - Handle wrapped lines (remove soft breaks)
  
- [ ] Copy to clipboard on Cmd/Ctrl+C
  - Only if selection exists
  - Use navigator.clipboard.writeText()
  - Clear selection after copy (optional)

**Test**: Select text with mouse, Cmd+C, paste in another app

---

## Phase 6: Keyboard Input (Week 3)

### 6. Send Keyboard to PTY
**Why**: Need to actually type commands

- [ ] Capture keyboard events
  - KeyDown listener
  - preventDefault on most keys
  - Allow Cmd+C, Cmd+V, Cmd+W
  
- [ ] Encode normal characters
  - A-Z, 0-9, symbols → send as UTF-8
  - Enter → send \r
  - Backspace → send \x7F (DEL) or \x08 (BS)
  
- [ ] Encode arrow keys
  - Normal mode: ESC[A, ESC[B, ESC[C, ESC[D
  - Will implement app mode later
  
- [ ] Encode Ctrl+letter
  - Ctrl+A → \x01
  - Ctrl+C → \x03
  - Ctrl+Z → \x1A
  - Map Ctrl+[A-Z] to 0x01-0x1A
  
- [ ] Connect to PTY via IPC
  - Send encoded input to backend
  - Backend writes to PTY

**Test**: Type `echo hello` in terminal, see output

---

## Phase 7: Scrollback (Week 4)

### 7. Scrollback Buffer
**Why**: Need to scroll up to see previous command output

- [ ] Implement scrollback buffer
  - Array of lines above visible screen
  - Max 1000 lines (configurable)
  - When scrolling, shift lines to scrollback
  
- [ ] Mouse wheel scrolling
  - Wheel up: scroll back in history
  - Wheel down: scroll forward
  - Auto-scroll to bottom on new output (if at bottom)
  - Stay scrolled back if user manually scrolled
  
- [ ] Render scrollback offset
  - viewportY = current scroll position
  - Render buffer[viewportY ... viewportY + rows]

**Test**: Run `cat /usr/share/dict/words`, scroll up to see beginning

---

## That's It for MVP!

With these 7 features, the terminal is **usable in cmux** for:
- Running shell commands
- Using vim/nano to edit files
- Viewing git diffs with colors
- Reading less/man pages
- Scrolling back through output
- Copying error messages

**Lines of Code Estimate**: ~2,500-3,500 (from current 680)
**Time Estimate**: 3-4 weeks
**What's Missing**: Mouse reporting, 256 colors, true color, lots of edge cases

---

## Post-MVP: Production Hardening (Weeks 5-8)

### 8. 256 Color & True Color
- [ ] SGR 38;5;n (256 color fg)
- [ ] SGR 48;5;n (256 color bg)
- [ ] SGR 38;2;r;g;b (true color fg)
- [ ] SGR 48;2;r;g;b (true color bg)

**Test**: Run `msgcat --color=test` or color test script

### 9. Application Cursor Keys Mode
- [ ] Mode 1 (DECCKM)
- [ ] Arrow keys send ESC O A/B/C/D in app mode

**Test**: Arrow keys work in vim command mode

### 10. More CSI Commands
- [ ] Insert/delete lines (IL, DL)
- [ ] Insert/delete chars (ICH, DCH)
- [ ] Scroll regions (DECSTBM)
- [ ] Tab operations

**Test**: vim visual block mode, tmux splits

### 11. OSC Sequences
- [ ] OSC 0/1/2 - Set window title
- [ ] OSC 52 - Clipboard integration (copy from terminal)

**Test**: Terminal title updates, clipboard works from vim

### 12. Mouse Reporting
- [ ] Mode 1000 - VT200 mouse
- [ ] Mode 1002 - Button tracking
- [ ] Mode 1006 - SGR mouse (modern)

**Test**: tmux mouse mode, vim mouse clicks

### 13. Bracketed Paste Mode
- [ ] Mode 2004
- [ ] Wrap pasted text in ESC[200~ ... ESC[201~

**Test**: Paste multi-line code in vim, doesn't trigger weird indents

---

## Validation Checklist

Before declaring "MVP done":

- [ ] Can run `git diff` and see colored output
- [ ] Can open vim, edit file, save, quit
- [ ] Can run `less README.md` and navigate with arrows/page keys
- [ ] Can run `htop` and see it render (even if mouse doesn't work)
- [ ] Can scroll back through 100+ lines of output
- [ ] Can select text with mouse and copy to clipboard
- [ ] Can type commands and see them echo
- [ ] No visible flicker during rendering
- [ ] Renders at 60fps during rapid output
- [ ] Memory stays under 50MB with full scrollback

If all checked ✅ → **Ready to integrate into cmux**

---

## What We're Explicitly NOT Doing in MVP

- ❌ Sixel/images
- ❌ Ligatures
- ❌ WebGL renderer
- ❌ Search (Cmd+F)
- ❌ Themes UI
- ❌ Addons system
- ❌ Session recording
- ❌ Split panes
- ❌ Accessibility (screen readers)
- ❌ Touch support
- ❌ Right-to-left text
- ❌ Fancy underline styles (curly, dotted)
- ❌ Synchronized output mode
- ❌ VT52 mode
- ❌ Lots of obscure escape sequences

These can come later. MVP = **works for daily coding tasks**.
