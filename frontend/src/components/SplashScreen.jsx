// src/components/SplashScreen.jsx

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, animate } from "framer-motion";
import * as THREE from "three";

import "./SplashScreen.css";

// Logo (the particles are built from this image)
import logoImage from "../assets/lll.png";

/* ============================================================
   PARTICLE GLOBE -> LOGO SPLASH SCREEN

   1. Thousands of particles start as a slowly spinning globe.
   2. They spring into place and form the VProTech logo.
   3. The crisp logo fades in over the particles.
   4. The splash fades out and the page (hero) is revealed.

   Requires:  npm install three   (framer-motion is already used)
============================================================ */

const COLUMNS = 190; // particle columns (rows are derived from logo aspect)

/* ------------------------------------------------------------
   SHADERS
------------------------------------------------------------ */

const VERTEX_SHADER = /* glsl */ `
  attribute vec3 imagePosition;
  attribute vec3 globePosition;
  attribute vec3 aColor;
  attribute float aBg;
  attribute float phase;
  attribute float speed;

  uniform float uGlobe;
  uniform float uTime;
  uniform float uRadius;
  uniform vec2 uSize;

  varying vec3 vColor;

  void main() {
    // slow spin of the globe around the Y axis
    float a = uTime * 0.45;
    float c = cos(a);
    float s = sin(a);
    vec3 gp = vec3(
      globePosition.x * c + globePosition.z * s,
      globePosition.y,
      -globePosition.x * s + globePosition.z * c
    );

    // gentle shimmer so the globe feels alive
    vec3 turbulence = vec3(
      sin(uTime * (speed + 0.6) + phase) * 0.03,
      cos(uTime * (speed + 0.37) + phase * 1.71) * 0.025,
      sin(uTime * (speed + 0.22) + phase * 2.13) * 0.03
    );

    vec3 center = mix(imagePosition, gp + turbulence, uGlobe);
    vec3 pos = center + vec3(position.xy * uSize, 0.0);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

    // Globe colour: brand blue -> green, lighter on the far side for depth
    float zn = clamp(gp.z / uRadius * 0.5 + 0.5, 0.0, 1.0);
    vec3 blue = vec3(0.145, 0.388, 0.922);
    vec3 green = vec3(0.125, 0.706, 0.525);
    vec3 globeColor = mix(blue, green, 0.5 + 0.5 * sin(phase * 3.0));
    globeColor = mix(vec3(0.82, 0.88, 0.98), globeColor, 0.35 + 0.65 * zn);

    // logo-coloured particles keep their colour; white background
    // particles borrow the globe colour while the globe is formed
    vColor = mix(aColor, globeColor, uGlobe * aBg);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  varying vec3 vColor;

  void main() {
    gl_FragColor = vec4(vColor, 1.0);
  }
`;

/* ------------------------------------------------------------
   HELPERS
------------------------------------------------------------ */

// Fades the crisp logo in only after the particles have settled
function overlayOpacity(globeAmount) {
  const amount = Math.max(globeAmount, 0);
  const start = 0.005;
  const end = 0.035;
  const t = Math.min(1, Math.max(0, (amount - start) / (end - start)));
  return 1 - t * t * (3 - 2 * t);
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not load the logo image"));
    image.src = src;
  });
}

function readPixels(image) {
  const maxWidth = 900;
  const scale = Math.min(1, maxWidth / image.naturalWidth);
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(image, 0, 0, width, height);

  return {
    width,
    height,
    data: ctx.getImageData(0, 0, width, height).data,
  };
}

/* ------------------------------------------------------------
   PARTICLE LOGO (three.js canvas)
------------------------------------------------------------ */

