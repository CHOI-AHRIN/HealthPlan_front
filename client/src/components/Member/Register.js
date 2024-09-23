import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from "axios";
import Swal from 'sweetalert2';
import $ from 'jquery';

const Register = () => {

    const [mtype, setMtype] = useState('');

    // const navigate = useNavigate(); // useNavigate 훅 초기화

    const history = useHistory();





        // 데이터 검증
        const fnValidate = () => {



            const uuid_val_checker = $('#uuid_val').val();
            const upw_val_checker = $('#upw_val').val();
            const upw_cnf_val_checker = $('#upw_cnf_val').val();
            const name_val_checker = $('#name_val').val();
            const phone_val_checker = $('#phone_val').val();
            const email_val_checker = $('#email_val').val();
            const mtype_val_checker = mtype; // mtype 상태 값
            


            const pattern1 = /[0-9]/;
            const pattern2 = /[a-zA-Z]/;
            const pattern3 = /[~!@#$%^&*()_+|<>?:{}]/;

            // 아이디
            if (uuid_val_checker === '') {
                $('#uuid_val').addClass('border_validate_err');
                sweetalert('아이디를 다시 확인해주세요.', '', 'error', '닫기');
                return false;
            }
            if (uuid_val_checker.search(/\s/) !== -1) {
                $('#uuid_val').addClass('border_validate_err');
                sweetalert('아이디 공백을 제거해 주세요.', '', 'error', '닫기');
                return false;
            }

            $('#uuid_val').removeClass('border_validate_err');

            // 비밀번호
            if (upw_val_checker === '') {
                $('#upw_val').addClass('border_validate_err');
                sweetalert('비밀번호를 입력해주세요.', '', 'error', '닫기');
                return false;
            }
            if (upw_val_checker !== '') {
                const str = upw_val_checker;
                if (str.search(/\s/) !== -1) {
                    $('#upw_val').addClass('border_validate_err');
                    sweetalert('비밀번호 공백을 제거해 주세요.', '', 'error', '닫기');
                    return false;
                }
                if (!pattern1.test(str) || !pattern2.test(str) || !pattern3.test(str)
                    || str.length < 8 || str.length > 16) {
                    $('#upw_val').addClass('border_validate_err');
                    sweetalert('8~16자 영문 대 소문자\n숫자, 특수문자를 사용하세요.', '', 'error', '닫기');
                    return false;
                }
            }
            $('#upw_val').removeClass('border_validate_err');

            if (upw_cnf_val_checker === '') {
                $('#upw_cnf_val').addClass('border_validate_err');
                sweetalert('비밀번호를 한번 더 입력해주세요.', '', 'error', '닫기');
                return false;
            }
            if (upw_val_checker !== upw_cnf_val_checker) {
                $('#upw_val').addClass('border_validate_err');
                $('#upw_cnf_val').addClass('border_validate_err');
                sweetalert('비밀번호가 일치하지 않습니다.', '', 'error', '닫기');
                return false;
            }
            $('#upw_cnf_val').removeClass('border_validate_err');

            // 이름
            if (name_val_checker === '') {
                $('#name_val').addClass('border_validate_err');
                sweetalert('이름을 입력해주세요.', '', 'error', '닫기');
                return false;
            }
            if (name_val_checker.search(/\s/) !== -1) {
                $('#name_val').addClass('border_validate_err');
                sweetalert('이름에 공백을 제거해 주세요.', '', 'error', '닫기');
                return false;
            }

            // 이메일
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(email_val_checker)) {
                $('#email_val').addClass('border_validate_err');
                sweetalert('올바른 이메일 형식을 입력해주세요.', '', 'error', '닫기');
                return false;
            }
            $('#email_val').removeClass('border_validate_err');
            if (email_val_checker === '') {
                $('#email_val').addClass('border_validate_err');
                sweetalert('이메일을 입력해주세요.', '', 'error', '닫기');
                return false;
            }
            if (email_val_checker.search(/\s/) !== -1) {
                $('#email_val').addClass('border_validate_err');
                sweetalert('이메일에 공백을 제거해 주세요.', '', 'error', '닫기');
                return false;
            }
            $('#email_val').removeClass('border_validate_err');

        // 핸드폰 번호
        if (phone_val_checker === '') {
            $('#phone_val').addClass('border_validate_err');
            sweetalert('핸드폰 번호를 입력해주세요.', '', 'error', '닫기');
            return false;
        }
        if (phone_val_checker.search(/\s/) !== -1) {
            $('#phone_val').addClass('border_validate_err');
            sweetalert('핸드폰 번호에 공백을 제거해 주세요.', '', 'error', '닫기');
            return false;
        }

        return true;

        }

        
    const uuidKeyPress = () => {
        $('#uuid_val').removeClass('border_validate_err');
    };

    const upwKeyPress = () => {
        $('#upw_val').removeClass('border_validate_err');
    };

    const memPwCnfKeyPress = () => {
        $('#memPw_cnf_val').removeClass('border_validate_err');
    };

    const nameKeyPress = () => {
        $('#name_val').removeClass('border_validate_err');
    };

    const emailKeyPress = () => {
        $('#email_val').removeClass('border_validate_err');
    };

    const phoneKeyPress = () => {
        $('#phone_val').removeClass('border_validate_err');
    };

    const mtypeKeyPress = () => {
        $('#mtype_val').removeClass('border_validate_err');
    };


        // 가입유형


        /*         if (fnValidate()) {
                    axios.post('/member/uuidCk', {
                        uuid : uuid_val_checker
                    })
                        .then(response => {
                            try {
                                const uuidCk = response.data.uuid;
        
                                if (uuidCk != null) {
                                    $('#uuid_val').addClass('border_validate_err');
                                    sweetalert('이미 존재하는 아이디입니다.', '', 'error', '닫기');
                                } else {
                                    $('#uuid_val').removeClass('border_validate_err');
                                }
                            } catch (error) {
                                sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기');
                            }
                        })
                        .catch(response => { return false; }); 
        
                }*/
                    
   
                    

        // 최종적으로 실행됨, 서버에 데이터 전송, success를 받으면 알럿 실행됨
        const fnSignInsert = () => {

            // 데이터의 직렬화, 아래 form[name='frm'] 이 name 값에 해당하는 녀석들을 json 데이터로 보낸다는 의미임 

            let jsonstr = $("form[name='frm']").serialize();
            jsonstr = decodeURIComponent(jsonstr);
            let Json_form = JSON.stringify(jsonstr).replace(/\"/gi, '');
            Json_form = "{\"" + Json_form.replace(/\&/g, '\",\"').replace(/=/gi, '\":"') + "\"}";
            alert(Json_form);
            let Json_data = JSON.parse(Json_form);

            axios.post('http://localhost:8080/member/register', Json_data)
                .then(response => {
                    try {
                        if (response.data == "success") {
                            sweetalertRegister('회원가입 되었습니다.', '', 'success', '확인')
                                .then(() => { history.push('/LoginForm'); });
                        }
                    }
                    catch (error) {
                        alert('1. 작업중 오류가 발생하였습니다.');
                    }
                })
                .catch(error => { alert('2. 작업중 오류가 발생하였습니다.'); return false; });
        };


        const submitClick = (e) => {

            e.preventDefault(); // 페이지 새로고침 방지
                                
            if (fnValidate()) {
                fnSignInsert();  // 데이터 전송 함수 호출
            }
    

    };

    // SweetAlert 알림 함수
    const sweetalert = (title, contents, icon, confirmButtonText) => {
        Swal.fire({
            title: title,
            text: contents,
            icon: icon,
            confirmButtonText: confirmButtonText
        });
    };
    
    const sweetalertRegister = (title, contents, icon, confirmButtonText) => {
        Swal.fire({
            title: title,
            text: contents,
            icon: icon,
            confirmButtonText: confirmButtonText
        }).then(function () {
            window.location.href = '/';
        });
    };

    const handleMtypeChange = (e) => {
        setMtype(e.target.value); // 선택된 값을 mtype 상태에 저장
    };

    return (
        <div>
            <section className="sub_wrap" >
                <article className="s_cnt re_1 ct1">
                    <div className="li_top">
                        <h2 className="s_tit1">회원가입</h2>
                        <form method="post" name="frm">
                            <div className="re1_wrap">
                                <div className="re_cnt ct2">
                                    <table className="table_ty1">
                                        <tr>
                                            <th>아이디</th>
                                            <td className='displayflex'>
                                                <input id="uuid_val" type="text" name="uuid"
                                                    placeholder="아이디를 입력해주세요." onKeyPress={(e) => uuidKeyPress(e)} />
                                                {/*  <button>중복확인</button> */}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>비밀번호</th>
                                            <td>
                                                <input id="upw_val" type="password" name="upw"
                                                    placeholder="비밀번호를 입력해주세요." onKeyPress={upwKeyPress} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>비밀번호 확인</th>
                                            <td>
                                                <input id="upw_cnf_val" type="password"
                                                    placeholder="비밀번호를 다시 입력해주세요." onKeyPress={memPwCnfKeyPress} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>이름</th>
                                            <td>
                                                <input id="name_val" type="text" name="name"
                                                    placeholder="이름을 입력해주세요." onKeyPress={nameKeyPress} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>이메일</th>
                                            <td>
                                                <input id="email_val" type="text" name="email"
                                                    placeholder="you@example.com" onKeyPress={emailKeyPress} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>핸드폰 번호</th>
                                            <td>
                                                <input id="phone_val" type="text" name="phone"
                                                    placeholder="핸드폰 번호를 입력해주세요." onKeyPress={phoneKeyPress} />
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
                            <div className="btn_confirm">
                                {/* <a href="javascript:" className="bt_ty bt_ty2 submit_ty1 modifyclass"
                            onClick={() => submitClick()}>회원가입</a> */}
                                <button className="bt_ty bt_ty2 submit_ty1 modifyclass" onClick={submitClick}>회원가입</button>
                            </div>
                        </form>
                    </div>
                </article >
            </section >
        </div >
    );
}

export default Register;