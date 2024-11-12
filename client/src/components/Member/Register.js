import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Swal from 'sweetalert2';

const Register = () => {

    const [uuid, setUuid] = useState('');
    const [upw, setUpw] = useState('');
    const [upwConfirm, setUpwConfirm] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [mtype, setMtype] = useState('');
    const navigate = useNavigate(); // useNavigate로 변경


    // 입력값 초기화 함수
    const resetForm = () => {
        setUuid('');
        setUpw('');
        setUpwConfirm('');
        setName('');
        setPhone('');
        setEmail('');
        setMtype('');
    };


    // 데이터 검증
    const fnValidate = () => {

        // 검증 로직
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+|<>?:{}]).{8,16}$/;


        if (!uuid || uuid.includes(" ")) {
            sweetalert('아이디를 다시 확인해주세요.', '', 'error', '닫기');
            return false;
        }
        if (!upw || !passwordPattern.test(upw)) {
            sweetalert('8~16자 영문 대소문자, 숫자, 특수문자를 사용하세요.', '', 'error', '닫기');
            return false;
        }
        if (upw !== upwConfirm) {
            sweetalert('비밀번호가 일치하지 않습니다.', '', 'error', '닫기');
            return false;
        }
        if (!name) {
            sweetalert('이름을 입력해주세요.', '', 'error', '닫기');
            return false;
        }
        if (!email || !emailPattern.test(email)) {
            sweetalert('올바른 이메일 형식을 입력해주세요.', '', 'error', '닫기');
            return false;
        }
        if (!phone || phone.includes(" ")) {
            sweetalert('핸드폰 번호에 공백을 제거해 주세요.', '', 'error', '닫기');
            return false;
        }

        return true;

    }


    // 아이디 중복체크 및 회원가입 처리
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!fnValidate()) return;

        axios.post('/api/member/uuidCk', { uuid })
            .then(response => {
                if (response.data !== 0) { // 중복된 아이디가 있을 경우
                    sweetalert('이미 존재하는 아이디입니다.', '', 'error', '닫기');
                    resetForm(); // 입력값 초기화
                } else {
                    fnSignInsert(); // 회원가입 요청
                }
            })
            .catch(error => {
                sweetalert('요청에 실패했습니다.', error.message || '알 수 없는 오류가 발생했습니다.', 'error', '닫기');
            });
    };

    // 최종 실행 쿼리
    const fnSignInsert = () => {
        const userData = {
            uuid,
            upw,
            name,
            phone,
            email,
            mtype
        };

        axios.post('/api/member/register', userData)
            .then(response => {
                if (response && response.data === "success") {
                    sweetalert('회원가입 되었습니다.', '', 'success', '확인')
                    .then(() => { navigate('/login'); }); 
                } else {
                    sweetalert('회원가입 중 오류가 발생했습니다.1', '', 'error', '닫기');
                }
            })
            .catch(error => {
                console.error('Error:', error); // 콘솔에 구체적인 오류 출력
                sweetalert('회원가입 중 오류가 발생했습니다.', error.message || '알 수 없는 오류가 발생했습니다.', 'error', '닫기');
            });
    };



    // SweetAlert 알림 함수
// SweetAlert 알림 함수 수정
const sweetalert = (title, contents, icon, confirmButtonText) => {
    return Swal.fire({
        title: title,
        text: contents,
        icon: icon,
        confirmButtonText: confirmButtonText
    });
};

/*     const sweetalertRegister = (title, contents, icon, confirmButtonText) => {
        Swal.fire({
            title: title,
            text: contents,
            icon: icon,
            confirmButtonText: confirmButtonText
        }).then(function () {
            window.location.href = '/';
        });
    };
 */
    const handleMtypeChange = (e) => {
        setMtype(e.target.value); // 선택된 값을 mtype 상태에 저장
    };

    return (
        <div>
            <section className="sub_wrap" >
                <article className="s_cnt re_1 ct1">
                    <div className="li_top">
                        <h2 className="s_tit1">회원가입</h2>
                        <form name="frm" onSubmit={handleSubmit}>
                            <div className="re1_wrap">
                                <div className="re_cnt ct2">
                                    <table className="table_ty1">
                                        <tr>
                                            <th>아이디</th>
                                            <td className='displayflex'>
                                                <input id="uuid_val" type="text" name="uuid" value={uuid}
                                                    placeholder="아이디를 입력해주세요." onChange={(e) => setUuid(e.target.value)} />
                                                {/*  <button>중복확인</button> */}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>비밀번호</th>
                                            <td>
                                                <input id="upw_val" type="password" name="upw" value={upw}
                                                    placeholder="비밀번호를 입력해주세요." onChange={(e) => setUpw(e.target.value)} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>비밀번호 확인</th>
                                            <td>
                                                <input id="upw_cnf_val" type="password" value={upwConfirm}
                                                    placeholder="비밀번호를 다시 입력해주세요." onChange={(e) => setUpwConfirm(e.target.value)} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>이름</th>
                                            <td>
                                                <input id="name_val" type="text" name="name" value={name}
                                                    placeholder="이름을 입력해주세요." onChange={(e) => setName(e.target.value)} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>이메일</th>
                                            <td>
                                                <input id="email_val" type="text" name="email" value={email}
                                                    placeholder="you@example.com" onChange={(e) => setEmail(e.target.value)} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>핸드폰 번호</th>
                                            <td>
                                                <input id="phone_val" type="tel" name="phone" value={phone}
                                                    placeholder="핸드폰 번호를 입력해주세요." onChange={(e) => setPhone(e.target.value)} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>회원유형</th>
                                            <td>
                                                <select value={mtype} onChange={handleMtypeChange} id="mtype_val" name="mtype" className="" >
                                                    <option value="">회원유형을 선택하세요.</option>
                                                    <option value='t'>전문가</option>
                                                    <option value='m'>일반회원</option>
                                                </select>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                            {/*                                 <div className="btn_confirm">
                                    {/* <a href="javascript:" className="bt_ty bt_ty2 submit_ty1 modifyclass"
                            onClick={() => submitClick()}>회원가입</a> 
                                    <button className="bt_ty bt_ty2 submit_ty1 modifyclass" onClick={submitClick}>회원가입</button>
                                </div> */}
                            <div className="btn_confirm">
                                <button className="bt_ty bt_ty2 submit_ty1 modifyclass" type="submit">회원가입</button>
                            </div>
                        </form>
                    </div>
                </article >
            </section >
        </div >
    );
}

export default Register;