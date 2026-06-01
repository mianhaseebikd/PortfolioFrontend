import { useEffect, useRef, useState } from "react";

function About() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

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
          <img src="/images/about-image.png" alt="" />

          <div
            className="about-boxes projects-float"
            style={{ transitionDelay: "0.4s" }}
          >
            <AnimatedNumber
              value={100}
              visible={isVisible}
              suffix="+"
              className="about-heading-green"
            />
            Total <br /> Projects
          </div>

          <div
            className="about-boxes experience-float"
            style={{ transitionDelay: "0.6s" }}
          >
            <AnimatedNumber
              value={2}
              visible={isVisible}
              suffix="+"
              className="about-heading-blue"
            />
            Years of <br />Experience
          </div>
        </div>

        <div
          className={`col-2 about-col about-content ${isVisible ? "fade-right" : ""}`}
          style={{ transitionDelay: "0.4s" }}
        >
          <h3 className="orange-text">Hello, I'm Developer</h3>
          <h2 className="headind-2">I Can <span className="heading-accent">Design</span> Anything You Want</h2>
          <p>
            Hello there! I'm a web designer, and I'm very passionate and dedicated
            to my work. With two years experience as a professional web developer,
            I have acquired the skills and knowledge necessary to make your project
            a success. I enjoy every step of the design process, from discussion
            and collaboration.
          </p>
          <a href="#">
            <button href="/images/my-resume.png" className="button">About Me</button>
          </a>
        </div>
      </div>
    </div>
  );
}

export default About;
