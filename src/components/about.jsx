import { useEffect, useRef, useState } from "react";
import { useSiteContent } from "../context/SiteContentContext.jsx";

function About() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const { content } = useSiteContent();
  const about = content?.about || {};
  const siteSettings = content?.siteSettings || {};
  const aboutStats = Array.isArray(about.stats) ? about.stats : [];
  const totalProjectsValue = Number.parseInt(String(aboutStats[0]?.value || "0").replace(/[^\d]/g, ""), 10) || 0;
  const experienceValue = Number.parseInt(String(aboutStats[1]?.value || "0").replace(/[^\d]/g, ""), 10) || 0;
  const projectLabel = aboutStats[0]?.label || "";
  const experienceLabel = aboutStats[1]?.label || "";

  // AnimatedNumber component
  function AnimatedNumber({ value, visible, suffix = "", className = "" }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (visible) {
        let start = 0;
        const duration = 1000; // animation duration in ms
        const increment = value / (duration / 16); // approx 60fps
        const interval = setInterval(() => {
          start += increment;
          if (start >= value) {
            start = value;
            clearInterval(interval);
          }
          setCount(Math.round(start));
        }, 16);
      }
    }, [visible, value]);

    return <h3 className={className}>{count}{suffix}</h3>;
  }

  // Intersection Observer for section visibility
  useEffect(() => {
    const node = sectionRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );
    if (node) observer.observe(node);

    return () => {
      if (node) observer.unobserve(node);
    };
  }, []);

  return (
    <div
      className={`about-wrapper ${isVisible ? "show" : ""}`}
      id="about"
      ref={sectionRef}
    >
      <div className="row80">
          <div
            className={`col-2 about-col about-img ${isVisible ? "fade-left" : ""}`}
            style={{ transitionDelay: "0.2s" }}
          >
          {about.image ? <img src={about.image} alt={about.title || "About"} /> : null}

          <div
            className="about-boxes projects-float"
            style={{ transitionDelay: "0.4s" }}
          >
            <AnimatedNumber
              value={totalProjectsValue}
              visible={isVisible}
              suffix="+"
              className="about-heading-green"
            />
            {projectLabel}
          </div>

          <div
            className="about-boxes experience-float"
            style={{ transitionDelay: "0.6s" }}
          >
            <AnimatedNumber
              value={experienceValue}
              visible={isVisible}
              suffix="+"
              className="about-heading-blue"
            />
            {experienceLabel}
          </div>
        </div>

        <div
          className={`col-2 about-col about-content ${isVisible ? "fade-right" : ""}`}
          style={{ transitionDelay: "0.4s" }}
        >
          <h3 className="orange-text">{about.eyebrow || ""}</h3>
          <h2 className="headind-2">
            {about.title || ""}
          </h2>
          <p>{about.description || ""}</p>
          {siteSettings.resumeUrl ? (
            <a href={siteSettings.resumeUrl} download className="button">
              {siteSettings.resumeButtonLabel || ""}
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default About;
