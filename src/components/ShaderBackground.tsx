"use client";

import React, { useEffect, useRef } from "react";

interface ShaderBackgroundProps {
  opacity?: number;
  className?: string;
  customFragmentShader?: string;
}

const DEFAULT_FRAGMENT_SHADER = `
precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
varying vec2 v_texCoord;

void main() {
    vec2 uv = v_texCoord;
    
    // Subtle, slow-moving gradient field matching LENS brand colors
    vec3 color1 = vec3(0.145, 0.388, 0.921); // Primary Blue #2563EB
    vec3 color2 = vec3(0.486, 0.227, 0.929); // Secondary Purple #7C3AED
    vec3 bgColor = vec3(0.973, 0.980, 0.988); // Background #F8FAFC
    
    float noise = sin(uv.x * 2.0 + u_time * 0.15) * cos(uv.y * 2.0 + u_time * 0.2);
    float glow = smoothstep(0.4, 0.6, 0.5 + 0.5 * noise);
    
    vec3 finalColor = mix(bgColor, mix(color1, color2, uv.x), glow * 0.04);
    
    gl_FragColor = vec4(finalColor, 1.0);
}
`;

const VERTEX_SHADER = `
attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

export default function ShaderBackground({
  opacity = 0.5,
  className = "absolute inset-0 w-full h-full",
  customFragmentShader,
}: ShaderBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl: WebGLRenderingContext | null = null;
    try {
      gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext;
    } catch (e) {
      console.error("WebGL not supported", e);
      return;
    }

    if (!gl) return;

    const vs = gl.createShader(gl.VERTEX_SHADER);
    if (!vs) return;
    gl.shaderSource(vs, VERTEX_SHADER);
    gl.compileShader(vs);

    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fs) return;
    gl.shaderSource(fs, customFragmentShader || DEFAULT_FRAGMENT_SHADER);
    gl.compileShader(fs);

    // Check compilation errors
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
      console.error("Vertex shader compile error:", gl.getShaderInfoLog(vs));
      return;
    }
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      console.error("Fragment shader compile error:", gl.getShaderInfoLog(fs));
      return;
    }

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);

    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(prog));
      return;
    }

    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes = gl.getUniformLocation(prog, "u_resolution");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");

    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        const nx = (event.clientX - rect.left) / rect.width;
        const ny = 1.0 - (event.clientY - rect.top) / rect.height;
        mouse.x = nx * canvas.width;
        mouse.y = ny * canvas.height;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    let animationFrameId: number;

    const render = (t: number) => {
      if (!canvas || !gl) return;
      
      const w = canvas.clientWidth || 1280;
      const h = canvas.clientHeight || 720;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }

      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    // Clean up
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      if (gl) {
        gl.deleteProgram(prog);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        gl.deleteBuffer(buf);
      }
    };
  }, [customFragmentShader]);

  return (
    <div className={`fixed inset-0 z-[-1] pointer-events-none overflow-hidden`} style={{ opacity }}>
      <canvas ref={canvasRef} className={className} style={{ display: "block", width: "100%", height: "100%" }} />
    </div>
  );
}
