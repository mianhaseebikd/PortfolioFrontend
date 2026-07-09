import { useEffect, useRef, useState } from "react";
import AnimatedNumber from "./animatedNumber";
import { useSiteContent } from "../context/SiteContentContext.jsx";

function Skill() {
    const { content } = useSiteContent();
    const [visible, setVisible] = useState(false);
    const skillRef = useRef(null);
    const siteSettings = content?.siteSettings || {};
    const skillItems = Array.isArray(content?.skills) ? content.skills : [];

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setVisible(true);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.3 }
        );

        if (skillRef.current) observer.observe(skillRef.current);

        return () => observer.disconnect();
    }, []);

    return (
        <div className="skill-wrapper" ref={skillRef}>
            <div className="row80 skill-row">
                <div className={`col-2 skill-content ${visible ? "show" : ""}`}>
                    <h3 className="orange-text">{siteSettings.skillTitle || ""}</h3>
                    <h2 className="headind-2">
                        {siteSettings.skillSubtitle || ""}
                    </h2>
                    <p>{siteSettings.skillDescription || ""}</p>
                    <div className="skill-bars">
                        {skillItems.map((item, index) => (
                        <div className={`progress-box ${visible ? "fill-html" : ""}`} key={item._id || item.id || item.title || index}>
                            <div className="progress-lable progress-html">
                                <span className="progress-title">{item.title}</span>
                                <AnimatedNumber value={Number(item.value || 0)} visible={visible} />
                            </div>
                            <div className="progress-bars">
                                <span
                                    className="progress-fill"
                                    style={{
                                        width: `${Math.min(100, Math.max(0, Number(item.value || 0)))}%`,
                                        backgroundColor: index % 3 === 0 ? "var(--first)" : index % 3 === 1 ? "var(--second)" : "var(--third)",
                                    }}
                                />
                            </div>
                        </div>
                        ))}

                    </div>
                </div>

                <div className={`col-2 skill-image ${visible ? "show" : ""}`}>
                    <img src="/images/skills.webp" alt={siteSettings.skillSubtitle || "Skills"} />
                </div>
            </div>
        </div>
    );
}

export default Skill;
