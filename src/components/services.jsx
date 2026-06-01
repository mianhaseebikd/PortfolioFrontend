import TimelineHeading from "./heading.jsx";
import ServicesCards from "./servicesCards.jsx";
function Services() {
  return (
    <>
      <div className="services-wrapper" id="services">
        <TimelineHeading
          title="Services"
          subtitle="What I Do for Clients"
          accentWord="Clients"
          description=" Most common methods for designing websites that work well on desktop
            is responsive and adaptive design"
        />
        <div className="row80 services-row">
          {/* import services Cards From "./servicesCards.jsx"; */}
          <ServicesCards />
        </div>
      </div>
    </>
  );
}
export default Services;
