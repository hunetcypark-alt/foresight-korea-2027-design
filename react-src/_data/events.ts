import { ForumEvent } from './types';

export const FORUM_EVENTS: ForumEvent[] = [
  {
    id: 'ev-1',
    subtitle: '비즈니스 리더를 위한',
    title: '프로페셔널 포토 이벤트',
    description: '한 컷으로 완성되는 브랜드 퍼스널리티',
    note: '전문 포토그래퍼가 촬영하는 맞춤 사진 제공',
    noteExtra: '*현장 내 선착순 운영',
    accentColor: '#5a8dff',
    decoImageUrl: 'assets/img/ev-deco-camera.svg',
  },
  {
    id: 'ev-2',
    subtitle: 'AI 포토 부스',
    title: '현장을 기록하는 스마트한 방법',
    description: 'AI 기술로 구현되는 개인화된 포럼 경험',
    note: '포럼 테마에 맞춘 AI 기반 이미지 생성',
    noteExtra: '다양한 스타일이 가능한 개인화된 경험 제공',
    accentColor: '#8b5cf6',
    decoImageUrl: 'assets/img/ev-deco-ai.svg',
  },
];
