import { useEffect, useMemo, useRef, useState } from "react";
import ProjectModal from "./ProjectModal.jsx";
import { useSiteContent } from "../context/SiteContentContext.jsx";

const Gallery = ({ panelMode = false } = {}) => {
  const { content } = useSiteContent();
  const projectData = useMemo(() => (Array.isArray(content?.projects) ? content.projects : []), [content?.projects]);
  const projectCategories = useMemo(
    () => (Array.isArray(content?.projectCategories) ? content.projectCategories.filter((category) => category?.visible !== false) : []),
    [content?.projectCategories]
  );
  const [visibleItems, setVisibleItems] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState(projectData);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [buttonsVisible, setButtonsVisible] = useState(false);

  const refs = useRef([]);
  const buttonsRef = useRef([]);

  const categories = useMemo(() => {
    if (projectCategories.length) {
      return [
        "All",
        ...[...projectCategories]
          .sort((a, b) => Number(a?.order || 0) - Number(b?.order || 0))
          .map((category) => category.name)
          .filter(Boolean),
      ];
    }
    return ["All", ...new Set(projectData.map((p) => p.category).filter(Boolean))];
  }, [projectCategories, projectData]);

  useEffect(() => {
    setFilteredProjects(projectData);
    setActiveFilter("All");
    setVisibleItems([]);
    refs.current = [];
    setSelectedIndex(null);
  }, [projectData]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setButtonsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    buttonsRef.current.forEach((btn) => {
      if (btn) observer.observe(btn);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-id");
            setVisibleItems((prev) => (prev.includes(id) ? prev : [...prev, id]));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    refs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [filteredProjects]);

  const handleFilter = (category) => {
    setActiveFilter(category);

    const newProjects =
      category === "All" ? projectData : projectData.filter((p) => p.category === category);

    setFilteredProjects(newProjects);
    setVisibleItems([]);
    refs.current = [];
    setSelectedIndex(null);
  };

  const openSlider = (index) => setSelectedIndex(index);
  const activeProject = selectedIndex !== null ? filteredProjects[selectedIndex] : null;
  const hasSlider = filteredProjects.length > 1;

  const goPrev = () => {
    if (!hasSlider) return;
    setSelectedIndex((prev) => (prev === null ? 0 : (prev - 1 + filteredProjects.length) % filteredProjects.length));
  };

  const goNext = () => {
    if (!hasSlider) return;
    setSelectedIndex((prev) => (prev === null ? 0 : (prev + 1) % filteredProjects.length));
  };

  const visibleProjects = panelMode ? filteredProjects.slice(0, 3) : filteredProjects;
  const moreCount = panelMode && filteredProjects.length > 3 ? filteredProjects.length - 3 : 0;

  return (
    <>
      {categories.length > 1 ? (
        <div className="filter-buttons">
          {categories.map((cat, index) => (
            <button
              key={cat}
              ref={(el) => (buttonsRef.current[index] = el)}
              className={`${activeFilter === cat ? "active" : ""} ${buttonsVisible ? "animate" : ""}`}
              style={{ transitionDelay: `${index * 0.2}s` }}
              onClick={() => handleFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      ) : null}

      <div className={`gallery ${panelMode ? "panel-mode" : ""}`}>
        {visibleProjects.map((project, index) => {
          const projectId = project._id || project.id || project.slug || project.title;

          return (
            <div
              key={projectId || `${project.title}-${activeFilter}`}
              ref={(el) => (refs.current[index] = el)}
              data-id={projectId}
              className={`gallery-item ${visibleItems.includes(String(projectId)) ? "animate" : ""}`}
              style={{ transitionDelay: `${index * 0.2}s` }}
              onClick={() => openSlider(index)}
            >
              <img src={project.image} alt={project.title} />
              <div className="content-holder">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
              </div>
            </div>
          );
        })}

        {panelMode && moreCount > 0 ? (
          <button
            type="button"
            className="gallery-item gallery-more-item"
            onClick={() => openSlider(3)}
          >
            <img src={filteredProjects[3]?.image || filteredProjects[0]?.image} alt="More projects" />
            <div className="content-holder more-holder">
              <h3>More Images</h3>
              <p>+{moreCount} more projects</p>
            </div>
          </button>
        ) : null}

        {!visibleProjects.length ? <p className="empty-state">No projects available.</p> : null}
      </div>

      <ProjectModal
        project={activeProject}
        projects={filteredProjects}
        currentIndex={selectedIndex || 0}
        onClose={() => setSelectedIndex(null)}
        onPrev={goPrev}
        onNext={goNext}
      />
    </>
  );
};

export default Gallery;