function ParticleLogo({ src, onFail, onSettled }) {
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const settledRef = useRef(onSettled);

  useEffect(() => {
    settledRef.current = onSettled;
  }, [onSettled]);

  useEffect(() => {
    let disposed = false;
    let rafId = 0;
    let controls = null;
    let observer = null;
    let renderer = null;
    let geometry = null;
    let material = null;
    let overlayGeometry = null;
    let overlayMaterial = null;
    let texture = null;

    const setup = async () => {
      const image = await loadImage(src);
      if (disposed) return;

      const stage = stageRef.current;
      const canvas = canvasRef.current;
      if (!stage || !canvas) return;

      /* ---------- renderer / scene / camera ---------- */

      renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setClearColor(0xffffff, 1);

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
      camera.position.z = 4;

      /* ---------- sample logo pixels ---------- */

      const photo = readPixels(image);
      const imageAspect = image.naturalWidth / image.naturalHeight;
      const rows = Math.max(1, Math.round(COLUMNS / imageAspect));
      const count = COLUMNS * rows;

      const imagePositions = new Float32Array(count * 3);
      const globePositions = new Float32Array(count * 3);
      const colours = new Float32Array(count * 3);
      const backgroundFlags = new Float32Array(count);
      const phases = new Float32Array(count);
      const speeds = new Float32Array(count);

      for (let i = 0; i < count; i++) {
        const column = i % COLUMNS;
        const row = Math.floor(i / COLUMNS);

        const sx = Math.min(
          photo.width - 1,
          Math.floor(((column + 0.5) / COLUMNS) * photo.width)
        );
        const sy = Math.min(
          photo.height - 1,
          Math.floor(((row + 0.5) / rows) * photo.height)
        );

        const p = (sy * photo.width + sx) * 4;
        const alpha = photo.data[p + 3] / 255;

        // composite the pixel over white
        const r = (photo.data[p] / 255) * alpha + (1 - alpha);
        const g = (photo.data[p + 1] / 255) * alpha + (1 - alpha);
        const b = (photo.data[p + 2] / 255) * alpha + (1 - alpha);
        const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

        colours[i * 3] = r;
        colours[i * 3 + 1] = g;
        colours[i * 3 + 2] = b;
        backgroundFlags[i] = luminance > 0.93 ? 1 : 0;
        phases[i] = Math.random() * Math.PI * 2;
        speeds[i] = 0.7 + Math.random() * 0.35;
      }

      /* ---------- geometry + material ---------- */

      geometry = new THREE.InstancedBufferGeometry().copy(
        new THREE.PlaneGeometry(1, 1)
      );
      geometry.instanceCount = count;

      const imageAttr = new THREE.InstancedBufferAttribute(imagePositions, 3);
      const globeAttr = new THREE.InstancedBufferAttribute(globePositions, 3);

      geometry.setAttribute("imagePosition", imageAttr);
      geometry.setAttribute("globePosition", globeAttr);
      geometry.setAttribute(
        "aColor",
        new THREE.InstancedBufferAttribute(colours, 3)
      );
      geometry.setAttribute(
        "aBg",
        new THREE.InstancedBufferAttribute(backgroundFlags, 1)
      );
      geometry.setAttribute(
        "phase",
        new THREE.InstancedBufferAttribute(phases, 1)
      );
      geometry.setAttribute(
        "speed",
        new THREE.InstancedBufferAttribute(speeds, 1)
      );

      const uniforms = {
        uGlobe: { value: 1 },
        uTime: { value: 0 },
        uRadius: { value: 0.5 },
        uSize: { value: new THREE.Vector2(0.01, 0.01) },
      };

      material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
      });

      const particles = new THREE.Mesh(geometry, material);
      particles.frustumCulled = false;
      scene.add(particles);

      /* ---------- crisp logo overlay ---------- */

      texture = new THREE.Texture(image);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;

      overlayGeometry = new THREE.PlaneGeometry(1, 1);
      overlayMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        toneMapped: false,
        opacity: 0,
      });

      const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial);
      overlay.renderOrder = 1;
      scene.add(overlay);

      /* ---------- layout (runs on every resize) ---------- */

      const yaw = Math.random() * Math.PI * 2;
      const tilt = -0.28;

      const layout = (aspect) => {
        let halfWidth = Math.min(0.7, aspect * 0.7);
        let halfHeight = halfWidth / imageAspect;

        if (halfHeight > 0.5) {
          halfHeight = 0.5;
          halfWidth = halfHeight * imageAspect;
        }

        const globeRadius = Math.min(0.6, aspect * 0.8);
        const yawCos = Math.cos(yaw);
        const yawSin = Math.sin(yaw);

        for (let i = 0; i < count; i++) {
          const column = i % COLUMNS;
          const row = Math.floor(i / COLUMNS);
          const x = (column + 0.5) / COLUMNS;
          const y = (row + 0.5) / rows;

          // Fibonacci sphere
          const sphereY = 1 - (i / Math.max(count - 1, 1)) * 2;
          const ring = Math.sqrt(Math.max(0, 1 - sphereY * sphereY));
          const angle = i * 2.39996323;
          const sphereX = Math.cos(angle) * ring;
          const sphereZ = Math.sin(angle) * ring;

          const spunX = sphereX * yawCos + sphereZ * yawSin;
          const spunZ = -sphereX * yawSin + sphereZ * yawCos;

          imagePositions[i * 3] = (x - 0.5) * halfWidth * 2;
          imagePositions[i * 3 + 1] = (0.5 - y) * halfHeight * 2;
          imagePositions[i * 3 + 2] = 0;

          globePositions[i * 3] = spunX * globeRadius;
          globePositions[i * 3 + 1] =
            (sphereY * Math.cos(tilt) - spunZ * Math.sin(tilt)) * globeRadius;
          globePositions[i * 3 + 2] =
            (sphereY * Math.sin(tilt) + spunZ * Math.cos(tilt)) * globeRadius;
        }

        imageAttr.needsUpdate = true;
        globeAttr.needsUpdate = true;

        uniforms.uRadius.value = globeRadius;
        uniforms.uSize.value.set(
          ((halfWidth * 2) / COLUMNS) * 1.02,
          ((halfHeight * 2) / rows) * 1.02
        );
        overlay.scale.set(halfWidth * 2, halfHeight * 2, 1);
      };

      const resize = () => {
        const width = Math.max(stage.clientWidth, 1);
        const height = Math.max(stage.clientHeight, 1);
        const aspect = width / height;

        renderer.setSize(width, height, false);
        camera.left = -aspect;
        camera.right = aspect;
        camera.top = 1;
        camera.bottom = -1;
        camera.updateProjectionMatrix();

        layout(aspect);
      };

      observer = new ResizeObserver(resize);
      observer.observe(stage);
      resize();

      /* ---------- motion: globe -> logo ---------- */

      let settled = false;

      controls = animate(1, 0, {
        type: "spring",
        stiffness: 60,
        damping: 17,
        mass: 1,
        delay: 0.7,
        onUpdate: (value) => {
          uniforms.uGlobe.value = value;
          overlayMaterial.opacity = overlayOpacity(value);

          // logo fully formed -> tell the splash it can leave soon
          if (!settled && value < 0.005) {
            settled = true;
            settledRef.current?.();
          }
        },
      });

      /* ---------- render loop ---------- */

      const startTime = performance.now();

      const render = (now) => {
        uniforms.uTime.value = (now - startTime) / 1000;
        renderer.render(scene, camera);
        rafId = requestAnimationFrame(render);
      };

      rafId = requestAnimationFrame(render);
      canvas.dataset.ready = "true";
    };

    setup().catch((error) => {
      console.error("Splash animation failed:", error);
      if (!disposed) onFail();
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      controls?.stop();
      observer?.disconnect();
      geometry?.dispose();
      material?.dispose();
      overlayGeometry?.dispose();
      overlayMaterial?.dispose();
      texture?.dispose();
      renderer?.dispose();
    };
  }, [src, onFail]);

  return (
    <div className="vpro-splash-stage" ref={stageRef}>
      <canvas
        ref={canvasRef}
        className="vpro-splash-canvas"
        aria-hidden="true"
      />
    </div>
  );
}

