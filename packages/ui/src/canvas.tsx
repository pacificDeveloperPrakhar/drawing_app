"use client"
import React, { useRef, useEffect, useState } from "react";

export default function DrawingCanvas() {
  const canvasRef = useRef(null);

  // Pre-filled shapes array
  const [shapes] = useState([
    {
      type: "circle",
      centerX: 0.3,
      centerY: 0.4,
      radius: 0.15,
      style: { stroke: "#e63946", lineWidth: 2, jitter: true },
    },
    {
      type: "circle",
      centerX: 0.7,
      centerY: 0.5,
      radius: 0.2,
      style: { stroke: "#457b9d", lineWidth: 2, jitter: true },
    },
    {
      type: "line",
      points: [
        { x: 0.1, y: 0.1 },
        { x: 0.9, y: 0.15 },
      ],
      style: { stroke: "#1d3557", lineWidth: 3 },
    },
    // Simulated stylus freehand shapes
    {
      type: "freehand",
      points: Array.from({ length: 40 }, (_, i) => ({
        x: 0.2 + i * 0.01,
        y: 0.2 + Math.sin(i / 2) * 0.02,
      })),
      style: { stroke: "#f4a261", lineWidth: 2 },
    },
    {
      type: "freehand",
      points: Array.from({ length: 50 }, (_, i) => ({
        x: 0.5 + Math.cos(i / 5) * 0.05,
        y: 0.7 + Math.sin(i / 5) * 0.05,
      })),
      style: { stroke: "#2a9d8f", lineWidth: 2 },
    },
    {
      type: "freehand",
      points: Array.from({ length: 35 }, (_, i) => ({
        x: 0.8 - i * 0.005,
        y: 0.3 + (Math.random() - 0.5) * 0.02,
      })),
      style: { stroke: "#e9c46a", lineWidth: 2 },
    },
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      renderShapes(ctx, canvas.width, canvas.height);
    };

    window.addEventListener("resize", resize);
    resize();

    return () => window.removeEventListener("resize", resize);
  }, [shapes]);

  const renderShapes = (ctx, width, height) => {
    ctx.clearRect(0, 0, width, height);
    shapes.forEach((shape) => {
      if (shape.type === "circle") {
        drawCircle(ctx, shape, width, height);
      } else if (shape.type === "line") {
        drawLine(ctx, shape, width, height);
      } else if (shape.type === "freehand") {
        drawFreehand(ctx, shape, width, height);
      }
    });
  };

  const drawCircle = (ctx, { centerX, centerY, radius, style }, width, height) => {
    const cx = width * centerX;
    const cy = height * centerY;
    const r = Math.min(width, height) * radius;

    ctx.beginPath();
    for (let angle = 0; angle <= Math.PI * 2; angle += 0.01) {
      const jitter = style.jitter
        ? Math.sin(angle * 8) * 2 + (Math.random() - 0.5) * 1.2
        : 0;
      const rad = r + jitter;
      const x = cx + rad * Math.cos(angle);
      const y = cy + rad * Math.sin(angle);
      if (angle === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = style.stroke;
    ctx.lineWidth = style.lineWidth;
    ctx.stroke();
  };

  const drawLine = (ctx, { points, style }, width, height) => {
    if (points.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(points[0].x * width, points[0].y * height);
    ctx.lineTo(points[1].x * width, points[1].y * height);
    ctx.strokeStyle = style.stroke;
    ctx.lineWidth = style.lineWidth;
    ctx.stroke();
  };

  const drawFreehand = (ctx, { points, style }, width, height) => {
    if (!points || points.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(points[0].x * width, points[0].y * height);
    points.forEach((p) => ctx.lineTo(p.x * width, p.y * height));
    ctx.strokeStyle = style.stroke;
    ctx.lineWidth = style.lineWidth;
    ctx.stroke();
  };

  return <canvas ref={canvasRef} style={{ display: "block" }} />;
}
