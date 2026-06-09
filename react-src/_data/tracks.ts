import { Track } from './types';

export const TRACKS: Track[] = [
  {
    id: 'A',
    letter: 'A',
    name: '거시환경',
    accentColor: '#3cc6ff',
    title: '2027 전략 수립의 외부 좌표: 경제∙정세∙정책 리스크를 읽는 법',
    description:
      '경제·정세·정책 리스크를 사업 가정으로 전환하는 법. 환율·금리·공급망·지정학 변수를 투자 의사결정에 반영합니다.',
    sessionCount: 6,
  },
  {
    id: 'B',
    letter: 'B',
    name: '경영전략',
    accentColor: '#4aa6ff',
    title: 'AI Native Company의 전략 공식:\n사업 모델과 성장 포트폴리오를 다시 짜다',
    description:
      '사업 모델·고객 가치·의사결정 구조를 AI 전제로 다시 설계하는 전략 프레임을 다룹니다.',
    sessionCount: 6,
  },
  {
    id: 'C',
    letter: 'C',
    name: 'AX · Tech',
    accentColor: '#5a8dff',
    title: 'AX의 기술 백본: AI Agent, 데이터, 플랫폼이 경영의 OS를 바꾼다',
    description:
      'AI Agent·데이터·플랫폼·보안이 경영의 OS를 어떻게 바꾸는지, 경영진의 언어로 해석합니다.',
    sessionCount: 6,
  },
  {
    id: 'D',
    letter: 'D',
    name: '마케팅',
    accentColor: '#6f7bf0',
    title: 'AI가 고객 접점을 재정의한다: 마케팅과 세일즈 OS의 전환',
    description:
      'AI 타겟팅·콘텐츠·CX·B2B 세일즈를 하나의 마케팅 OS 관점에서 다룹니다.',
    sessionCount: 6,
  },
  {
    id: 'E',
    letter: 'E',
    name: '조직·리더십',
    accentColor: '#8b5cf6',
    title: 'AI Native 조직을 만드는 법: 속도, 인재, 평가, 리더십의 재설계',
    description:
      '직무 재설계·리스킬링·평가보상·Human-AI 협업까지, 사람 중심 조직 OS를 재구성합니다.',
    sessionCount: 6,
  },
];

export const TRACK_COLOR_MAP: Record<string, string> = {
  A: '#3cc6ff',
  B: '#4aa6ff',
  C: '#5a8dff',
  D: '#6f7bf0',
  E: '#8b5cf6',
};
