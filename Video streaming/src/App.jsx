import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Hero from './Components/Hero';
import Header from './Components/Header';
import CoursePage from './Components/CoursePage/CoursePage';
import FeaturedCourses from './Components/FeaturedCourse';

function App() {
  return (
    <Router>
  

      <Routes>
        <Route
          path="/"
          element={
            <>
                <Header />
              <Hero />
              <FeaturedCourses />
            </>
          }
        />
        <Route path="/course" element={<CoursePage />} />
      </Routes>
    </Router>
  );
}

export default App;
