import { useEffect, useRef } from "react";

function TimelineHeading({ title, subtitle, description, accentWord }) {
  const headingRef = useRef(null);

  const renderSubtitle = () => {
    if (!accentWord || typeof subtitle !== "string") {
      return subtitle;
    }

    const index = subtitle.indexOf(accentWord);
    if (index === -1) {
      return subtitle;
    }

    return (
      <>
        {subtitle.slice(0, index)}
        <span className="heading-accent">{accentWord}</span>
        {subtitle.slice(index + accentWord.length)}
      </>
    );
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (headingRef.current) {
      observer.observe(headingRef.current);
    }
  }, []);

  return (
    <div className="containers-heading" ref={headingRef}>
      <h3>{title}</h3>
      <h2>{renderSubtitle()}</h2>
      <p>{description}</p>
    </div>
  );
}

export default TimelineHeading;
