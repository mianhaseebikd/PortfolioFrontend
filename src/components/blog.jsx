import { useEffect, useRef, useState } from "react";
import TimelineHeading from "./heading.jsx";
import { Blogs } from "../content/blogs.js";

const CalendarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const BlogCard = ({ blog, index }) => {
  const cardRef = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShow(true);
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    if (cardRef.current) observer.observe(cardRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <a
      href={blog.link || "#"}
      className={`blog-card-link${show ? " blog-card-show" : ""}`}
      ref={cardRef}
      style={{ transitionDelay: `${index * 0.12}s` }}
      aria-label={`Read article: ${blog.title}`}
    >
      <article className="blog-card">
        <div className="blog-img-wrap">
          <img src={blog.image} alt={blog.title} className="blog-img" />
        </div>

        <div className="blog-content">
          <div className="blog-date">
            <CalendarIcon />
            <span>{blog.date}</span>
          </div>

          <h3 className="blog-title">{blog.title}</h3>
        </div>
      </article>
    </a>
  );
};

const Blog = () => {
  return (
    <div className="blog-wrapper" id="blog">
      <TimelineHeading
        title="Blog"
        subtitle="Our Recent Blogs"
        accentWord="Blogs"
        description="Thoughts, tips and insights on web development, design and freelancing."
      />
      <div className="row80 blog-row">
        {Blogs.map((blog, i) => (
          <BlogCard key={blog.id} blog={blog} index={i} />
        ))}
      </div>
    </div>
  );
};

export default Blog;
