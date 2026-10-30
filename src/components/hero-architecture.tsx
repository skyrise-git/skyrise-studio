'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Decorative product architecture, not a navigation surface.
 * One bounded WebGL scene with a reduced-motion and low-end-device fallback.
 */
export default function HeroArchitecture() {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = mount.current;
    if (!host) return;
    if (window.matchMedia('(max-width: 767px)').matches) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let renderer: InstanceType<typeof THREE.WebGLRenderer> | undefined;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    } catch {
      return; // The CSS architecture fallback remains visible.
    }

    const currentRenderer = renderer;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0.1, 10.5);
    currentRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    currentRenderer.setClearColor(0xffffff, 0);
    currentRenderer.outputColorSpace = THREE.SRGBColorSpace;
    currentRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    currentRenderer.toneMappingExposure = 1.35;
    const canvas = currentRenderer.domElement;
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = 'display:block;width:100%;height:100%;pointer-events:none;';
    host.appendChild(canvas);

    const root = new THREE.Group();
    scene.add(root);
    const architecture = new THREE.Group();
    root.add(architecture);

    const palette = [0x18365e, 0x3974aa, 0x83b7d9, 0x24486f, 0x5a93c1];
    const objects: Array<{ geometry: { dispose: () => void }; material?: { dispose: () => void } | Array<{ dispose: () => void }> }> = [];

    // Different heights represent the stack: web, commerce, platforms, integrations and intelligence.
    const columns = [
      { x: -1.35, y: -0.75, depth: 0.25, height: 2.1 },
      { x: -0.62, y: -0.35, depth: -0.18, height: 3.0 },
      { x: 0.15, y: 0.02, depth: 0.32, height: 3.7 },
      { x: 0.88, y: -0.45, depth: -0.32, height: 2.7 },
      { x: 1.54, y: -0.86, depth: 0.08, height: 1.9 },
    ];
    columns.forEach((column, i) => {
      const geometry = new THREE.BoxGeometry(0.61, column.height, 0.65);
      const material = new THREE.MeshPhysicalMaterial({
        color: palette[i], metalness: 0.26, roughness: 0.18,
        transparent: true, opacity: 0.26, transmission: 0.28, thickness: 0.5,
        clearcoat: 0.9, clearcoatRoughness: 0.15, depthWrite: false,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(column.x, column.y + column.height * 0.24, column.depth);
      architecture.add(mesh);
      objects.push(mesh);

      const edgesGeometry = new THREE.EdgesGeometry(geometry);
      const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x3c719f, transparent: true, opacity: 0.72 });
      const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
      edges.position.copy(mesh.position);
      architecture.add(edges);
      objects.push(edges);

      // Delicate horizontal floors give the model a deliberate engineered quality.
      for (let level = 1; level < Math.floor(column.height * 1.75); level++) {
        const planeGeometry = new THREE.PlaneGeometry(0.59, 0.63);
        const planeMaterial = new THREE.MeshBasicMaterial({
          color: 0xa9d0e8, transparent: true, opacity: 0.18, side: THREE.DoubleSide, depthWrite: false,
        });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -Math.PI / 2;
        plane.position.set(column.x, mesh.position.y - column.height / 2 + level * 0.56, column.depth);
        architecture.add(plane);
        objects.push(plane);
      }
    });

    const orbitGeometry = new THREE.TorusGeometry(2.65, 0.009, 5, 160);
    const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0x6f9fc6, transparent: true, opacity: 0.48 });
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbit.rotation.x = 0.34;
    orbit.rotation.y = 0.22;
    root.add(orbit);
    objects.push(orbit);

    const orbit2Geometry = new THREE.TorusGeometry(2.05, 0.007, 5, 150);
    const orbit2Material = new THREE.MeshBasicMaterial({ color: 0xb6d0e7, transparent: true, opacity: 0.43 });
    const orbit2 = new THREE.Mesh(orbit2Geometry, orbit2Material);
    orbit2.rotation.x = -0.48;
    orbit2.rotation.y = -0.33;
    root.add(orbit2);
    objects.push(orbit2);

    scene.add(new THREE.AmbientLight(0xe6f1ff, 2.1));
    const light = new THREE.DirectionalLight(0xffffff, 2.5);
    light.position.set(3, 5, 7);
    scene.add(light);
    const light2 = new THREE.PointLight(0x80b5e0, 45);
    light2.position.set(-3, -2, 4);
    scene.add(light2);

    root.rotation.set(-0.08, -0.31, -0.07);
    let targetX = 0;
    let targetY = 0;
    let inViewport = true;
    let raf = 0;
    let frame = 0;

    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      currentRenderer.setSize(width, height, false);
      currentRenderer.render(scene, camera);
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);

    const pointer = (event: PointerEvent) => {
      const bounds = host.getBoundingClientRect();
      targetX = Math.max(-0.16, Math.min(0.16, ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.22));
      targetY = Math.max(-0.12, Math.min(0.12, ((event.clientY - bounds.top) / bounds.height - 0.5) * 0.12));
    };
    window.addEventListener('pointermove', pointer, { passive: true });

    const draw = () => {
      raf = 0;
      if (!inViewport || document.hidden || reducedMotion) return;
      frame += 0.01;
      architecture.rotation.y += (targetX + Math.sin(frame * 0.32) * 0.13 - architecture.rotation.y) * 0.026;
      architecture.rotation.x += (targetY - architecture.rotation.x) * 0.025;
      orbit.rotation.z += 0.0009;
      orbit2.rotation.z -= 0.00065;
      currentRenderer.render(scene, camera);
      raf = requestAnimationFrame(draw);
    };
    const start = () => { if (!raf && inViewport && !document.hidden && !reducedMotion) raf = requestAnimationFrame(draw); };
    const observer = new IntersectionObserver(entries => {
      inViewport = entries[0]?.isIntersecting ?? false;
      if (inViewport) start(); else { cancelAnimationFrame(raf); raf = 0; }
    }, { threshold: 0.01 });
    observer.observe(host);
    document.addEventListener('visibilitychange', start);
    start();

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', pointer);
      document.removeEventListener('visibilitychange', start);
      objects.forEach(object => {
        object.geometry.dispose();
        if (Array.isArray(object.material)) object.material.forEach(m => m.dispose());
        else object.material?.dispose();
      });
      currentRenderer.dispose();
      if (host.contains(canvas)) host.removeChild(canvas);
    };
  }, []);

  return (
    <div ref={mount} aria-hidden="true" className="hero-architecture pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-10 rounded-full opacity-55 bg-[radial-gradient(ellipse_at_center,rgba(181,213,237,.30),transparent_70%)]" />
    </div>
  );
}
