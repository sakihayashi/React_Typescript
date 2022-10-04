import { CSSProperties } from 'react';
// import React from 'react'
export const virtualInputWrapper: CSSProperties = {
  width: '100vw',
  backgroundColor: 'rgba(0, 0, 0, 0.9)',
  height: '50%',
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 3900,
};

export const virtualInputContainer: CSSProperties = {
  zIndex: 3950,
  padding: 1,
  background: '#fff',
  display: 'flex',
  position: 'relative',
  top: 100,
  alignItems: 'center',
  justifyContent: 'center',
  width: 'auto',
  maxWidth: 500,
  minWidth: 100,
  margin: 'auto'
};
export const closeIconStyle: CSSProperties = {
  position: 'fixed',
  top: 100,
  right: '10%',
  color: '#fff',
  cursor: 'pointer',
  width: 40,
  height: 40
};