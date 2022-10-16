import menu from '../../assets/images/menu.svg';
import './TableRow.css';

import { OutsideClickListener } from '../../hoc/OutsideClickListener';

import { MenuPopover } from '../MenuPopover/MenuPopover';

export const TableRow = ({
  index,
  id,
  date,
  name,
  count,
  distance,
  lastRowElementRef,
  handleRedactClick,
  idMenuOpened,
  setIdMenuOpened,
  handleDeleteClick,
}) => {
  const handleMenuClick = () => {
    setIdMenuOpened(id);
  };
  return (
    <tr ref={lastRowElementRef}>
      <td>
        <img
          src={menu}
          className='menu-row'
          alt='edit'
          onClick={handleMenuClick}
        />
        {id === idMenuOpened && (
          <OutsideClickListener setCloseMenu={() => setIdMenuOpened(null)}>
            <MenuPopover
              id={id}
              index={index}
              handleDeleteClick={handleDeleteClick}
              handleRedactClick={handleRedactClick}
            />
          </OutsideClickListener>
        )}
      </td>
      <td>{new Date(date).toLocaleDateString()}</td>
      <td>
        {name} {id}
      </td>
      <td>{count}</td>
      <td>{distance}</td>
    </tr>
  );
};
