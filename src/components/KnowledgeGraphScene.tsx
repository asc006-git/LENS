"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function KnowledgeGraphScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 250;

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

    // Central Hub
    const hubGeom = new THREE.IcosahedronGeometry(0.6, 2);
    const hubMat = new THREE.MeshPhongMaterial({
      color: 0x7c3aed,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const hub = new THREE.Mesh(hubGeom, hubMat);
    group.add(hub);

    // Knowledge Nodes and Connections
    const nodeCount = 12;
    const nodes: Array<{ mesh: THREE.Mesh; originalPos: THREE.Vector3; offset: number }> = [];
    for (let i = 0; i < nodeCount; i++) {
      const nodeGeom = new THREE.SphereGeometry(0.12, 16, 16);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: 0x2563eb,
        emissive: 0x2563eb,
        emissiveIntensity: 0.2,
      });
      const node = new THREE.Mesh(nodeGeom, nodeMat);

      const angle = (i / nodeCount) * Math.PI * 2;
      const radius = 2.5 + (Math.random() - 0.5);
      node.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        (Math.random() - 0.5) * 2
      );
      group.add(node);
      nodes.push({
        mesh: node,
        originalPos: node.position.clone(),
        offset: Math.random() * 100,
      });
    }

    scene.add(group);

    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      group.rotation.y += 0.002;
      group.rotation.x += 0.001;

      hub.rotation.z += 0.005;
      const pulse = 1 + Math.sin(Date.now() * 0.002) * 0.1;
      hub.scale.set(pulse, pulse, pulse);

      nodes.forEach((n) => {
        n.mesh.position.y = n.originalPos.y + Math.sin(Date.now() * 0.001 + n.offset) * 0.1;
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
      hubGeom.dispose();
      hubMat.dispose();
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

  return <div ref={containerRef} className="w-full h-full min-h-[220px]" />;
}
