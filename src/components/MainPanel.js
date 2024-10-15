import { Route, Routes } from 'react-router-dom';

import style from '../styles/MainPanel.module.css';
import StartPage from './StartPage';
import MetroInfo from './MetroInfo';

function MainPanel() {

    return(
        <div className={`${style.body}`}>
            <Routes>
                <Route path='/' element={<StartPage />} />
                <Route path='/metro' element={<MetroInfo />} />
            </Routes>
            {/* <StartPage /> */}
            
        </div>
    )
}

export default MainPanel;