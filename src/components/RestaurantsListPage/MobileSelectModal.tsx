'use client';

import React from 'react';

import CheckIcon from '@/icons/Check';
import { foreground, slate100, white } from '@/tokens';

interface Option {
  label: string;
  value: string;
}

interface MobileSelectModalProps {
  title: string;
  options?: Option[];
  selected?: string;
  onSelect?: (value: string) => void;
  onClose: () => void;
  children?: React.ReactNode;
}

export default function MobileSelectModal({
  title,
  options,
  selected,
  onSelect,
  onClose,
  children,
}: MobileSelectModalProps) {
  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.4)',
          zIndex: 1000,
        }}
      />

      {/* Bottom sheet */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: white,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          padding: 24,
          zIndex: 1001,
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <span style={{ fontSize: 16, fontWeight: 700, color: foreground }}>{title}</span>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 20,
              color: foreground,
              padding: '4px 8px',
              lineHeight: 1,
            }}
            aria-label='Close'
          >
            ✕
          </button>
        </div>

        {/* Content: custom children (e.g. calendar) or options list */}
        {children !== null && children !== undefined
          ? children
          : options?.map(opt => {
              const isSel = opt.value === selected;
              return (
                <div
                  key={opt.value}
                  onClick={() => {
                    onSelect?.(opt.value);
                    onClose();
                  }}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 0',
                    borderBottom: `1px solid ${slate100}`,
                    cursor: 'pointer',
                    color: foreground,
                    fontSize: 15,
                    fontWeight: isSel ? 700 : 400,
                  }}
                >
                  <span>{opt.label}</span>
                  {isSel && (
                    <span style={{ display: 'flex', alignItems: 'center', color: foreground }}>
                      <CheckIcon />
                    </span>
                  )}
                </div>
              );
            })}
      </div>
    </>
  );
}
