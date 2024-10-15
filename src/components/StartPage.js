import { useNavigate } from 'react-router-dom';

import style from '../styles/StartPage.module.css';

function StartPage() {

    const navigate = useNavigate();

    const getpo = ()  => {
        navigator.geolocation.getCurrentPosition(success, error, options);
    }

    const success = pos => {
        const crd = pos.coords;
        console.log('위도 :' + crd.latitude);
        console.log('경도 :' + crd.longitude);
        navigate('/metro');
    }

    const error = () => {
        console.error("what");
        alert('위치 정보를 가져올 수 없습니다.');
    }

    const options = {
        enableHighAccuracy: true
    }

    return(
        <div className={`${style.startPage}`} style={{maxWidth: '1080px', margin: '0 auto'}}>
            <button className={`${style.searchBtn}`} onClick={() => {getpo()}}>
                <div>
                    
                </div>
                <p>
                    주변역 찾기
                </p>
            </button>
        </div>
    );
}

export default StartPage;