// GNB ① 휴넷CEO 상단 바
// PC: 고정 상단 / 모바일: 숨김 (styles.css 에서 처리)

interface Props {
  userName?: string;         // 로그인한 사용자 이름 — API에서 주입
  onMyForumClick?: () => void;
}

export default function GnbTop({ userName = '사용자', onMyForumClick }: Props) {
  return (
    <div id="gnb-top">
      <a href="#" className="gt-logo" aria-label="휴넷CEO">
        <img src="assets/hunet-ceo-logo.svg" alt="휴넷CEO" style={{ width: 26 }} />
      </a>
      <div className="gt-right">
        <nav className="gt-snav">
          <a href="#" />
          <a href="#" style={{ fontFamily: "'PT Serif'" }}>휴넷CEO</a>
          <a href="#" className="on" style={{ fontFamily: "'PT Serif'" }}>FORESIGHT KOREA</a>
        </nav>
        <div className="gt-vsep" />
        <div className="gt-user">
          <span>{userName}님</span>
          <img src="assets/user-icon.svg" alt="" />
        </div>
        <a
          href="#"
          className="gt-myforum"
          style={{ borderStyle: 'none', fontFamily: "'PT Serif'", padding: '5px 0px' }}
          onClick={(e) => { e.preventDefault(); onMyForumClick?.(); }}
        >
          My Forum
        </a>
      </div>
    </div>
  );
}
