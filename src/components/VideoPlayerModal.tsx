import React, { useState, useEffect } from 'react';
import { VideoModule } from '../types';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize,
  ListOrdered,
  BookOpen,
  CheckCircle,
  Clock,
  Download,
  Share2,
  Sparkles,
  ChevronRight,
  FileText
} from 'lucide-react';

interface VideoPlayerModalProps {
  video: VideoModule | null;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ video, onClose }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(45);
  const totalDurationSec = 6480; // ~1h 48m
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activeSideTab, setActiveSideTab] = useState<'chapters' | 'notes'>('chapters');
  const [completedChapters, setCompletedChapters] = useState<number[]>([0]);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTimeSec(prev => {
          if (prev >= totalDurationSec) {
            setIsPlaying(false);
            return totalDurationSec;
          }
          return prev + Math.floor(playbackSpeed);
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  if (!video) return null;

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.min(100, (currentTimeSec / totalDurationSec) * 100);

  const toggleChapter = (index: number) => {
    if (completedChapters.includes(index)) {
      setCompletedChapters(completedChapters.filter(i => i !== index));
    } else {
      setCompletedChapters([...completedChapters, index]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/50 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative flex flex-col lg:flex-row w-full max-w-6xl h-[92vh] max-h-[860px] bg-white rounded-3xl md:rounded-[32px] border border-slate-100 shadow-[0_25px_70px_rgba(15,23,42,0.18)] overflow-hidden text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Main Video Viewport (70% on desktop) */}
        <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 bg-slate-50/70 relative overflow-hidden">

          {/* Top Bar inside player - Clean Light Header */}
          <div className="flex items-center justify-between z-10 pb-3 border-b border-slate-200/60">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60 shrink-0">
                {video.month} Masterclass
              </span>
              <span className="text-xs font-semibold text-slate-700 truncate">
                {video.topic} · Live Session Recording
              </span>
              <span className="hidden sm:inline-block text-xs text-slate-400">
                · {video.date}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 rounded-full transition-colors shrink-0"
              title="Close Player"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Interactive Simulated Video Stage - Light & Crisp Lecture Hall */}
          <div className="relative my-auto flex flex-col items-center justify-center min-h-[220px] md:min-h-[380px] rounded-2xl overflow-hidden bg-slate-950 text-white shadow-md">
            {/* Ambient Background Gradient for video projection screen */}
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 opacity-95" />

            {/* Subtle glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Video Canvas Details */}
            <div className="relative z-10 w-11/12 max-w-xl p-6 sm:p-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 text-center shadow-xl">
              <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-2 font-sans">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Inspire Accounting Lecture Stream · 1080p FHD</span>
              </div>

              <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white mb-2">
                {video.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed max-w-md mx-auto">
                {video.description}
              </p>

              <div className="mt-2 text-xs font-medium text-emerald-300">
                Faculty: Mrs. Ruwanthi Senanayaka (Lead A/L Accounting)
              </div>

              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex items-center justify-center w-14 h-14 rounded-full bg-white text-slate-950 shadow-xl hover:scale-105 transition-all group"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 fill-slate-950" />
                  ) : (
                    <Play className="w-6 h-6 fill-slate-950 ml-0.5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Clean Light Playback Scrub Bar & Controls (Matching Homepage Language) */}
          <div className="z-10 mt-3 p-3 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
            {/* Progress Scrub Bar */}
            <div
              className="relative w-full h-2 rounded-full bg-slate-100 cursor-pointer overflow-hidden group"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                setCurrentTimeSec(Math.floor(pos * totalDurationSec));
              }}
            >
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-150"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Playback Controls Row */}
            <div className="flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1.5 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-slate-700" />}
                </button>

                <button
                  onClick={() => setCurrentTimeSec(Math.max(0, currentTimeSec - 10))}
                  className="p-1.5 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Rewind 10s"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setCurrentTimeSec(Math.min(totalDurationSec, currentTimeSec + 10))}
                  className="p-1.5 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Forward 10s"
                >
                  <RotateCw className="w-4 h-4" />
                </button>

                <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1.5 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>

                <span className="font-sans font-medium text-[11px] text-slate-500 pl-1">
                  {formatTime(currentTimeSec)} / {formatTime(totalDurationSec)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Speed selector */}
                <div className="flex items-center bg-slate-100 rounded-lg p-0.5 text-[11px] font-sans font-bold">
                  {[1, 1.25, 1.5, 2].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setPlaybackSpeed(spd)}
                      className={`px-2 py-0.5 rounded-md transition-colors ${
                        playbackSpeed === spd
                          ? 'bg-white text-slate-950 shadow-2xs font-extrabold'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>

                <button
                  className="p-1.5 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition-colors hidden sm:block"
                  title="Fullscreen"
                >
                  <Maximize className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Light Themed Chapters & Notes Panel (30% on desktop) */}
        <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-slate-100 flex flex-col bg-white">

          {/* Light Tabs */}
          <div className="flex border-b border-slate-100 p-2 gap-2 bg-slate-50/50">
            <button
              onClick={() => setActiveSideTab('chapters')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                activeSideTab === 'chapters'
                  ? 'bg-white text-slate-950 shadow-2xs border border-slate-200/60'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>Lesson Plan</span>
            </button>

            <button
              onClick={() => setActiveSideTab('notes')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                activeSideTab === 'notes'
                  ? 'bg-white text-slate-950 shadow-2xs border border-slate-200/60'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>LKAS Notes</span>
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {activeSideTab === 'chapters' ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium pb-1">
                  <span>{video.chapters.length} Timestamps</span>
                  <span>{completedChapters.length}/{video.chapters.length} Completed</span>
                </div>

                {video.chapters.map((chap, idx) => {
                  const isDone = completedChapters.includes(idx);
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleChapter(idx)}
                      className={`p-3 rounded-2xl cursor-pointer transition-all flex items-start gap-2.5 text-left border ${
                        isDone
                          ? 'bg-emerald-50/60 border-emerald-200/60 text-slate-900'
                          : 'bg-white hover:bg-slate-50 border-slate-100 text-slate-700'
                      }`}
                    >
                      <div className={`mt-0.5 rounded-full p-0.5 ${isDone ? 'text-emerald-600' : 'text-slate-300'}`}>
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate">
                          {chap.title}
                        </p>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 font-sans mt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>{chap.time}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4 text-left">
                <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-100 text-xs text-blue-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span>LKAS Standard Focus</span>
                  </div>
                  <p className="text-[11px] text-blue-700/90 leading-relaxed">
                    Official accounting standard guidelines relevant to this lecture block.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-900">Key Takeaways</h4>
                  {video.notesSummary.map((note, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed">
                      • {note}
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <a
                    href="#download"
                    onClick={(e) => {
                      e.preventDefault();
                      // Download initiated smoothly
                    }}
                    className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Lecture PDF</span>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Student Support info */}
          <div className="p-3 border-t border-slate-100 bg-slate-50/60 text-center">
            <span className="text-[11px] text-slate-500 font-medium">
              Need academic help? Post question in discussion forum.
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
