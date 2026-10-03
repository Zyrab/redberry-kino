import { Link } from "react-router";
import "../../styles/home.css";

export default function SectionHeader({ title, to }) {
  return (
    <div className="home-section-header">
      <h2 className="text-h1">{title}</h2>
      {to && (
        <Link to={to} className="home-section-link text-label-m">
          See all
        </Link>
      )}
    </div>
  );
}
