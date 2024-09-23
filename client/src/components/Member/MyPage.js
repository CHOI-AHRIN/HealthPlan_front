import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import cookie from 'react-cookies';

const MyPage = () => {

    const [uuid, setUuid] = useState(cookie.load('uuid'));
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mno, setMno] = useState('');
    const [phone, setPhone] = useState('');
    const [mtype, setMtype] = useState('');
    const [regdate, setRegdate] = useState('');
    const [sstype, setSstype] = useState('');
    const [pcount, setPcount] = useState('');
    // const [appendCarList, setAppendCarList] = useState([]);


    useEffect(() => {
        // 쿠키에서 토큰을 가져온 후, JWT 디코딩을 통해 uuid 추출
        const token = cookie.load('token');  // 쿠키에서 JWT 토큰 불러오기
        if (token) {
            try {
                const decodedToken = jwt_decode(token);  // JWT 토큰 디코딩
                setUuid(decodedToken.sub);  // 디코딩된 토큰에서 uuid 추출
            } catch (error) {
                console.error('토큰 디코딩 실패:', error);
            }
        }

        if (uuid) {
            callMemberInfoApi();
        }
    }, [uuid]);  // uuid가 설정된 후 API 호출

    const callMemberInfoApi = () => {
        axios.post('http://localhost:8080/member/read', {
            uuid: uuid  // 추출한 uuid를 API로 전송
        })
        .then(response => {
            try {
                setMno(response.data.mno);
                setName(response.data.name);
                setEmail(response.data.email);
                setPhone(response.data.phone);
                setMtype(response.data.mtype);
                setRegdate(response.data.regdate);
                setSstype(response.data.sstype);
                setPcount(response.data.pcount);
            } catch (error) {
                alert('회원데이터 받기 오류');
            }
        })
        .catch(error => { 
            alert('회원데이터 받기 오류2'); 
        });
    }

/*     const callMemberInfoApi = () => {

        axios.post('http://localhost:8080/member/read', {
            uuid: uuid,
            name: name,
            email : email,
            mno: mno,
            phone : phone,
            mtype:mtype,
            regdate :regdate,
            sstype:sstype,
            pcount:pcount
        })
            .then(response => {
                try {
                    setName(response.data.uuid);
                    setName(response.data.name);
                    setName(response.data.email);
                }
                catch (error) {
                    alert('회원데이터 받기 오류');
                }
            })
            .catch(error => { alert('회원데이터 받기 오류2'); return false; });


/*         axios.post('/api/cars/read', {
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
            .catch(error => { return false; });  }*/


 

/*     const carListAppend = (carList) => {
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
    } */

/*     const deleteCar = (carNum) => {
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
    }; */

    return (
        <div>
            <section className="sub_wrap" >
                <article className="s_cnt re_1 ct1">
                    <div className="li_top">
                        <h2 className="s_tit1">MyPage</h2>
                        <form method="post" name="frm">
                            <div className="re1_wrap">
                                <div className="re_cnt ct2">
                                    <table className="table_ty1">
                                    <tr>
                                            <th>회원번호</th>
                                            <td>
                                                <input name="mno" id="mno" readOnly="readonly" value={mno} />
                                            </td>
                                        </tr>
                                        <tr className="re_email">
                                            <th>아이디</th>
                                            <td>
                                                <input name="uuid" id="uuid" readOnly="readonly" value={uuid} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>이름</th>
                                            <td>
                                                <input name="name" id="name" readOnly="readonly" value={name} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>연락처</th>
                                            <td>
                                                <input id="phone" type="text" name="phone_" readOnly="readonly" value={phone}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>이메일</th>
                                            <td>
                                                <input id="email" type="text" name="email" readOnly="readonly" value={email}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                        <th>회원타입</th>
                                            <td>
                                                <input id="mtype" type="text" name="mtype" readOnly="readonly" value={mtype}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                        <th>가입일자</th>
                                            <td>
                                                <input id="regdate" type="text" name="regdate" readOnly="readonly" value={regdate}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                        <th>구독타입</th>
                                            <td>
                                                <input id="sstype" type="text" name="sstype"  readOnly="readonly" value={sstype}
                                                />
                                            </td>
                                            <button className="bt_ty3 bt_ty2 submit_ty1">구독타입 변경하기</button>
                                        </tr>
                                        <tr>
                                        <th>잔여 포인트</th>
                                            <td>
                                                <input id="pcount" type="text" name="pcount" readOnly="readonly" value={pcount}
                                                />
                                            </td>
                                            <button className="bt_ty3 bt_ty2 submit_ty1" >포인트 충전</button>
                                        </tr>
                                        {/* {appendCarList} */}
                                    </table>
                                </div>
                            </div>
                            <div className="btn_confirm">
                                <Link to={'/Modify'} className="bt_ty bt_ty2 submit_ty1 modifyclass">프로필수정</Link>
                                {/* <Link to={'/CarRegister'} className="bt_ty bt_ty2 submit_ty1 modifyclass">차량등록</Link> */}
                            </div>
                        </form>
                    </div>
                </article>
            </section>
        </div>
    );
}

export default MyPage;