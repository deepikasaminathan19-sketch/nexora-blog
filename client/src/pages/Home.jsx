
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  TrendingUp,
  BookOpen,
  Layers3
} from 'lucide-react';

import useFetch from '../hooks/useFetch.js';
import BlogCard from '../components/BlogCard.jsx';
import Newsletter from '../components/Newsletter.jsx';
import { useSEO } from '../utils/seo.js';

export default function Home() {
  useSEO({
    title: 'Technology Insights, AI & Software Development',
    description:
      'Explore practical insights in artificial intelligence, machine learning, software development, cloud computing and cybersecurity.'
  });

  const feat = useFetch('/blogs?featured=1&limit=3');
  const latest = useFetch('/blogs?limit=6');
  const cats = useFetch('/categories');

  const featured = feat.data?.items || [];
  const lead = featured[0];
  const supporting = featured.slice(1);
  const categories = cats.data || [];

  return (
    <main className="nexora-home">

      {/* HERO */}
      <section className="nx-hero">
        <div className="wrap nx-hero-inner">

          <div className="nx-hero-copy">
            <div className="nx-eyebrow">
              <span className="nx-eyebrow-dot" />
              <Sparkles size={15} />
              IDEAS. TECHNOLOGY. POSSIBILITY.
            </div>

            <h1>
              The future is
              <span className="nx-gradient-text"> being built.</span>
              <br />
              Understand it.
            </h1>

            <p className="nx-hero-description">
              Discover ideas, practical knowledge and fresh perspectives
              across the technologies shaping tomorrow.
            </p>

            <div className="nx-hero-actions">
              <Link to="/blogs" className="nx-primary-btn">
                Explore stories <ArrowUpRight size={18} />
              </Link>

              <Link to="/categories" className="nx-secondary-btn">
                Discover topics <ArrowRight size={17} />
              </Link>
            </div>

            <div className="nx-hero-note">
              <span><BookOpen size={15} /> Practical knowledge</span>
              <span><Layers3 size={15} /> Multiple tech domains</span>
            </div>
          </div>

          <div className="nx-hero-visual">
            <div className="nx-visual-orbit nx-orbit-one" />
            <div className="nx-visual-orbit nx-orbit-two" />

            <div className="nx-visual-core">
              <span className="nx-core-x">X</span>
              <span className="nx-core-name">NEXORA</span>
              <span className="nx-core-tagline">
                EXPLORE. LEARN. INNOVATE.
              </span>
            </div>

            <div className="nx-floating-label nx-label-top">
              <Sparkles size={15} /> Explore new ideas
            </div>

            <div className="nx-floating-label nx-label-bottom">
              <TrendingUp size={15} /> Stay ahead
            </div>
          </div>

        </div>

        <div className="nx-hero-bottom">
          <div className="wrap nx-hero-bottom-inner">
            <span>CURIOUS MINDS START HERE</span>
            <span>ARTIFICIAL INTELLIGENCE</span>
            <span>SOFTWARE & DEVELOPMENT</span>
            <span>EMERGING TECHNOLOGY</span>
          </div>
        </div>
      </section>

      {/* FEATURED STORIES */}
      <section className="wrap nx-section nx-featured">
        <div className="nx-section-heading">
          <div>
            <span className="nx-kicker">HANDPICKED FOR YOU</span>
            <h2>Stories worth your time.</h2>
            <p>Fresh perspectives on the technology that matters.</p>
          </div>

          <Link to="/blogs" className="nx-text-link">
            Explore all stories <ArrowUpRight size={17} />
          </Link>
        </div>

        {feat.loading && (
          <p className="state">Discovering featured stories…</p>
        )}

        {feat.error && (
          <p className="state err">{feat.error}</p>
        )}

        {!feat.loading && !feat.error && featured.length === 0 && (
          <p className="state">New featured stories are coming soon.</p>
        )}

        {lead && (
          <div className="nx-feature-layout">

            <Link
              to={`/blog/${lead.slug}`}
              className="nx-feature-main"
            >
              <div className="nx-feature-image">
                <img
                  src={lead.image}
                  alt={lead.imageAlt || lead.title}
                  loading="lazy"
                />
                <span className="nx-image-label">
                  EDITOR'S PICK
                </span>
                <span className="nx-image-arrow">
                  <ArrowUpRight size={22} />
                </span>
              </div>

              <div className="nx-feature-content">
                <span className="nx-category-label">
                  {lead.category?.name}
                </span>

                <h3>{lead.title}</h3>

                <p>{lead.excerpt}</p>

                <div className="nx-feature-meta">
                  <span>{lead.author?.name}</span>
                  <span>{lead.readingTime} min read</span>
                </div>
              </div>
            </Link>

            <div className="nx-feature-side">
              {supporting.map((blog, index) => (
                <Link
                  to={`/blog/${blog.slug}`}
                  className="nx-side-story"
                  key={blog._id}
                >
                  <div className="nx-side-number">
                    0{index + 1}
                  </div>

                  <div className="nx-side-content">
                    <span className="nx-category-label">
                      {blog.category?.name}
                    </span>

                    <h3>{blog.title}</h3>

                    <span className="nx-side-read">
                      Read story <ArrowUpRight size={14} />
                    </span>
                  </div>
                </Link>
              ))}

              <Link to="/blogs" className="nx-all-stories">
                <span>There is more to discover.</span>
                <ArrowRight size={19} />
              </Link>
            </div>

          </div>
        )}
      </section>

      {/* CATEGORIES */}
      <section className="nx-topics-section">
        <div className="wrap nx-section">
          <div className="nx-section-heading">
            <div>
              <span className="nx-kicker">EXPLORE YOUR INTERESTS</span>
              <h2>Technology, from every angle.</h2>
              <p>Find the topics that inspire your curiosity.</p>
            </div>

            <Link to="/categories" className="nx-text-link">
              All categories <ArrowUpRight size={17} />
            </Link>
          </div>

          {cats.loading && (
            <p className="state">Loading topics…</p>
          )}

          {cats.error && (
            <p className="state err">{cats.error}</p>
          )}

          <div className="nx-topic-grid">
            {categories.map((category, index) => (
              <Link
                to={`/category/${category.slug}`}
                className={`nx-topic-card nx-topic-${index % 4}`}
                key={category._id}
              >
                <span className="nx-topic-index">
                  0{index + 1}
                </span>

                <span className="nx-topic-name">
                  {category.name}
                </span>

                <span className="nx-topic-count">
                  {category.count} articles
                </span>

                <span className="nx-topic-arrow">
                  <ArrowUpRight size={19} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST ARTICLES */}
      <section className="wrap nx-section nx-latest">
        <div className="nx-section-heading">
          <div>
            <span className="nx-kicker">THE LATEST</span>
            <h2>Ideas moving forward.</h2>
            <p>Explore the latest stories from across NEXORA.</p>
          </div>

          <Link to="/blogs" className="nx-text-link">
            View all articles <ArrowUpRight size={17} />
          </Link>
        </div>

        {latest.loading && (
          <p className="state">Loading latest articles…</p>
        )}

        {latest.error && (
          <p className="state err">{latest.error}</p>
        )}

        <div className="grid nx-latest-grid">
          {latest.data?.items.map(blog => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      </section>

      {/* CLOSING BANNER */}
      <section className="wrap nx-closing">
        <div className="nx-closing-inner">
          <div>
            <span className="nx-kicker">KEEP EXPLORING</span>
            <h2>Stay curious. Keep moving forward.</h2>
            <p>
              Every great idea begins with a question.
              Find your next one at NEXORA.
            </p>
          </div>

          <Link to="/blogs" className="nx-closing-btn">
            Start exploring <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>

      <Newsletter />

    </main>
  );
}
