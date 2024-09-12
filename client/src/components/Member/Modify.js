import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import $ from 'jquery';
import cookie from 'react-cookies';

const Modify = () => {

    const [memId, setMemId] = useState(cookie.load('memId'));
    const [memName, setMemName] = useState(cookie.load('memName'));
    const [memNickName, setMemNickName] = useState(cookie.load('memNickName'));

    useEffect(() => {
        callModifyInfoApi();
    }, []);

    const callModifyInfoApi = () => {
        axios.post('/api/members/read', {
            memId: memId,
        })
            .then(response => {
                try {
                    setMemName(response.data.memName);
                    setMemNickName(response.data.memNickName);
                    $('#is_memNickName').val(response.data.memNickName);
                }
                catch (error) {
                    alert('1. 작업중 오류가 발생하였습니다.')
                }
            })
            .catch(error => { alert('2. 작업중 오류가 발생하였습니다.'); return false; });
    }

    const submitClick = (type, e) => {
        const memPw_val_checker = $('#memPw_val').val();
        const memPw_cnf_val_checker = $('#memPw_cnf_val').val();
        const memNickName_val_checker = $('#memNickName_val').val();

        const fnValidate = (e) => {
            const pattern1 = /[0-9]/;
            const pattern2 = /[a-zA-Z]/;
            const pattern3 = /[~!@#$%^&*()_+|<>?:{}]/;

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
            setMemNickName(memNickName_val_checker)
            axios.post('/api/members/ninameCk', {
                memNickName: memNickName
            })
                .then(response => {
                    try {
                        const memNickNameCk = response.data.memNickName;

                        if (memNickNameCk != null) {
                            $('#memNickName_val').addClass('border_validate_err');
                            sweetalert('이미 존재하는 닉네임입니다.', '', 'error', '닫기');
                        } else {
                            $('#memNickName_val').removeClass('border_validate_err');
                            fnSignInsert('modify', e);
                        }
                    } catch (error) {
                        sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기');
                    }
                })
                .catch(response => { return false; });
        }

        const fnSignInsert = (type, e) => {
            let jsonstr = $("form[name='frm']").serialize();
            jsonstr = decodeURIComponent(jsonstr);
            let Json_form = JSON.stringify(jsonstr).replace(/\"/gi, '');
            Json_form = "{\"" + Json_form.replace(/\&/g, '\",\"').replace(/=/gi, '\":"') + "\"}";
            let Json_data = JSON.parse(Json_form);


            axios.post('/api/members/modify', Json_data)
                .then(response => {
                    try {
                        if (response.data == "SUCCESS") {
                            if (type == 'modify') {
                                sweetalertModify('수정되었습니다. \n 다시 로그인해주세요.', '', 'success', '확인');
                            }
                        }
                    }
                    catch (error) {
                        alert('1. 작업중 오류가 발생하였습니다.');
                    }
                })
                .catch(error => { alert('2. 작업중 오류가 발생하였습니다.'); return false; });

        }
    };

    const memPwKeyPress = (e) => {
        $('#memPw_val').removeClass('border_validate_err');
    };

    const memPwCnfKeyPress = (e) => {
        $('#memPw_cnf_val').removeClass('border_validate_err');
    };

    const memNickNameKeyPress = (e) => {
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

    const sweetalertModify = (title, contents, icon, confirmButtonText) => {
        Swal.fire({
            title: title,
            text: contents,
            icon: icon,
            confirmButtonText: confirmButtonText
        }).then(function () {
            cookie.remove('memId', { path: '/' });
            cookie.remove('memNickName', { path: '/' });
            cookie.remove('memPw', { path: '/' });
            window.location.href = '/';
        });
    };

    const deleteMember = () => {
        sweetalertDelete('정말 탈퇴하시겠습니까?', function () {
            axios.post('/api/members/remove', {
                memId: memId
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
                cookie.remove('memId', { path: '/' });
                cookie.remove('memNickName', { path: '/' });
                cookie.remove('memPw', { path: '/' });
                window.location.href = '/MainForm';
            } else {
                return false;
            }
            callbackFunc();
        });
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
                                                <input id="memNickName_val" type="text" name="memNickName" placeholder="닉네임을 입력해주세요."
                                                    onKeyPress={memNickNameKeyPress} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>새 비밀번호</th>
                                            <td>
                                                <input id="memPw_val" type="password" name="memPw"
                                                    placeholder="비밀번호를 입력해주세요." onKeyPress={memPwKeyPress} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>비밀번호 확인</th>
                                            <td>
                                                <input id="memPw_cnf_val" type="password"
                                                    placeholder="비밀번호를 한번 더 입력해주세요." onKeyPress={memPwCnfKeyPress} />
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                            <div className="btn_confirm">
                                <a href="javascript:" className="bt_ty bt_ty2 submit_ty1 modifyclass"
                                    onClick={(e) => submitClick('modify', e)}>수정</a>

                                <a href="javascript:" className="bt_ty bt_ty2 submit_ty1 deleteclass"
                                    onClick={(e) => deleteMember()}>탈퇴</a>
                            </div>
                        </form>
                    </div>
                </article>
            </section>
        </div>
    );
}

export default Modify;