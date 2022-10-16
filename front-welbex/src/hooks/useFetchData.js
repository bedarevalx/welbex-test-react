import { useState, useEffect } from 'react';
import axiosInstance from '../axiosData';

function useFetchData() {
  //СОРТИРОВКА [0] -параметр [1] -направление
  //ФИЛЬТРАЦИЯ [2] -параметр [3] -тип [4] - значение
  const [query, setQuery] = useState([null, null, 0, 0, null]);
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const [isRetryingLoading, setisRetryingLoading] = useState(false);

  useEffect(() => {
    setPageNum(1);
    setisRetryingLoading(true);
    setHasMore(true);
    console.log(query);
  }, [query]);

  useEffect(() => {
    setisRetryingLoading(false);
    setIsLoading(true);
    console.log('load' + query);
    let queryParams = '';
    //собираем запрос к api
    query[0] ? (queryParams += `&sortBy=${query[0]}`) : (queryParams += '');
    query[1] ? (queryParams += `&sortType=${query[1]}`) : (queryParams += '');
    query[2]?.length > 0
      ? (queryParams += `&filterBy=${query[2]}`)
      : (queryParams += '');
    query[3]?.length > 0
      ? (queryParams += `&filterType=${query[3]}`)
      : (queryParams += '');
    query[4]?.length > 0
      ? (queryParams += `&value=${query[4]}`)
      : (queryParams += '');
    !isLoading &&
      axiosInstance
        .get(`/api/row?page=${pageNum}` + queryParams)
        .then((res) => {
          console.log(res);
          setRows([...rows, ...res.data.data]);
          setHasMore(res.data.totalPages > pageNum);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
  }, [pageNum, isRetryingLoading]);

  return {
    isLoading,
    rows,
    hasMore,
    setRows,
    setQuery,
    query,
    setPageNum,
  };
}

export default useFetchData;
