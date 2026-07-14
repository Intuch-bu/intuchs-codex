import { Link } from "react-router-dom";

function SiteLogo({ className = "text-[28px] font-semibold leading-none" }) {
  return (
    <Link to="/" className={className} aria-label="hh. home">
      hh<span className="text-[#5ad1db]">.</span>
    </Link>
  );
}

export default SiteLogo;
