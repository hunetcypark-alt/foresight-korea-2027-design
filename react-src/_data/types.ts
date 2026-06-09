// ─── 공통 열거형 ─────────────────────────────────────────────────────────────

export type TrackId = 'A' | 'B' | 'C' | 'D' | 'E';
export type TicketStatus = 'ended' | 'selling' | 'upcoming';
export type PassType = 'ALL_PASS' | 'LIVE_PASS';
export type ScheduleRowType = 'keynote' | 'track' | 'lunch' | 'closing';
export type PageId = 'home' | 'ceo' | 'program' | 'events' | 'register' | 'faq' | 'myforum';

// ─── 연사 ────────────────────────────────────────────────────────────────────

export interface KeynoteSpeaker {
  title: string;
  organization: string;
  name: string;
  role: string;
  photoUrl?: string;
}

export interface Speaker {
  id: string;            // 'A-1', 'B-3', …
  trackId: TrackId;
  sessionNumber: number; // 1–6
  title: string;
  organization?: string;
  name?: string;         // undefined → TBD
  role?: string;
  photoUrl?: string;
  isTbd: boolean;
  speakerBio?: string;   // 모달 연사소개 탭
  sessionDesc?: string;  // 모달 세션소개 탭
}

// ─── 트랙 ────────────────────────────────────────────────────────────────────

export interface Track {
  id: TrackId;
  letter: TrackId;
  name: string;          // '거시환경', '경영전략', …
  accentColor: string;   // CSS hex
  title: string;
  description: string;
  sessionCount: number;
}

// ─── 타임테이블 ───────────────────────────────────────────────────────────────

export interface ScheduleSession {
  trackId: TrackId;
  accentColor: string;
  title: string;
  speaker: string;       // '대외경제정책연구원 · 윤상하 실장' or '섭외 진행 중'
  isConfirmed: boolean;
}

export interface ScheduleRow {
  timeStart: string;
  timeEnd: string;
  type: ScheduleRowType;
  label?: string;        // 'keynote' | 'lunch' | 'closing' 전용
  sessions?: ScheduleSession[];
}

// ─── 등록 / 티켓 ─────────────────────────────────────────────────────────────

export interface TicketPass {
  type: PassType;
  label: string;
  originalPrice?: number;
  price: number;
  discountRate?: number; // 0.4 = 40%
}

export interface Ticket {
  tier: string;          // '1차 얼리버드', '정가', …
  status: TicketStatus;
  deadline?: string;     // ISO 8601, 예: '2026-08-27T23:59:59+09:00'
  dateLabel: string;     // '~ 8/15(토)'
  passes: TicketPass[];
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

// ─── 이벤트 카드 ─────────────────────────────────────────────────────────────

export interface ForumEvent {
  id: string;
  subtitle: string;
  title: string;
  description: string;
  note: string;
  noteExtra?: string;
  accentColor: string;
  decoImageUrl: string;
}

// ─── 인사이트 동영상 ──────────────────────────────────────────────────────────

export interface InsightVideo {
  id: string;
  embedSrc: string;
  title: string;
}

// ─── 아카이브 ────────────────────────────────────────────────────────────────

export interface ForumArchive {
  year: number;
  title: string;
  date: string;
  venue: string;
  url: string;
}

// ─── GNB 네비게이션 ───────────────────────────────────────────────────────────

export interface NavItem {
  id: string;
  label: string;
  page: PageId;
}

export interface ArchiveNavItem {
  year: number;
  label: string;
  url: string;
  isCurrent?: boolean;
}
