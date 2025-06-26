// Hero.jsx
import React from 'react';
import { Play, Star, Users, Award } from 'lucide-react';
import './Hero.css';
import { Link } from 'react-router-dom';
const Hero = () => {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          {/* Left Content */}
          <div className="content-section">
            <div className="text-content">
              <h1 className="hero-title">
                Learn Without
                <span className="title-accent"> Limits</span>
              </h1>
              <p className="hero-description">
                Access thousands of courses from world-class instructors. Build skills that matter for your career and personal growth.
              </p>
            </div>

            <div className="button-group">
              <button className="btn btn-primary">
              <Link to="/course" className="btn btn-primary">
  <span>Explore Courses</span>
</Link>
              </button>
              <button className="btn btn-secondary">
                {/* <Play className="btn-icon" /> */}
                {/* <span>Watch Demo</span> */}
              </button>
            </div>

            {/* Stats */}
            
          </div>

         
          <div className="visual-section">
            <div className="card-container">
              <div className="progress-card">
                <div className="card-header">
                  <Award className="card-icon" />
                  <span className="card-title">Course Progress</span>
                </div>
                <div className="progress-list">
                  <div className="progress-item">
                    <div className="progress-info">
                      <span>React Development</span>
                      <span>85%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill progress-85"></div>
                    </div>
                  </div>
                  <div className="progress-item">
                    <div className="progress-info">
                      <span>UI/UX Design</span>
                      <span>92%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill progress-92"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="floating-element floating-star">
              <Star className="floating-icon" />
            </div>
            <div className="floating-element floating-users">
              <Users className="floating-icon" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;