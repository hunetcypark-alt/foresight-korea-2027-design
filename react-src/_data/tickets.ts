import { Ticket } from './types';

export const TICKETS: Ticket[] = [
  {
    tier: '1차 얼리버드',
    status: 'ended',
    dateLabel: '~ 8/9(일)',
    passes: [
      { type: 'ALL_PASS', label: 'ALL PASS', originalPrice: 1_000_000, price: 600_000, discountRate: 0.4 },
      { type: 'LIVE_PASS', label: 'LIVE PASS', originalPrice: 750_000, price: 450_000, discountRate: 0.4 },
    ],
  },
  {
    tier: '2차 얼리버드',
    status: 'selling',
    deadline: '2026-09-13T23:59:59+09:00',
    dateLabel: '~ 9/13(일)',
    passes: [
      { type: 'ALL_PASS', label: 'ALL PASS', originalPrice: 1_000_000, price: 750_000, discountRate: 0.25 },
      { type: 'LIVE_PASS', label: 'LIVE PASS', originalPrice: 750_000, price: 562_500, discountRate: 0.25 },
    ],
  },
  {
    tier: '정가',
    status: 'upcoming',
    dateLabel: '~ 9/29(화)',
    passes: [
      { type: 'ALL_PASS', label: 'ALL PASS', price: 1_000_000 },
      { type: 'LIVE_PASS', label: 'LIVE PASS', price: 750_000 },
    ],
  },
];

// VOD 상품 (행사 후 판매)
export const VOD_PRODUCTS = [
  {
    tag: 'VOD ALL',
    name: 'Track A~E 전체 VOD',
    includes: '30개 세션 전체 시청 · 기조연설 포함',
    price: 500_000,
  },
  {
    tag: 'VOD TRACK',
    name: 'Track 1택',
    includes: '관심 있는 1개 트랙 6개 세션 시청',
    price: 150_000,
  },
];
