import Gallery from "./gallery.jsx";
import TimelineHeading from "./heading.jsx";
function Portfolio() {
  return (
    <>
      <div className="portfolio-wrapper" id="portfolio">
        <TimelineHeading
          title="Portfolio"
          subtitle="My Amazing Works"
          accentWord="Amazing"
          description=" Most common methods for designing websites that work well on desktop
            is responsive and adaptive design"
        />
        {/* import gallery from './gallery.jsx'; */}
        <Gallery />
      </div>
    </>
  );
}
export default Portfolio;
