import React, { useState, useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import cookie from 'react-cookies';
import axios from "axios";

// CSS 파일 import
import '../css/new.css';

// 헤더 컴포넌트 import
import Header from './Header/Header';

// 메인 컴포넌트 import
import MainForm from './Main/MainForm';

// 푸터 컴포넌트 import
import Footer from './Footer/Footer';

// 로그인 컴포넌트 import
import LoginForm from './LoginForm';

// 회원 관리 컴포넌트 import
import Register from './Member/Register';
import Modify from './Member/Modify';
import MyPage from './Member/MyPage';


// 게시판 컴포넌트 import
import SubscribeLList   from './subscribe/SubscribeLList';
import SubscribeLInsert from './subscribe/SubscribeLInsert';
import SubscribeLRead   from './subscribe/SubscribeLRead';
import SubscribeLUpdate from './subscribe/SubscribeLUpdate';

import ChallengeList from './Challenge/ChallengeList';
import ChallengeInsert from './Challenge/ChallengeInsert';
import ChallengeRead from './Challenge/ChallengeRead';
import ChallengeUpdate from './Challenge/ChallengeUpdate';



const App = () => {
  const [name, setName] = useState(''); // 사용자 이름 저장
  const [token, setToken] = useState(cookie.load('token'));
 
  useEffect(() => {
    
    if (token) {
      axios
        .post('/api/member/loginCookie', { token })
        .then(response => {
          const uuid = response.data.uuid;
          if (uuid) {
            axios.post('/api/member/read', { uuid })
                .then(response => {
                    const data = response.data;
                    setToken(token);  // uuid 상태 값 설정
                    setName(data.name);  // mno 값 설정
                })
                .catch(error => {
                    console.error('회원 정보를 가져오는 중 오류 발생:', error);
                });
        } else {
            console.error('아이디를 가져오는 데 실패했습니다.');
        }
        })
        .catch(error => {
          noPermission();
        });
    }
  }, [token]);


/*     if (
      window.location.pathname.includes('/MainForm')  ||
      window.location.pathname.includes('/MyPage') ||
      window.location.pathname.includes('/MyPage') ||
      window.location.pathname.includes('/Modify/') 
      // window.location.pathname.includes('/CarRegister') ||
      // window.location.pathname.includes('/findStation') ||
      // window.location.pathname.includes('/NboardList') ||
      // window.location.pathname.includes('/NboardRegister') ||
      // window.location.pathname.includes('/NboardRead') ||
      // window.location.pathname.includes('/NboardModify')
    ) {
      axios
        .post('http://localhost:8080/member/loginCookie', {
          token: cookie.load('token') 
        })
        .then(response => {
          if (response.data.uuid === undefined) {
            noPermission();
          } 
        })
        .catch(error => {
          noPermission();
        });
    }
  }, []); */

  const noPermission = () => {
    if (window.location.hash !== 'nocookie') {
      removeCookie();
      window.location.href = '/login/#nocookie';
    }
  };

  const removeCookie = () => {
    cookie.remove('uuid', { path: '/' });
    cookie.remove('name', { path: '/' });
    cookie.remove('upw', { path: '/' });
  };

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path='/' element={<LoginForm />} />
        <Route path='/login' element={<LoginForm />} />
        <Route path='/MainForm' element={<MainForm />} />
        <Route path='/Register' element={<Register />} />
        <Route path='/MyPage' element={<MyPage />} />
        <Route path='/Modify' element={<Modify />} />
        <Route path='/SubscribeLList' element={<SubscribeLList />} />
        <Route path='/SubscribeLInsert' element={<SubscribeLInsert />} />
        <Route path='/SubscribeLRead/:sno' element={<SubscribeLRead />} />
        <Route path='/SubscribeLUpdate/:sno' element={<SubscribeLUpdate />} />
        <Route path='/ChallengeList' element={<ChallengeList />} />
        <Route path='/ChallengeRead/:bno' element={<ChallengeRead/>}/>
        <Route path='/ChallengeInsert' element={<ChallengeInsert />} />
        <Route path='/ChallengeUpdate/:bno' element={<ChallengeUpdate />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;


