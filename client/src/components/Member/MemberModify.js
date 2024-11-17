import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

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
            axios.get(`/api/member/read/${uuid}`)
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


    const handleUpdate = () => {
        const updatedMemberInfo = {
            ...memberInfo,
            uuid: uuid, // uuid를 포함한 데이터로 POST 요청 보냄
        };

        axios.post('/api/member/modifyMem', updatedMemberInfo)
            .then(response => {
                // alert('회원 정보가 성공적으로 수정되었습니다.');
                sweetalertModify('회원 정보가 성공적으로 수정되었습니다.', '', 'success', '확인');
                // navigate('/MemberList'); // 수정 후 리스트 페이지로 이동
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


    // 회원삭제
    const deleteMember = () => {
        sweetalertDelete('정말 삭제하시겠습니까?', function () {
            axios.delete('/api/member/remove', { data: { uuid } })
                .then(response => {
                }).catch(error => { alert('작업중 오류가 발생하였습니다.'); return false; });
        });
    };

    // 수정 알럿
    const sweetalertModify = (title, contents, icon, confirmButtonText) => {
        Swal.fire({
            title: title,
            text: contents,
            icon: icon,
            confirmButtonText: confirmButtonText
        }).then(function () {
            window.location.href = '/MemberList';
        });
    };



    // 탈퇴 알럿
    const sweetalertDelete = (title, callbackFunc) => {
        Swal.fire({
            title: title,
            text: "",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel'  // 취소 버튼 텍스트 추가
        }).then((result) => {
            if (result.isConfirmed) {  // 'Yes' 버튼을 눌렀을 때만 실행
                Swal.fire(
                    '탈퇴되었습니다.',
                    '',
                    'success'
                );
                window.location.href = '/MemberList';
                callbackFunc(); // 'Yes' 클릭 후에만 콜백 실행
            } else if (result.isDismissed) {
                Swal.fire(
                    '취소되었습니다.',
                    '',
                    'info'
                );
            }
        });
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
                                        <td><input type="text" name="mtype" value={memberInfo.mtype} onChange={handleChange} />
                                        </td>
                                    </tr>
                                    <div style={{ fontSize: '12px', color: '#888', marginLeft: '150px', width: '370%', textAlign: 'right' }}>
                                        t: 전문가 / m: 일반회원
                                    </div>
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
                    <div
                        style={{
                            alignItems: 'center',
                            display: 'flex',
                            justifyContent: 'center'
                        }}>
                        <div className="btn_confirm bt_ty bt_ty2 submit_ty1 modifyclass" type="button" onClick={handleUpdate}>수정</div>
                        <div className="bt_ty bt_ty2 submit_ty1 deleteclass" type="button" onClick={(e) => deleteMember()} >탈퇴</div>
                    </div>

                </form>
            </article >
        </section >
    );
};

export default MemberModify;