import React from 'react';

import './MenuPopover.css';

export const MenuPopover = ({
  id,
  handleDeleteClick,
  handleRedactClick,
  index,
}) => {
  return (
    <div className='menu-popover'>
      <button onClick={() => handleRedactClick(index)}>Редактировать</button>
      <button onClick={() => handleDeleteClick(id)}>Удалить</button>
    </div>
  );
};
