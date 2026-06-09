import React from 'react';
import { Speaker } from '../_data/types';

interface Props {
  speaker: Speaker;
  onClick?: (speaker: Speaker) => void;
}

function AvatarSil() {
  return (
    <svg className="av-sil" viewBox="0 0 100 100">
      <use href="#avatar-sil" />
    </svg>
  );
}

export default function SpeakerCard({ speaker, onClick }: Props) {
  return (
    <article
      className={`sc srise${speaker.isTbd ? ' is-tbd' : ''}`}
      style={{ fontSize: 16 }}
      onClick={() => onClick?.(speaker)}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="sc-photo">
        {speaker.photoUrl ? (
          <img src={speaker.photoUrl} alt={speaker.name ?? ''} width={80} height={80} />
        ) : (
          <AvatarSil />
        )}
      </div>
      <div className="sc-no">{speaker.id}</div>
      <div className="sc-title">{speaker.title}</div>
      <div className="sc-foot">
        {speaker.organization && <div className="sc-co">{speaker.organization}</div>}
        <div className="sc-name">{speaker.isTbd ? 'TBD' : speaker.name}</div>
      </div>
    </article>
  );
}
