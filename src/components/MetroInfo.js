import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

import { MdSignalCellularAlt1Bar, MdSignalCellularAlt2Bar, MdSignalCellularAlt  } from "react-icons/md"; 
import { FaSignal } from "react-icons/fa";

import style from '../styles/MetroInfo.module.css';
import subway from '../assets/imgs/subway.png';
import subwayImg from '../assets/imgs/subway_paint.png';

function MetroInfo() {
    const lineColor = {
        1: '#0032A0',
        2: '#00B140',
        3: '#FC4C02',
        4: '#00A9E0',
        5: '#A05EB5',
        6: '#A9431E',
        7: '#67823A',
        8: '#E31C79',
        9: '#8C8279',
    }

    const navigate = useNavigate();
    
    const [showDetail, setShowDetail] = useState([]);
    const [stationIds, setStationIds] = useState([]);
    const [stationName, setStationName] = useState([]);
    const [lineNums, setLineNums] = useState([]);
    const [congestions, setCongestions] = useState([]);
    const [adjacent, setAdjacent] = useState([]);
    const [arriveT, setArriveT] = useState([]);
    const [totalNum, setTotalNum] = useState(0);

    const {state} = useLocation();

    useEffect(() => {
        let temp = Array(totalNum).fill(false);
        setShowDetail(temp);
    }, [totalNum]);
    useEffect(() => {
        let consArr= [];
        let adjarr = [];
        let arrCollection = [];
        //초기 state 설정
        setStationIds(state.ids);
        setStationName(state.stations);
        setLineNums([...state.lines]);
        setTotalNum(state.stations.length);

        if(state.stations.length > 0) {
            for(let i = 0; i < state.stations.length; i++) {
                //혼잡도 
                axios.get(`/api/metro/stations/${state.stations[i]}/congestions`).then(res => {
                    let congestion = res.data.result.congestion;
                    for(let j = 0; j < congestion.length; j++) {
                        //해당 역과 같은 호선 혼잡도만 (환승역일 경우 여러 호선 존재)
                        if(congestion[j].lineNumber == state.lines[i]) {
                            let { upDegree, downDegree } = congestion[j];
                            //혼잡도 데이터 없는 경우
                            if(isNaN(upDegree)) {
                                upDegree = -1;
                                downDegree = -1;
                            }
                            else {
                                upDegree = Number(upDegree);
                                downDegree = Number(downDegree);
                            }
                            let newObj = { upDegree, downDegree };
                            consArr.push(newObj);
                            if(consArr.length === state.stations.length)
                                setCongestions(consArr);
                            break;
                        }
                    }
                }).catch(res => {
                    console.log('error');
                    console.log(res);
                })

                //도착정보 가져오기
                axios.get(`/api/metro/stations/${state.stations[i]}/arrivals`).then(res => {
                    let allResult = res.data.result;
                    console.log(allResult);
                    
                    //도착정보가 없을 시 --:--
                    if(typeof allResult === 'string') {
                        let temp = {
                            prevStation: '--',
                            nextStation: '--'
                        }
                        adjarr[i] = temp;
                        arrCollection[i] = ({1: ['--:--', '--:--'], 2: ['--:--', '--:--']});
                    }
                    else if(allResult.length > 0) {
                        let arrTimeU = [];    //상행선 예상 도착시간
                        let arrTimeD = [];    //하행선 예상 도착시간

                        //상행선 기준으로 인접역 가져온 후 배열에 넣기
                        for(let k = 0; k < allResult.length; k++) {
                            if(allResult[k].lineNumber == state.lines[i]) {
                                if(allResult[k].direction === '1') {
                                    let {prevStation, nextStation} =  allResult[k];
                                    let adjacentStn = {prevStation, nextStation};
                                    adjarr[i] = adjacentStn;
                                    break;
                                }
                            }
                        }
                        //상, 하행 예상 도착시간 배열에 넣기
                        for(let k = 0; k < allResult.length; k++) {
                            if(allResult[k].lineNumber == state.lines[i]) {
                                if(allResult[k].direction === '1') {
                                    let {arriveTime} =  allResult[k];
                                    arrTimeU.push(arriveTime);
                                }
                                else if(allResult[k].direction === '2') {
                                    let {arriveTime} =  allResult[k];
                                    arrTimeD.push(arriveTime);
                                }
                            }
                        }
                        arrCollection[i] = ({1: arrTimeU, 2: arrTimeD});
                    }
                    //인접역과 도착시간정보 state 할당
                    if(adjarr.filter(item => item !== undefined).length === state.stations.length)
                        setAdjacent(adjarr);
                    if(arrCollection.filter(item => item !== undefined).length === state.stations.length)
                        setArriveT(arrCollection);
                }).catch(res => {
                    console.log('arrival error');
                    console.log(res);
                })
            }
        }
        setCongestions(consArr);
    }, [state]);
    
    //홈화면 이동
    const goHome = () => {
        navigate('/');
    }

    const renderItems = () => {
        return(
                stationName.map((station, idx) => (
                    <>
                        <div className={`${style.metroItem}`} onClick={() => {
                            let temp = [...showDetail];
                            temp[idx] = !temp[idx];
                            setShowDetail(temp);
                        }} style ={{
                            borderColor: `${lineColor[lineNums[idx]]}`
                        }}>
                            <p className={`${style.metroNum}`} style={{backgroundColor: `${lineColor[lineNums[idx]]}`}}>{lineNums[idx]}</p>
                            <p className = {`${style.stationName}`}>{station}</p>
                        </div>
                        <div className={`${style.tableDiv}`} style={{ display: showDetail[idx] === true ? 'block' : 'none'}}>
                            <table className={`${style.timeTable}`}>
                                <thead>
                                    <tr>
                                        <th>
                                            <p className={`${style.confusion}`}>{renderCongestion(congestions[idx], 'u')}</p>
                                            <p>성수 방면</p>
                                            <p>성수(외선)</p>
                                        </th>
                                        <th>
                                            <p className={`${style.confusion}`}>{renderCongestion(congestions[idx], 'd')}</p>
                                            <p>구의 방면</p>
                                            <p>성수(내선)</p>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                {
                                    [...Array(15)].map(() => (
                                        <tr>
                                            <td>
                                                <p><b>22:12</b></p>
                                                <p>오금 -&gt; 대화</p>
                                            </td>
                                            <td>
                                                <p></p>
                                                <p></p>
                                            </td>
                                        </tr>
                                    ))
                                }
                                </tbody>
                            </table>
                        </div>
                    </>
                ))
        );
    }

    //혼잡도별 아이콘 렌더링
    const renderCongestion = (congestion, direction) => {
        if(congestion) { 
            let result = direction === 'u' ? congestion.upDegree : congestion.downDegree;
            if(result < 0) {

            }
            else if(result < 33.3) {
                return(<MdSignalCellularAlt1Bar size='25' color='green' />);
            }
            else if(result < 66) {
                return(<MdSignalCellularAlt2Bar size='25' color='gold' />);
            }
            else if(result < 100) {
                return(<MdSignalCellularAlt size='25' color='orange' />);
            }
            else {
                return(<FaSignal size='25' color='red' />);
            }
        }
    }

    const renderItems2 = () => {
        return(
            stationName.map((station, idx) => (
                <>
                    <div className={`${style.metroItem2}`}>
                        <div className={`${style.line}`} style={{backgroundColor: `${lineColor[lineNums[idx]]}`}}></div>
                        <div className={`${style.stationFrame}`} style={{border: `3px ${lineColor[lineNums[idx]]} solid`}}>
                            <div className={`${style.stationId}`} style={{backgroundColor: `${lineColor[lineNums[idx]]}`}}>{stationIds[idx]}</div>
                            <p className={`${style.stationName}`}>{station}</p>
                        </div>
                        {adjacent[idx] && <p className={`${style.adj}`} style={{left: '5%'}}>{adjacent[idx].prevStation}</p>}
                        {arriveT[idx] && 
                        <div className={`${style.comingTrain}`} style={{left: `${5 + 3 * timecalc(arriveT[idx]['1'][0])}%`}}>
                            {congestions[idx] && renderCongestion(congestions[idx], 'u')}
                            <img src={subwayImg} style={{width: '55px', margin: 0, transform: 'scaleX(-1)'}} />
                        </div>
                        }
                        {arriveT[idx] && <p className={`${style.eta}`} style={{right: '63%'}}>{`${arriveT[idx]['1'][0]} 도착 예정`}</p>}
                        {arriveT[idx] && <p className={`${style.secondEta} ${style.eta}`} style={{right: '63%'}}>{`${arriveT[idx]['1'][1]} 도착 예정`}</p>}
                        {adjacent[idx] && <p className={`${style.adj}`} style={{right: '5%'}}>{adjacent[idx].nextStation}</p>}
                        {arriveT[idx] &&
                        <div className={`${style.comingTrain}`} style={{right: `${5 + 3 * timecalc(arriveT[idx]['2'][0])}%`}}>
                            {congestions[idx] && renderCongestion(congestions[idx], 'd')}
                            <img src={subwayImg} style={{width: '55px', margin: 0}} />
                        </div>
                        }
                        {arriveT[idx] && <p className={`${style.eta}`} style={{left: '63%'}}>{`${arriveT[idx]['2'][0]} 도착 예정`}</p>}
                        {arriveT[idx] && <p className={`${style.secondEta} ${style.eta}`} style={{left: '63%'}}>{`${arriveT[idx]['2'][1]} 도착 예정`}</p>}
                    </div>
                </>
            ))
        );
    }

    //현재 시간 - 열차 예상 도착 시간
    const timecalc = arriveTime => {
        let currentMin = Number(new Date().getMinutes());
        let arriveMin = Number(arriveTime.slice(-2));        

        if(isNaN(currentMin) || isNaN(arriveMin) || arriveMin - currentMin >= 9) return 0;
        else if(arriveMin - currentMin >= 0) {
            return 9 - (arriveMin - currentMin);
        } 
        else {
            return 9 - (arriveMin - currentMin + 60);
        }         
    }

    return(
        <div className={`${style.metroInfo}`} style={{backgroundColor: 'white', maxWidth: '1080px', margin: '0 auto'}}>
            <img src={subway} onClick={goHome} alt='' className={`${style.logo}`}></img>
            <div className={`${style.content}`}>
                {/* {renderItems()} */}
                {renderItems2()}
            </div>
        </div>
    );
}

export default MetroInfo;