import { TiltWrapper } from "./tlintWrapper.jsx";
import { useSiteContent } from "../context/SiteContentContext.jsx";

export default function ServicesCards() {
  const { content } = useSiteContent();
  const services = Array.isArray(content?.services) ? content.services : [];

  return (
    <>
      {services.map((service) => {
        const slug = service.slug || service._id || service.id || service.title;
        const href = `/services/${encodeURIComponent(slug)}`;

        return (
          <a
            href={href}
            key={service._id || service.id || service.slug || service.title}
            className="service-card-link"
            aria-label={`Open ${service.title} service details`}
          >
            <TiltWrapper className="service-card" style={{ cursor: "pointer" }}>
              <div
                className="service-icon"
                style={{
                  background: service.iconBg
                    ? `url(${service.iconBg}) center center / cover no-repeat`
                    : "var(--first)",
                }}
              >
                {service.icon ? <img src={service.icon} alt={service.title} width={40} /> : <span>{service.title?.charAt(0)}</span>}
              </div>
              <div className="services-content">
                <h3>{service.title}</h3>
                {service.priceFrom ? (
                  <div className="price-text">
                    Starts from <span>{service.priceFrom}</span>
                  </div>
                ) : null}
                <p>{service.shortDescription}</p>
                <span className="service-card-footer">Explore service</span>
              </div>
            </TiltWrapper>
          </a>
        );
      })}

      {!services.length ? <p className="empty-state">No services available.</p> : null}
    </>
  );
}
