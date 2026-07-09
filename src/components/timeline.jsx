import { FaUserGraduate, FaAnchor } from "react-icons/fa";
import { useEffect, useState } from "react";
import TimelineHeading from "./heading.jsx";
import { useSiteContent } from "../context/SiteContentContext.jsx";

function Timeline() {
  const { content } = useSiteContent();
  const siteSettings = content?.siteSettings || {};
  const educationData = Array.isArray(content?.education) ? content.education : [];
  const experienceData = Array.isArray(content?.experience) ? content.experience : [];
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(educationData.length > 0 || experienceData.length > 0);
  }, [educationData.length, experienceData.length]);

  return (
    <div className="timeline-wrapper" id="resume">
      <TimelineHeading
        title={siteSettings.timelineTitle || ""}
        subtitle={siteSettings.timelineSubtitle || ""}
        accentWord=""
        description={siteSettings.timelineDescription || ""}
      />

      <div className="timeline-row">
        <div className="timeline-col">
          <div className={`timeline-head left ${ready ? "show" : ""}`}>
            <FaUserGraduate className="icon" />
            <h3>Education</h3>
          </div>
          <div className="timeline-box">
            {educationData.map((item, index) => (
              <div className={`tcontent-box ${ready ? "show" : ""}`} key={index} style={{ transitionDelay: `${index * 0.12}s` }}>
                <span>{item.year}</span>
                <h3>{item.college}</h3>
                <h4>{item.degree}</h4>
                <p>{item.description}</p>
              </div>
            ))}
            {!educationData.length ? <p className="empty-state">No education records available.</p> : null}
          </div>
        </div>

        <div className="timeline-col">
          <div className={`timeline-head right ${ready ? "show" : ""}`}>
            <FaAnchor className="icon" />
            <h3>Experience</h3>
          </div>
          <div className="timeline-box">
            {experienceData.map((item, index) => (
              <div className={`tcontent-box ${ready ? "show" : ""}`} key={index} style={{ transitionDelay: `${index * 0.12}s` }}>
                <span>{item.year}</span>
                <h3>{item.college}</h3>
                <h4>{item.degree}</h4>
                <p>{item.description}</p>
              </div>
            ))}
            {!experienceData.length ? <p className="empty-state">No experience records available.</p> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Timeline;
