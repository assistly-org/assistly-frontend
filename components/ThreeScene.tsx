"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );

    mountRef.current.appendChild(renderer.domElement);

    // AI Sphere

    const geometry = new THREE.IcosahedronGeometry(1.5, 15);

    const material = new THREE.PointsMaterial({
      color: 0x6366f1,
      size: 0.02,
      transparent: true,
      opacity: 0.8,
    });

    const points = new THREE.Points(geometry, material);

    scene.add(points);

    // Inner Wireframe

    const innerGeom = new THREE.IcosahedronGeometry(1.4, 4);

    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    });

    const innerMesh = new THREE.Mesh(innerGeom, innerMat);

    scene.add(innerMesh);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

    scene.add(ambientLight);

    camera.position.z = 4;

    const animate = () => {
      requestAnimationFrame(animate);

      points.rotation.y += 0.002;
      points.rotation.x += 0.001;

      innerMesh.rotation.y -= 0.003;

      const time = Date.now() * 0.001;

      points.scale.setScalar(
        1 + Math.sin(time) * 0.05
      );

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;

      camera.aspect =
        mountRef.current.clientWidth /
        mountRef.current.clientHeight;

      camera.updateProjectionMatrix();

      renderer.setSize(
        mountRef.current.clientWidth,
        mountRef.current.clientHeight
      );
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );

      renderer.dispose();

      if (
        mountRef.current &&
        renderer.domElement.parentNode
      ) {
        mountRef.current.removeChild(
          renderer.domElement
        );
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full opacity-60"
    />
  );
}