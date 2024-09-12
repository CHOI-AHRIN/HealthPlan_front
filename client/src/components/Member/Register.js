import React, {} from 'react';
import axios from "axios";
import Swal from 'sweetalert2';
import $ from 'jquery';

const Register = () => {

    const submitClick = () => {

        const memId_val_checker = $('#memId_val').val();
        const memPw_val_checker = $('#memPw_val').val();
        const memPw_cnf_val_checker = $('#memPw_cnf_val').val();
        const memName_val_checker = $('#memName_val').val();
        const memNickName_val_checker = $('#memNickName_val').val();

        const fnValidate = () => { 
            const pattern1 = /[0-9]/;
            const pattern2 = /[a-zA-Z]/;
            const pattern3 = /[~!@#$%^&*()_+|<>?:{}]/;

            if (memId_val_checker === '') {
                $('#memId_val').addClass('border_validate_err');
                sweetalert('이메일 주소를 다시 확인해주세요.', '', 'error', '닫기');
                return false;
            }
            if (memId_val_checker.search(/\s/) !== -1) {
                $('#memId_val').addClass('border_validate_err');
                sweetalert('이메일 공백을 제거해 주세요.', '', 'error', '닫기');
                return false;
            }
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(memId_val_checker)) {
                $('#memId_val').addClass('border_validate_err');
                sweetalert('올바른 이메일 형식을 입력해주세요.', '', 'error', '닫기');
                return false;
            }

            $('#memId_val').removeClass('border_validate_err');


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
                    sweetalert('8~16자 영문 대 소문자\n숫자, 특수문자를 사용하세요.', '', 'error', '닫기');
                    return false;
                }
            }
            $('#memPw_val').removeClass('border_validate_err');

            if (memPw_cnf_val_checker === '') {
                $('#memPw_cnf_val').addClass('border_validate_err');
                sweetalert('비밀번호를 한번 더 입력해주세요.', '', 'error', '닫기');
                return false;
            }
            if (memPw_val_checker !== memPw_cnf_val_checker) {
                $('#memPW_val').addClass('border_validate_err');
                $('#memPw_cnf_val').addClass('border_validate_err');
                sweetalert('비밀번호가 일치하지 않습니다.', '', 'error', '닫기');
                return false;
            }
            $('#memPw_cnf_val').removeClass('border_validate_err');

            if (memName_val_checker === '') {
                $('#memName_val').addClass('border_validate_err');
                sweetalert('이름을 입력해주세요.', '', 'error', '닫기');
                return false;
            }
            if (memName_val_checker.search(/\s/) !== -1) {
                $('#memName_val').addClass('border_validate_err');
                sweetalert('이름에 공백을 제거해 주세요.', '', 'error', '닫기');
                return false;
            }
            $('#memNickName_val').removeClass('border_validate_err');
            if (memNickName_val_checker === '') {
                $('#memNickName_val').addClass('border_validate_err');
                sweetalert('닉네임을 입력해주세요.', '', 'error', '닫기');
                return false;
            }
            if (memNickName_val_checker.search(/\s/) !== -1) {
                $('#memNickName_val').addClass('border_validate_err');
                sweetalert('닉네임에 공백을 제거해 주세요.', '', 'error', '닫기');
                return false;
            }
            $('#memNickName_val').removeClass('border_validate_err');
            return true;
        }


        if (fnValidate()) {
            axios.post('/api/members/emailCk', {
                memId: memId_val_checker
            })
                .then(response => {
                    try {
                        const memIdCk = response.data.memId;

                        if (memIdCk != null) {
                            $('#memId_val').addClass('border_validate_err');
                            sweetalert('이미 존재하는 이메일입니다.', '', 'error', '닫기');
                        } else {
                            $('#memId_val').removeClass('border_validate_err');
                        }
                    } catch (error) {
                        sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기');
                    }
                })
                .catch(response => { return false; });

            axios.post('/api/members/ninameCk', {
                memNickName: memNickName_val_checker
            })
                .then(response => {
                    try {
                        const memNickNameCk = response.data.memNickName;

                        if (memNickNameCk != null) {
                            $('#memNickName_val').addClass('border_validate_err');
                            sweetalert('이미 존재하는 닉네임입니다.', '', 'error', '닫기');
                        } else {
                            $('#memNickName_val').removeClass('border_validate_err');
                            fnSignInsert();
                        }
                    } catch (error) {
                        sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기');
                    }
                })
                .catch(response => { return false; });
        }

        const fnSignInsert = () => {

            let jsonstr = $("form[name='frm']").serialize();
            jsonstr = decodeURIComponent(jsonstr);
            let Json_form = JSON.stringify(jsonstr).replace(/\"/gi, '');
            Json_form = "{\"" + Json_form.replace(/\&/g, '\",\"').replace(/=/gi, '\":"') + "\"}";
            let Json_data = JSON.parse(Json_form);

            axios.post('/api/members/register', Json_data)
                .then(response => {
                    try {
                        if (response.data == "success") {
                            sweetalertRegister('회원가입 되었습니다.', '', 'success', '확인');
                        }
                    }
                    catch (error) {
                        alert('1. 작업중 오류가 발생하였습니다.');
                    }
                })
                .catch(error => { alert('2. 작업중 오류가 발생하였습니다.'); return false; });
        }
    };

    const memIdKeyPress = () => {
        $('#memId_val').removeClass('border_validate_err');
    };

    const memPwKeyPress = () => {
        $('#memPw_val').removeClass('border_validate_err');
    };

    const memPwCnfKeyPress = () => {
        $('#memPw_cnf_val').removeClass('border_validate_err');
    };

    const memNameKeyPress = () => {
        $('#memName_val').removeClass('border_validate_err');
    };

    const memNickNameKeyPress = () => {
        $('#memNickName_val').removeClass('border_validate_err');
    };

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
                                            <th>이메일</th>
                                            <td className='displayflex'>
                                                <input id="memId_val" type="text" name="memId"
                                                    placeholder="이메일을 입력해주세요." onKeyPress={memIdKeyPress} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>비밀번호</th>
                                            <td>
                                                <input id="memPw_val" type="password" name="memPw"
                                                    placeholder="비밀번호를 입력해주세요." onKeyPress={memPwKeyPress} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>비밀번호 확인</th>
                                            <td>
                                                <input id="memPw_cnf_val" type="password"
                                                    placeholder="비밀번호를 다시 입력해주세요." onKeyPress={memPwCnfKeyPress} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>이름</th>
                                            <td>
                                                <input id="memName_val" type="text" name="memName"
                                                    placeholder="이름을 입력해주세요." onKeyPress={memNameKeyPress} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>닉네임</th>
                                            <td>
                                                <input id="memNickName_val" type="text" name="memNickName"
                                                    placeholder="닉네임을 입력해주세요." onKeyPress={memNickNameKeyPress} />
                                            </td>
                                        </tr>

                                    </table>
                                </div>
                            </div>
                            <div className="btn_confirm">
                                <a href="javascript:" className="bt_ty bt_ty2 submit_ty1 modifyclass"
                                    onClick={() => submitClick()}>회원가입</a>
                            </div>
                        </form>
                    </div>
                </article>
            </section>
        </div>
    );
}

export default Register;