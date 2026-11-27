import React, { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./JourneySection.css";

import journey1 from "../../assets/img1.jpg";
import journey2 from "../../assets/i2.jpg";
import journey3 from "../../assets/i3.jpg";
import journey4 from "../../assets/i4.jpg";
import journey5 from "../../assets/i5.jpg"; 
import journey6 from "../../assets/i6.jpg"; // NOTE: your gallery used img6.jpeg, check the extension
import journey7 from "../../assets/img7.jpg";
import journey8 from "../../assets/i8.jpg"; // NOTE: your gallery used img8.jpeg, check the extension
import journey9 from "../../assets/i9.jpg"; // NOTE: your gallery used img9.jpeg, check the extension
import journey10 from "../../assets/i10.jpg"; // NOTE: your gallery used img10.jpeg, check the extension
import journey11 from "../../assets/i11.jpg"; // NOTE: your gallery used img11.jpeg, check the extension
import journey12 from "../../assets/i12.jpg"; // NOTE: your gallery used img12.jpeg, check the extension


const journeyImages = [
journey1, 
  journey2,
  journey3,
  journey4,
  journey5,
  journey6,
  journey7,
  journey8,
  journey9,
  journey10,
  journey11,
  journey12

];

const N = journeyImages.length;

/* ---- tweak these to change the feel ---- */
const SPEED = 0.3;       // images per second (higher = faster glide)
const TILT = 10;         // degrees of curve per card from the centre
const DEPTH = 70;        // px each card steps back from the centre
const SHRINK = 0.07;     // scale lost per card from the centre

/* ---- card size (big horizontal cards), as a share of the stage width ---- */
const CARD_RATIO = 2 / 3;      // height / width  (3:2 landscape, taller than 16:9)
const CARD_W_PHONE = 0.86;     // below 700px   -> one big card, neighbours peek in
const CARD_W_TABLET = 0.66;    // 700 - 1100px
const CARD_W_DESKTOP = 0.46;   // above 1100px  -> big centre card + two partial sides
const CARD_MAX = 820;          // never wider than this, in px

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

    /* card size, spacing and stage height all follow the stage width */
    const layout = () => {
      const w = stage.clientWidth;
      const phone = w < 700;

      const share = phone ? CARD_W_PHONE : w < 1100 ? CARD_W_TABLET : CARD_W_DESKTOP;
      const cardW = Math.min(w * share, CARD_MAX);
      const cardH = cardW * CARD_RATIO;

      s.spacing = cardW * (phone ? 1.03 : 1.06);

      /* stage is as tall as the card plus room for the tilt and shadow */
      stage.style.height = `${Math.round(cardH + (phone ? 48 : 110))}px`;

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
        const opacity = abs > 2 ? 0 : abs > 1.5 ? (2 - abs) / 0.5 : 1;

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