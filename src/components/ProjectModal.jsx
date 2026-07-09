const ProjectModal = ({ project, projects = [], currentIndex = 0, onClose, onPrev, onNext }) => {
  const activeProject = project;

  if (!activeProject) return null;
  const hasSlider = Array.isArray(projects) && projects.length > 1;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-shell" onClick={(e) => e.stopPropagation()}>
        <button
          className="close-btn modal-close-outside"
          type="button"
          onClick={onClose}
          aria-label="Close popup"
        >
          {"\u00D7"}
        </button>

        <div className="modal-content modal-project">
          <div className="modal-hero">
            <img src={activeProject.image} alt={activeProject.title} />
          </div>

          <div className="modal-body">
            <div className="modal-links-panel">
              <p className="modal-links-label">Project Links</p>
              <div className="project-links-box modal-links">
                <a
                  href={activeProject.liveDemo}
                  className="modal-link-chip"
                  target="_blank"
                  rel="noreferrer"
                >
                  Live Demo
                </a>
                <a
                  href={activeProject.sourceCode}
                  className="modal-link-chip"
                  target="_blank"
                  rel="noreferrer"
                >
                  Source Code
                </a>
              </div>
            </div>

            <h2>{activeProject.title}</h2>
            <p className="modal-description">{activeProject.description}</p>

            {hasSlider ? (
              <div className="modal-slider-controls">
                <button className="modal-link-chip" type="button" onClick={onPrev}>
                  Previous
                </button>
                <button className="modal-link-chip" type="button" onClick={onNext}>
                  Next
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
