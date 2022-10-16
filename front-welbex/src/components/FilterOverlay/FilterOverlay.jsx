import { useRef } from 'react';
import { useState } from 'react';

import { OutsideClickListener } from '../../hoc/OutsideClickListener';

import './FilterOverlay.css';

export const FilterOverlay = ({ handleCloseFilters, setQuery, setRows }) => {
  const [filterBy, setFilterBy] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterValue, setFilterValue] = useState(null);

  const filterBySelectRef = useRef(null);
  const filterTypeSelectRef = useRef(null);
  const filterInputRef = useRef(null);

  const handleConfirmFilters = () => {
    setRows([]);
    setQuery((prev) => [prev[0], prev[1], filterBy, filterType, filterValue]);
  };

  const handleResetAll = () => {
    setQuery((prev) => [prev[0], prev[1], '', '', '']);
    setFilterBy('');
    setFilterType('');
    setFilterValue('');
    setRows([]);
    //убираем запрос
    //очищаем инпуты
  };

  const handleResetFilterBy = () => {
    setFilterBy('');
    setFilterType('');
  };

  const onResetInputValue = () => {
    setFilterValue('');
    filterInputRef.current.value = '';
  };

  const handleChangeFilterType = (e) => {
    setFilterType(e.target.value);
  };

  const handleChangeFilterBy = (e) => {
    setFilterBy(e.target.value);
    setFilterType(null);
  };
  return (
    <div className='overlay'>
      <OutsideClickListener setCloseMenu={handleCloseFilters}>
        <div className='overlay-content'>
          <div className='top-part'>
            <p onClick={handleResetAll}>Сбросить все</p>
            <button onClick={handleCloseFilters}>Закрыть</button>
          </div>
          <section className='filters'>
            <div className='filter-row'>
              <div className='text-part'>
                <p>Фильтрация по</p>
                <p className='reset-p' onClick={handleResetFilterBy}>
                  Сбросить
                </p>
              </div>
              <select
                ref={filterBySelectRef}
                value={filterBy}
                name=''
                onChange={handleChangeFilterBy}>
                <option value=''>Выбрать тип фильтрации</option>
                <option value='date'>Дата</option>
                <option value='name'>Название</option>
                <option value='count'>Количество</option>
                <option value='distance'>Дистанция</option>
              </select>
            </div>
            <div className='filter-row'>
              <div className='text-part'>
                <p>Выбор условия</p>
                <p className='reset-p' onClick={() => setFilterType('')}>
                  Сбросить
                </p>
              </div>
              <select
                ref={filterTypeSelectRef}
                value={filterType}
                disabled={filterBy === ''}
                onChange={handleChangeFilterType}>
                <option>Выбрать условие</option>
                <option value='equal'>Равно</option>
                {filterBy === 'name' && (
                  <option value='contain'>Содержит</option>
                )}
                {filterBy !== 'name' && (
                  <>
                    <option value='moreThan'>Больше</option>
                    <option value='lessThan'>Меньше</option>
                  </>
                )}
              </select>
            </div>
            <div className='filter-row'>
              <div className='text-part'>
                <p>Введите значение</p>
                <p className='reset-p' onClick={onResetInputValue}>
                  Сбросить
                </p>
              </div>
              {filterBy === '' && (
                <input
                  type='text'
                  disabled
                  ref={filterInputRef}
                  onChange={(e) => setFilterValue(e.target.value)}
                  value={filterValue}
                  placeholder='Введите значение'
                />
              )}
              {filterBy !== '' && (
                <input
                  type={
                    filterBy === 'name'
                      ? 'text'
                      : filterBy === 'date'
                      ? 'date'
                      : 'number'
                  }
                  disabled={!filterType?.length > 0}
                  ref={filterInputRef}
                  onChange={(e) => setFilterValue(e.target.value)}
                  value={filterValue}
                  placeholder='Введите значение'
                />
              )}
            </div>
            <button
              className='confirm-filters'
              onClick={handleConfirmFilters}
              disabled={
                filterValue?.length === 0 ||
                filterType === '' ||
                filterBy === ''
              }>
              Применить
            </button>
          </section>
        </div>
      </OutsideClickListener>
    </div>
  );
};
