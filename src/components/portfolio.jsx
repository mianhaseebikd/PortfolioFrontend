import Gallery from "./gallery.jsx";
import TimelineHeading from "./heading.jsx";
import { useSiteContent } from "../context/SiteContentContext.jsx";
function Portfolio() {
  const { content } = useSiteContent();
  const siteSettings = content?.siteSettings || {};
  return (
    <>
      <div className="portfolio-wrapper" id="portfolio">
        <TimelineHeading
          title={siteSettings.portfolioTitle || ""}
          subtitle={siteSettings.portfolioSubtitle || ""}
          accentWord=""
          description={siteSettings.portfolioDescription || ""}
        />
        <Gallery />
      </div>
    </>
  );
}
export default Portfolio;
