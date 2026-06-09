import { ScheduleRow } from './types';

// 타임테이블 — 2026.10.01 (목) 09:00~18:00
export const SCHEDULE: ScheduleRow[] = [
  {
    timeStart: '09:00',
    timeEnd: '09:50',
    type: 'keynote',
    label: 'AX: Transforming into an AI-Native Company',
  },
  {
    timeStart: '10:10',
    timeEnd: '11:00',
    type: 'track',
    sessions: [
      { trackId: 'A', accentColor: '#3cc6ff', title: '2027 사업계획의 첫 번째 전제: 성장·물가·교역의 새 질서', speaker: '대외경제정책연구원 · 윤상하 실장', isConfirmed: true },
      { trackId: 'B', accentColor: '#4aa6ff', title: '연간 계획의 종말: AI Adaptive Planning으로 전략을 다시 짜다', speaker: '섭외 진행 중', isConfirmed: false },
      { trackId: 'C', accentColor: '#5a8dff', title: '스틸칼라의 등장: 피지컬 AI가 산업 현장을 바꾸는 방식', speaker: '섭외 진행 중', isConfirmed: false },
      { trackId: 'D', accentColor: '#6f7bf0', title: 'AI 네이티브 소비자의 탄생: 2027 고객은 어떻게 선택하는가', speaker: '트렌드코리아컴퍼니 · 전미영 박사', isConfirmed: true },
      { trackId: 'E', accentColor: '#8b5cf6', title: '글로벌 빅테크가 다시 짠 일의 구조: AI Native 직무 재설계', speaker: '동국대학교 · 이중학 교수', isConfirmed: true },
    ],
  },
  {
    timeStart: '11:20',
    timeEnd: '12:10',
    type: 'track',
    sessions: [
      { trackId: 'A', accentColor: '#3cc6ff', title: '모두가 타깃이 되는 세계: 2027 지정학 리스크와 한국 기업의 선택', speaker: '중앙대학교 · 이승주 교수', isConfirmed: true },
      { trackId: 'B', accentColor: '#4aa6ff', title: 'AI Native 도약의 첫 조건: 성장을 막는 레거시를 버리는 법', speaker: '섭외 진행 중', isConfirmed: false },
      { trackId: 'C', accentColor: '#5a8dff', title: '테크 드래곤의 비상: 중국 AI 굴기가 바꾸는 경쟁의 판', speaker: '한양대학교 · 백서인 교수', isConfirmed: true },
      { trackId: 'D', accentColor: '#6f7bf0', title: '검색 이후의 브랜드 전략: AI가 바꾼 구매 여정의 새 규칙', speaker: 'Kearney · 윤성훈 파트너', isConfirmed: true },
      { trackId: 'E', accentColor: '#8b5cf6', title: '프롬프트가 업무 능력이 된 시대: 임직원 AI 리스킬링 전략', speaker: '섭외 진행 중', isConfirmed: false },
    ],
  },
  {
    timeStart: '12:10',
    timeEnd: '13:30',
    type: 'lunch',
    label: '점심시간 · 네트워킹 런치',
  },
  {
    timeStart: '13:30',
    timeEnd: '14:20',
    type: 'track',
    sessions: [
      { trackId: 'A', accentColor: '#3cc6ff', title: '에너지·물류 초크포인트: 원가와 공급망을 흔드는 다음 충격', speaker: '삼일PwC · 강명수 국제통상솔루션센터장', isConfirmed: true },
      { trackId: 'B', accentColor: '#4aa6ff', title: 'Dual AX 전략: 사업 모델과 실행 역량을 동시에 바꾸다', speaker: '섭외 진행 중', isConfirmed: false },
      { trackId: 'C', accentColor: '#5a8dff', title: 'AI 투자의 성패: 거품과 워크슬롭을 넘어 ROI를 만드는 법', speaker: '섭외 진행 중', isConfirmed: false },
      { trackId: 'D', accentColor: '#6f7bf0', title: 'AI 시대의 미디어 투자 전략: 채널 믹스와 성과 극대화의 새 공식', speaker: '한국종합예술원 · 이승무 교수', isConfirmed: true },
      { trackId: 'E', accentColor: '#8b5cf6', title: '프롬프트 리더십: 구성원의 AI 잠재력을 깨우는 리더의 역할', speaker: '섭외 진행 중', isConfirmed: false },
    ],
  },
  {
    timeStart: '14:40',
    timeEnd: '15:30',
    type: 'track',
    sessions: [
      { trackId: 'A', accentColor: '#3cc6ff', title: '환율·금리·자본비용: 2027 재무 전략의 리스크 지도', speaker: '섭외 진행 중', isConfirmed: false },
      { trackId: 'B', accentColor: '#4aa6ff', title: '[AX사례] 제품을 넘어 생태계로: 플랫폼 기업은 어떻게 비즈니스를 재정의했나', speaker: '섭외 진행 중', isConfirmed: false },
      { trackId: 'C', accentColor: '#5a8dff', title: '[AX사례] 전사 AI 도입의 현실: 성공 조건과 실패 패턴', speaker: 'KPMG · 이동근 AI센터장', isConfirmed: true },
      { trackId: 'D', accentColor: '#6f7bf0', title: '[AX사례] 퍼포먼스 마케팅의 재설계: AI 측정·최적화와 인간의 판단', speaker: '고려대학교 · 송수진 교수', isConfirmed: true },
      { trackId: 'E', accentColor: '#8b5cf6', title: '[AX사례] AI Native HR: 채용부터 평가까지 인재 의사결정을 바꾸다', speaker: 'SAP · 한광모 본부장', isConfirmed: true },
    ],
  },
  {
    timeStart: '15:50',
    timeEnd: '16:40',
    type: 'track',
    sessions: [
      { trackId: 'A', accentColor: '#3cc6ff', title: 'K자형 양극화의 한국 경제: 2027 성장 기회와 방어 전략', speaker: '현대경제연구원 · 주원 실장', isConfirmed: true },
      { trackId: 'B', accentColor: '#4aa6ff', title: '[AX사례] 실행 속도의 혁명: 하이퍼 스냅스 조직은 어떻게 움직이는가', speaker: '섭외 진행 중', isConfirmed: false },
      { trackId: 'C', accentColor: '#5a8dff', title: '자율 경제 에이전트(AEA): AI가 결정하는 시대의 통제와 책임', speaker: '섭외 진행 중', isConfirmed: false },
      { trackId: 'D', accentColor: '#6f7bf0', title: 'AI 네이티브 마케팅 조직: 사람과 에이전트는 어떻게 협업하는가', speaker: '섭외 진행 중', isConfirmed: false },
      { trackId: 'E', accentColor: '#8b5cf6', title: '[AX사례] 전사 AI 내재화의 조건: 임원진은 어떻게 변화를 밀어붙였나', speaker: '섭외 진행 중', isConfirmed: false },
    ],
  },
  {
    timeStart: '17:00',
    timeEnd: '17:50',
    type: 'track',
    sessions: [
      { trackId: 'A', accentColor: '#3cc6ff', title: '불확실성을 숫자로 바꾸는 시나리오 경영: 예산과 실행계획의 기술', speaker: '섭외 진행 중', isConfirmed: false },
      { trackId: 'B', accentColor: '#4aa6ff', title: '실리콘밸리의 극단적 AX: \'1인 유니콘\'이 던지는 성장의 질문', speaker: '섭외 진행 중', isConfirmed: false },
      { trackId: 'C', accentColor: '#5a8dff', title: '통제인가 자율인가: 새도우 AI를 성과로 바꾸는 조직 설계', speaker: '섭외 진행 중', isConfirmed: false },
      { trackId: 'D', accentColor: '#6f7bf0', title: '[AX사례] 고객 경험의 AX: AI는 접점을 어떻게 바꾸는가', speaker: '섭외 진행 중', isConfirmed: false },
      { trackId: 'E', accentColor: '#8b5cf6', title: '[AX사례] 연공서열과 AI 속도의 충돌: 한국형 조직의 현실적 전환법', speaker: '섭외 진행 중', isConfirmed: false },
    ],
  },
  {
    timeStart: '17:50',
    timeEnd: '18:00',
    type: 'closing',
    label: '클로징 세레머니 · 수료증 배부',
  },
];
