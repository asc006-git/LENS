"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function LensScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x2563eb, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Create a "Lens" group
    const lensGroup = new THREE.Group();

    // Main Lens Ring
    const ringGeom = new THREE.TorusGeometry(2, 0.05, 16, 100);
    const ringMat = new THREE.MeshPhongMaterial({ color: 0x2563eb, transparent: true, opacity: 0.8 });
    const ring = new THREE.Mesh(ringGeom, ringMat);
    lensGroup.add(ring);

    // Inner "Core" Spark
    const coreGeom = new THREE.SphereGeometry(0.3, 32, 32);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x7c3aed,
      emissive: 0x7c3aed,
      emissiveIntensity: 0.5,
    });
    const core = new THREE.Mesh(coreGeom, coreMat);
    lensGroup.add(core);

    // Floating "Concept Nodes"
    const nodes: Array<{ mesh: THREE.Mesh; angle: number; radius: number; speed: number }> = [];
    for (let i = 0; i < 8; i++) {
      const nodeGeom = new THREE.SphereGeometry(0.1, 16, 16);
      const nodeMat = new THREE.MeshBasicMaterial({ color: 0x2563eb });
      const node = new THREE.Mesh(nodeGeom, nodeMat);

      const angle = (i / 8) * Math.PI * 2;
      const radius = 2.5;
      node.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, Math.random() - 0.5);

      lensGroup.add(node);
      nodes.push({
        mesh: node,
        angle: angle,
        radius: radius,
        speed: 0.005 + Math.random() * 0.01,
      });
    }

    scene.add(lensGroup);

    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      lensGroup.rotation.y += 0.005;
      lensGroup.rotation.x += 0.002;

      const time = Date.now() * 0.002;
      const scale = 1 + Math.sin(time) * 0.1;
      core.scale.set(scale, scale, scale);

      nodes.forEach((n) => {
        n.angle += n.speed;
        n.mesh.position.x = Math.cos(n.angle) * n.radius;
        n.mesh.position.y = Math.sin(n.angle) * n.radius;
      });

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
      ringGeom.dispose();
      ringMat.dispose();
      coreGeom.dispose();
      coreMat.dispose();
      nodes.forEach((n) => {
        n.mesh.geometry.dispose();
        if (Array.isArray(n.mesh.material)) {
          n.mesh.material.forEach((m) => m.dispose());
        } else {
          n.mesh.material.dispose();
        }
      });
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full min-h-[300px]" />;
}
