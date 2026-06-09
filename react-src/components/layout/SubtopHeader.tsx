// 서브페이지 공통 상단 헤더 (CEO/Program/Events/FAQ 에서 사용)
// PC: 좌측 로고 + 우측 날짜/장소/버튼 / 모바일: 세로 스택

interface Props {
  onRegisterClick?: () => void;
  onLeafletClick?: () => void;
}

export default function SubtopHeader({ onRegisterClick, onLeafletClick }: Props) {
  return (
    <div className="subtop">
      <div className="subtop-graphic" aria-hidden="true">
        <img src="assets/img/subtop-vector.png" alt="" className="subtop-graphic-img" />
      </div>
      <div className="subtop-row">
        <div className="subtop-left">
          <img
            src="assets/img/logo-w-h.png"
            alt="FORESIGHT KOREA 2027"
            className="subtop-logoimg"
          />
        </div>
        <div className="subtop-right">
          <div className="subtop-info">
            {/* PC */}
            <p className="subtop-venue">그랜드 인터컨티넨탈 서울 파르나스 5층 Grand Ballroom</p>
            <p className="subtop-date">2026. 10. 01 (목) 09:00 - 18:00</p>
          </div>
          <div className="subtop-btns">
            <a
              href="#"
              className="subtop-btn subtop-btn--ghost"
              onClick={(e) => { e.preventDefault(); onLeafletClick?.(); }}
            >
              <svg viewBox="0 0 22 22" fill="none" width="20" height="20">
                <rect x="3" y="1.5" width="13" height="19" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M6.5 7h8M6.5 11h8M6.5 15h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              리플렛
            </a>
            <a
              href="#"
              className="subtop-btn subtop-btn--solid"
              onClick={(e) => { e.preventDefault(); onRegisterClick?.(); }}
            >
              <svg viewBox="0 0 22 22" fill="none" width="20" height="20">
                <path d="M4 12L8.5 16.5L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              등록하기
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
