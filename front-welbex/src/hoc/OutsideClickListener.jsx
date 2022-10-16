import { useRef } from 'react';
import { useOutsideClick } from '../hooks/useOutsideClick';

export const OutsideClickListener = ({ children, setCloseMenu }) => {
  const wrapperMenuRef = useRef(null);
  useOutsideClick(wrapperMenuRef, setCloseMenu);

  return <div ref={wrapperMenuRef}>{children}</div>;
};
