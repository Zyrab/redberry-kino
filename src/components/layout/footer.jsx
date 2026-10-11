import "../../styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <p className="footer-logo text-label-m">
        KINO <span>XII</span>
      </p>
      <p className="footer-copy text-body-s">© {new Date().getFullYear()} Kino XII. All rights reserved.</p>
    </footer>
  );
}
