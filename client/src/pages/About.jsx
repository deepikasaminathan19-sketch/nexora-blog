
import useFetch from '../hooks/useFetch.js';
import { useSEO } from '../utils/seo.js';

export default function About() {
  useSEO({
    title: 'About NEXORA',
    description:
      'Discover NEXORA, a technology blog platform designed to make technology easier to explore, understand, and learn.'
  });

  const { data } = useFetch('/authors');

  return (
    <div className="wrap sec narrow">
      <h1>About NEXORA</h1>

      <p className="lead">
        Explore. Learn. Innovate.
      </p>

      <p>
        NEXORA is a technology blog platform created to make learning about
        technology simple, engaging, and accessible. We bring together
        informative articles and insights across different areas of technology.
      </p>

      <h2>Our Mission</h2>
      <p>
        Our mission is to make technology knowledge easier to understand
        through clear explanations, useful information, and an enjoyable
        reading experience.
      </p>

      <h2>What We Offer</h2>
      <p>
        Discover technology articles, explore topics by category, learn
        from different authors, and stay informed about the latest ideas
        in the technology world.
      </p>

      <h2>Our Authors</h2>
      {data?.map((a) => (
        <div key={a._id} className="author">
          <img src={a.avatar} alt={a.name} />
          <div>
            <b>{a.name}</b>
            <p>{a.bio}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
