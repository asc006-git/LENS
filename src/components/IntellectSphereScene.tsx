"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function IntellectSphereScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 200;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 4.5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x2563eb, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const group = new THREE.Group();

    // Central "Intellect" Sphere
    const coreGeom = new THREE.IcosahedronGeometry(1.5, 3);
    const coreMat = new THREE.MeshPhongMaterial({
      color: 0x2563eb,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const core = new THREE.Mesh(coreGeom, coreMat);
    group.add(core);

    // Synaptic Nodes (Points)
    const nodeCount = 50;
    const positions = new Float32Array(nodeCount * 3);
    for (let i = 0; i < nodeCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    const pointsGeom = new THREE.BufferGeometry();
    pointsGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const pointsMat = new THREE.PointsMaterial({ color: 0x7c3aed, size: 0.05 });
    const points = new THREE.Points(pointsGeom, pointsMat);
    group.add(points);

    scene.add(group);

    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      group.rotation.y += 0.002;
      group.rotation.x += 0.001;

      // Pulse core
      const scale = 1 + Math.sin(Date.now() * 0.001) * 0.05;
      core.scale.set(scale, scale, scale);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      coreGeom.dispose();
      coreMat.dispose();
      pointsGeom.dispose();
      pointsMat.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full min-h-[200px]" />;
}
