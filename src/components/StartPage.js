import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import style from '../styles/StartPage.module.css';

function StartPage() {

    const navigate = useNavigate();

    //사용자 위치정보 가져오기
    const getpo = ()  => {
        navigator.geolocation.getCurrentPosition(success, error, options);
    }

    const success = pos => {
        const crd = pos.coords;
        console.log('위도 :' + crd.latitude);
        console.log('경도 :' + crd.longitude);
        axios.get('/api/metro/stations', {
            params: {
                latitude: crd.latitude,
                longitude: crd.longitude
            }
        }).then(res => {
            let stations = [];    //역명
            let lines = [];    //호선
            let ids = [];    //역 번호
            for(let i = 0; i < res.data.length; i++) {
                stations.push(res.data[i].name);
                lines.push(res.data[i].lineNumber);
                ids.push(res.data[i].id)
            }
            
            console.log(stations, lines, ids);
            navigate('/metro', {
                state: {
                    ids: ids,
                    stations: stations,
                    lines: lines
                }
            });
            console.log(res);
        }).catch((res) => {
            console.log(res);
        })
        
    }

    const error = () => {
        console.error("Positioning Sys err");
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