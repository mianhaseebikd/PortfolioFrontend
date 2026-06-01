import { FaUserGraduate, FaAnchor } from "react-icons/fa";
import timelineData, { timeLineExperience } from "../Content/timeLine.js";
import { useEffect } from "react";
import TimelineHeading from "./heading.jsx";

function Timeline() {
  useEffect(() => {
    // Animate content boxes
    const boxes = document.querySelectorAll(".tcontent-box");
    const heads = document.querySelectorAll(".timeline-head");

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

    boxes.forEach((box) => observer.observe(box));
    heads.forEach((head) => observer.observe(head));
  }, []);

  return (
    <div className="timeline-wrapper" id="resume">
      <TimelineHeading
        title="Resume"
        subtitle="My Education & Expertise"
        accentWord="Expertise"
        description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
      />

      <div className="timeline-row">
        {/* Education */}
        <div className="timeline-col">
          <div className="timeline-head left">
            <FaUserGraduate className="icon" />
            <h3>Education</h3>
          </div>
          <div className="timeline-box">
            {timelineData.map((item, index) => (
              <div className="tcontent-box" key={index}>
                <span>{item.year}</span>
                <h3>{item.college}</h3>
                <h4>{item.degree}</h4>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className="timeline-col">
          <div className="timeline-head right">
            <FaAnchor className="icon" />
            <h3>Experience</h3>
          </div>
          <div className="timeline-box">
            {timeLineExperience.map((item, index) => (
              <div className="tcontent-box" key={index}>
                <span>{item.year}</span>
                <h3>{item.college}</h3>
                <h4>{item.degree}</h4>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Timeline;
