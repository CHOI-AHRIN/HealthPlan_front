import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import cookie from 'react-cookies';
import $ from 'jquery';

const Header = () => {

    const [token, setToken] = useState(cookie.load('token'));
    const [uuid, setUuid] = useState(''); // uuid 상태를 추가
    const [name, setName] = useState('');
    const [activeMenu, setActiveMenu] = useState('/');
    const [menuVisible, setMenuVisible] = useState(false);
    /*  const [activeIndex, setActiveIndex] = useState(null); // 활성화된 메뉴 인덱스 */
    const [submenuVisible, setSubmenuVisible] = useState(false); // 서브메뉴

    /*     const MENU_LIST = [
            { title: '커뮤니티', list: [ '식단', '운동' ] },
            { title: '챌린지', list: [ '챌린지'] },
            { title: '구독', list: [ '구독', '강의' ] },
            { title: 'FAQ', list: [ 'FAQ' ] },
            { title: '마이페이지', list: [ '마이페이지' ] }
        ]; */


    useEffect(() => {
        // 특정 경로에서만 헤더를 숨기기
        if (
            window.location.pathname.endsWith('/') ||
            window.location.pathname.includes('/login') ||
            window.location.pathname.includes('/Register')
        ) {
            $('header').hide();
        } else {
            $('header').show(); // 다른 경로에서는 다시 보여줌
        }

        // 토큰이 있으면 서버에서 uuid 값을 가져와 설정
        if (token) {
            axios
                .post('http://localhost:8080/api/member/loginCookie', { token })
                .then(response => {
                    if (response.data && response.data.uuid) {
                        setUuid(response.data.uuid); // uuid 설정
                        setName(response.data.name); // name 설정 가능하면 설정
                    }
                })
                .catch(error => {
                    console.error('Error fetching UUID:', error);
                });
        }
    }, [token]); // token이 변경될 때마다 실행


    /* 로그아웃 */
    const logout = () => {
        cookie.remove('token', { path: '/' });
        cookie.remove('name', { path: '/' });
        // cookie.remove('upw', { path: '/' });
        window.location.href = '/login';
    };

    /* 메뉴 클릭 핸들러 */
    const handleMenuClick = (path) => {
        setActiveMenu(path);
        setMenuVisible(false);
    };


    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    /* 서브메뉴 클릭 핸들러 */
    const toggleSubmenu = () => {
        setSubmenuVisible(!submenuVisible);
    }

    return (
        <header className="gnb_box">
            <div className="hd_top">
                <div className="top_wrap ct1 af">
                    <span className="health-plan-title">
                        <a href="/MainForm" className="health-plan-link">HealthPlan</a>
                    </span>
                    <div className="hd_right">
                        <p>
                            <span>'{uuid}'</span>님 안녕하세요.
                        </p>
                        <button type="button" onClick={logout}>
                            로그아웃
                        </button>
                    </div>
                </div>

            </div>
            <div className="h_nav ct1 af">
                <div className="logo">
                    <img src={require('../../img/layout/exerciseMan.gif')} height="100px" width="200px" alt="" />
                </div>
                <div className={`menu-icon ${menuVisible ? 'open' : ''}`} onClick={toggleMenu}>
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                </div>
                <div className="hbrfont">
                    <nav className={`nav ${menuVisible ? 'show-menu' : ''}`}>
                        <ul className="menubar">
                            <li className={`menulist ${window.location.pathname === '/MainForm' ? 'active' : ''}`}>
                                <Link to={'/MainForm'} onClick={() => handleMenuClick('/MainForm')}>
                                    홈
                                </Link>
                            </li>
                            {/* <li className={`menulist ${window.location.pathname === '/' ? 'active' : ''}`}>
                                <Link to={'/'} onClick={() => handleMenuClick('/')}>
                                    커뮤니티
                                </Link>
                            </li> */}
                            <li className={`menulist ${window.location.pathname === '/ChallengeList' ? 'active' : ''}`}>
                                <Link to={'/ChallengeList'} onClick={() => handleMenuClick('/ChallengeList')}>
                                    챌린지
                                </Link>
                            </li>
                            <li 
                                   className={`menulist ${
                                    (window.location.pathname === '/SubscribeLList' || window.location.pathname === '/SubscribeList') 
                                        ? 'active' 
                                        : ''
                                }`}
                                onMouseEnter={toggleSubmenu}
                                onMouseLeave={toggleSubmenu}
                            >
                                <Link to={'/SubscribeLList'} onClick={() => handleMenuClick('/SubscribeLList')}>
                                    구독
                                </Link>
                                {submenuVisible && (
                                    <ul className="submenu">
                                        <li className="submenu-item">
                                            <Link to={'/SubscribeList'}>구독</Link>
                                        </li>
                                        <li className="submenu-item">
                                            <Link to={'/SubscribeLList'}>강의</Link>
                                        </li>
                                    </ul>
                                )}
                            </li>
                            {/* <li className="menulist">
                                <Link to={'/VboardList'} onClick={() => handleMenuClick('')}>
                                FAQ
                                </Link> 
                            </li> */}
                            <li className={`menulist ${window.location.pathname === '/MyPage' ? 'active' : ''}`}>
                                <Link to={'/MyPage'} onClick={() => handleMenuClick('/MyPage')}>
                                    마이페이지
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div >
            </div >
        </header >
    );
};

export default Header;