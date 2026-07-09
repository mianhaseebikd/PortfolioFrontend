import { useEffect } from "react";
import Header from "./components/header.jsx";
import Process from "./components/process.jsx";
import About from "./components/about.jsx";
import Timeline from "./components/timeline.jsx";
import Portfolio from "./components/portfolio.jsx";
import Skill from "./components/skill.jsx";
import Services from "./components/services.jsx";
import Testimonial from "./components/testimonial.jsx";
import CompaniesSection from "./components/companies.jsx";
import Blog from "./components/blog.jsx";
import Newsletter from "./components/newsletter.jsx";
import Contact from "./components/contact.jsx";
import Footer from "./components/footer.jsx";
import {
  BlogDetailPage,
  BlogsArchivePage,
  PortfolioArchivePage,
  ServiceDetailPage,
  ServicesArchivePage,
} from "./components/archivePages.jsx";
import { publicApi } from "./lib/api.js";

const VISITOR_KEY = "portfolio_visitor_id";
const VIEWED_KEY = "portfolio_viewed_sections";

const normalizePath = (value = "") => {
  const stripped = String(value || "").replace(/\/+$/, "");
  return stripped || "/";
};

const getVisitorId = () => {
  const existing = localStorage.getItem(VISITOR_KEY);
  if (existing) return existing;

  const generated =
    (typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID()) ||
    `visitor_${Math.random().toString(36).slice(2)}_${Date.now()}`;
  localStorage.setItem(VISITOR_KEY, generated);
  return generated;
};

const toTitle = (value) =>
  String(value || "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase())
    .trim();

const getPageKey = (pathname) => {
  const path = normalizePath(pathname);
  if (path === "/") return "home";
  if (path === "/services") return "services-archive";
  if (path.startsWith("/services/")) return "service-detail";
  if (path === "/blog") return "blog-archive";
  if (path.startsWith("/blog/")) return "blog-detail";
  if (path === "/portfolio") return "portfolio-archive";
  return path.replace(/^\//, "") || "home";
};

function HomePage() {
  useEffect(() => {
    const visitorId = getVisitorId();
    const seen = new Set(JSON.parse(sessionStorage.getItem(VIEWED_KEY) || "[]").filter(Boolean));

    const track = async (payload) => {
      try {
        await publicApi.track(payload);
      } catch (_error) {
        // ignore analytics failures
      }
    };

    track({
      pageKey: "home",
      pageTitle: "Home",
      path: "/",
      visitorId,
      referrer: document.referrer || "",
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const pageKey = entry.target.id;
          if (!pageKey || seen.has(pageKey)) return;

          seen.add(pageKey);
          sessionStorage.setItem(VIEWED_KEY, JSON.stringify(Array.from(seen)));

          track({
            pageKey,
            pageTitle: toTitle(pageKey),
            path: "/",
            visitorId,
            referrer: document.referrer || "",
          });
        });
      },
      { threshold: 0.45 },
    );

    document.querySelectorAll("[id]").forEach((node) => {
      const tagName = String(node.tagName || "").toLowerCase();
      const nodeId = String(node.id || "");
      if (["root", "modal-root", "portal-root"].includes(nodeId)) return;
      if (["a", "nav", "button"].includes(tagName)) return;
      observer.observe(node);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Header />
      <Process />
      <About />
      <Timeline />
      <Portfolio />
      <Skill />
      <Services />
      <Testimonial />
      <CompaniesSection />
      <Blog />
      <Newsletter />
      <Contact />
      <Footer />
    </>
  );
}

function PublicApp() {
  const pathname = normalizePath(window.location.pathname);

  useEffect(() => {
    const visitorId = getVisitorId();
    const pageKey = getPageKey(pathname);
    const routeTitle = toTitle(pageKey);

    const track = async () => {
      try {
        await publicApi.track({
          pageKey,
          pageTitle: routeTitle,
          path: pathname,
          visitorId,
          referrer: document.referrer || "",
        });
      } catch (_error) {
        // ignore analytics failures
      }
    };

    if (pageKey !== "home") {
      track();
    }
  }, [pathname]);

  if (pathname === "/services") {
    return <ServicesArchivePage />;
  }

  if (pathname.startsWith("/services/")) {
    return <ServiceDetailPage path={pathname} />;
  }

  if (pathname === "/blog") {
    return <BlogsArchivePage />;
  }

  if (pathname.startsWith("/blog/")) {
    return <BlogDetailPage path={pathname} />;
  }

  if (pathname === "/portfolio") {
    return <PortfolioArchivePage />;
  }

  return <HomePage />;
}

export default PublicApp;
