import './App.css';
import { useEffect } from 'react';
import axios from 'axios';
import { Table } from './components/Table/Table';

function App() {
  useEffect(() => {
    axios
      .get('http://localhost:8080/api/row?page=1')
      .then((res) => console.log(res));
  }, []);

  return (
    <div className='App'>
      <Table />
    </div>
  );
}

export default App;
