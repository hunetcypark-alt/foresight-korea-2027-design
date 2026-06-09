import React, { useState } from 'react';
import { PageId } from '../../_data/types';

interface Props {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  onDrawerOpen?: () => void;
}

const NAV_ITEMS: { id: string; label: string; page: PageId }[] = [
  { id: 'home', label: 'Home', page: 'home' },
  { id: 'ceo', label: 'CEO Remarks', page: 'ceo' },
  { id: 'program', label: 'Program & Speakers', page: 'program' },
  { id: 'events', label: 'Events', page: 'events' },
  { id: 'register', label: 'Register', page: 'register' },
  { id: 'faq', label: 'FAQ', page: 'faq' },
];

const ARCHIVE_ITEMS = [
  { year: 2027, label: '2027', url: '/foresight-korea/2027/home', isCurrent: true },
  { year: 2026, label: '2026', url: 'https://ceo.hunet.co.kr/foresight-korea/2026/home' },
  { year: 2025, label: '2025', url: 'https://ceo.hunet.co.kr/foresight-korea/2025/home' },
];

export default function GnbNav({ currentPage, onNavigate, onDrawerOpen }: Props) {
  const [archiveOpen, setArchiveOpen] = useState(false);

  return (
    <>
      <div id="gnb-nav" style={{ backgroundColor: 'rgb(255, 255, 255)' }}>
        {/* 모바일 햄버거 (PC에선 숨김) */}
        <button
          className="gn-hamburger"
          id="gn-hamburger"
          aria-label="메뉴 열기"
          aria-expanded={false}
          onClick={onDrawerOpen}
        >
          <svg viewBox="0 0 22 22" fill="none" aria-hidden="true">
            <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </button>

        <span
          className="gn-title"
          style={{
            fontFamily: "'PT Serif', serif",
            fontWeight: 700,
            color: 'rgb(0,0,0)',
            fontSize: 20,
            letterSpacing: -0.5,
          }}
        >
          FORESIGHT KOREA 2027
        </span>

        <div className="gn-items">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href="#"
              data-page={item.page}
              className={currentPage === item.page ? 'on' : undefined}
              style={{
                color: currentPage === item.page ? 'rgb(223,7,46)' : 'rgb(0,0,0)',
                borderColor: currentPage === item.page ? 'rgb(223,7,46)' : undefined,
                fontSize: 16,
                fontWeight: currentPage === item.page ? 400 : undefined,
              }}
              onClick={(e) => { e.preventDefault(); onNavigate(item.page); }}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Forum Archive 드롭다운 */}
        <div className="gn-archive-wrap">
          <button
            type="button"
            className="gn-archive"
            id="gn-archive-btn"
            aria-haspopup="true"
            aria-expanded={archiveOpen}
            style={{ color: 'rgb(0,0,0)', fontSize: 16, padding: '0px' }}
            onClick={() => setArchiveOpen((prev) => !prev)}
          >
            Forum Archive
            <svg className="gn-archive-chev" viewBox="0 0 14 14" fill="none">
              <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {archiveOpen && (
            <div className="gn-archive-menu" id="gn-archive-menu" role="menu">
              {ARCHIVE_ITEMS.map((item) => (
                <a
                  key={item.year}
                  href={item.url}
                  role="menuitem"
                  className={item.isCurrent ? 'on' : undefined}
                  target={item.isCurrent ? undefined : '_blank'}
                  rel={item.isCurrent ? undefined : 'noreferrer'}
                >
                  {item.label}
                  {item.isCurrent && (
                    <span className="now" style={{ letterSpacing: 0 }}>NOW</span>
                  )}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* 모바일 유저 아이콘 (PC에선 숨김) */}
        <div className="gn-mob-user">
          <svg viewBox="0 0 24 24" fill="none" width="22" height="22" aria-hidden="true">
            <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </>
  );
}
