import React, { useEffect, useRef, useState, useCallback } from "react";
import TimelineHeading from "./heading.jsx";
import { Clients } from "../content/clients.js";

const StarIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

// Floating avatar positions: left side and right side
const floatPositions = [
  { side: "left", top: "12%", left: "2%" },
  { side: "left", top: "42%", left: "6%" },
  { side: "left", top: "72%", left: "1%" },
  { side: "right", top: "10%", right: "3%" },
  { side: "right", top: "45%", right: "1%" },
  { side: "right", top: "74%", right: "5%" },
];

// Decorative shapes config
const shapes = [
  {
    type: "circle-outline",
    color: "var(--third)",
    size: 28,
    top: "22%",
    left: "13%",
    opacity: 0.55,
  },
  {
    type: "dot",
    color: "var(--first)",
    size: 10,
    top: "60%",
    left: "10%",
    opacity: 0.7,
  },
  {
    type: "dot",
    color: "var(--second)",
    size: 14,
    top: "80%",
    left: "18%",
    opacity: 0.6,
  },
  {
    type: "circle-outline",
    color: "var(--second)",
    size: 34,
    top: "30%",
    right: "12%",
    opacity: 0.5,
  },
  {
    type: "dot",
    color: "var(--first)",
    size: 10,
    top: "55%",
    right: "16%",
    opacity: 0.65,
  },
  {
    type: "dot",
    color: "var(--third)",
    size: 16,
    top: "75%",
    right: "9%",
    opacity: 0.55,
  },
  {
    type: "circle-outline",
    color: "var(--first)",
    size: 20,
    top: "68%",
    left: "22%",
    opacity: 0.35,
  },
  {
    type: "dot",
    color: "var(--second)",
    size: 8,
    top: "18%",
    right: "22%",
    opacity: 0.5,
  },
];

const Testimonial = () => {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState("next");
  const [visible, setVisible] = useState(false);
  const autoRef = useRef(null);
  const wrapperRef = useRef(null);
  const total = Clients.length;

  const goTo = useCallback(
    (index, dir) => {
      if (animating) return;
      setDirection(dir);
      setAnimating(true);
      setTimeout(() => {
        setCurrent(index);
        setAnimating(false);
      }, 420);
    },
    [animating],
  );

  const next = useCallback(
    () => goTo((current + 1) % total, "next"),
    [current, total, goTo],
  );
  const prev = useCallback(
    () => goTo((current - 1 + total) % total, "prev"),
    [current, total, goTo],
  );

  const resetAuto = () => {
    clearInterval(autoRef.current);
    autoRef.current = setInterval(next, 5500);
  };

  useEffect(() => {
    autoRef.current = setInterval(next, 5500);
    return () => clearInterval(autoRef.current);
  }, [next]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            // also trigger bg image animation on the wrapper
            if (wrapperRef.current)
              wrapperRef.current.classList.add("testi-bg-visible");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    if (wrapperRef.current) observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, []);

  const client = Clients[current];

  return (
    <div className="review-wrapper" id="review" ref={wrapperRef}>
      {/* ── Decorative background images ── */}
      <img
        src="/images/bg-about.png"
        className="testi-bg-img testi-bg-img-1"
        alt=""
        aria-hidden="true"
      />
      <img
        src="/images/background-about.png"
        className="testi-bg-img testi-bg-img-2"
        alt=""
        aria-hidden="true"
      />
      <img
        src="/images/services-bg2.webp"
        className="testi-bg-img testi-bg-img-3"
        alt=""
        aria-hidden="true"
      />

      <TimelineHeading
        title="Testimonials"
        subtitle="What Clients Say"
        accentWord="Clients"
        description="Real words from real clients — here's what people say about working with me."
      />

      <div className={`testi-stage${visible ? " testi-stage-visible" : ""}`}>
        {/* ── Decorative geometric shapes ── */}
        {shapes.map((s, i) => (
          <span
            key={i}
            className={`testi-shape testi-shape-${i}`}
            style={{
              top: s.top,
              left: s.left,
              right: s.right,
              opacity: s.opacity,
              width: s.size,
              height: s.size,
              borderRadius: "50%",
              border:
                s.type === "circle-outline" ? `2.5px solid ${s.color}` : "none",
              background: s.type === "dot" ? s.color : "transparent",
              position: "absolute",
              pointerEvents: "none",
            }}
          />
        ))}

        {/* ── Floating avatars (left & right) ── */}
        {Clients.map((c, i) => {
          const pos =
            floatPositions[i] || floatPositions[i % floatPositions.length];
          const isActive = i === current;
          return (
            <button
              key={c.id}
              className={`testi-float-avatar${isActive ? " testi-float-active" : ""}`}
              style={{ top: pos.top, left: pos.left, right: pos.right }}
              onClick={() => {
                goTo(i, i > current ? "next" : "prev");
                resetAuto();
              }}
              aria-label={`View ${c.clientName}'s review`}
            >
              <img src={c.imageUrl} alt={c.clientName} />
            </button>
          );
        })}

        {/* ── Prev arrow — absolute left ── */}
        <button
          className="testi-side-arrow testi-side-prev"
          onClick={() => {
            prev();
            resetAuto();
          }}
          aria-label="Previous"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* ── Center content ── */}
        <div className="testi-center">
          {/* Big quote mark */}
          <div className="testi-big-quote">
            <svg width="72" height="56" viewBox="0 0 52 40" fill="none">
              <path
                d="M0 40V24.444C0 18.704 1.296 13.778 3.889 9.667 6.481 5.556 10.556 2.407 16.111 0.222L19.444 5.333C16.481 6.593 14.185 8.407 12.556 10.778 10.926 13.148 10.111 15.926 10.111 19.111H20.556V40H0ZM31.444 40V24.444C31.444 18.704 32.741 13.778 35.333 9.667 37.926 5.556 42 2.407 47.556 0.222L50.889 5.333C47.926 6.593 45.63 8.407 44 10.778 42.37 13.148 41.556 15.926 41.556 19.111H52V40H31.444Z"
                fill="var(--first)"
              />
            </svg>
          </div>

          {/* Review text with animation */}
          <div
            className={`testi-text-wrap${animating ? ` testi-text-exit-${direction}` : " testi-text-enter"}`}
          >
            <p className="testi-review-text">"{client.review}"</p>
            {/* Stars — below author info */}
            <div className="testi-stars">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="testi-star">
                  <StarIcon />
                </span>
              ))}
            </div>
            {/* Author row — avatar + name/service */}
            <div className="testi-author">
              <div className="testi-author-avatar-wrap">
                <img
                  src={client.imageUrl}
                  alt={client.clientName}
                  className="testi-author-avatar"
                />
              </div>
              <div className="testi-author-info">
                <h4 className="testi-author-name">{client.clientName}</h4>
                <span className="testi-author-service">
                  {client.whichServices}
                </span>
              </div>
            </div>
          </div>

          {/* Dots only */}
          <div className="testi-dots">
            {Clients.map((_, i) => (
              <button
                key={i}
                className={`testi-dot${i === current ? " testi-dot-active" : ""}`}
                onClick={() => {
                  goTo(i, i > current ? "next" : "prev");
                  resetAuto();
                }}
                aria-label={`Review ${i + 1}`}
              />
            ))}
          </div>
        </div>
        {/* end testi-center */}

        {/* ── Next arrow — absolute right ── */}
        <button
          className="testi-side-arrow testi-side-next"
          onClick={() => {
            next();
            resetAuto();
          }}
          aria-label="Next"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
      {/* end testi-stage */}
    </div>
  );
};

export default Testimonial;
