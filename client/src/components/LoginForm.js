import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import cookie from 'react-cookies';
import Swal from 'sweetalert2';

const LoginForm = () => {
    const [memId, setMemId] = useState('');
    const [memPw, setMemPw] = useState('');

    const sweetalert = (title, contents, icon, confirmButtonText) => {
        Swal.fire({
            title: title,
            text: contents,
            icon: icon,
            confirmButtonText: confirmButtonText
        });
    };

    const submitClick = () => {
        if (memId === '' || memPw === '') {
            sweetalert('이메일과 비밀번호를 입력해주세요.', '', 'error', '닫기');
        } else {
            axios.post('/api/members/loginPost', {
                memId: memId,
                memPw: memPw
            })
                .then(response => {
                    if (response.data.memId !== undefined) {
                        const expires = new Date();
                        expires.setMinutes(expires.getMinutes() + 60);
                        cookie.save('memId', response.data.memId, { path: '/', expires });
                        cookie.save('memNickName', response.data.memNickName, { path: '/', expires });
                        cookie.save('memPw', response.data.memPw, { path: '/', expires });
                        window.location.href = '/MainForm';
                    } else {
                        sweetalert('이메일과 비밀번호를 확인해주세요.', '', 'error', '닫기');
                    }
                })
                .catch(error => {
                    sweetalert('이메일과 비밀번호를 확인해주세요.', '', 'error', '닫기');
                });
        }
    }

    const handleOnKeyPress = (e) => {
        if (e.key === 'Enter') {
            submitClick();
        }
    };

    return (
        <section className="main">
            <div className="m_login signin">
                <span className="logo-image">
                    <img src={require("../img/layout/어디야로고.png")} style={{ width: '350px', height: 'auto', marginBottom: '0px' }} />
                </span>
                <h3>LOGIN</h3>
                <div className="log_box">
                    <div className="in_ty1">
                        <span><img src={require("../img/main/m_log_i3.png")} alt="" /></span>
                        <input type="email" id="memId_val" placeholder="이메일" onChange={e => setMemId(e.target.value)} />
                    </div>
                    <div className="in_ty1">
                        <span className="ic_2">
                            <img src={require("../img/main/m_log_i2.png")} alt="" />
                        </span>
                        <input type="password" id="memPw_val" placeholder="비밀번호" onKeyPress={handleOnKeyPress} onChange={e => setMemPw(e.target.value)} />
                    </div>
                    <br></br>
                    <div className="s_bt" type="button" onClick={submitClick}>로그인</div>
                    <br></br>
                    <Link to={"/Register"}>
                        <div className="s_bt" type="button">회원가입</div>
                    </Link>
                </div>
            </div>
        </section>
    );

}

export default LoginForm;