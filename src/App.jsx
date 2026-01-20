import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music, Heart, Repeat, Shuffle, X, Minus, Pin, PinOff } from 'lucide-react';

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTrack, setCurrentTrack] = useState({
    title: 'Connect to SoundCloud',
    artist: 'No track playing',
    artwork: null,
    duration: 180
  });
  const [isLiked, setIsLiked] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [scConnected, setScConnected] = useState(false);
  const [isPinned, setIsPinned] = useState(true);
  const progressInterval = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + (100 / currentTrack.duration);
        });
      }, 1000);
    } else {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    }
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isPlaying, currentTrack.duration]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);
  const toggleLike = () => setIsLiked(!isLiked);
  const toggleRepeat = () => setIsRepeat(!isRepeat);
  const toggleShuffle = () => setIsShuffle(!isShuffle);

  const handleVolumeChange = (e) => {
    setVolume(parseInt(e.target.value));
    if (isMuted) setIsMuted(false);
  };

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setProgress(percentage);
  };

  const connectSoundCloud = () => {
    setScConnected(true);
    setCurrentTrack({
      title: 'Summer Vibes Mix',
      artist: 'DJ Example',
      artwork: 'https://via.placeholder.com/80/ff5500/ffffff?text=SC',
      duration: 240
    });
  };

  const handleMinimize = () => {
    if (window.electron) {
      window.electron.minimizeWindow();
    }
  };

  const handleClose = () => {
    if (window.electron) {
      window.electron.closeWindow();
    }
  };

  const togglePin = () => {
    const newPinState = !isPinned;
    setIsPinned(newPinState);
    if (window.electron) {
      window.electron.setAlwaysOnTop(newPinState);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentTime = (progress / 100) * currentTrack.duration;
  const remainingTime = currentTrack.duration - currentTime;

  return (
    <div className="w-96 bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl shadow-2xl p-4 font-sans relative">
      {/* Window Controls */}
      <div className="absolute top-2 right-2 flex gap-1 no-drag z-10">
        <button
          onClick={togglePin}
          className="p-1.5 hover:bg-white/20 rounded-full transition text-white"
          title={isPinned ? "Unpin window" : "Pin window on top"}
        >
          {isPinned ? <Pin size={14} /> : <PinOff size={14} />}
        </button>
        <button
          onClick={handleMinimize}
          className="p-1.5 hover:bg-white/20 rounded-full transition text-white"
          title="Minimize"
        >
          <Minus size={14} />
        </button>
        <button
          onClick={handleClose}
          className="p-1.5 hover:bg-red-500 rounded-full transition text-white"
          title="Close"
        >
          <X size={14} />
        </button>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4 mt-2">
        <div className="flex items-center gap-2">
          <Music className="text-white" size={24} />
          <span className="text-white font-bold text-lg">SoundCloud</span>
        </div>
        {!scConnected ? (
          <button
            onClick={connectSoundCloud}
            className="bg-white text-orange-600 px-3 py-1 rounded-full text-sm font-semibold hover:bg-orange-100 transition no-drag"
          >
            Connect
          </button>
        ) : (
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        )}
      </div>

      {/* Artwork */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-orange-800 rounded-lg flex items-center justify-center overflow-hidden">
            {currentTrack.artwork ? (
              <img src={currentTrack.artwork} alt="artwork" className="w-full h-full object-cover" />
            ) : (
              <Music className="text-orange-300" size={32} />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold text-lg truncate">{currentTrack.title}</h3>
            <p className="text-orange-200 text-sm truncate">{currentTrack.artist}</p>
          </div>
          <button
            onClick={toggleLike}
            className="p-2 hover:bg-white/10 rounded-full transition no-drag"
          >
            <Heart
              className={isLiked ? 'text-red-400 fill-red-400' : 'text-white'}
              size={20}
            />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div
          onClick={handleProgressClick}
          className="h-2 bg-white/20 rounded-full cursor-pointer relative overflow-hidden no-drag"
        >
          <div
            className="h-full bg-white rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-orange-200 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>-{formatTime(remainingTime)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <button
          onClick={toggleShuffle}
          className={`p-2 rounded-full transition no-drag ${
            isShuffle ? 'bg-white/20 text-white' : 'text-orange-200 hover:bg-white/10'
          }`}
        >
          <Shuffle size={18} />
        </button>
        
        <button className="p-2 text-white hover:bg-white/10 rounded-full transition no-drag">
          <SkipBack size={24} />
        </button>
        
        <button
          onClick={togglePlay}
          className="bg-white text-orange-600 p-4 rounded-full hover:scale-110 transition shadow-lg no-drag"
        >
          {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
        </button>
        
        <button className="p-2 text-white hover:bg-white/10 rounded-full transition no-drag">
          <SkipForward size={24} />
        </button>
        
        <button
          onClick={toggleRepeat}
          className={`p-2 rounded-full transition no-drag ${
            isRepeat ? 'bg-white/20 text-white' : 'text-orange-200 hover:bg-white/10'
          }`}
        >
          <Repeat size={18} />
        </button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-3 bg-white/10 rounded-lg p-3">
        <button onClick={toggleMute} className="text-white hover:bg-white/10 p-1 rounded transition no-drag">
          {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <input
          type="range"
          min="0"
          max="100"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="flex-1 h-2 bg-white/20 rounded-full appearance-none cursor-pointer no-drag"
          style={{
            background: `linear-gradient(to right, white ${isMuted ? 0 : volume}%, rgba(255,255,255,0.2) ${isMuted ? 0 : volume}%)`
          }}
        />
        <span className="text-white text-sm w-8 text-right">{isMuted ? 0 : volume}</span>
      </div>

      {/* Instructions */}
      {!scConnected && (
        <div className="mt-4 text-xs text-orange-200 text-center bg-white/10 p-2 rounded-lg">
          Click Connect to link your SoundCloud account
        </div>
      )}
    </div>
  );
}