import React, { useState } from 'react';
import { Speaker } from '../_data/types';
import { TRACK_COLOR_MAP } from '../_data/tracks';

interface Props {
  speaker: Speaker | null;
  onClose: () => void;
}

type Tab = 'speaker' | 'session';

export default function SessionModal({ speaker, onClose }: Props) {
  const [tab, setTab] = useState<Tab>('speaker');

  if (!speaker) return null;

  const accentColor = TRACK_COLOR_MAP[speaker.trackId] ?? '#5a8dff';

  return (
    <div id="sess-overlay" className="sess-overlay" onClick={onClose}>
      <div className="sess-modal" onClick={(e) => e.stopPropagation()}>
        {/* 상단 트랙 레이블 + 닫기 버튼 */}
        <div className="sess-top" id="sess-top" style={{ '--acc': accentColor } as React.CSSProperties}>
          <span className="sess-track-label">
            TRACK {speaker.trackId} · {speaker.id}
          </span>
          <button className="sess-close-btn" onClick={onClose} aria-label="닫기">
            <svg viewBox="0 0 20 20" fill="none" width="20" height="20">
              <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="sess-body">
          <div className="sess-info">
            <p className="sess-title">{speaker.title}</p>
            <div className="sess-tags">
              <span>{speaker.id}</span>
            </div>
            <div className="sess-profile">
              <div className="sess-photo-wrap">
                {speaker.photoUrl ? (
                  <img src={speaker.photoUrl} alt={speaker.name ?? ''} className="sess-photo-img" />
                ) : (
                  <img src="assets/img/man.svg" alt="" className="sess-photo-img" />
                )}
              </div>
              <div className="sess-name-wrap">
                {speaker.organization && <p className="sess-org">{speaker.organization}</p>}
                <p className="sess-name">{speaker.isTbd ? 'TBD' : speaker.name}</p>
              </div>
            </div>
          </div>

          {/* 탭 바 */}
          <div className="sess-tabs">
            <button
              className={`sess-tab${tab === 'speaker' ? ' active' : ''}`}
              onClick={() => setTab('speaker')}
            >
              연사소개
            </button>
            <button
              className={`sess-tab${tab === 'session' ? ' active' : ''}`}
              onClick={() => setTab('session')}
            >
              세션소개
            </button>
          </div>

          {/* 연사소개 탭 */}
          {tab === 'speaker' && (
            <div className="sess-panel">
              <p className="sess-desc">
                {speaker.speakerBio ?? '연사 소개가 준비 중입니다.'}
              </p>
            </div>
          )}

          {/* 세션소개 탭 */}
          {tab === 'session' && (
            <div className="sess-panel">
              <p className="sess-desc">
                {speaker.sessionDesc ?? '세션 소개가 준비 중입니다.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
