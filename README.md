# WASM Terminal - xterm.js Compatible

A minimal terminal emulator with an xterm.js-compatible API, built with:
- **TypeScript** for terminal state management and rendering
- **Zig + WASM** for low-level parsing helpers (optional)
- **libghostty-vt inspiration** (though current implementation is self-contained)

## Status: Proof of Concept (PoC)

This is a janky, experimental implementation to explore using libghostty-vt with WASM.

## Structure

```
wasm-terminal/
├── zig/                    # Zig WASM module
│   ├── build.zig          # Zig build configuration
│   ├── main.zig           # WASM exports (helper functions)
│   └── zig-out/bin/       # Compiled WASM binary
├── src/
│   └── terminal.ts        # TypeScript terminal implementation
├── index.html             # Demo page
└── README.md
```

## Building

```bash
# Build WASM module (requires Zig 0.13.0)
cd zig
zig build

# Open demo
# Serve index.html with any HTTP server, e.g.:
python3 -m http.server 8000
# Then open http://localhost:8000
```

## API Compatibility

Implements core xterm.js Terminal API:
- `new Terminal(options)`
- `open(parent)`
- `write(data)`
- `resize(cols, rows)`
- `clear()`
- `dispose()`
- `onData` event
- `onResize` event

## Current Limitations

- No ANSI color parsing yet (cell attributes exist, not implemented)
- No selection/clipboard support
- No addons support
- Basic rendering (no canvas/webgl)
- WASM module is minimal (just helper functions)

## Next Steps

To make this production-ready:
1. Add full ANSI/VT escape sequence parsing
2. Implement color rendering (SGR sequences)
3. Add cursor rendering and styles
4. Integrate actual libghostty-vt WASM builds
5. Performance optimization
6. Selection and clipboard support
7. Scrollback buffer management

## License

See main cmux LICENSE (AGPL-3.0)
