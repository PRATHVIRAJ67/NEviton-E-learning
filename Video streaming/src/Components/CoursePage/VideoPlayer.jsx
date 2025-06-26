import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipForward, SkipBack, Settings, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import './VideoPlayer.css'

const VideoPlayer = ({ videoData, onVideoEnd, autoPlay  }) => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [error, setError] = useState(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsView, setSettingsView] = useState('main'); // 'main', 'speed', 'quality'
  const [qualities, setQualities] = useState([]);
  const [currentQuality, setCurrentQuality] = useState(-1);

  const playbackRates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

 
  useEffect(() => {
    const loadHlsJs = async () => {
      if (!window.Hls) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
        script.onload = () => initializeVideo();
        script.onerror = () => setError('Failed to load video player');
        document.head.appendChild(script);
      } else {
        initializeVideo();
      }
    };

    const initializeVideo = () => {
      const video = videoRef.current;
      if (!video || !videoData?.streamUrl) return;

     
      setError(null);
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);

      
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }

      if (window.Hls && window.Hls.isSupported()) {
       
        const hls = new window.Hls();
        hlsRef.current = hls;

        hls.loadSource(videoData.streamUrl);
        hls.attachMedia(video);

        hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
          console.log('HLS manifest loaded successfully');
          
         
          const levels = hls.levels.map((level, index) => ({
            index,
            height: level.height,
            width: level.width,
            bitrate: level.bitrate,
            name: `${level.height}p`
          }));
          setQualities(levels);
          setCurrentQuality(-1); 
          
         
          if (autoPlay) {
            video.play().catch(() => {
              console.log('Auto-play failed - user interaction required');
            });
          }
        });

        hls.on(window.Hls.Events.ERROR, (event, data) => {
          console.error('HLS error:', data);
          if (data.fatal) {
            setError('Failed to load video stream');
          }
        });

      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = videoData.streamUrl;
        
        if (autoPlay) {
          video.play().catch(() => {
            console.log('Auto-play failed - user interaction required');
          });
        }
      } else {
        setError('HLS is not supported in this browser');
      }
    };

    if (videoData?.streamUrl) {
      loadHlsJs();
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [videoData?.streamUrl, autoPlay]);

  
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleDurationChange = () => setDuration(video.duration || 0);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      onVideoEnd?.(); 
    };
    const handleError = () => setError('Video playback error');

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleDurationChange);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleDurationChange);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
    };
  }, [onVideoEnd]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(() => setError('Playback failed'));
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    const video = videoRef.current;
    if (!video) return;
    
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleProgressClick = (e) => {
    const video = videoRef.current;
    if (!video || !duration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    
    video.currentTime = newTime;
  };

  const skipForward = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.min(video.currentTime + 10, duration);
  };

  const skipBackward = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(video.currentTime - 10, 0);
  };

  const changePlaybackRate = (rate) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSettings(false);
    setSettingsView('main');
  };

  const changeQuality = (qualityIndex) => {
    if (!hlsRef.current) return;
    hlsRef.current.currentLevel = qualityIndex;
    setCurrentQuality(qualityIndex);
    setShowSettings(false);
    setSettingsView('main');
  };

  const toggleFullscreen = () => {
    const container = videoRef.current?.parentElement;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen().catch(console.error);
    }
  };

  const handleSettingsClick = () => {
    setShowSettings(!showSettings);
    setSettingsView('main');
  };

  const formatTime = (time) => {
    if (!time || !isFinite(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getCurrentQualityName = () => {
    if (currentQuality === -1) return 'Auto';
    const quality = qualities.find(q => q.index === currentQuality);
    return quality ? quality.name : 'Auto';
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  const renderSettingsMenu = () => {
    if (settingsView === 'main') {
      return (
        <div className="settings-menu">
          <div className="settings-section">
            <button
              className="settings-menu-item"
              onClick={() => setSettingsView('speed')}
            >
              <span> speed</span>
              <div className="settings-menu-item-right">
                <span className="settings-current-value">{playbackRate === 1 ? 'Normal' : `${playbackRate}x`}</span>
                <ChevronRight size={16} />
              </div>
            </button>
            
            {qualities.length > 0 && (
              <button
                className="settings-menu-item"
                onClick={() => setSettingsView('quality')}
              >
                <span>Quality</span>
                <div className="settings-menu-item-right">
                  <span className="settings-current-value">{getCurrentQualityName()}</span>
                  <ChevronRight size={16} />
                </div>
              </button>
            )}
          </div>
        </div>
      );
    }

    if (settingsView === 'speed') {
      return (
        <div className="settings-menu">
          <div className="settings-header">
            <button
              className="settings-back-button"
              onClick={() => setSettingsView('main')}
            >
              <ChevronLeft size={16} />
            </button>
            <span className="settings-title">Playback speed</span>
          </div>
          <div className="settings-section">
            {playbackRates.map((rate) => (
              <button
                key={rate}
                className={`settings-menu-item ${playbackRate === rate ? 'active' : ''}`}
                onClick={() => changePlaybackRate(rate)}
              >
                <span>{rate === 1 ? 'Normal' : `${rate}x`}</span>
                {playbackRate === rate && (
                  <Check size={16} className="settings-check-icon" />
                )}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (settingsView === 'quality') {
      return (
        <div className="settings-menu">
          <div className="settings-header">
            <button
              className="settings-back-button"
              onClick={() => setSettingsView('main')}
            >
              <ChevronLeft size={16} />
            </button>
            <span className="settings-title">Quality</span>
          </div>
          <div className="settings-section">
            <button
              className={`settings-menu-item ${currentQuality === -1 ? 'active' : ''}`}
              onClick={() => changeQuality(-1)}
            >
              <span>Auto</span>
              {currentQuality === -1 && (
                <Check size={16} className="settings-check-icon" />
              )}
            </button>
            {qualities.map((quality) => (
              <button
                key={quality.index}
                className={`settings-menu-item ${currentQuality === quality.index ? 'active' : ''}`}
                onClick={() => changeQuality(quality.index)}
              >
                <span>{quality.name}</span>
                {currentQuality === quality.index && (
                  <Check size={16} className="settings-check-icon" />
                )}
              </button>
            ))}
          </div>
        </div>
      );
    }
  };

  return (
    <div 
      className="video-player-container"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="video-element"
        onClick={togglePlay}
        playsInline
      />

      {error && (
        <div className="overlay-base error-overlay">
          <div className="error-content">
            <p>{error}</p>
            <button 
              className="retry-button"
              onClick={() => setError(null)}
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Controls */}
      <div 
        className="controls-overlay"
        style={{
          opacity: showControls ? 1 : 0,
          pointerEvents: showControls ? 'auto' : 'none'
        }}
      >
        {/* Progress Bar */}
        <div
          className="progress-bar"
          onClick={handleProgressClick}
        >
          <div
            className="progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Control buttons */}
        <div className="controls-container">
          <div className="control-group">
            <button
              className="control-button"
              onClick={skipBackward}
            >
              <SkipBack size={20} />
            </button>

            <button
              className="control-button"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause size={28} /> : <Play size={28} />}
            </button>

            <button
              className="control-button"
              onClick={skipForward}
            >
              <SkipForward size={20} />
            </button>

            <div className="volume-group">
              <button
                className="control-button"
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              
              <input
                type="range"
                className="volume-slider"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
              />
            </div>

            <div className="time-display">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="control-group">
            <div className="settings-container">
              <button
                className="control-button"
                onClick={handleSettingsClick}
              >
                <Settings size={20} />
              </button>
              
              {showSettings && renderSettingsMenu()}
            </div>

            <button
              className="control-button"
              onClick={toggleFullscreen}
            >
              <Maximize size={20} />
            </button>
          </div>
       </div>
      </div>
    </div>
  );
};

export default VideoPlayer;