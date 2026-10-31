import React, { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./JourneySection.css";

import journey1 from "../../assets/img1.jpg";
import journey2 from "../../assets/img2.jpg";
import journey3 from "../../assets/img3.jpg";
import journey4 from "../../assets/img4.jpg";
import journey5 from "../../assets/img5.jpg";
import journey6 from "../../assets/img6.jpg"; // NOTE: your gallery used img6.jpeg, check the extension
import journey7 from "../../assets/img7.jpg";
import journey8 from "../../assets/img8.jpg";

const journeyImages = [
  journey1,
  journey2,
  journey3,
  journey4,
  journey5,
  journey6,
  journey7,
  journey8,
];

const N = journeyImages.length;

/* ---- tweak these to change the feel ---- */
const SPEED = 0.35;      // images per second (higher = faster glide)
const TILT = 13;         // degrees of curve per card from the centre
const DEPTH = 40;        // px each card steps back from the centre
const SHRINK = 0.04;     // scale lost per card from the centre

export default function JourneySection() {
  const stageRef = useRef(null);
  const cardRefs = useRef([]);
  const state = useRef({
    pos: 0,          // current position, in images
    speed: SPEED,    // current glide speed
    nudge: 0,        // pending arrow-button movement, in images
    dragging: false,
    startX: 0,
    startPos: 0,
    spacing: 300,
  });

  useEffect(() => {
    const stage = stageRef.current;
    const s = state.current;
    if (!stage) return undefined;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* card size + spacing follow the stage width */
    const layout = () => {
      const w = stage.clientWidth;
      const cardW = w < 700 ? w * 0.5 : w * 0.2;
      s.spacing = cardW * 1.08;
      cardRefs.current.forEach((c) => {
        if (c) c.style.width = `${cardW}px`;
      });
    };
    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(stage);

    let raf = 0;
    let last = performance.now();

    const render = (now) => {
      const dt = Math.min(now - last, 64);
      last = now;

      /* continuous glide, never stops on hover */
      /* always glide, only pausing while you drag it */
      const wanted = s.dragging || reduce ? 0 : SPEED;
      const ease = wanted === 0 ? 110 : 400;   // stops quickly, restarts gently
      s.speed += (wanted - s.speed) * (1 - Math.exp(-dt / ease));
      if (s.speed < 0.002 && wanted === 0) s.speed = 0;
      if (!s.dragging) s.pos += (s.speed * dt) / 1000;

      /* arrow-button nudge, eased in on top of the glide */
      if (s.nudge !== 0) {
        const take = s.nudge * (1 - Math.exp(-dt / 180));
        s.pos += take;
        s.nudge -= take;
        if (Math.abs(s.nudge) < 0.001) s.nudge = 0;
      }

      cardRefs.current.forEach((card, i) => {
        if (!card) return;

        /* shortest signed distance from the centre, wrapping around */
        let off = i - s.pos;
        off = ((((off + N / 2) % N) + N) % N) - N / 2;
        const abs = Math.abs(off);

        const x = off * s.spacing;
        const rot = Math.max(-45, Math.min(45, -off * TILT));
        const z = -abs * DEPTH;
        const scale = 1 - Math.min(abs, 3) * SHRINK;
        const opacity = abs > 3 ? 0 : abs > 2.5 ? (3 - abs) / 0.5 : 1;

        card.style.transform =
          `translate3d(calc(-50% + ${x.toFixed(1)}px), -50%, ${z.toFixed(1)}px) ` +
          `rotateY(${rot.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
        card.style.opacity = opacity.toFixed(2);
        card.style.zIndex = String(Math.round(100 - abs * 10));
        card.style.visibility = opacity === 0 ? "hidden" : "visible";
      });

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  /* ---------- controls ---------- */
  const step = (dir) => {
    state.current.nudge += dir;
  };

  const onPointerDown = (e) => {
    const s = state.current;
    s.dragging = true;
    s.startX = e.clientX;
    s.startPos = s.pos;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    const s = state.current;
    if (!s.dragging) return;
    s.pos = s.startPos - (e.clientX - s.startX) / s.spacing;
  };

  const endDrag = () => {
    state.current.dragging = false; // glide resumes from where you let go
  };

  return (
    <section className="journey-section">
      <div className="journey-container">
        <div className="journey-heading">
          <span className="journey-label">OUR JOURNEY</span>

          <h2>
            Growing, Learning & <span>Building Together</span>
          </h2>

          <p>
            Take a look at our journey, milestones, and the moments that
            shaped who we are today.
          </p>
        </div>
      </div>

      <div
        className="journey-stage"
        ref={stageRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {journeyImages.map((image, index) => (
          <figure
            className="journey-card"
            key={index}
            ref={(el) => (cardRefs.current[index] = el)}
          >
            <img
              src={image}
              alt={`Our Journey ${index + 1}`}
              decoding="async"
              draggable={false}
            />
          </figure>
        ))}
      </div>

        
    </section>
  );
}