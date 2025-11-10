# Terminal Implementation Roadmap

## Quick Stats
- **Current**: 680 lines (3% complete)
- **Target**: 13,000-20,000 lines
- **Time**: 11-16 weeks (3-4 months)
- **Goal**: Replace xterm.js in cmux

## Phase 1: MVP (Weeks 1-2) - Make it Usable

**Goal**: Basic usable terminal with colors

### Must Have
1. **ANSI Color Parsing** (SGR sequences)
   - 16 base colors
   - 256 color palette
   - True color (24-bit RGB)
   - Bold, italic, underline, strikethrough

2. **Cursor Rendering**
   - Block cursor with blink
   - Proper positioning

3. **Canvas Renderer**
   - Replace DOM with canvas
   - Measure and cache font metrics
   - Render cells efficiently

4. **Basic Selection**
   - Mouse drag selection
   - Copy to clipboard

5. **CSI Cursor Movement**
   - CUU, CUD, CUF, CUB (arrow keys)
   - CUP, HVP (absolute positioning)
   - ED, EL (erase operations)

**Deliverable**: Can run `ls --color`, navigate with arrow keys, select/copy text

## Phase 2: Production Ready (Weeks 3-4) - Make it Good

**Goal**: Handles real terminal programs

### Must Have
6. **Full CSI Support**
   - Scroll regions
   - Insert/delete lines/chars
   - Tab operations
   - Cursor save/restore

7. **Keyboard Input**
   - Normal and application mode
   - Modified keys (Ctrl, Alt, Shift)
   - Function keys
   - Special keys

8. **Alternate Screen**
   - Switch between main/alt buffers
   - Needed for vim, less, etc.

9. **Scrollback**
   - Infinite scroll (memory limited)
   - Search in scrollback
   - Reflow on resize

10. **Performance**
    - Dirty region tracking
    - Throttled rendering (60fps)
    - <16ms per frame

**Deliverable**: Can run vim, tmux, htop, git diff

## Phase 3: Feature Complete (Weeks 5-8) - Make it Great

**Goal**: Full xterm.js feature parity

### Must Have
11. **Mouse Reporting**
    - X10, VT200, button/any event
    - Needed for tmux mouse mode

12. **OSC Sequences**
    - Window title
    - Color queries
    - Hyperlinks (OSC 8)
    - Clipboard (OSC 52)

13. **Bracketed Paste**
    - Secure paste mode
    - Large paste handling

14. **Graphics**
    - Sixel support (nice to have)
    - iTerm2 images (nice to have)

15. **Testing**
    - vttest compatibility
    - Real program tests
    - Performance benchmarks

**Deliverable**: Full-featured terminal, production ready

## Phase 4: Polish (Weeks 9-12) - Make it Excellent

**Goal**: Better than xterm.js

### Nice to Have
- Search (Cmd+F)
- Themes
- Link detection
- Font customization
- WebGL renderer
- Addons system
- Session recording

**Deliverable**: Superior alternative to xterm.js

## Critical Path

```
Week 1-2: ANSI Colors + Canvas Renderer
   ↓
Week 3-4: Full CSI + Input Handling + Alt Screen
   ↓
Week 5-6: Mouse + OSC + Performance
   ↓
Week 7-8: Testing + Bug Fixes
   ↓
Week 9-12: Polish + Advanced Features
```

## Risk Areas

1. **Performance**: Canvas rendering must be faster than DOM
2. **Compatibility**: Must pass vttest suite
3. **libghostty-vt**: API is unstable, may need to refactor
4. **Memory**: Large scrollback can leak, need careful management
5. **Input encoding**: Complex, easy to get wrong

## Success Criteria

### Minimum (MVP)
- ✅ Renders colors correctly
- ✅ Can run basic shell commands
- ✅ Selection and copy work
- ✅ 60fps rendering

### Target (Production)
- ✅ Runs vim/tmux without issues
- ✅ Passes vttest
- ✅ <100ms startup time
- ✅ <50MB memory for 10K scrollback
- ✅ All core xterm.js APIs work

### Stretch (Excellence)
- ✅ Faster than xterm.js
- ✅ Better rendering quality
- ✅ Smaller bundle size
- ✅ More features (Sixel, etc.)

## Dependencies

### External
- Zig 0.13.0+ (WASM compilation)
- Canvas API (rendering)
- Clipboard API (copy/paste)

### Internal (cmux)
- PTY spawning (already exists)
- IPC for terminal data
- UI integration

### Optional
- libghostty-vt (when API stabilizes)
- WebGL for hardware acceleration

## Next Immediate Steps

1. **Start Phase 1**: Implement ANSI color parsing
2. **Canvas renderer**: Measure fonts, draw cells
3. **SGR state machine**: Parse color escape codes
4. **Test harness**: Run colorized outputs

See `MISSING_FEATURES.md` for full checklist.
