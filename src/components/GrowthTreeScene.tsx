"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function GrowthTreeScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 2, 8);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Trunk
    const trunkGeom = new THREE.CylinderGeometry(0.2, 0.4, 4, 12);
    const trunkMat = new THREE.MeshPhongMaterial({ color: 0x2563eb, transparent: true, opacity: 0.8 });
    const trunk = new THREE.Mesh(trunkGeom, trunkMat);
    trunk.position.y = 0;
    group.add(trunk);

    // Branches as "Knowledge Nodes"
    const branches: Array<{ group: THREE.Group; leaf: THREE.Mesh }> = [];
    const colors = [0x2563eb, 0x7c3aed, 0x10b981];

    function createBranch(y: number, angle: number, length: number, color: number) {
      const branchGroup = new THREE.Group();
      branchGroup.position.y = y;

      const geom = new THREE.CylinderGeometry(0.05, 0.1, length, 8);
      const mat = new THREE.MeshPhongMaterial({ color: color });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.rotation.z = Math.PI / 3;
      mesh.position.x = length / 2;

      branchGroup.add(mesh);
      branchGroup.rotation.y = angle;

      // Leaf/Node at the end
      const leafGeom = new THREE.SphereGeometry(0.3, 16, 16);
      const leafMat = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.4,
      });
      const leaf = new THREE.Mesh(leafGeom, leafMat);
      leaf.position.set(length, length / 1.5, 0);
      branchGroup.add(leaf);

      return { group: branchGroup, leaf: leaf, geom, mat, leafGeom, leafMat };
    }

    const branchResources: Array<{
      geom: THREE.CylinderGeometry;
      mat: THREE.MeshPhongMaterial;
      leafGeom: THREE.SphereGeometry;
      leafMat: THREE.MeshStandardMaterial;
    }> = [];

    for (let i = 0; i < 6; i++) {
      const b = createBranch(
        (i - 2) * 0.8,
        (i / 6) * Math.PI * 2,
        1.5 + Math.random(),
        colors[i % 3]
      );
      group.add(b.group);
      branches.push({ group: b.group, leaf: b.leaf });
      branchResources.push({
        geom: b.geom,
        mat: b.mat,
        leafGeom: b.leafGeom,
        leafMat: b.leafMat,
      });
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      group.rotation.y += 0.003;

      const time = Date.now() * 0.001;
      branches.forEach((b, i) => {
        const scale = 1 + Math.sin(time + i) * 0.1;
        b.leaf.scale.setScalar(scale);
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
      trunkGeom.dispose();
      trunkMat.dispose();
      branchResources.forEach((r) => {
        r.geom.dispose();
        r.mat.dispose();
        r.leafGeom.dispose();
        r.leafMat.dispose();
      });
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full min-h-[300px]" />;
}
