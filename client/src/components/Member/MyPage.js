import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import cookie from 'react-cookies';
import axios from 'axios';

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



    // 날짜 형식을 변환하는 함수
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        // const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day}   ${hours}:${minutes} `; // ${hours}:${minutes}:${seconds}
    };



    const callMemberInfoApi = () => {

        // 1. 쿠키에서 토큰 가져오기 
        const token = cookie.load('token');

        // 2. token을 서버로 보내고 uuid를 받아오기
        axios
            .post('http://localhost:8080/member/loginCookie', {

                token: token

            }).then(response => {

                const uuid = response.data.uuid;

                // 3. 받아온 데이터를 통해 정보 조회
                axios.post('http://localhost:8080/member/read', {
                    uuid: uuid // 받은 uuid를 다시 서버로 전송
                }).then(response => {
                    try {
                        const data = response.data;
                        setUuid(data.uuid);      // 회원 아이디
                        setName(data.name);      // 회원 이름
                        setEmail(data.email);    // 회원 이메일
                        setMtype(data.mtype);    // 회원 타입
                        setPhone(data.phone);    // 연락처
                        setRegdate(formatDate(data.regdate)); // 가입 일자
                        setMno(data.mno);        // 회원 번호
                        setSstype(data.sstype);  // 구독 타입
                        setPcount(data.pcount);  // 잔여 포인트
                    } catch (error) {
                        alert('회원데이터를 읽어오는 중에 오류가 발생했습니다.');
                    }
                }).catch(error => { alert('토큰을 확인하는 중에 오류가 발생했습니다.'); return false; });
            })
    };



    useEffect(() => {
        callMemberInfoApi(); // 컴포넌트 마운트 시 API 호출
    }, []); // 빈 배열을 전달하여 최초 한 번만 실행되도록 설정


    // mtype을 변환하는 함수
    const displayMtype = () => {
        if (mtype === 't') {
            return '전문가';
        } else if (mtype === 'm') {
            return '일반회원';
        } else {
            return '알 수 없는 타입'; // 다른 값이 있을 때 대비
        }
    };

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
                                        <tr className="re_email">
                                            <th>이메일</th>
                                            <td>
                                                <input id="email" type="text" name="email" readOnly="readonly" value={email}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>회원타입</th>
                                            <td>
                                                <input id="mtype" type="text" name="mtype" readOnly="readonly" value={displayMtype()}
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
                                                <input id="sstype" type="text" name="sstype" readOnly="readonly" value={sstype}
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