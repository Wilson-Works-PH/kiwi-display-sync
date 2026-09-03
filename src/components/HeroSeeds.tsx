import { useEffect, useRef } from "react";
import * as THREE from "three";
import { prefersReducedMotion } from "../lib/motion";
import { useTheme } from "../lib/theme";
import seedsLime from "../assets/brand/seeds-lime.png";
import seedsMauve from "../assets/brand/seeds-mauve.png";

const COUNT = 46;

/**
 * Ambient 3D field of brand seed-splashes floating behind the hero.
 * Lime seeds carry the dark theme, mauve seeds the light theme.
 */
export function HeroSeeds() {
  const mountRef = useRef<HTMLDivElement>(null);
  const groupsRef = useRef<{ lime: THREE.Group; mauve: THREE.Group } | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || prefersReducedMotion()) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = 12;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    mount.appendChild(renderer.domElement);

    const loader = new THREE.TextureLoader();
    const seeds: { sprite: THREE.Sprite; speed: number; phase: number; spin: number }[] = [];

    const makeGroup = (texUrl: string, opacity: number) => {
      const group = new THREE.Group();
      const tex = loader.load(texUrl);
      tex.colorSpace = THREE.SRGBColorSpace;
      for (let i = 0; i < COUNT / 2; i++) {
        const mat = new THREE.SpriteMaterial({
          map: tex,
          transparent: true,
          opacity: opacity * (0.35 + Math.random() * 0.65),
          rotation: Math.random() * Math.PI * 2,
          depthWrite: false,
        });
        const sprite = new THREE.Sprite(mat);
        const scale = 0.25 + Math.random() * 0.85;
        sprite.scale.setScalar(scale);
        sprite.position.set(
          (Math.random() - 0.5) * 22,
          (Math.random() - 0.5) * 12,
          -4 + Math.random() * 8,
        );
        group.add(sprite);
        seeds.push({
          sprite,
          speed: 0.15 + Math.random() * 0.4,
          phase: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.35,
        });
      }
      scene.add(group);
      return group;
    };

    const lime = makeGroup(seedsLime, 0.5);
    const mauve = makeGroup(seedsMauve, 0.55);
    groupsRef.current = { lime, mauve };
    const isLight = document.documentElement.dataset.theme === "light";
    lime.visible = !isLight;
    mauve.visible = true; // mauve reads well on both themes

    const pointer = { x: 0, y: 0 };
    const onPointer = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const resize = () => {
      const { width, height } = mount.getBoundingClientRect();
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(mount);

    let raf = 0;
    const clock = new THREE.Clock();
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      const t = clock.getElapsedTime();
      for (const s of seeds) {
        s.sprite.position.y += Math.sin(t * s.speed + s.phase) * 0.0035;
        s.sprite.position.x += Math.cos(t * s.speed * 0.7 + s.phase) * 0.002;
        s.sprite.material.rotation += s.spin * 0.004;
      }
      camera.position.x += (pointer.x * 1.1 - camera.position.x) * 0.03;
      camera.position.y += (-pointer.y * 0.7 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      seeds.forEach((s) => s.sprite.material.dispose());
      renderer.dispose();
      mount.removeChild(renderer.domElement);
      groupsRef.current = null;
    };
  }, []);

  // Swap seed colorways with the theme without rebuilding the scene.
  useEffect(() => {
    const groups = groupsRef.current;
    if (!groups) return;
    groups.lime.visible = theme === "dark";
    groups.mauve.visible = true;
  }, [theme]);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
    />
  );
}
