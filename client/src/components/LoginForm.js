import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import cookie from 'react-cookies';
import Swal from 'sweetalert2';

const LoginForm = () => { // memId와 memPw는 화면이나 로직에서 사용되는 변수 이름
    const [uuid, setUuid] = useState(''); // memId>현재 상태값을 저장하는 변수, 처음엔 빈 문자열로 초기화 / setUuid> memId 상태를 업데이트 할 때 사용하는 함수, 이 함수를 호출해 값을 변경할 수 있게 함
    const [upw, setUpw] = useState('');
    const [name, setName] = useState('');

    const sweetalert = (title, contents, icon, confirmButtonText, timer = 0) => {
        Swal.fire({
            title: title,
            text: contents,
            icon: icon,
            confirmButtonText: confirmButtonText,
            timer: timer, // 타이머 추가
            timerProgressBar: true, // 타이머 진행바 추가
            willClose: () => {
                clearTimeout(timer); // 타이머 클리어
            }
        });
    };

    const submitClick = () => {
        if (uuid === '' || upw === '') {
            sweetalert('아이디와 비밀번호를 입력해 주세요.', '', 'error', '닫기');
        } else {
            axios.post('http://localhost:8080/member/loginPost', {
                uuid: uuid, // 서버에 전달될 객체의 키 : 리액트 상태 변수 (사용자가 선언한 값을 담음)
                upw: upw
            })

                .then(response => {
                    if (response.data.token) { // 서버에서 jwt 토큰 반환
                        console.log(response);  // 응답 데이터 확인
                        const expires = new Date();
                        expires.setMinutes(expires.getMinutes() + 60);
                        cookie.save('token', response.data.token, { path: '/', expires });
                        cookie.save('name', response.data.name, { path: '/', expires });
                        window.location.href = '/MainForm';
                        sweetalert('로그인 성공', '', 'success', '닫기', 5000);
                        setTimeout(() => {
                            window.location.href ='/MainForm';
                        }, 5000 )
                    } else {
                        sweetalert('아이디와 비밀번호를 확인해주세요.', '', 'error', '닫기');
                        console.log(response);  // 응답 데이터 확인
                        console.log("Response Data:", response.data);  // 응답 데이터 확인
                    }
                })
                .catch(error => {
                    sweetalert('아이디와 비밀번호를 확인해주세요.', '', 'error', '닫기');
                });

        }
    }

    const handleOnKeyPress = (e) => { // 엔터치면 로그인 버튼이 눌러지도록!
        if (e.key === 'Enter') {
            submitClick();
        }
    };

    return (
        <section className="main">
            <div className="m_login signin">
                <span className="logo-image">
                    <img src={require("../img/layout/HealthPlan logo.png")} style={{ width: '350px', height: 'auto', marginBottom: '0px' }} alt="메인로고" />
                </span>
                {/* <h2>LOGIN</h2> */}

                <div className="log_box">
                    <div className="in_ty1">
                        <label htmlFor="uuid">
                            <span><img src={require("../img/main/m_log_i3.png")} alt="아이디 입력 아이콘" /></span>
                        </label>
                        <input type="text" id="uuid" placeholder="아이디" onChange={e => setUuid(e.target.value)} />   {/* 사용자 입력에 따라 memId 값을 업데이트 */}
                    </div>
                    <div className="in_ty1">
                        <label htmlFor="upw">
                            <span className="ic_2">
                                <img src={require("../img/main/m_log_i2.png")} alt="비밀번호 입력 아이콘" />
                            </span>
                        </label>
                        <input type="password" id="upw" placeholder="비밀번호" onKeyPress={handleOnKeyPress} onChange={e => setUpw(e.target.value)} />
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