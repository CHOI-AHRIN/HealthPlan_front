import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import cookie from 'react-cookies';

const MyPage = () => {

    const [memId, setMemId] = useState(cookie.load('memId'));
    const [memNickName, setMemNickName] = useState(cookie.load('memNickName'));
    const [memName, setMemName] = useState('');
    const [appendCarList, setAppendCarList] = useState([]);


    useEffect(() => {
        callMemberInfoApi();
    }, [])

    const callMemberInfoApi = () => {

        axios.post('/api/members/read', {
            memId: memId,
        })
            .then(response => {
                try {
                    setMemNickName(response.data.memNickName);
                    setMemName(response.data.memName);
                }
                catch (error) {
                    alert('회원데이터 받기 오류');
                }
            })
            .catch(error => { alert('회원데이터 받기 오류2'); return false; });


        axios.post('/api/cars/read', {
            memId: memId,
        })
            .then(response => {
                try {
                    setAppendCarList(carListAppend(response.data));
                }
                catch (error) {
                    alert('차량데이터 받기 오류');
                }
            })
            .catch(error => { return false; });


    }

    const carListAppend = (carList) => {
        const result = [];

        for (let i = 0; i < carList.length; i++) {
            let data = carList[i];

            result.push(
                <tr class="hidden_type">
                    <th>차량{'['}{i + 1}{']'}</th>
                    <td className='name-container'>
                        <input name="carInfo" id="carInfo_val" readOnly="readonly"
                            value={`${data.carBrand} / ${data.carModel} / ${data.carNum} / 충전타입 : ${data.charType}`} />
                        <button type="button" onClick={() => deleteCar(data.carNum)}>X</button>
                    </td>
                </tr>
            );
        };
        return result;
    }

    const deleteCar = (carNum) => {
        axios.post('/api/cars/remove', {
            memId: memId,
            carNum: carNum
        })
            .then(response => {
                if (response.data == 'succ') {

                    window.location.replace("/MyPage")
                } else {
                    alert('오류가 발생했습니다.')
                    return false;
                }
            });
    };

    return (
        <div>
            <section className="sub_wrap" >
                <article className="s_cnt re_1 ct1">
                    <div className="li_top">
                        <h2 className="s_tit1">마 이 페 이 지</h2>
                        <form method="post" name="frm">
                            <div className="re1_wrap">
                                <div className="re_cnt ct2">
                                    <table className="table_ty1">
                                        <tr className="re_email">
                                            <th>이메일</th>
                                            <td>
                                                <input name="memId" id="memId_val" readOnly="readonly" value={memId} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>이름</th>
                                            <td>
                                                <input name="memName" id="memName_val" readOnly="readonly" value={memName} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>닉네임</th>
                                            <td>
                                                <input id="memNickName_val" type="text" name="memNickName" readOnly="readonly" value={memNickName}
                                                />
                                            </td>
                                        </tr>
                                        {appendCarList}
                                    </table>
                                </div>
                            </div>
                            <div className="btn_confirm">
                                <Link to={'/Modify'} className="bt_ty bt_ty2 submit_ty1 modifyclass">프로필수정</Link>
                                <Link to={'/CarRegister'} className="bt_ty bt_ty2 submit_ty1 modifyclass">차량등록</Link>
                            </div>
                        </form>
                    </div>
                </article>
            </section>
        </div>
    );
}

export default MyPage;