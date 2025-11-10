const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.resolveTargetQuery(.{
        .cpu_arch = .wasm32,
        .os_tag = .freestanding,
    });
    
    const optimize = b.standardOptimizeOption(.{});
    
    const exe = b.addExecutable(.{
        .name = "ghostty-terminal",
        .root_source_file = b.path("main.zig"),
        .target = target,
        .optimize = optimize,
    });
    
    // Allow exported symbols
    exe.rdynamic = true;
    exe.entry = .disabled;
    
    b.installArtifact(exe);
}
