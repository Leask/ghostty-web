/**
 * Minimal terminal emulator with xterm.js-compatible API
 * Uses WASM for low-level parsing helpers (optional)
 */

export interface ITerminalOptions {
  cols?: number;
  rows?: number;
  scrollback?: number;
  cursorBlink?: boolean;
  cursorStyle?: 'block' | 'underline' | 'bar';
  theme?: ITheme;
}

export interface ITheme {
  foreground?: string;
  background?: string;
  cursor?: string;
  black?: string;
  red?: string;
  green?: string;
  yellow?: string;
  blue?: string;
  magenta?: string;
  cyan?: string;
  white?: string;
  brightBlack?: string;
  brightRed?: string;
  brightGreen?: string;
  brightYellow?: string;
  brightBlue?: string;
  brightMagenta?: string;
  brightCyan?: string;
  brightWhite?: string;
}

export interface IDisposable {
  dispose(): void;
}

interface Cell {
  char: string;
  fg: number;
  bg: number;
  bold: boolean;
  italic: boolean;
  underline: boolean;
}

class EventEmitter<T> {
  private listeners: Array<(data: T) => void> = [];

  fire(data: T): void {
    this.listeners.forEach((listener) => listener(data));
  }

  event(listener: (data: T) => void): IDisposable {
    this.listeners.push(listener);
    return {
      dispose: () => {
        const index = this.listeners.indexOf(listener);
        if (index >= 0) {
          this.listeners.splice(index, 1);
        }
      },
    };
  }
}

export class Terminal {
  private cols: number;
  private rows: number;
  private scrollback: number;
  private buffer: Cell[][];
  private cursorX: number = 0;
  private cursorY: number = 0;
  private container: HTMLElement | null = null;
  private element: HTMLElement | null = null;
  private renderRequested: boolean = false;
  
  private onDataEmitter = new EventEmitter<string>();
  private onResizeEmitter = new EventEmitter<{ cols: number; rows: number }>();
  
  cols: number;
  rows: number;
  
  constructor(options: ITerminalOptions = {}) {
    this.cols = options.cols || 80;
    this.rows = options.rows || 24;
    this.scrollback = options.scrollback || 1000;
    this.buffer = this.createBuffer(this.rows);
  }
  
  private createBuffer(rows: number): Cell[][] {
    const buffer: Cell[][] = [];
    for (let y = 0; y < rows; y++) {
      buffer.push(this.createRow());
    }
    return buffer;
  }
  
  private createRow(): Cell[] {
    const row: Cell[] = [];
    for (let x = 0; x < this.cols; x++) {
      row.push({
        char: ' ',
        fg: 7, // white
        bg: 0, // black
        bold: false,
        italic: false,
        underline: false,
      });
    }
    return row;
  }
  
  open(parent: HTMLElement): void {
    this.container = parent;
    this.element = document.createElement('div');
    this.element.className = 'terminal-container';
    this.element.style.cssText = `
      font-family: 'Courier New', monospace;
      font-size: 14px;
      line-height: 1.2;
      background: #000;
      color: #fff;
      padding: 4px;
      overflow: hidden;
      white-space: pre;
    `;
    
    parent.appendChild(this.element);
    this.requestRender();
  }
  
  write(data: string): void {
    for (let i = 0; i < data.length; i++) {
      const char = data[i];
      this.writeChar(char);
    }
    this.requestRender();
  }
  
  private writeChar(char: string): void {
    const code = char.charCodeAt(0);
    
    // Handle control characters
    if (code === 10) { // \n
      this.cursorY++;
      this.cursorX = 0;
      if (this.cursorY >= this.rows) {
        this.scroll();
        this.cursorY = this.rows - 1;
      }
      return;
    }
    
    if (code === 13) { // \r
      this.cursorX = 0;
      return;
    }
    
    if (code === 8) { // backspace
      if (this.cursorX > 0) {
        this.cursorX--;
      }
      return;
    }
    
    // Regular character
    if (code >= 32) {
      const cell = this.buffer[this.cursorY][this.cursorX];
      cell.char = char;
      
      this.cursorX++;
      if (this.cursorX >= this.cols) {
        this.cursorX = 0;
        this.cursorY++;
        if (this.cursorY >= this.rows) {
          this.scroll();
          this.cursorY = this.rows - 1;
        }
      }
    }
  }
  
  private scroll(): void {
    this.buffer.shift();
    this.buffer.push(this.createRow());
  }
  
  private requestRender(): void {
    if (!this.renderRequested) {
      this.renderRequested = true;
      requestAnimationFrame(() => this.render());
    }
  }
  
  private render(): void {
    this.renderRequested = false;
    if (!this.element) return;
    
    let html = '';
    for (let y = 0; y < this.rows; y++) {
      const row = this.buffer[y];
      let line = '';
      for (let x = 0; x < this.cols; x++) {
        const cell = row[x];
        line += cell.char;
      }
      html += line + '\n';
    }
    
    this.element.textContent = html;
  }
  
  resize(cols: number, rows: number): void {
    const oldCols = this.cols;
    const oldRows = this.rows;
    
    this.cols = cols;
    this.rows = rows;
    
    // Resize buffer
    while (this.buffer.length < rows) {
      this.buffer.push(this.createRow());
    }
    while (this.buffer.length > rows) {
      this.buffer.pop();
    }
    
    // Resize rows
    for (const row of this.buffer) {
      while (row.length < cols) {
        row.push({
          char: ' ',
          fg: 7,
          bg: 0,
          bold: false,
          italic: false,
          underline: false,
        });
      }
      while (row.length > cols) {
        row.pop();
      }
    }
    
    // Adjust cursor
    if (this.cursorX >= cols) this.cursorX = cols - 1;
    if (this.cursorY >= rows) this.cursorY = rows - 1;
    
    this.onResizeEmitter.fire({ cols, rows });
    this.requestRender();
  }
  
  clear(): void {
    this.buffer = this.createBuffer(this.rows);
    this.cursorX = 0;
    this.cursorY = 0;
    this.requestRender();
  }
  
  reset(): void {
    this.clear();
  }
  
  dispose(): void {
    if (this.element && this.container) {
      this.container.removeChild(this.element);
    }
    this.element = null;
    this.container = null;
  }
  
  // Event handlers
  get onData() {
    return this.onDataEmitter.event.bind(this.onDataEmitter);
  }
  
  get onResize() {
    return this.onResizeEmitter.event.bind(this.onResizeEmitter);
  }
  
  // Stub methods for xterm.js compatibility
  focus(): void {}
  blur(): void {}
  scrollToBottom(): void {}
  scrollToTop(): void {}
  scrollLines(amount: number): void {}
  scrollPages(pageCount: number): void {}
  scrollToLine(line: number): void {}
  clearSelection(): void {}
  selectAll(): void {}
  hasSelection(): boolean { return false; }
  getSelection(): string { return ''; }
  getSelectionPosition(): any { return undefined; }
}
