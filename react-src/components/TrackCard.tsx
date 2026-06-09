import React from 'react';
import { Track } from '../_data/types';

// 트랙별 데코 SVG — 트랙 ID에 따라 분기
function TrackDecoSvg({ trackId }: { trackId: string }) {
  if (trackId === 'A') {
    return (
      <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#ga-clip)">
          <path d="M70 156.8C107.114 156.8 137.2 126.713 137.2 89.5999C137.2 52.4864 107.114 22.3999 70 22.3999C32.8865 22.3999 2.8 52.4864 2.8 89.5999C2.8 126.713 32.8865 156.8 70 156.8Z" fill="url(#ga-grad)" />
          <path d="M97.8998 89.6001C97.8998 71.2002 94.6339 54.6133 89.4145 42.6831C86.8038 36.716 83.7336 31.9813 80.4008 28.7593C77.0753 25.5444 73.5632 23.9 70.0004 23.8999C66.4374 23.8999 62.9246 25.5442 59.599 28.7593C56.2663 31.9813 53.196 36.716 50.5854 42.6831C45.3659 54.6133 42.1 71.2002 42.1 89.6001C42.1 108 45.366 124.586 50.5854 136.516C53.1961 142.483 56.2662 147.219 59.599 150.441C62.9246 153.656 66.4375 155.3 70.0004 155.3C73.5631 155.3 77.0754 153.656 80.4008 150.441C83.7336 147.219 86.8038 142.483 89.4145 136.516C94.6339 124.586 97.8998 108 97.8998 89.6001Z" fill="white" fillOpacity="0.3" />
          <path d="M135.7 89.5996C135.7 86.4784 134.107 83.3484 130.894 80.3408C127.677 77.331 122.942 74.5513 116.965 72.1855C105.02 67.4575 88.4163 64.5 70.0002 64.5C51.5838 64.5 34.9792 67.4574 23.0344 72.1855C17.0577 74.5513 12.322 77.3309 9.10567 80.3408C5.89197 83.3484 4.30014 86.4784 4.3 89.5996C4.3 92.7209 5.89201 95.8508 9.10567 98.8584C12.322 101.868 17.0576 104.649 23.0344 107.015C34.9792 111.743 51.5838 114.7 70.0002 114.7C88.4163 114.7 105.02 111.743 116.965 107.015C122.942 104.649 127.677 101.868 130.894 98.8584C134.108 95.8507 135.7 92.721 135.7 89.5996Z" fill="white" fillOpacity="0.3" />
        </g>
        <defs>
          <linearGradient id="ga-grad" x1="2.8" y1="22.3999" x2="2.8" y2="143.5" gradientUnits="userSpaceOnUse">
            <stop stopColor="white" stopOpacity="0.65" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <clipPath id="ga-clip"><rect width="140" height="140" fill="white" /></clipPath>
        </defs>
      </svg>
    );
  }
  if (trackId === 'B') {
    return (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gb" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity=".70" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x="6" y="38" width="26" height="62" rx="7" fill="url(#gb)" />
        <rect x="38" y="14" width="26" height="86" rx="7" fill="url(#gb)" />
        <rect x="70" y="54" width="26" height="46" rx="7" fill="url(#gb)" />
      </svg>
    );
  }
  if (trackId === 'C') {
    return (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gc" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity=".65" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="32" y1="5" x2="32" y2="14" stroke="white" strokeOpacity=".38" strokeWidth="3" strokeLinecap="round" />
        <line x1="50" y1="3" x2="50" y2="14" stroke="white" strokeOpacity=".28" strokeWidth="3" strokeLinecap="round" />
        <line x1="68" y1="5" x2="68" y2="14" stroke="white" strokeOpacity=".38" strokeWidth="3" strokeLinecap="round" />
        <line x1="32" y1="86" x2="32" y2="95" stroke="white" strokeOpacity=".38" strokeWidth="3" strokeLinecap="round" />
        <line x1="50" y1="86" x2="50" y2="97" stroke="white" strokeOpacity=".28" strokeWidth="3" strokeLinecap="round" />
        <line x1="68" y1="86" x2="68" y2="95" stroke="white" strokeOpacity=".38" strokeWidth="3" strokeLinecap="round" />
        <line x1="5" y1="32" x2="14" y2="32" stroke="white" strokeOpacity=".38" strokeWidth="3" strokeLinecap="round" />
        <line x1="3" y1="50" x2="14" y2="50" stroke="white" strokeOpacity=".28" strokeWidth="3" strokeLinecap="round" />
        <line x1="5" y1="68" x2="14" y2="68" stroke="white" strokeOpacity=".38" strokeWidth="3" strokeLinecap="round" />
        <line x1="86" y1="32" x2="95" y2="32" stroke="white" strokeOpacity=".38" strokeWidth="3" strokeLinecap="round" />
        <line x1="86" y1="50" x2="97" y2="50" stroke="white" strokeOpacity=".28" strokeWidth="3" strokeLinecap="round" />
        <line x1="86" y1="68" x2="95" y2="68" stroke="white" strokeOpacity=".38" strokeWidth="3" strokeLinecap="round" />
        <rect x="14" y="14" width="72" height="72" rx="13" fill="url(#gc)" />
      </svg>
    );
  }
  if (trackId === 'D') {
    return (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gd" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity=".60" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="54" r="44" fill="url(#gd)" />
        <circle cx="50" cy="54" r="28" fill="white" fillOpacity=".26" />
        <circle cx="50" cy="54" r="13" fill="white" fillOpacity=".44" />
      </svg>
    );
  }
  // Track E
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity=".68" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1="50" y1="22" x2="20" y2="76" stroke="white" strokeOpacity=".30" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="22" x2="80" y2="76" stroke="white" strokeOpacity=".30" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="20" y1="76" x2="80" y2="76" stroke="white" strokeOpacity=".24" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="20" cy="76" r="15" fill="url(#ge)" />
      <circle cx="80" cy="76" r="15" fill="url(#ge)" />
      <circle cx="50" cy="22" r="22" fill="url(#ge)" />
    </svg>
  );
}

// 트랙별 아이콘 SVG
function TrackIconSvg({ trackId }: { trackId: string }) {
  if (trackId === 'A') {
    return (
      <svg viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="9.4" />
        <ellipse cx="14" cy="14" rx="4.1" ry="9.4" />
        <line x1="4.8" y1="11" x2="23.2" y2="11" />
        <line x1="4.8" y1="17" x2="23.2" y2="17" />
      </svg>
    );
  }
  if (trackId === 'B') {
    return (
      <svg viewBox="0 0 28 28" fill="none">
        <rect x="4.6" y="4.6" width="8.6" height="8.6" rx="2" />
        <rect x="15.4" y="4.6" width="8" height="5.8" rx="2" />
        <rect x="15.4" y="13" width="8" height="10.4" rx="2" />
        <rect x="4.6" y="15.8" width="8.6" height="7.6" rx="2" />
      </svg>
    );
  }
  if (trackId === 'C') {
    return (
      <svg viewBox="0 0 28 28" fill="none">
        <rect x="8" y="8" width="12" height="12" rx="2.6" />
        <circle cx="14" cy="14" r="2.4" />
        <line x1="11" y1="4.6" x2="11" y2="8" />
        <line x1="17" y1="4.6" x2="17" y2="8" />
        <line x1="11" y1="20" x2="11" y2="23.4" />
        <line x1="17" y1="20" x2="17" y2="23.4" />
        <line x1="4.6" y1="11" x2="8" y2="11" />
        <line x1="4.6" y1="17" x2="8" y2="17" />
        <line x1="20" y1="11" x2="23.4" y2="11" />
        <line x1="20" y1="17" x2="23.4" y2="17" />
      </svg>
    );
  }
  if (trackId === 'D') {
    return (
      <svg viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="9.4" />
        <circle cx="14" cy="14" r="5.2" />
        <circle cx="14" cy="14" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="6.6" r="2.6" />
      <circle cx="6.6" cy="20" r="2.6" />
      <circle cx="21.4" cy="20" r="2.6" />
      <line x1="13.8" y1="9.1" x2="7.7" y2="17.5" />
      <line x1="14.2" y1="9.1" x2="20.3" y2="17.5" />
      <line x1="9.2" y1="20" x2="18.8" y2="20" />
    </svg>
  );
}

interface Props {
  track: Track;
  isOpen?: boolean;
  onClick?: (track: Track) => void;
}

export default function TrackCard({ track, isOpen = false, onClick }: Props) {
  return (
    <div
      className={`tr${isOpen ? ' is-open' : ''}`}
      style={{ '--acc': track.accentColor } as React.CSSProperties}
      onClick={() => onClick?.(track)}
    >
      <span className="tr-short">
        <span className="tr-short-letter">{track.letter}</span>
        <span className="tr-short-name">{track.name}</span>
      </span>
      <div className="tr-content">
        <div className="tr-icon">
          <TrackIconSvg trackId={track.id} />
        </div>
        <div className="tr-tag">Track {track.letter} · {track.name}</div>
        <div className="tr-title">{track.title}</div>
        <div className="tr-desc">{track.description}</div>
        <div className="tr-foot">
          <span>{track.sessionCount} sessions</span>
          <span className="tr-foot-arrow">→</span>
        </div>
      </div>
      <div className="tr-deco" aria-hidden="true">
        <TrackDecoSvg trackId={track.id} />
      </div>
      <div className="tr-bot" />
      <span className="tr-edge" />
    </div>
  );
}
