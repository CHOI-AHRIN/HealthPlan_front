import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // 추가된 부분
import axios from 'axios';

const MemberModify = () => {
    const { uuid } = useParams();
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

    // 회원 정보 불러오기
    useEffect(() => {
        axios.get(`http://localhost:8080/api/member/read?uuid={uuid}`)
            .then(response => {
                setMemberInfo(response.data);
            })
            .catch(error => {
                console.error('회원 정보 불러오기 오류:', error);
            });
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
                <h2 className="s_tit1">회원 정보 수정</h2>
                <table className="table_ty1">
                    <tbody>
                        <tr>
                            <th>회원번호</th>
                            <td><input type="text" name="mno" value={memberInfo.mno} readOnly /></td>
                        </tr>
                        <tr>
                            <th>아이디</th>
                            <td><input type="text" name="uuid" value={memberInfo.uuid} readOnly /></td>
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
                            <td><input type="text" name="regdate" value={memberInfo.regdate} readOnly /></td>
                        </tr>
                        <tr>
                            <th>잔여 포인트</th>
                            <td><input type="text" name="pcount" value={memberInfo.pcount} onChange={handleChange} /></td>
                        </tr>
                    </tbody>
                </table>
                <button onClick={handleUpdate}>수정 완료</button>
            </article>
        </section>
    );
};

export default MemberModify;