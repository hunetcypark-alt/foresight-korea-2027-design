import React from 'react';
import { ForumEvent } from '../_data/types';

interface Props {
  event: ForumEvent;
}

export default function EventCard({ event }: Props) {
  return (
    <div className="ev-card" style={{ '--acc': event.accentColor } as React.CSSProperties}>
      <div className="tr-bot" />
      <div className="ev-card-body">
        <p className="ev-card-sub">{event.subtitle}</p>
        <h3 className="ev-card-title">{event.title}</h3>
        <div className="ev-divider" />
        <p className="ev-card-desc">{event.description}</p>
        <p className="ev-card-note">
          {event.note}
          {event.noteExtra && (
            <><br /><span className="ev-note-sub">{event.noteExtra}</span></>
          )}
        </p>
      </div>
      <div className="ev-deco" aria-hidden="true">
        <img src={event.decoImageUrl} alt="" />
      </div>
      <div className="tr-edge" />
    </div>
  );
}