/* ------------------------------------------------------------
   SPLASH SCREEN
------------------------------------------------------------ */

// How long the finished logo stays on screen before the page opens
const HOLD_AFTER_LOGO = 350; // ms

export default function SplashScreen({ duration = 4500, onComplete }) {
  const [visible, setVisible] = useState(true);
  const [failed, setFailed] = useState(false);

  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const handleFail = useCallback(() => setFailed(true), []);

  // As soon as the logo has formed, open the page after a short hold
  const holdTimer = useRef(null);

  const handleSettled = useCallback(() => {
    clearTimeout(holdTimer.current);
    holdTimer.current = setTimeout(() => setVisible(false), HOLD_AFTER_LOGO);
  }, []);

  useEffect(() => () => clearTimeout(holdTimer.current), []);

  // Safety net: never stay longer than `duration`
  useEffect(() => {
    const timer = setTimeout(
      () => setVisible(false),
      reduceMotion || failed ? 1400 : duration
    );

    return () => clearTimeout(timer);
  }, [duration, reduceMotion, failed]);

  // Stop the page behind the splash from scrolling
  useEffect(() => {
    if (!visible) return undefined;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous;
    };
  }, [visible]);

  const showStaticLogo = reduceMotion || failed;

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {visible && (
        <motion.div
          className="vpro-splash"
          role="status"
          aria-label="Loading VProTech Digital"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
          }}
        >
          {showStaticLogo ? (
            <motion.img
              src={logoImage}
              alt="VProTech Digital"
              className="vpro-splash-fallback-logo"
              draggable="false"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
          ) : (
            <ParticleLogo
              src={logoImage}
              onFail={handleFail}
              onSettled={handleSettled}
            />
          )}

          <div className="vpro-splash-corner corner-top-left" />
          <div className="vpro-splash-corner corner-bottom-right" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}