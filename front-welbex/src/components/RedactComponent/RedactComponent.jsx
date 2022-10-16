import axios from '../../axiosData';
import { useEffect } from 'react';
import { useState } from 'react';
import './RedactComponent.css';

export const RedactComponent = ({ row, handleCloseRedacting, setRows }) => {
  const [dateInput, setDateInput] = useState(null);
  const [nameInput, setNameInput] = useState(row?.name);
  const [countInput, setCountInput] = useState(row?.count);
  const [distanceInput, setDistanceInput] = useState(row?.distance);

  const [isValidateError, setIsValidateError] = useState(false);

  const handleSubmitForm = (event) => {
    event.preventDefault();
    if (
      dateInput == null ||
      nameInput == null ||
      countInput == null ||
      distanceInput == null
    ) {
      setIsValidateError(true);
    } else {
      setIsValidateError(false);
      axios
        .put('/api/row', {
          id: row.id,
          date: dateInput,
          name: nameInput,
          distance: distanceInput,
          count: countInput,
        })
        .then((res) => {
          if (res.status === 200) {
            setRows((prev) => [
              {
                id: row.id,
                date: dateInput,
                name: nameInput,
                distance: distanceInput,
                count: countInput,
              },
              ...prev.filter((rowPrev) => row.id !== rowPrev.id),
            ]);
            handleCloseRedacting();
          } else {
            setIsValidateError(true);
            console.log('Error with editing');
          }
        });
    }
    console.log('send');
  };
  return (
    <div className='redact-wrapper'>
      <form onSubmit={handleSubmitForm}>
        <div className='redact-string'>
          <span>Дата</span>
          <input
            type='date'
            placeholder='Выберите дату'
            value={dateInput}
            className={isValidateError ? 'invalid' : ''}
            onChange={(e) => setDateInput(e.target.value)}
          />
        </div>
        <div className='redact-string'>
          <span>Название</span>
          <input
            type='text'
            placeholder='Введите название'
            value={nameInput}
            className={isValidateError ? 'invalid' : ''}
            onChange={(e) => setNameInput(e.target.value)}
          />
        </div>
        <div className='redact-string'>
          <span>Количество</span>
          <input
            type='number'
            placeholder='Введите количество'
            value={countInput}
            className={isValidateError ? 'invalid' : ''}
            onChange={(e) => setCountInput(e.target.value)}
          />
        </div>
        <div className='redact-string'>
          <span>Расстояние</span>
          <input
            type='number'
            placeholder='Введите расстояние'
            value={distanceInput}
            className={isValidateError ? 'invalid' : ''}
            onChange={(e) => setDistanceInput(e.target.value)}
          />
        </div>
        <button type='submit'>Сохранить</button>
      </form>
      <button onClick={handleCloseRedacting}>Отменить</button>
    </div>
  );
};
