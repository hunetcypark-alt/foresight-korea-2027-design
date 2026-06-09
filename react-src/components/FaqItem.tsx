import React, { useState } from 'react';
import { FaqItem as FaqItemType } from '../_data/types';

interface Props {
  item: FaqItemType;
}

export default function FaqItem({ item }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="faq-item">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
          padding: '24px 0',
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          borderBottom: '1px solid #e1e2e4',
          textAlign: 'left',
        }}
        aria-expanded={isOpen}
      >
        <span style={{ fontSize: 18, color: '#20222d', lineHeight: 1.6, fontWeight: 700 }}>
          {item.question}
        </span>
        <svg
          className="faq-arrow"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          style={{
            flexShrink: 0,
            transition: 'transform .2s',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <path d="M5 7.5l5 5 5-5" stroke="#20222d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {isOpen && (
        <div
          className="faq-answer"
          style={{ background: '#f7f7f8', padding: 24, borderBottom: '1px solid #e1e2e4' }}
        >
          <p style={{ fontSize: 16, color: '#20222d', lineHeight: 1.6 }}>
            {item.answer}
          </p>
        </div>
      )}
    </div>
  );
}
