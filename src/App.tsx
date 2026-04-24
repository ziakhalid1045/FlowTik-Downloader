/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Download, Link2, RefreshCw, Play, Loader2, Music, Copy, Check, AlertCircle, Github, Info, HelpCircle, Puzzle, X, Shield, FileText, Mail, MessageSquare } from 'lucide-react';

type Page = 'home' | 'privacy' | 'terms' | 'contact' | 'about' | 'disclaimer';
import { motion, AnimatePresence } from 'motion/react';

// Interfaces for API response
interface TikwmResponse {
  code: number;
  msg: string;
  data?: {
    title: string;
    cover: string;
    play: string;
    music: string;
    author: {
      nickname: string;
      unique_id: string;
      avatar: string;
    };
    digg_count: number;
    share_count: number;
    duration: number;
  };
}

interface ToastInfo {
  id: number;
  message: string;
  type: 'error' | 'success';
}

export default function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoData, setVideoData] = useState<TikwmResponse['data'] | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [showCookieNotice, setShowCookieNotice] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setTimeout(() => setShowCookieNotice(true), 2000);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'true');
    setShowCookieNotice(false);
  };

  const showToast = (message: string, type: 'error' | 'success' = 'error') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    if (!url.includes('tiktok.com')) {
      showToast('Please enter a valid TikTok video URL.', 'error');
      return;
    }

    setLoading(true);
    setVideoData(null);

    try {
      // Simulate slight delay for the UI skeleton to show (optional, feels premium)
      await new Promise(r => setTimeout(r, 600));

      const response = await fetch(`https://tikwm.com/api/?url=${encodeURIComponent(url)}`);
      const data: TikwmResponse = await response.json();

      if (data.code === 0 && data.data) {
        setVideoData(data.data);
      } else {
        showToast(data.msg || 'Failed to fetch video. Please check the URL and try again.', 'error');
      }
    } catch (err) {
      showToast('Network error. Failed to connect to the provided service.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setUrl('');
    setVideoData(null);
  };

  const handleCopyLink = async () => {
    if (videoData?.play) {
      try {
        await navigator.clipboard.writeText(videoData.play);
        setCopiedLink(true);
        showToast('Direct video link copied to clipboard!', 'success');
        setTimeout(() => setCopiedLink(false), 2000);
      } catch (err) {
        showToast('Failed to copy link to clipboard.', 'error');
      }
    }
  };

  const handleDownload = async (mediaUrl: string, filename: string) => {
    try {
      showToast('Starting download...', 'success');
      // Fetch as a blob to force download
      const response = await fetch(mediaUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      // Fallback: open link directly
      window.open(mediaUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const formatNumber = (num: number | undefined) => {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatDuration = (seconds: number | undefined) => {
    if (!seconds) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-200 flex flex-col font-sans selection:bg-cyan-500/30 overflow-x-hidden relative">
      
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
         <motion.div 
           animate={{ 
             scale: [1, 1.2, 1],
             opacity: [0.3, 0.2, 0.3],
             rotate: [0, 90, 0]
           }}
           transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
           className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-cyan-500/10 blur-[120px] rounded-full"
         />
         <motion.div 
           animate={{ 
             scale: [1, 1.5, 1],
             opacity: [0.1, 0.2, 0.1],
             x: [0, 100, 0]
           }}
           transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
           className="absolute top-1/2 -left-1/4 w-[600px] h-[600px] bg-rose-500/10 blur-[120px] rounded-full"
         />
      </div>

      {/* Cookie Notice */}
      <AnimatePresence>
        {showCookieNotice && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-4 left-4 right-4 md:left-8 md:right-auto md:max-w-md z-[110]"
          >
            <div className="bg-[#0B0E14]/90 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl flex flex-col gap-4">
              <div className="flex items-center gap-3 text-cyan-400">
                <Info className="w-5 h-5" />
                <h4 className="font-bold">Cookie Notice</h4>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                FlowTik uses cookies to improve your experience and show personalized ads. By using our site, you agree to our Privacy Policy.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={acceptCookies}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                >
                  Accept
                </button>
                <button 
                  onClick={() => setCurrentPage('privacy')}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white text-sm font-bold py-2 rounded-lg transition-colors border border-white/5"
                >
                  Learn More
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="fixed top-20 right-4 md:right-8 z-[100] flex flex-col gap-3">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, x: 20 }}
              className={`flex items-center gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-md min-w-[280px] max-w-sm ${
                toast.type === 'error' 
                  ? 'bg-red-950/80 border-red-500/20 text-red-100' 
                  : 'bg-emerald-950/80 border-emerald-500/20 text-emerald-100'
              }`}
            >
              {toast.type === 'error' ? (
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              ) : (
                <Check className="w-5 h-5 text-emerald-400 shrink-0" />
              )}
              <p className="text-sm font-medium flex-1">{toast.message}</p>
              <button 
                onClick={() => removeToast(toast.id)}
                className="text-white/50 hover:text-white transition-colors p-1"
              >
                 <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Header */}
      <header className="border-b border-white/5 bg-[#0B0E14]/60 backdrop-blur-xl sticky top-0 z-50 transition-all">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div 
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-gradient-to-tr from-[#FE2C55] to-[#25F4EE] rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20 transition-transform group-hover:scale-105">
              <Play className="w-5 h-5 text-white fill-current ml-0.5" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">Flow<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#25F4EE] to-[#FE2C55]">Tik</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <button onClick={() => setCurrentPage('home')} className={`hover:text-white transition-colors flex items-center gap-2 ${currentPage === 'home' ? 'text-white' : ''}`}>
              <Info className="w-4 h-4" /> Home
            </button>
            <button onClick={() => setCurrentPage('about')} className={`hover:text-white transition-colors flex items-center gap-2 ${currentPage === 'about' ? 'text-white' : ''}`}>
              <HelpCircle className="w-4 h-4" /> About
            </button>
            <button onClick={() => setCurrentPage('contact')} className={`hover:text-white transition-colors flex items-center gap-2 ${currentPage === 'contact' ? 'text-white' : ''}`}>
              <Mail className="w-4 h-4" /> Contact
            </button>
          </div>

          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2.5 rounded-full"
            title="View on GitHub"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </header>

      {/* Main Content Area */}
      {currentPage === 'home' ? (
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-8 py-12 md:py-24 flex flex-col items-center relative z-10">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12 w-full max-w-3xl"
        >
          <div className="inline-block mb-4 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-bold tracking-wide uppercase">
            ⚡ 100% Free & Unlimited
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-[1.1]">
            Download TikTok Videos HD <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">without watermark</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-xl mx-auto">
            The fastest way to save TikTok videos in HD quality. Paste your link below and get your video instantly.
          </p>
        </motion.div>

        {/* Input Form */}
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          onSubmit={handleFetch}
          className="relative w-full max-w-3xl flex flex-col md:flex-row items-center p-2.5 md:p-2 bg-slate-900/60 border border-white/10 rounded-2xl md:rounded-full shadow-2xl backdrop-blur-xl z-10 gap-3 md:gap-0 transition-shadow focus-within:shadow-cyan-500/10 focus-within:border-white/20"
        >
          <div className="relative flex-1 w-full pl-5 pr-4 flex items-center md:border-b-0 pb-2 md:pb-0 h-14">
            <Link2 className="h-6 w-6 text-slate-500 shrink-0" />
            <input
              type="url"
              className="w-full h-full bg-transparent border-none text-white focus:ring-0 text-base md:text-lg px-4 outline-none placeholder:text-slate-500"
              placeholder="Paste TikTok video link here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
              required
            />
            {url && (
              <button
                type="button"
                onClick={() => setUrl('')}
                className="text-slate-500 hover:text-white transition-colors p-2 shrink-0 bg-white/5 hover:bg-white/10 rounded-full"
                aria-label="Clear input"
              >
                 <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || !url.trim()}
            className="w-full md:w-auto h-14 bg-gradient-to-r from-[#FE2C55] to-[#ff5d7d] hover:brightness-110 disabled:opacity-75 disabled:hover:brightness-100 text-white font-bold px-8 rounded-xl md:rounded-full shadow-lg shadow-rose-500/20 transition-all flex items-center justify-center gap-2 shrink-0"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Fetching...</span>
              </>
            ) : (
              <>
                <span>Download</span>
                <Download className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </motion.form>

        {/* Loading Skeleton */}
        <AnimatePresence mode="wait">
          {loading && !videoData && (
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="mt-12 w-full max-w-4xl bg-slate-900/40 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl relative z-10"
             >
               <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                 <div className="md:col-span-4 aspect-[9/16] bg-slate-800/50 animate-pulse rounded-2xl"></div>
                 <div className="md:col-span-8 py-2">
                   <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-slate-800/50 animate-pulse"></div>
                      <div className="space-y-2">
                         <div className="h-5 w-32 bg-slate-800/50 rounded animate-pulse"></div>
                         <div className="h-4 w-24 bg-slate-800/50 rounded animate-pulse"></div>
                      </div>
                   </div>
                   <div className="space-y-3 mb-8">
                      <div className="h-4 w-full bg-slate-800/50 rounded animate-pulse"></div>
                      <div className="h-4 w-5/6 bg-slate-800/50 rounded animate-pulse"></div>
                      <div className="h-4 w-3/4 bg-slate-800/50 rounded animate-pulse"></div>
                   </div>
                   <div className="space-y-3 mt-12">
                      <div className="h-14 w-full bg-slate-800/50 rounded-xl animate-pulse"></div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="h-12 w-full bg-slate-800/50 rounded-xl animate-pulse"></div>
                        <div className="h-12 w-full bg-slate-800/50 rounded-xl animate-pulse"></div>
                        <div className="h-12 w-full bg-slate-800/50 rounded-xl animate-pulse"></div>
                      </div>
                   </div>
                 </div>
               </div>
             </motion.div>
          )}

          {/* Results */}
          {videoData && !loading && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mt-12 w-full max-w-4xl bg-slate-900/60 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl shadow-cyan-900/10 relative z-10"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Video Preview */}
                <div className="md:col-span-4 shrink-0 flex flex-col gap-4">
                  <div className="relative group rounded-2xl overflow-hidden bg-black aspect-[9/16] shadow-2xl ring-1 ring-white/10">
                    <img 
                      src={videoData.cover} 
                      alt={videoData.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-xl group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 text-white fill-current ml-1" />
                      </div>
                    </div>
                    {videoData.duration > 0 && (
                      <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-2 py-1 rounded-md text-[11px] font-bold text-white uppercase tracking-wider">
                        {formatDuration(videoData.duration)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Video Info & Actions */}
                <div className="md:col-span-8 flex flex-col justify-between py-1">
                  <div className="space-y-5">
                    <div className="flex items-center gap-4">
                       <div className="relative">
                         <img 
                           src={videoData.author.avatar} 
                           alt={videoData.author.nickname} 
                           className="w-14 h-14 rounded-full border-2 border-cyan-400 bg-slate-800 object-cover relative z-10"
                         />
                         <div className="absolute inset-0 rounded-full bg-cyan-400 blur-md opacity-30"></div>
                       </div>
                       <div className="flex-1 min-w-0">
                         <h3 className="text-xl font-bold text-white leading-tight truncate">{videoData.author.nickname}</h3>
                         <p className="text-sm text-cyan-400 truncate font-medium">@{videoData.author.unique_id}</p>
                       </div>
                    </div>

                    <p className="text-slate-300 text-lg line-clamp-3 leading-relaxed">
                      {videoData.title || 'No description provided.'}
                    </p>

                    {/* Stats */}
                    <div className="flex gap-6 py-2 border-y border-white/5">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-0.5">Likes</span>
                        <span className="text-lg font-mono text-white font-semibold">{formatNumber(videoData.digg_count)}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-0.5">Shares</span>
                        <span className="text-lg font-mono text-white font-semibold">{formatNumber(videoData.share_count)}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-0.5">Resolution</span>
                        <span className="text-lg font-mono text-cyan-400 font-semibold">HD+</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mt-8">
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleDownload(videoData.play, `${videoData.author.unique_id}_video.mp4`)}
                      className="w-full flex items-center justify-center gap-2 bg-white text-slate-900 font-bold py-4 px-6 rounded-xl shadow-lg shadow-white/10 hover:shadow-white/20 transition-all border border-transparent"
                    >
                      <Download className="w-6 h-6" />
                      <span className="text-lg">Download (No Watermark)</span>
                    </motion.button>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <motion.button
                         whileHover={{ scale: 1.02 }}
                         whileTap={{ scale: 0.98 }}
                        onClick={handleCopyLink}
                        className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-xl transition-colors border border-white/5 w-full shadow-md"
                      >
                        {copiedLink ? (
                           <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                           <Copy className="w-4 h-4 text-cyan-400" />
                        )}
                        <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleDownload(videoData.music, `${videoData.author.unique_id}_audio.mp3`)}
                        className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-xl transition-colors border border-white/5 w-full shadow-md"
                      >
                        <Music className="w-4 h-4 text-rose-400" />
                        <span>Save Audio</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={reset}
                        className="flex items-center justify-center gap-2 bg-[#FE2C55]/10 hover:bg-[#FE2C55]/20 text-[#FE2C55] font-medium py-3 rounded-xl transition-colors border border-[#FE2C55]/20 w-full shadow-md"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>Convert New</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SEO Content Section */}
        {!videoData && !loading && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full max-w-5xl mt-24 mb-6 text-slate-300"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-10 text-center tracking-tight">Best Free TikTok Downloader <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">To Save Videos No Watermark</span></h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              <article className="bg-[#0B0E14]/60 border border-white/5 p-8 rounded-3xl backdrop-blur-sm shadow-xl shadow-cyan-900/5 hover:border-white/10 transition-colors">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6">
                  <Check className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">No Watermark</h3>
                <p className="text-sm text-slate-400 leading-relaxed">FlowTik allows you to download TikTok videos in original HD quality without any watermarks. Our tool ensures a clean, professional result every time you save a video.</p>
              </article>
              <article className="bg-[#0B0E14]/60 border border-white/5 p-8 rounded-3xl backdrop-blur-sm shadow-xl shadow-cyan-900/5 hover:border-white/10 transition-colors">
                <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-6">
                  <Play className="w-6 h-6 text-cyan-400 ml-1" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Unlimited & Fast</h3>
                <p className="text-sm text-slate-400 leading-relaxed">Save as many videos as you want with no daily limits. FlowTik processes links instantly, offering high-speed downloads for both MP4 and MP3 files.</p>
              </article>
              <article className="bg-[#0B0E14]/60 border border-white/5 p-8 rounded-3xl backdrop-blur-sm shadow-xl shadow-cyan-900/5 hover:border-white/10 transition-colors">
                <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center mb-6">
                  <Shield className="w-6 h-6 text-rose-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Safe & Anonymous</h3>
                <p className="text-sm text-slate-400 leading-relaxed">We respect your privacy. No registration or login is required. You can download videos anonymously and securely on any device or browser.</p>
              </article>
            </div>

            <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-8 md:p-12 shadow-inner mb-16">
              <h2 className="text-3xl font-bold text-white mb-10 text-center tracking-tight">How to Download TikTok Videos with FlowTik</h2>
              <div className="grid md:grid-cols-3 gap-8 relative">
                <div className="hidden md:block absolute top-6 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                
                <div className="relative z-10 flex flex-col items-center text-center">
                   <div className="w-12 h-12 rounded-full bg-[#0B0E14] border-2 border-cyan-500/50 text-cyan-400 flex items-center justify-center font-bold text-xl mb-6 shadow-[0_0_15px_rgba(34,211,238,0.2)]">1</div>
                   <h3 className="text-lg font-bold text-white mb-3">Step 1: Copy Link</h3>
                   <p className="text-sm text-slate-400 leading-relaxed px-2">Launch the TikTok app or visit the website. Find the video you love, click on the "Share" icon, and select "Copy Link".</p>
                </div>
                <div className="relative z-10 flex flex-col items-center text-center">
                   <div className="w-12 h-12 rounded-full bg-[#0B0E14] border-2 border-blue-500/50 text-blue-400 flex items-center justify-center font-bold text-xl mb-6 shadow-[0_0_15px_rgba(59,130,246,0.2)]">2</div>
                   <h3 className="text-lg font-bold text-white mb-3">Step 2: Paste URL</h3>
                   <p className="text-sm text-slate-400 leading-relaxed px-2">Head back to FlowTik.xyz and paste the link into the search bar. Click the download button to start processing.</p>
                </div>
                <div className="relative z-10 flex flex-col items-center text-center">
                   <div className="w-12 h-12 rounded-full bg-[#0B0E14] border-2 border-rose-500/50 text-rose-400 flex items-center justify-center font-bold text-xl mb-6 shadow-[0_0_15px_rgba(244,63,94,0.2)]">3</div>
                   <h3 className="text-lg font-bold text-white mb-3">Step 3: Save HD</h3>
                   <p className="text-sm text-slate-400 leading-relaxed px-2">Your video is ready! Select 'No Watermark' to download the HD video or choosing 'Audio' to save only the sound.</p>
                </div>
              </div>
            </div>

            <div className="space-y-16 py-12">
              <section>
                <h2 className="text-3xl font-bold text-white mb-6 border-l-4 border-cyan-400 pl-4">Download TikTok Videos HD Online</h2>
                <p className="mb-4 leading-relaxed">Are you searching for the most efficient <strong>TikTok video downloader without watermark</strong>? FlowTik is a premium, free web service designed to fetch and download your favorite TikTok content in superior High Definition quality. Our sophisticated algorithms bypass the standard watermark overlay, providing you with a clean version of any video found on the platform.</p>
                <p className="leading-relaxed">Whether you are a content creator looking to repurpose your videos, a student saving educational clips, or simply someone who enjoys offline viewing, FlowTik offers the ultimate solution. Our service is refined for speed, ensuring you spend less time waiting and more time enjoying your downloaded media.</p>
              </section>

              <section>
                <h3 className="text-2xl font-bold text-white mb-6">Why Choose FlowTik.xyz?</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-cyan-400">High Definition Quality</h4>
                    <p className="text-sm text-slate-400">Unlike other basic tools, we don't compress your videos. You get the highest resolution available on TikTok servers.</p>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-cyan-400">Full MP3 Support</h4>
                    <p className="text-sm text-slate-400">Want to save a trending sound? FlowTik extracts audio perfectly, allowing you to download TikTok as MP3 instantly.</p>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-cyan-400">No Installation Needed</h4>
                    <p className="text-sm text-slate-400">Everything happens in your browser. No shady APKs or slow browser extensions are required to use our software.</p>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-cyan-400">Compatible with All Devices</h4>
                    <p className="text-sm text-slate-400">From the latest iPhone to older Android tablets and desktop PCs, FlowTik works flawlessly across the entire digital ecosystem.</p>
                  </div>
                </div>
              </section>

              <section className="bg-white/5 rounded-3xl p-8 border border-white/5">
                <h3 className="text-2xl font-bold text-white mb-8 text-center">Frequently Asked Questions (FAQ)</h3>
                <div className="space-y-6">
                  <details className="group border-b border-white/10 pb-4 cursor-pointer">
                    <summary className="font-bold flex justify-between items-center list-none">
                      Is FlowTik.xyz free to use?
                      <span className="group-open:rotate-180 transition-transform"><X className="w-4 h-4 rotate-45" /></span>
                    </summary>
                    <p className="mt-4 text-slate-400 text-sm">Yes, FlowTik is 100% free. We don't charge any subscription or usage fees. Our service is supported by minimal ads to keep the servers running.</p>
                  </details>
                  <details className="group border-b border-white/10 pb-4 cursor-pointer">
                    <summary className="font-bold flex justify-between items-center list-none">
                      Can I download TikTok videos on iPhone/iOS?
                      <span className="group-open:rotate-180 transition-transform"><X className="w-4 h-4 rotate-45" /></span>
                    </summary>
                    <p className="mt-4 text-slate-400 text-sm">Yes. However, due to Apple's security policy, iOS 13+ users need to use the Safari browser or a file manager app to save files directly to their camera roll.</p>
                  </details>
                  <details className="group border-b border-white/10 pb-4 cursor-pointer">
                    <summary className="font-bold flex justify-between items-center list-none">
                      Do you store my downloaded videos?
                      <span className="group-open:rotate-180 transition-transform"><X className="w-4 h-4 rotate-45" /></span>
                    </summary>
                    <p className="mt-4 text-slate-400 text-sm">No. We do not store or host any videos on our servers. All downloads are fetched directly from TikTok CDN servers for maximum privacy.</p>
                  </details>
                  <details className="group border-b border-white/10 pb-4 cursor-pointer">
                    <summary className="font-bold flex justify-between items-center list-none">
                      How to save TikTok as MP3?
                      <span className="group-open:rotate-180 transition-transform"><X className="w-4 h-4 rotate-45" /></span>
                    </summary>
                    <p className="mt-4 text-slate-400 text-sm">Paste your link, wait for the result, and click the "Save Audio" button. Our system will extract the sound file automatically.</p>
                  </details>
                </div>
              </section>
            </div>
          </motion.section>
        )}
      </main>
      ) : (
        <main className="flex-1 w-full max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/60 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-xl shadow-2xl"
          >
            {currentPage === 'privacy' && (
              <div className="prose prose-invert max-w-none">
                <h1 className="text-3xl font-bold mb-8 flex items-center gap-3"><Shield className="text-cyan-400" /> Privacy Policy</h1>
                <p className="text-slate-400 mb-6">Last Updated: April 24, 2026</p>
                <div className="space-y-6 text-slate-300">
                  <p>At FlowTik, accessible from FlowTik.xyz, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by FlowTik and how we use it.</p>
                  <h2 className="text-xl font-bold text-white mt-8">Log Files</h2>
                  <p>FlowTik follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.</p>
                  <h2 className="text-xl font-bold text-white mt-8">Google DoubleClick DART Cookie</h2>
                  <p>Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to FlowTik.xyz and other sites on the internet.</p>
                  <h2 className="text-xl font-bold text-white mt-8">Third Party Privacy Policies</h2>
                  <p>FlowTik's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information.</p>
                </div>
                <button onClick={() => setCurrentPage('home')} className="mt-12 bg-white/5 hover:bg-white/10 text-white font-bold py-3 px-8 rounded-xl transition-all border border-white/5">Back to Home</button>
              </div>
            )}
            {currentPage === 'terms' && (
              <div className="prose prose-invert max-w-none">
                <h1 className="text-3xl font-bold mb-8 flex items-center gap-3"><FileText className="text-cyan-400" /> Terms of Service</h1>
                <p className="text-slate-400 mb-6">Last Updated: April 24, 2026</p>
                <div className="space-y-6 text-slate-300">
                  <p>By accessing FlowTik.xyz, you agree to comply with and be bound by the following terms and conditions of use.</p>
                  <h2 className="text-xl font-bold text-white mt-8">1. License and Access</h2>
                  <p>You may use our service for personal, non-commercial purposes only. You must not use this tool to infringe upon the intellectual property rights of others. We do not host any content; we only provide a mechanism to fetch content from third-party servers.</p>
                  <h2 className="text-xl font-bold text-white mt-8">2. Prohibited Uses</h2>
                  <p>You are prohibited from using the site or its content: (a) for any unlawful purpose; (b) to solicit others to perform or participate in any unlawful acts; (c) to violate any international or national regulations, rules, or laws.</p>
                  <h2 className="text-xl font-bold text-white mt-8">3. Disclaimer</h2>
                  <p>The materials on FlowTik.xyz are provided on an 'as is' basis. FlowTik makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability.</p>
                </div>
                <button onClick={() => setCurrentPage('home')} className="mt-12 bg-white/5 hover:bg-white/10 text-white font-bold py-3 px-8 rounded-xl transition-all border border-white/5">Back to Home</button>
              </div>
            )}
            {currentPage === 'about' && (
              <div className="prose prose-invert max-w-none text-center">
                <div className="w-20 h-20 bg-gradient-to-tr from-[#FE2C55] to-[#25F4EE] rounded-2xl flex items-center justify-center shadow-2xl mx-auto mb-8">
                   <Play className="w-10 h-10 text-white fill-current ml-1" />
                </div>
                <h1 className="text-4xl font-bold mb-6">About FlowTik</h1>
                <div className="space-y-6 text-slate-300 max-w-2xl mx-auto">
                  <p className="text-lg">FlowTik is a leading independent media utility designed to help users enjoy their favorite digital content more freely.</p>
                  <p>Born from a need for simplicity and speed, FlowTik was developed to provide a seamless bridge between online entertainment and offline enjoyment. We believe that technology should be accessible to everyone, which is why we've built a platform that requires zero technical knowledge to use.</p>
                  <p>Our team is dedicated to maintaining the most stable and fastest TikTok downloader on the web. We continuously update our systems to ensure compatibility with the latest platform changes.</p>
                </div>
                <button onClick={() => setCurrentPage('home')} className="mt-12 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-12 rounded-xl transition-all">Start Downloading</button>
              </div>
            )}
            {currentPage === 'contact' && (
              <div className="prose prose-invert max-w-none">
                <h1 className="text-3xl font-bold mb-8 flex items-center gap-3"><Mail className="text-cyan-400" /> Contact Us</h1>
                <p className="text-slate-400 mb-8">Have questions, feedback, or need help? We'd love to hear from you. Please reach out through any of the channels below.</p>
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                  <div className="bg-white/5 p-8 rounded-2xl border border-white/5">
                    <h3 className="text-xl font-bold text-white mb-4">Email Support</h3>
                    <p className="text-slate-400 mb-6">For technical issues or partnerships, email our support team directly.</p>
                    <a href="mailto:support@flowtik.xyz" className="text-cyan-400 font-bold hover:underline">support@flowtik.xyz</a>
                  </div>
                  <div className="bg-white/5 p-8 rounded-2xl border border-white/5">
                    <h3 className="text-xl font-bold text-white mb-4">General Inquiries</h3>
                    <p className="text-slate-400 mb-6">For general feedback or to just say hello!</p>
                    <p className="text-white font-bold">contact@flowtik.xyz</p>
                  </div>
                </div>
                <div className="bg-cyan-900/10 border border-cyan-500/20 p-8 rounded-2xl">
                  <p className="text-slate-300 italic text-sm">Response time: We typically respond to all inquiries within 24-48 business hours.</p>
                </div>
                <button onClick={() => setCurrentPage('home')} className="mt-12 bg-white/5 hover:bg-white/10 text-white font-bold py-3 px-8 rounded-xl transition-all border border-white/5">Back to Home</button>
              </div>
            )}
            {currentPage === 'disclaimer' && (
                <div className="prose prose-invert max-w-none">
                  <h1 className="text-3xl font-bold mb-8 flex items-center gap-3"><AlertCircle className="text-rose-400" /> Disclaimer</h1>
                  <div className="space-y-6 text-slate-300">
                    <p>The information and tools provided by FlowTik.xyz are for educational and personal use only. FlowTik does not host any content on its servers; it merely acts as a technical intermediary that facilitates the download of publicly available content from TikTok's servers.</p>
                    <p>Users are solely responsible for ensuring that their use of downloaded content complies with the terms of service of the original platform and applicable copyright laws. FlowTik is not affiliated with, authorized, maintained, sponsored, or endorsed by TikTok or any of its affiliates or subsidiaries.</p>
                    <p>By using this website, you acknowledge that you are responsible for any potential copyright infringement if you use downloaded content for commercial purposes without the original creator's permission.</p>
                  </div>
                  <button onClick={() => setCurrentPage('home')} className="mt-12 bg-white/5 hover:bg-white/10 text-white font-bold py-3 px-8 rounded-xl transition-all border border-white/5">Back to Home</button>
                </div>
            )}
          </motion.div>
        </main>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-white/5 bg-[#080B10] py-12 relative z-10">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
            <div className="flex flex-col gap-3 items-start">
              <div 
                onClick={() => setCurrentPage('home')}
                className="flex items-center gap-2 text-white font-bold text-2xl cursor-pointer"
              >
                Flow<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#25F4EE] to-[#FE2C55]">Tik</span>
              </div>
              <p className="text-slate-500 text-sm max-w-xs leading-relaxed">Fast, free, and secure TikTok downloader. Save videos in HD without watermarks effortlessly.</p>
            </div>
            
            <div className="flex flex-wrap gap-x-12 gap-y-6 text-sm">
              <div className="flex flex-col gap-4">
                <h4 className="font-bold text-white uppercase tracking-widest text-xs">Platform</h4>
                <button onClick={() => setCurrentPage('home')} className="text-slate-400 hover:text-white transition-colors text-left">Downloader</button>
                <button onClick={() => setCurrentPage('about')} className="text-slate-400 hover:text-white transition-colors text-left">About Us</button>
              </div>
              <div className="flex flex-col gap-4">
                <h4 className="font-bold text-white uppercase tracking-widest text-xs">Legal</h4>
                <button onClick={() => setCurrentPage('privacy')} className="text-slate-400 hover:text-white transition-colors text-left">Privacy Policy</button>
                <button onClick={() => setCurrentPage('terms')} className="text-slate-400 hover:text-white transition-colors text-left">Terms of Service</button>
                <button onClick={() => setCurrentPage('disclaimer')} className="text-slate-400 hover:text-white transition-colors text-left">Disclaimer</button>
              </div>
              <div className="flex flex-col gap-4">
                <h4 className="font-bold text-white uppercase tracking-widest text-xs">Help</h4>
                <button onClick={() => setCurrentPage('contact')} className="text-slate-400 hover:text-white transition-colors text-left">Contact Us</button>
                <button onClick={() => setCurrentPage('home')} className="text-slate-400 hover:text-white transition-colors text-left">FAQ</button>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-white/5">
            <p className="text-slate-500 text-xs text-center md:text-left">© 2026 FlowTik.xyz. All rights reserved. Not affiliated with TikTok Inc.</p>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2 text-xs text-slate-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                 <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span> API Status: Operational
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

