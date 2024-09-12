import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import cookie from 'react-cookies';
import $ from 'jquery';

const Header = () => {

    const [memId, setMemId] = useState(cookie.load('memId'))
    const [memNickName, setMemNickName] = useState(cookie.load('memNickName'));
    const [activeMenu, setActiveMenu] = useState('/');
    const [menuVisible, setMenuVisible] = useState(false);

    useEffect(() => {

        if (
            window.location.pathname.endsWith('/') ||
            window.location.pathname.includes('/login') ||
            window.location.pathname.includes('/Register')
        ) {
            $('header').hide();
        }

        if (memId !== undefined) {
            $('.menulist').show();
            $('.hd_top').show();
        } else {
            $('.menulist').hide();
            $('.hd_top').hide();
        }
    }, []);

    const logout = () => {
        cookie.remove('memId', { path: '/' });
        cookie.remove('memNickName', { path: '/' });
        cookie.remove('memPw', { path: '/' });
        window.location.href = '/login';
    };

    const handleMenuClick = (path) => {
        setActiveMenu(path);
        setMenuVisible(false);
    };

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    return (
        <header className="gnb_box">
            <div className="hd_top">
                <div className="top_wrap ct1 af">
                    <span>HealthPlan</span>
                    <div className="hd_right">
                        <p>
                            <span>'{memNickName}'</span>님 안녕하세요.
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
                            <li className={`menulist ${window.location.pathname === '/findStation' ? 'active' : ''}`}>
                                <Link to={'/findStation'} onClick={() => handleMenuClick('/findStation')}>
                                    충전소 검색
                                </Link>
                            </li>
                            <li className={`menulist ${window.location.pathname === '/NboardList' ? 'active' : ''}`}>
                                <Link to={'/NboardList'} onClick={() => handleMenuClick('/NboardList')}>
                                    공지사항
                                </Link>
                            </li>
                            <li className="menulist">
                                <Link to={'/FboardList'} onClick={() => handleMenuClick('')}>
                                    커뮤니티
                                </Link>
                            </li>
                            <li className="menulist">
                                <Link to={'/VboardList'} onClick={() => handleMenuClick('')}>
                                    리뷰쓰기
                                </Link>
                            </li>
                            <li className="menulist">
                                <Link to={'/QboardList'} onClick={() => handleMenuClick('')}>
                                    문의하기
                                </Link>
                            </li>
                            <li className={`menulist ${window.location.pathname === '/MyPage' ? 'active' : ''}`}>
                                <Link to={'/MyPage'} onClick={() => handleMenuClick('/MyPage')}>
                                    마이페이지
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;
