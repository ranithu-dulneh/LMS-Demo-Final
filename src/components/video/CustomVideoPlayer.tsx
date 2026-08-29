import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings, AlertCircle } from 'lucide-react';

interface CustomVideoPlayerProps {
  url: string;
}

const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({ url }) => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [hasError, setHasError] = useState(false);

  const playerRef = useRef<any>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sanitize URL: react-player requires full URLs (http/https) to detect YouTube correctly
  let sanitizedUrl = url || '';
  if (sanitizedUrl && !sanitizedUrl.startsWith('http')) {
    sanitizedUrl = `https://${sanitizedUrl}`;
  }

  // Handle Double Tap Seeking
  const [lastTap, setLastTap] = useState<{ time: number; side: 'left' | 'right' | null }>({ time: 0, side: null });

  const handlePlayerTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const currentTime = new Date().getTime();
    const tapGap = currentTime - lastTap.time;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const side = x < rect.width / 2 ? 'left' : 'right';

    if (tapGap < 300 && tapGap > 0 && lastTap.side === side) {
      // Double tap detected
      handleSeekRelative(side === 'left' ? -10 : 10);
      setLastTap({ time: 0, side: null }); // Reset
    } else {
      // Single tap
      setLastTap({ time: currentTime, side });
      toggleControls();
    }
  };

  const toggleControls = () => {
    setShowControls(prev => !prev);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);

    if (!showControls) {
      controlsTimeoutRef.current = setTimeout(() => {
        if (playing) setShowControls(false);
      }, 3000);
    }
  };

  const handleSeekRelative = (seconds: number) => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      playerRef.current.seekTo(currentTime + seconds, 'seconds');
    }
  };

  const handleProgress = (state: { played: number, playedSeconds: number }) => {
    if (!hasError) setPlayed(state.played);
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPlayed = parseFloat(e.target.value);
    setPlayed(newPlayed);
    if (playerRef.current) {
      playerRef.current.seekTo(newPlayed);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerContainerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds === 0) return '00:00';
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  // Create a component that TypeScript won't complain about
  const PlayerComponent = ReactPlayer as any;

  if (!sanitizedUrl) {
    return (
      <div className="w-full aspect-video bg-gray-900 rounded-2xl flex flex-col items-center justify-center text-gray-500">
        <AlertCircle size={48} className="mb-4 opacity-50" />
        <p>No video URL provided for this lesson.</p>
      </div>
    );
  }

  return (
    <div
      ref={playerContainerRef}
      className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden group font-sans select-none"
      onMouseMove={() => {
        setShowControls(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = setTimeout(() => {
          if (playing) setShowControls(false);
        }, 3000);
      }}
      onMouseLeave={() => {
        if (playing) setShowControls(false);
      }}
    >
      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-gray-900 z-50">
           <AlertCircle size={48} className="mb-4 text-red-500" />
           <p className="font-bold">Unable to load video</p>
           <p className="text-sm text-gray-400 mt-2">The provided link might be invalid or restricted.</p>
           <p className="text-xs text-gray-500 mt-1 break-all max-w-[80%] text-center">{sanitizedUrl}</p>
        </div>
      ) : (
        <>
          {/* Video Player */}
          <PlayerComponent
            ref={playerRef}
            url={sanitizedUrl}
            width="100%"
            height="100%"
            playing={playing}
            volume={volume}
            muted={muted}
            playbackRate={playbackRate}
            onProgress={handleProgress}
            onDuration={setDuration}
            onError={(e: any) => {
              console.error("ReactPlayer Error:", e);
              setHasError(true);
              setPlaying(false);
            }}
            config={{
              youtube: {
                playerVars: {
                  controls: 0,
                  disablekb: 1,
                  modestbranding: 1,
                  rel: 0,
                  showinfo: 0,
                  iv_load_policy: 3,
                  fs: 0,
                  origin: window.location.origin
                }
              }
            }}
            style={{ pointerEvents: 'none' }} // Prevent standard YT interactions
          />

          {/* Tap/Click Overlay for interaction */}
          <div
            className="absolute inset-0 z-10 cursor-pointer"
            onClick={handlePlayerTap}
          ></div>

          {/* Center Play/Pause Overlay (Shows briefly on tap) */}
          <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 z-20 ${showControls && !playing ? 'opacity-100' : 'opacity-0'}`}>
            <button
              className="bg-blue-600/90 text-white rounded-full p-6 shadow-2xl backdrop-blur-sm pointer-events-auto hover:bg-blue-600 transform hover:scale-105 transition-all"
              onClick={(e) => { e.stopPropagation(); setPlaying(!playing); }}
            >
              {playing ? <Pause size={48} fill="currentColor" /> : <Play size={48} fill="currentColor" className="ml-2" />}
            </button>
          </div>

          {/* Controls Bar */}
          <div
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-16 px-4 pb-4 z-30 transition-opacity duration-300 ${
              showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Timeline */}
            <div className="flex items-center gap-3 mb-4 group/timeline cursor-pointer">
              <span className="text-white text-xs font-medium w-10 text-right">
                {formatTime(duration * played)}
              </span>
              <div className="relative flex-1 h-1.5 bg-white/30 rounded-full overflow-hidden group-hover/timeline:h-2 transition-all">
                <div
                  className="absolute top-0 left-0 bottom-0 bg-blue-500 rounded-full"
                  style={{ width: `${played * 100}%` }}
                ></div>
                <input
                  type="range"
                  min={0} max={1} step="any"
                  value={played}
                  onChange={handleSeekChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <span className="text-white/70 text-xs font-medium w-10">
                {formatTime(duration)}
              </span>
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setPlaying(!playing)}
                  className="text-white hover:text-blue-400 transition-colors focus:outline-none"
                >
                  {playing ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                </button>

                <div className="flex items-center gap-2 group/volume relative">
                  <button onClick={() => setMuted(!muted)} className="text-white hover:text-blue-400 transition-colors">
                    {muted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                  <div className="w-0 overflow-hidden group-hover/volume:w-20 transition-all duration-300 flex items-center">
                    <input
                      type="range" min={0} max={1} step="any"
                      value={muted ? 0 : volume}
                      onChange={(e) => {
                        setVolume(parseFloat(e.target.value));
                        if (muted) setMuted(false);
                      }}
                      className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <button
                    onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                    className="text-white hover:text-blue-400 flex items-center gap-1 text-sm font-medium"
                  >
                    <Settings size={20} /> {playbackRate}x
                  </button>
                  {showSpeedMenu && (
                    <div className="absolute bottom-full right-0 mb-2 bg-black/90 backdrop-blur-sm rounded-lg py-2 flex flex-col min-w-[100px] border border-white/10">
                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                        <button
                          key={rate}
                          onClick={() => { setPlaybackRate(rate); setShowSpeedMenu(false); }}
                          className={`px-4 py-1.5 text-sm text-left hover:bg-white/10 transition-colors ${playbackRate === rate ? 'text-blue-400 font-bold' : 'text-white'}`}
                        >
                          {rate === 1 ? 'Normal' : `${rate}x`}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button onClick={toggleFullscreen} className="text-white hover:text-blue-400 transition-colors">
                  {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CustomVideoPlayer;
