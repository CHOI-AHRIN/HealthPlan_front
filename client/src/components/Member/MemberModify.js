import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';

const MemberModify = () => {
    // useState로 uuid 관리
    // const [uuid, setUuid] = useState('');  // 초기값으로 실제 uuid 값을 설정
    const { uuid } = useParams(); // useParams로 uuid 값 가져오기
    const navigate = useNavigate();
    const [memberInfo, setMemberInfo] = useState({
        name: '',
        email: '',
        phone: '',
        mtype: '',
        sstype: '',
        regdate: '',
        pcount: '',
        mno: ''
    });

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



    // uuid를 useState로 관리
    const [uuidState, setUuidState] = useState('');

    // 회원 정보 불러오기
    useEffect(() => {

        setUuidState(uuid);
        if (uuid) {
            axios.get(`http://localhost:8080/api/member/read/${uuid}`)
                .then(response => {
                    console.log("회원 정보:", response.data);
                    const data = response.data;
                    data.regdate = formatDate(data.regdate);  // 날짜 형식을 변환 후 설정
                    setMemberInfo(data);
                })
                .catch(error => {
                    console.error('회원 정보 불러오기 오류:', error);
                    alert('회원 정보를 불러오는 중 오류가 발생했습니다.');
                });
        } else {
            alert("회원 ID가 제공되지 않았습니다.");
        }
    }, [uuid]);






    // 회원 정보 수정
    const handleUpdate = () => {
        axios.put('http://localhost:8080/api/member/update', memberInfo)
            .then(response => {
                alert('회원 정보가 성공적으로 수정되었습니다.');
                navigate('/MemberList'); // 수정 후 리스트 페이지로 이동
            })
            .catch(error => {
                console.error('회원 정보 수정 오류:', error);
                alert('회원 정보 수정 중 오류가 발생했습니다.');
            });
    };



    // 입력 변경 처리
    const handleChange = (e) => {
        const { name, value } = e.target;
        setMemberInfo(prevInfo => ({
            ...prevInfo,
            [name]: value
        }));
    };

    return (
        <section className="sub_wrap">
            <article className="s_cnt mp_pro_li ct1">
                <h2 className="s_tit1">회원정보 수정</h2>
                <form method="post" name="frm">
                    <div className="re1_wrap">
                        <div className="re_cnt ct2">
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    marginBottom: '20px'
                                }}>
                                <Link to="/MemberList" className="bt_ty2 submit_ty1"
                                    style={{
                                        fontSize: '15px',
                                        width: '120px',
                                        height: '30px',
                                        lignItems: 'center',
                                        justifyContent: 'center',
                                        display: 'flex',
                                        alignItems: 'center',
                                        backgroundColor: '#004AAD'
                                    }}>
                                    회원목록
                                </Link>
                            </div>
                            <table className="table_ty1">

                                <tbody>
                                    <tr>
                                        <th>회원번호</th>
                                        <td><input type="text" name="mno" value={memberInfo.mno} readOnly="readonly" /></td>
                                    </tr>
                                    <tr>
                                        <th>아이디</th>
                                        <td><input type="text" name="uuid" value={memberInfo.uuid} readOnly="readonly" /></td>
                                    </tr>
                                    <tr>
                                        <th>이름</th>
                                        <td><input type="text" name="name" value={memberInfo.name} onChange={handleChange} /></td>
                                    </tr>
                                    <tr>
                                        <th>이메일</th>
                                        <td><input type="text" name="email" value={memberInfo.email} onChange={handleChange} /></td>
                                    </tr>
                                    <tr>
                                        <th>연락처</th>
                                        <td><input type="text" name="phone" value={memberInfo.phone} onChange={handleChange} /></td>
                                    </tr>
                                    <tr>
                                        <th>회원타입</th>
                                        <td><input type="text" name="mtype" value={memberInfo.mtype} onChange={handleChange} /></td>
                                    </tr>
                                    <tr>
                                        <th>구독타입</th>
                                        <td><input type="text" name="sstype" value={memberInfo.sstype} onChange={handleChange} /></td>
                                    </tr>
                                    <tr>
                                        <th>가입일자</th>
                                        <td><input type="text" name="regdate" value={memberInfo.regdate} readOnly="readonly" /></td>
                                    </tr>
                                    <tr>
                                        <th>잔여 포인트</th>
                                        <td><input type="text" name="pcount" value={memberInfo.pcount} onChange={handleChange} /></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div>
                        <div className="btn_confirm bt_ty bt_ty2 submit_ty1 modifyclass" type="button" /* onClick={(e) => submitClick('modify', e)}  */>수정</div>
                        <div className="bt_ty bt_ty2 submit_ty1 deleteclass" type="button" /* onClick={(e) => deleteMember() }*/ >탈퇴</div>
                    </div>

                </form>
            </article >
        </section >
    );
};

export default MemberModify;