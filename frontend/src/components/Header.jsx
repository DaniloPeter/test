import { Link } from "react-router-dom";

function Header() {
  return (
    <header>
      <nav>
        <Link to="/">TESTAR</Link>
        <Link to="/profile">
          <div className="profile-header"></div>
        </Link>
      </nav>
    </header>
  );
}

export default Header;
