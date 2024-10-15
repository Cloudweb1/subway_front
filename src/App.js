import { Route, Routes } from 'react-router-dom';

import './App.css';

import MainPanel from './components/MainPanel';
import MetroInfo from './components/MetroInfo';

function App() {
  return (
    <MainPanel />
    // <Routes>
    //     <Route path='/' element={<MainPanel />} />
    //     <Route path='/metro' element={<MetroInfo />} />
    // </Routes>
  );
}

export default App;
