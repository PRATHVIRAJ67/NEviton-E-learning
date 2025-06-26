// Header.jsx
import { Search, Bell, User, Menu } from "lucide-react";
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <div className="logo-section">
            <div className="logo">
              Neviton E-Learning
            </div> 
          </div>
          
          {/* Navigation - Hidden on mobile */}
          <nav className="navigation">
            <a href="#" className="nav-link">Courses</a>
            <a href="#" className="nav-link">About</a>
            <a href="#" className="nav-link">Contact</a>
          </nav>
          
          {/* Search Bar */}
          <div className="search-container">
            <div className="search-wrapper">
              <Search className="search-icon" />
              <input 
                type="text"
                placeholder="Search courses..." 
                className="search-input"
              />
            </div>
          </div>
          
          {/* Right Actions */}
          <div className="actions">
            <button className="btn btn-ghost btn-desktop">
              <Bell className="icon" />
              <span className="notification-badge">3</span>
            </button>
            <button className="btn btn-ghost btn-desktop">
              <User className="icon" />
            </button>
            <button className="btn btn-ghost btn-mobile">
              <Menu className="icon" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;