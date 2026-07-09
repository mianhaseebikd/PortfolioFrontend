import TimelineHeading from "./heading.jsx";
import ServicesCards from "./servicesCards.jsx";
import { useSiteContent } from "../context/SiteContentContext.jsx";
function Services() {
  const { content } = useSiteContent();
  const siteSettings = content?.siteSettings || {};
  return (
    <>
      <div className="services-wrapper" id="services">
        <TimelineHeading
          title={siteSettings.servicesTitle || ""}
          subtitle={siteSettings.servicesSubtitle || ""}
          accentWord=""
          description={siteSettings.servicesDescription || ""}
        />
        <div className="row80 services-row">
          <ServicesCards />
        </div>
      </div>
    </>
  );
}
export default Services;
