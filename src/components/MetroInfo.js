import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { MdSignalCellularAlt1Bar, MdSignalCellularAlt2Bar, MdSignalCellularAlt  } from "react-icons/md"; 
import { FaSignal } from "react-icons/fa";
// import { MdSignalCellularAlt2Bar } from "react-icons/md";

import style from '../styles/MetroInfo.module.css';
import subway from '../assets/imgs/subway.png';

function MetroInfo() {
    const totalNum = 7;

    const navigate = useNavigate();

    const [showDetail, setShowDetail] = useState([]);

    useEffect(() => {
        let temp = Array(totalNum).fill(false);
        setShowDetail(temp);
    }, [totalNum])

    
    
    const goHome = () => {
        navigate('/');
    }

    const renderItems = () => {
        return(
                [...Array(7)].map((_, idx) => (
                    <>
                        <div className={`${style.metroItem}`} onClick={() => {
                            let temp = [...showDetail];
                            temp[idx] = !temp[idx];
                            console.log(idx);
                            setShowDetail(temp);
                        }}>
                            <p className={`${style.metroNum}`}>3</p>
                            <p className = {`${style.stationName}`}>을지로3가</p>
                            <p className={`${style.confusion}`}><MdSignalCellularAlt1Bar size='50' color='green' /></p>
                        </div>
                        <div className={`${style.tableDiv}`} style={{ display: showDetail[idx] === true ? 'block' : 'none'}}>
                            <table className={`${style.timeTable}`}>
                                <thead>
                                    <tr>
                                        <th>
                                            <p>성수 방면</p>
                                            <p>성수(외선)</p>
                                        </th>
                                        <th>
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

    return(
        <div className={`${style.metroInfo}`} style={{backgroundColor: 'white', maxWidth: '1080px', margin: '0 auto'}}>
            <img src={subway} onClick={goHome} alt=''></img>
            <div className={`${style.content}`}>
                {renderItems()}
            </div>
        </div>
    );
}

export default MetroInfo;