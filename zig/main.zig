const std = @import("std");

// Simple test function
export fn add(a: i32, b: i32) i32 {
    return a + b;
}

// Simple ANSI parser - just detect ESC sequences
export fn isEscape(byte: u8) bool {
    return byte == 0x1B;
}

// Check if byte is in CSI param range
export fn isCSIByte(byte: u8) bool {
    return (byte >= 0x30 and byte <= 0x3F);
}

// Check if byte is CSI final
export fn isCSIFinal(byte: u8) bool {
    return (byte >= 0x40 and byte <= 0x7E);
}
