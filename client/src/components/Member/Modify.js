import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import $ from 'jquery';
import cookie from 'react-cookies';

const Modify = () => {

    const [uuid, setUuid] = useState(cookie.load('uuid'));
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mno, setMno] = useState('');
    const [phone, setPhone] = useState('');

    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [isEditingPhone, setIsEditingPhone] = useState(false);

    useEffect(() => {
        callModifyInfoApi();
    }, []);


    const callModifyInfoApi = () => {

        // 1. 쿠키에서 토큰 가져오기 
        const token = cookie.load('token');

        // 2. token을 서버로 보내고 uuid를 받아오기
        axios
            .post('http://localhost:8080/member/loginCookie', {

                token: token
            }).then(response => { // then 함수 안에서 다시 호출
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
                        $('#email_val').val(data.email);
                        setPhone(data.phone);    // 연락처
                        $('#phone_val').val(data.phone);
                        setMno(data.mno);        // 회원 번호
                    }
                    catch (error) {
                        alert('회원데이터를 읽어오는 중에 오류가 발생했습니다.');
                    }
                }).catch(error => { alert('토큰을 확인하는 중에 오류가 발생했습니다.'); return false; });
            })
    };

    const fnSignInsert = (type, e) => {
        let jsonstr = $("form[name='frm']").serialize();
        jsonstr = decodeURIComponent(jsonstr);
        let Json_form = JSON.stringify(jsonstr).replace(/\"/gi, '');
        Json_form = "{\"" + Json_form.replace(/\&/g, '\",\"').replace(/=/gi, '\":"') + "\"}";
        let Json_data = JSON.parse(Json_form);

        axios.post('http://localhost:8080/member/modify', Json_data)
            .then(response => {
                try {
                    if (response.data === "SUCCESS") {
                        if (type === 'modify') {
                            sweetalertModify('수정되었습니다. \n 다시 로그인해주세요.', '', 'success', '확인');
                        }
                    }
                } catch (error) {
                    alert('1. 작업중 오류가 발생하였습니다.');
                }
            })
            .catch(error => { 
                alert('2. 작업중 오류가 발생하였습니다 (서버).'); 
                return false; 
            });
    };

        const submitClick = (type, e) => {
        const memPw_val_checker = $('#upw').val();
        const memPw_cnf_val_checker = $('#upw_cnf_val').val();
        const email_val_checker = $('#email_val').val();
        const phone_val_checker = $('#phone_val').val();

        const fnValidate = (e) => {
            const pattern1 = /[0-9]/;
            const pattern2 = /[a-zA-Z]/;
            const pattern3 = /[~!@#$%^&*()_+|<>?:{}]/;

            // 연락처
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


            // 비밀번호
            if (memPw_val_checker === '') {
                $('#memPw_val').addClass('border_validate_err');
                sweetalert('비밀번호를 입력해주세요.', '', 'error', '닫기');
                return false;
            }
            if (memPw_val_checker !== '') {
                const str = memPw_val_checker;
                if (str.search(/\s/) !== -1) {
                    $('#memPw_val').addClass('border_validate_err');
                    sweetalert('비밀번호 공백을 제거해 주세요.', '', 'error', '닫기');
                    return false;
                }
                if (!pattern1.test(str) || !pattern2.test(str) || !pattern3.test(str)
                    || str.length < 8 || str.length > 16) {
                    $('#memPw_val').addClass('border_validate_err');
                    sweetalert('8~16자 영문 대 소문자 \n 숫자, 특수문자를 사용하세요.', '', 'error', '닫기');
                    return false;
                }
            }
            $('#memPw_val').removeClass('border_validate_err');

            if (memPw_cnf_val_checker === '') {
                $('#memPw_cnf_val').addClass('border_validate_err');
                sweetalert('비밀번호 확인을 입력해주세요.', '', 'error', '닫기');
                return false;
            }
            if (memPw_val_checker !== memPw_cnf_val_checker) {
                $('#memPw_val').addClass('border_validate_err');
                $('#memPw_cnf_val').addClass('border_validate_err');
                sweetalert('비밀번호가 일치하지 않습니다.', '', 'error', '닫기');
                return false;
            }
            $('#memPw_cnf_val').removeClass('border_validate_err');
            return true;
        }

        if (fnValidate()) {
            fnSignInsert('modify', e);
        }
    }; 


    const memPwKeyPress = (e) => {
        $('#upw').removeClass('border_validate_err');
    };

    const memPwCnfKeyPress = (e) => {
        $('#upw_cnf_val').removeClass('border_validate_err');
    };

    const emailKeyPress = () => {
        $('#email_val').removeClass('border_validate_err');
    };

    const phoneKeyPress = () => {
        $('#phone_val').removeClass('border_validate_err');
    };


    const sweetalert = (title, contents, icon, confirmButtonText) => {
        Swal.fire({
            title: title,
            text: contents,
            icon: icon,
            confirmButtonText: confirmButtonText
        });
    };

    const sweetalertModify = (title, contents, icon, confirmButtonText) => {
        Swal.fire({
            title: title,
            text: contents,
            icon: icon,
            confirmButtonText: confirmButtonText
        }).then(function () {
            cookie.remove('uuid', { path: '/' });
            cookie.remove('name', { path: '/' });
            cookie.remove('upw', { path: '/' });
            window.location.href = '/';
        });
    };

    const deleteMember = () => {
        sweetalertDelete('정말 탈퇴하시겠습니까?', function () {
            axios.post('http://localhost:8080/member/remove', {
                uuid: uuid
            })
                .then(response => {
                }).catch(error => { alert('작업중 오류가 발생하였습니다.'); return false; });
        });
    };

    const sweetalertDelete = (title, callbackFunc) => {
        Swal.fire({
            title: title,
            text: "",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.value) {
                Swal.fire(
                    '탈퇴되었습니다.',
                    '',
                    'success'
                );
                cookie.remove('uuid', { path: '/' });
                cookie.remove('name', { path: '/' });
                cookie.remove('upw', { path: '/' });
                window.location.href = '/login';
            } else {
                return false;
            }
            callbackFunc();
        });
    };



    const toggleEditEmail = () => {
        setIsEditingEmail(!isEditingEmail);
    };

    const toggleEditPhone = () => {
        setIsEditingPhone(!isEditingPhone);
    };




    return (
        <div>
            <section className="sub_wrap" >
                <article className="s_cnt re_1 ct1">
                    <div className="li_top">
                        <h2 className="s_tit1">회원정보수정</h2>
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
                                                <input id="phone_val"  type="text" name="phone"  />
       
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>이메일</th>
                                            <td>
                                                <input id="email_val" type="text" name="email" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>새 비밀번호</th>
                                            <td>
                                                <input id="upw" type="password" name="upw"
                                                    placeholder="비밀번호를 입력해주세요." onKeyPress={memPwKeyPress} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>비밀번호 확인</th>
                                            <td>
                                                <input id="upw_cnf_val" type="password"
                                                    placeholder="비밀번호를 한번 더 입력해주세요." onKeyPress={memPwCnfKeyPress} />
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                            <div>
                            <div className="btn_confirm bt_ty bt_ty2 submit_ty1 modifyclass"  type="button" onClick={(e) => submitClick('modify', e)} >수정</div>
                                {/* <a href="javascript:" className="bt_ty bt_ty2 submit_ty1 modifyclass"
                                    onClick={(e) => submitClick('modify', e)}>수정</a> */}
                            <div className="bt_ty bt_ty2 submit_ty1 deleteclass"  type="button" onClick={(e) => deleteMember()} >탈퇴</div>
                                {/* <a href="javascript:" className="bt_ty bt_ty2 submit_ty1 modifyclass"
                                    onClick={(e) => submitClick('modify', e)}>수정</a> */}
                           
                                {/* <a href="javascript:" className="bt_ty bt_ty2 submit_ty1 deleteclass"
                                    onClick={(e) => deleteMember()}>탈퇴</a> */}
                            </div>
                        </form>
                    </div>
                </article>
            </section>
        </div>
    );
}

export default Modify;