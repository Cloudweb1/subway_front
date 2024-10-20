import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import style from '../styles/StartPage.module.css';

function StartPage() {

    // const [stationName, setStationName] = useState([]);
    // const [lineNum, setLineNum] = useState([]);

    const navigate = useNavigate();

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
            let stations = [];
            let lines = [];
            let ids = [];
            // const res = {
            //     data: [{
            //             name: '건대입구',
            //             lineNumber: '7'
            //         },
            //         {
            //             name: '건대입구',
            //             lineNumber: '2'
            //         }
            //     ]
            // }
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