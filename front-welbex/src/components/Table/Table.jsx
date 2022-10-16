import { useState, useEffect, useRef, useCallback } from 'react';
import useFetchData from '../../hooks/useFetchData';

import './Table.css';
import arrow from '../../assets/images/arrow.svg';
// import axios from 'axios';
import axios from '../../axiosData';

import { FilterOverlay } from '../FilterOverlay/FilterOverlay';
import { TableRow } from '../TableRow/TableRow';
import { RedactComponent } from '../RedactComponent/RedactComponent';
import { AddComponent } from '../AddComponent/AddComponent';

export const Table = () => {
  const { isLoading, rows, hasMore, query, setQuery, setPageNum, setRows } =
    useFetchData();
  //id строки на которой вызывается меню
  const [idMenuOpened, setIdMenuOpened] = useState(null);

  const [isRedacting, setIsRedacting] = useState(false);
  //индекс редактируемой строки
  const [indexRowRedacting, setIndexRowRedacting] = useState(null);

  const [isAdding, setIsAdding] = useState(false);

  const [isFiltersOpened, setIsFiltersOpened] = useState(false);

  const handleOpenFilters = () => {
    setIsFiltersOpened(true);
    const body = document.querySelector('body');
    body.style.overflow = 'hidden';
  };

  const handleCloseFilters = () => {
    setIsFiltersOpened(false);
    const body = document.querySelector('body');
    body.style.overflow = 'scroll';
  };

  const handleRedactClick = (index) => {
    if (isAdding) setIsAdding(false);
    console.log(rows[index]);
    setIndexRowRedacting(index);
    setIsRedacting(true);
  };

  const handleCloseRedacting = () => {
    setIndexRowRedacting(null);
    setIsRedacting(false);
  };

  const handleAddingClick = () => {
    if (isRedacting) setIsRedacting(false);
    setIsAdding(true);
  };

  const handleCloseAdding = () => {
    setIsAdding(false);
  };

  const handleDeleteClick = async (id) => {
    try {
      axios.delete(`/api/row/${id}`).then((res) => {
        res.status === 200
          ? setRows((prev) => prev.filter((row) => row.id !== id))
          : console.log('Delete Erorr');
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSortByName = () => {
    setRows([]);
    if (query[0] === 'name') {
      query[1] === 'asc'
        ? setQuery((prev) => ['name', 'desc', ...prev.slice(2)])
        : setQuery((prev) => [null, null, ...prev.slice(2)]);
    } else {
      setQuery((prev) => ['name', 'asc', ...prev.slice(2)]);
    }
  };
  const handleSortByCount = () => {
    setRows([]);

    if (query[0] === 'count') {
      query[1] === 'asc'
        ? setQuery((prev) => ['count', 'desc', ...prev.slice(2)])
        : setQuery((prev) => [null, null, ...prev.slice(2)]);
    } else {
      setQuery((prev) => ['count', 'asc', ...prev.slice(1)]);
    }
  };
  const handleSortByDistance = () => {
    setRows([]);

    if (query[0] === 'distance') {
      query[1] === 'asc'
        ? setQuery((prev) => ['distance', 'desc', ...prev.slice(2)])
        : setQuery((prev) => [null, null, ...prev.slice(2)]);
    } else {
      setQuery((prev) => ['distance', 'asc', ...prev.slice(1)]);
    }
  };

  const observer = useRef();
  const lastRowElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        //если последний объект наблюдаемый и можно еще подтянуть данные
        if (entries[0].isIntersecting && hasMore) {
          setPageNum((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore],
  );

  return (
    <>
      <div className='wrapper'>
        {isAdding && (
          <AddComponent
            handleCloseAdding={handleCloseAdding}
            setRows={setRows}></AddComponent>
        )}
        {isRedacting && (
          <RedactComponent
            row={rows[indexRowRedacting]}
            setRows={setRows}
            handleCloseRedacting={handleCloseRedacting}
          />
        )}
        {isFiltersOpened && (
          <FilterOverlay
            setRows={setRows}
            handleCloseFilters={handleCloseFilters}
            setQuery={setQuery}
          />
        )}
        <div className='filters-menu-wrapper'>
          <button onClick={handleAddingClick}>Добавить</button>
          <button onClick={handleOpenFilters}>Фильтры</button>
        </div>
        <table>
          <tr>
            <td></td>
            <td>
              <b>Дата</b>
            </td>
            <td>
              <b onClick={handleSortByName} className='sort-header'>
                Название
                {query[0] === 'name' && (
                  <img
                    src={arrow}
                    className={'arrow ' + query[1]}
                    alt='arrow'
                  />
                )}
              </b>
            </td>
            <td>
              <b onClick={handleSortByCount} className='sort-header'>
                Количество
                {query[0] === 'count' && (
                  <img
                    src={arrow}
                    className={'arrow ' + query[1]}
                    alt='arrow'
                  />
                )}
              </b>
            </td>
            <td>
              <b onClick={handleSortByDistance} className='sort-header'>
                Расстояние
                {query[0] === 'distance' && (
                  <img
                    src={arrow}
                    className={'arrow ' + query[1]}
                    alt='arrow'
                  />
                )}
              </b>
            </td>
          </tr>
          {rows.length > 0 &&
            rows.map((row, index) =>
              rows.length == index + 1 ? (
                <TableRow
                  id={row.id}
                  index={index}
                  key={row.id}
                  date={row.date}
                  name={row.name}
                  count={row.count}
                  handleRedactClick={handleRedactClick}
                  lastRowElementRef={lastRowElementRef}
                  idMenuOpened={idMenuOpened}
                  setIdMenuOpened={setIdMenuOpened}
                  handleDeleteClick={handleDeleteClick}
                  distance={row.distance}></TableRow>
              ) : (
                <TableRow
                  id={row.id}
                  index={index}
                  key={row.id}
                  date={row.date}
                  name={row.name}
                  count={row.count}
                  handleRedactClick={handleRedactClick}
                  handleDeleteClick={handleDeleteClick}
                  idMenuOpened={idMenuOpened}
                  setIdMenuOpened={setIdMenuOpened}
                  distance={row.distance}></TableRow>
              ),
            )}
        </table>
        {isLoading && <b>Загрузка...</b>}
        {rows?.length === 0 && !isLoading && <b>Ничего не найдено :(</b>}
      </div>
    </>
  );
};
