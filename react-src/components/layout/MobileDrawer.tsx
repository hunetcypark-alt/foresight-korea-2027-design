import React from 'react';
import { PageId } from '../../_data/types';

interface Props {
  isOpen: boolean;
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  onClose: () => void;
}

const NAV_ITEMS: { label: string; page: PageId }[] = [
  { label: 'Home', page: 'home' },
  { label: 'CEO Remarks', page: 'ceo' },
  { label: 'Program & Speakers', page: 'program' },
  { label: 'Events', page: 'events' },
  { label: 'Register', page: 'register' },
  { label: 'FAQ', page: 'faq' },
];

const ARCHIVE_ITEMS = [
  { year: 2027, label: '2027', url: '#', isCurrent: true },
  { year: 2026, label: '2026', url: 'https://ceo.hunet.co.kr/foresight-korea/2026/home' },
  { year: 2025, label: '2025', url: 'https://ceo.hunet.co.kr/foresight-korea/2025/home' },
];

export default function MobileDrawer({ isOpen, currentPage, onNavigate, onClose }: Props) {
  return (
    <>
      {/* 오버레이 */}
      <div
        className="mob-overlay"
        id="mob-overlay"
        aria-hidden={!isOpen}
        style={{ display: isOpen ? undefined : 'none' }}
        onClick={onClose}
      />

      {/* 드로어 */}
      <div
        className={`mob-drawer${isOpen ? ' is-open' : ''}`}
        id="mob-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="내비게이션"
      >
        <div className="mob-drawer-head">
          <span className="mob-drawer-title">FORESIGHT KOREA 2027</span>
          <button
            className="mob-drawer-close"
            id="mob-drawer-close"
            aria-label="메뉴 닫기"
            onClick={onClose}
          >
            <svg viewBox="0 0 20 20" fill="none" width="18" height="18">
              <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav className="mob-drawer-nav">
          <div className="mob-drawer-label">포럼 메뉴</div>
          {NAV_ITEMS.map((item) => (
            <a
              key={item.page}
              href="#"
              data-page={item.page}
              className={currentPage === item.page ? 'on' : undefined}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(item.page);
                onClose();
              }}
            >
              {item.label}
            </a>
          ))}

          <div className="mob-drawer-divider" />
          <div className="mob-drawer-label">Forum Archive</div>

          {ARCHIVE_ITEMS.map((item) => (
            <a
              key={item.year}
              href={item.url}
              target={item.isCurrent ? undefined : '_blank'}
              rel={item.isCurrent ? undefined : 'noreferrer'}
              onClick={item.isCurrent ? (e) => e.preventDefault() : undefined}
              style={item.isCurrent ? { opacity: 0.55, cursor: 'default' } : undefined}
            >
              {item.label}
              {item.isCurrent && (
                <span style={{
                  fontSize: 11,
                  background: 'rgba(223,7,46,.15)',
                  color: 'var(--hunet-red)',
                  padding: '1px 6px',
                  borderRadius: 4,
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                }}>NOW</span>
              )}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
