import React, { useState, useEffect } from 'react';
import { Play, Clock, BookOpen, ChevronRight } from 'lucide-react';
import VideoPlayer from './VideoPlayer.jsx';
import './CoursePage.css';

const CoursePage = () => {
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://neviton-e-learning-1.onrender.com/api/videos');
      const videosData = await response.json();
      setVideos(videosData);
      
      if (videosData && videosData.length > 0) {
        selectVideo(videosData[0]);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectVideo = async (video) => {
    try {
      console.log(video.id)
      
      const response = await fetch(`https://neviton-e-learning-1.onrender.com/api/videos/${video.id}/stream`);
      const streamData = await response.json();
      
      setCurrentVideo({
        ...video,
        streamUrl: streamData.streamUrl,
        thumbnailUrl: streamData.thumbnailUrl
      });
    } catch (error) {
      console.error('Error fetching video stream:', error);
      setCurrentVideo(video);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="spinner"></div>
          <p>Loading videos...</p>
        </div>
      </div>
    );
  }

  if (!videos.length) {
    return (
      <div className="error-container">
        <div className="error-content">
          <h2>No videos found</h2>
          <p>No videos are available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="course-container">
      <div className="course-header">
        <div className="header-content1">
          <h1>Courses Available</h1>
          {/* <p>Watch and learn from our video collection</p> */}
        </div>
      </div>

      <div className="main-content">
        <div className="content-grid">
          <div className="video-section">
            <div className="video-container">
              {currentVideo ? (
                <div>
                  <VideoPlayer 
                    videoData={currentVideo} 
                    autoPlay={false}
                    controls={true}
                  />
                  
                  <div className="video-info">
                    <h2>{currentVideo.title}</h2>
                    <p className="video-description">{currentVideo.description}</p>
                    
                    <div className="video-meta">
                      <div className="meta-item">
                        <Clock size={16} />
                        <span>{currentVideo.duration}</span>
                      </div>
                      <div className="meta-item">
                        <BookOpen size={16} />
                        <span>
                          {videos.findIndex(v => v.id === currentVideo.id) + 1} of {videos.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="video-placeholder">
                  <div className="placeholder-content">
                    <Play size={48} className="placeholder-icon" />
                    <p>Select a video to start watching</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="playlist-section">
            <div className="playlist-container">
              <div className="playlist-header">
                <h3>Courses Available</h3>
                <p>{videos.length} videos</p>
              </div>
              
              <div className="playlist-videos">
                {videos.map((video, index) => {
                  const isActive = currentVideo?.id === video.id;
                  
                  return (
                    <div
                      key={video.id}
                      className={`video-item ${isActive ? 'active' : ''}`}
                      onClick={() => selectVideo(video)}
                    >
                      <div className="video-item-content">
                        <div className="video-status">
                          <div className={`video-number ${isActive ? 'active' : ''}`}>
                            <span>{index + 1}</span>
                          </div>
                        </div>
                        
                        <div className="video-details">
                          <h4 className={isActive ? 'active-title' : ''}>{video.title}</h4>
                          <p className="video-item-description">{video.description}</p>
                        </div>
                        
                        <ChevronRight size={16} className="chevron-icon" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;