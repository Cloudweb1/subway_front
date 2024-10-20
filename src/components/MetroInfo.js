import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios, { all } from 'axios';

import { MdSignalCellularAlt1Bar, MdSignalCellularAlt2Bar, MdSignalCellularAlt  } from "react-icons/md"; 
import { FaSignal } from "react-icons/fa";
// import { MdSignalCellularAlt2Bar } from "react-icons/md";

import style from '../styles/MetroInfo.module.css';
import subway from '../assets/imgs/subway.png';
import subwayImg from '../assets/imgs/subway_paint.png';

function MetroInfo() {
    let c = 0;
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

    const congestionRes = {
        data: [
            {
                lineNumber: '2',
                stationId: '240',
                name: '건대입구',
                direction: '1',
                congestion: '106.3',
            },
            {
                lineNumber: '2',
                stationId: '240',
                name: '건대입구',
                direction: '2',
                congestion: '31.3',
            },
            {
                lineNumber: '7',
                stationId: '240',
                name: '건대입구',
                direction: '1',
                congestion: '48.3',
            },
            {
                lineNumber: '7',
                stationId: '240',
                name: '건대입구',
                direction: '2',
                congestion: '82.3',
            }
        ]
    }

    const navigate = useNavigate();
    
    // const {stations, lines} = params;

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
        setStationIds(state.ids);
        setStationName(state.stations);
        setLineNums([...state.lines]);
        setTotalNum(state.stations.length);
        if(state.stations.length > 0) {
            for(let i = 0; i < state.stations.length; i++) {
                axios.get(`/api/metro/stations/${state.stations[i]}/congestions`).then(res => {
                    let congestion = res.data.result.congestion;
                    for(let j = 0; j < congestion.length; j++) {
                        if(congestion[j].lineNumber == state.lines[i]) {
                            let { upDegree, downDegree } = congestion[j];
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
                axios.get(`/api/metro/stations/${state.stations[i]}/arrivals`).then(res => {
                    let allResult = res.data.result;
                    console.log(state.stations[i], allResult);
                    
                    if(typeof allResult === 'string') {
                        let temp = {
                            prevStation: '--',
                            nextStation: '--'
                        }
                        adjarr[i] = temp;
                        arrCollection[i] = ({1: ['--:--', '--:--'], 2: ['--:--', '--:--']});
                    }
                    else if(allResult.length > 1) {
                        let arrTimeU = [];
                        let arrTimeD = [];
                        for(let k = 0; k < allResult.length; k++) {
                            if(allResult[k].lineNumber == state.lines[i]) {
                                if(allResult[k].direction === '1') {
                                    let {prevStation, nextStation} =  allResult[k];
                                    let adjacentStn = {prevStation, nextStation};
                                    // adjarr.push(adjacentStn);
                                    adjarr[i] = adjacentStn;
                                    console.log(adjarr);
                                    break;
                                }
                            }
                        }
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
                    // else {
                    //     for(let k = 0; k < allResult.length; k++) {
                    //         if(allResult[k].lineNumber == state.lines[i]) {
                    //             if(allResult[k].direction === '1') {
                    //                 let {prevStation, nextStation} =  allResult[k];
                    //                 let adjacentStn = {prevStation, nextStation};
                    //                 // adjarr.push(adjacentStn);
                    //                 adjarr[i] = adjacentStn;
                    //                 console.log(adjarr);
                    //                 break;
                    //             }
                    //         }
                    //     }
                    // }
                    console.log(arrCollection);
                    // if(adjarr.length === state.stations.length)
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
    
    const goHome = () => {
        // navigate('/');
        // console.log(stations, lines);
        // console.log();
    }

    const renderItems = () => {
        return(
                stationName.map((station, idx) => (
                    <>
                        <div className={`${style.metroItem}`} onClick={() => {
                            let temp = [...showDetail];
                            temp[idx] = !temp[idx];
                            console.log(idx);
                            setShowDetail(temp);
                            console.log(lineColor[lineNums[idx]]);
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

    const renderCongestion = (congestion, direction) => {
        if(congestion) { 
            console.log(congestions);
            let result = direction === 'u' ? congestion.upDegree : congestion.downDegree;
            console.log(result);
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
        console.log(adjacent);
        return(
            stationName.map((station, idx) => (
                <>
                    <div className={`${style.metroItem2}`}>
                        <div className={`${style.line}`} style={{backgroundColor: `${lineColor[lineNums[idx]]}`}}></div>
                        <div className={`${style.stationFrame}`} style={{border: `3px ${lineColor[lineNums[idx]]} solid`}}>
                            <div className={`${style.stationId}`} style={{backgroundColor: `${lineColor[lineNums[idx]]}`}}>{stationIds[idx]}</div>
                            <p className={`${style.stationName}`}>{station}</p>
                        </div>
                        {/* <p className={`${style.adj}`} style={{left: '5%'}}>{adjacent[idx] && adjacent[idx].prevStation}</p> */}
                        {adjacent[idx] && <p className={`${style.adj}`} style={{left: '5%'}}>{adjacent[idx].prevStation}</p>}
                        <div className={`${style.comingTrain}`} style={{left: '5%'}}>
                            {/* <MdSignalCellularAlt size='25' color='orange' /> */}
                            {congestions[idx] && renderCongestion(congestions[idx], 'u')}
                            <img src={subwayImg} style={{width: '55px', margin: 0, transform: 'scaleX(-1)'}} />
                        </div>
                        {/* <p className={`${style.eta}`} style={{right: '63%'}}>12:48 도착 예정</p> */}
                        {arriveT[idx] && <p className={`${style.eta}`} style={{right: '63%'}}>{`${arriveT[idx]['1'][0]} 도착 예정`}</p>}
                        {arriveT[idx] && <p className={`${style.secondEta} ${style.eta}`} style={{right: '63%'}}>{`${arriveT[idx]['1'][1]} 도착 예정`}</p>}
                        {adjacent[idx] && <p className={`${style.adj}`} style={{right: '5%'}}>{adjacent[idx].nextStation}</p>}
                        <div className={`${style.comingTrain}`} style={{right: '5%'}}>
                            {/* <FaSignal size='25' color='red' /> */}
                            {congestions[idx] && renderCongestion(congestions[idx], 'd')}
                            <img src={subwayImg} style={{width: '55px', margin: 0}} />
                        </div>
                        {arriveT[idx] && <p className={`${style.eta}`} style={{left: '63%'}}>{`${arriveT[idx]['2'][0]} 도착 예정`}</p>}
                        {arriveT[idx] && <p className={`${style.secondEta} ${style.eta}`} style={{left: '63%'}}>{`${arriveT[idx]['2'][1]} 도착 예정`}</p>}
                        {/* <p className={`${style.eta}`} style={{left: '63%'}}>12:48 도착 예정</p>
                        <p className={`${style.secondEta} ${style.eta}`} style={{left: '63%'}}>12:48 도착 예정</p> */}
                    </div>
                </>
            ))
        );
    }

    return(
        <div className={`${style.metroInfo}`} style={{backgroundColor: 'white', maxWidth: '1080px', margin: '0 auto'}}>
            <img src={subway} onClick={goHome} alt='' className={`${style.logo}`}></img>
            <div className={`${style.content}`}>
                {/* {renderItems()} */}
                {renderItems2()}
                {/* <div style={{display: 'flex', height: '25%', alignItems: 'center', position: 'relative'}}>
                    <div style={{backgroundColor: 'green', width: '90%', margin: '0 auto', height: '5px'}}></div>
                    <div style={{backgroundColor: 'white', height: '50%', width: '25%', borderRadius: '50px', position: 'absolute', left: '50%', transform: 'translateX(-50%)', border: '3px green solid'}}>
                        <div style={{backgroundColor: 'green', color: 'white', height: '60%', aspectRatio: '1', borderRadius: '50%', position: 'absolute', top: '50%', left: '18px', transform: 'translateY(-50%)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'korail'}}>212</div>
                        <p style={{fontFamily: 'korail', fontSize: '25px', position: 'absolute', top: '50%', left: '25%', transform: 'translateY(-50%)', textAlign: 'center', width: '60%'}} className={`${style.sName}`}>건대입구</p>
                    </div>
                    <p style={{position: 'absolute', top: '60%', left: '5%', transform: 'translateY(-50%)', fontFamily: 'korail'}}>성수</p>
                    <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column', position: 'absolute', top: '6%', left: '5%'}}>
                        <MdSignalCellularAlt size='25' color='orange' />
                        <img src={subwayImg} style={{width: '55px', margin: 0, transform: 'scaleX(-1)'}} />
                    </div>
                    <p style={{position: 'absolute', top: '55%', fontFamily: 'korail', right: '63%', color: 'orangered', fontSize: '12px'}}>12:48 도착 예정</p>
                    
                    <p style={{position: 'absolute', top: '60%', right: '5%', transform: 'translateY(-50%)', fontFamily: 'korail'}}>구의</p>
                    <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column', position: 'absolute', top: '6%', right: '5%'}}>
                        <FaSignal size='25' color='red' />
                        <img src={subwayImg} style={{width: '55px', margin: 0}} />
                    </div>
                    <p style={{position: 'absolute', top: '55%', fontFamily: 'korail', left: '63%', color: 'orangered', fontSize: '12px'}}>12:48 도착 예정</p>
                </div>

                <div style={{display: 'flex', height: '25%', alignItems: 'center', position: 'relative'}}>
                    <div style={{backgroundColor: 'green', width: '90%', margin: '0 auto', height: '5px'}}></div>
                    <div style={{backgroundColor: 'white', height: '50%', width: '25%', borderRadius: '50px', position: 'absolute', left: '50%', transform: 'translateX(-50%)', border: '3px green solid'}}>
                        <div style={{backgroundColor: 'green', color: 'white', height: '60%', aspectRatio: '1', borderRadius: '50%', position: 'absolute', top: '50%', left: '18px', transform: 'translateY(-50%)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'korail'}}>212</div>
                        <p style={{fontFamily: 'korail', fontSize: '25px', position: 'absolute', top: '50%', left: '25%', transform: 'translateY(-50%)', textAlign: 'center', width: '60%'}} className={`${style.sName}`}>건대입구</p>
                    </div>
                    <p style={{position: 'absolute', top: '60%', left: '5%', transform: 'translateY(-50%)', fontFamily: 'korail'}}>성수</p>
                    <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column', position: 'absolute', top: '6%', left: '5%'}}>
                        <MdSignalCellularAlt size='25' color='orange' />
                        <img src={subwayImg} style={{width: '55px', margin: 0, transform: 'scaleX(-1)'}} />
                    </div>
                    <p style={{position: 'absolute', top: '55%', fontFamily: 'korail', right: '63%', color: 'orangered', fontSize: '12px'}}>12:48 도착 예정</p>
                    
                    <p style={{position: 'absolute', top: '60%', right: '5%', transform: 'translateY(-50%)', fontFamily: 'korail'}}>구의</p>
                    <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column', position: 'absolute', top: '6%', right: '5%'}}>
                        <FaSignal size='25' color='red' />
                        <img src={subwayImg} style={{width: '55px', margin: 0}} />
                    </div>
                    <p style={{position: 'absolute', top: '55%', fontFamily: 'korail', left: '63%', color: 'orangered', fontSize: '12px'}}>12:48 도착 예정</p>
                </div>

                <div style={{display: 'flex', height: '25%', alignItems: 'center', position: 'relative'}}>
                    <div style={{backgroundColor: 'green', width: '90%', margin: '0 auto', height: '5px'}}></div>
                    <div style={{backgroundColor: 'white', height: '50%', width: '25%', borderRadius: '50px', position: 'absolute', left: '50%', transform: 'translateX(-50%)', border: '3px green solid'}}>
                        <div style={{backgroundColor: 'green', color: 'white', height: '60%', aspectRatio: '1', borderRadius: '50%', position: 'absolute', top: '50%', left: '18px', transform: 'translateY(-50%)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'korail'}}>212</div>
                        <p style={{fontFamily: 'korail', fontSize: '25px', position: 'absolute', top: '50%', left: '25%', transform: 'translateY(-50%)', textAlign: 'center', width: '60%'}} className={`${style.sName}`}>건대입구</p>
                    </div>
                    <p style={{position: 'absolute', top: '60%', left: '5%', transform: 'translateY(-50%)', fontFamily: 'korail'}}>성수</p>
                    <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column', position: 'absolute', top: '6%', left: '5%'}}>
                        <MdSignalCellularAlt size='25' color='orange' />
                        <img src={subwayImg} style={{width: '55px', margin: 0, transform: 'scaleX(-1)'}} />
                    </div>
                    <p style={{position: 'absolute', top: '55%', fontFamily: 'korail', right: '63%', color: 'orangered', fontSize: '12px'}}>12:48 도착 예정</p>
                    
                    <p style={{position: 'absolute', top: '60%', right: '5%', transform: 'translateY(-50%)', fontFamily: 'korail'}}>구의</p>
                    <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column', position: 'absolute', top: '6%', right: '5%'}}>
                        <FaSignal size='25' color='red' />
                        <img src={subwayImg} style={{width: '55px', margin: 0}} />
                    </div>
                    <p style={{position: 'absolute', top: '55%', fontFamily: 'korail', left: '63%', color: 'orangered', fontSize: '12px'}}>12:48 도착 예정</p>
                </div> */}
            </div>
        </div>
    );
}

export default MetroInfo;