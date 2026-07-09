import { useEffect, useRef, useState } from "react";
import { useSiteContent } from "../context/SiteContentContext.jsx";

function TiltCard({ children, index, visible }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    card.style.transition = "transform 0s";
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "rotateX(0deg) rotateY(0deg)";
    card.style.transition = "transform 0.3s ease";
  };

  return (
    <div
      ref={cardRef}
      data-id={index}
      className={`col-3 card process-card ${visible ? "show" : ""}`}
      style={{ transitionDelay: `${index * 0.2}s` }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}

function Process() {
  const { content } = useSiteContent();
  const [ready, setReady] = useState(false);
  const processCards = Array.isArray(content?.processes) ? content.processes : [];

  useEffect(() => {
    setReady(processCards.length > 0);
  }, [processCards.length]);

  return (
    <div className="second-container" id="process">
      <div className="row-3">
        {processCards.map((card, index) => (
          <TiltCard
            key={card._id || card.id || card.title || index}
            index={index}
            visible={ready}
          >
            <div className="inner-box-process process-circle">
              <span className="pcircle-bg">
                <img src={card.bgImage || "/images/process-bg-1.png"} alt={card.title} />
                <img src={card.iconImage || "/images/process-icon-1.svg"} alt={card.title} />
              </span>
            </div>
            <div className="inner-box-process process-heading">
              <h3>{card.title}</h3>
            </div>
            <div className="inner-box-process process-text">
              <p>{card.text}</p>
            </div>
          </TiltCard>
        ))}
      </div>
    </div>
  );
}

export default Process;
