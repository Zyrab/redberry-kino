import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Badge from "../../components/ui/badge";
import Button from "../../components/ui/button";
import "../../styles/slider.css";

const INTERVAL = 6000;

export default function Slider({ featured = [], loading }) {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const count = featured.length;

  useEffect(() => {
    if (count < 2) return;
    const id = setTimeout(() => setIndex((i) => (i + 1) % count), INTERVAL);
    return () => clearTimeout(id);
  }, [index, count]);

  if (loading) return <section className="slider slider-loading" />;
  if (!count) return null;

  const prev = () => setIndex((i) => (i - 1 + count) % count);
  const next = () => setIndex((i) => (i + 1) % count);

  return (
    <section className="slider" style={{ "--slider-interval": `${INTERVAL}ms` }}>
      {featured.map(({ id, title, backdropUrl, ageRating, runtimeMinutes, formats, genres, synopsis }, i) => (
        <article key={id} className={`slider-slide ${i === index ? "is-active" : ""}`} aria-hidden={i !== index}>
          <img className="slider-image" src={backdropUrl} alt="" />

          <div className="slider-content">
            <p className="slider-genres text-overline">{genres.map((g) => g.name).join(" · ")}</p>
            <h2 className="text-display">{title}</h2>
            <div className="slider-info">
              <Badge variant="red" label={ageRating?.code} />
              <Badge leftIcon="timer" label={runtimeMinutes + " min"} />
              {formats.map(({ id, name }) => (
                <Badge key={id} label={name} />
              ))}
            </div>
            <p className="slider-description text-body-m">{synopsis}</p>
            <div className="slider-actions">
              <Button leftIcon="ticket" onClick={() => navigate(`/movies/${id}`)}>
                Buy Tickets
              </Button>
              <Button variant="transparent" onClick={() => navigate(`/movies/${id}`)}>
                All sessions
              </Button>
            </div>
          </div>
        </article>
      ))}

      <div className="slider-controls">
        <div className="slider-progress">
          {featured.map(({ title, id }, i) => (
            <button
              key={id}
              type="button"
              aria-label={`Show ${title}`}
              className={`slider-bar ${i < index ? "is-done" : ""} ${i === index ? "is-active" : ""}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
        <div className="slider-arrows">
          <Button variant="ghost" leftIcon="arrowLeft" className="slider-arrow" onClick={prev} aria-label="Previous"></Button>
          <Button variant="ghost" leftIcon="arrowRight" className="slider-arrow" onClick={next} aria-label="Next"></Button>
        </div>
      </div>
    </section>
  );
}
