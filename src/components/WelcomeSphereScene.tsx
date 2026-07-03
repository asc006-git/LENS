"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function WelcomeSphereScene() {
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

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x2563eb, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const group = new THREE.Group();

    // Floating Student Learning Node (Central Sphere)
    const sphereGeom = new THREE.IcosahedronGeometry(1.2, 2);
    const sphereMat = new THREE.MeshPhongMaterial({
      color: 0x2563eb,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    const sphere = new THREE.Mesh(sphereGeom, sphereMat);
    group.add(sphere);

    // Orbiting "Concept Nodes"
    const nodes: Array<{ mesh: THREE.Mesh; angle: number; radius: number; speed: number }> = [];
    const nodeCount = 6;
    for (let i = 0; i < nodeCount; i++) {
      const nodeGeom = new THREE.SphereGeometry(0.15, 16, 16);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0x7c3aed : 0x10b981,
        emissive: i % 2 === 0 ? 0x7c3aed : 0x10b981,
        emissiveIntensity: 0.2,
      });
      const node = new THREE.Mesh(nodeGeom, nodeMat);
      const orbitRadius = 2.4;
      const angle = (i / nodeCount) * Math.PI * 2;
      node.position.set(Math.cos(angle) * orbitRadius, Math.sin(angle) * orbitRadius, 0);
      group.add(node);
      nodes.push({
        mesh: node,
        angle: angle,
        radius: orbitRadius,
        speed: 0.005 + Math.random() * 0.01,
      });
    }

    scene.add(group);

    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      group.rotation.y += 0.003;
      group.rotation.x += 0.001;

      sphere.rotation.z += 0.005;

      nodes.forEach((n) => {
        n.angle += n.speed;
        n.mesh.position.x = Math.cos(n.angle) * n.radius;
        n.mesh.position.y = Math.sin(n.angle) * n.radius;
        n.mesh.position.z = Math.sin(n.angle * 2.0) * 0.5;
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
      sphereGeom.dispose();
      sphereMat.dispose();
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

  return <div ref={containerRef} className="w-full h-full min-h-[180px]" />;
}
