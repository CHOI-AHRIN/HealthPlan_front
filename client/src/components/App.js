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
import MemberList from './Member/MemberList';
import MemberModify from './Member/MemberModify';




// 구독 컴포넌트 import
import SubscribeLList from './subscribe/SubscribeLList';
import SubscribeLInsert from './subscribe/SubscribeLInsert';
import SubscribeLRead from './subscribe/SubscribeLRead';
import SubscribeLUpdate from './subscribe/SubscribeLUpdate';

// 구독 전문가 컴포넌트 import
import SubscribeList from './subscribe/SubscribeList';
import SubscribeInsert from './subscribe/SubscribeInsert';
import SubscribeRead from './subscribe/SubscribeRead';
import SubscribeUpdate from './subscribe/SubscribeUpdate';

// 챌린지 컴포넌트 import
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
            axios.post('/api/member/readName', { uuid })
              .then(response => {
                console.log('응답 데이터:', response.data); // 응답 데이터 출력
                const data = response.data;
                setToken(token);  // uuid 상태 값 설정
                setName(data.name);  // name 값 설정
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
        <Route path='/MemberList' element={<MemberList />} />
        <Route path='/MemberModify/:uuid' element={<MemberModify />} />
        <Route path='/SubscribeLList' element={<SubscribeLList />} />
        <Route path='/SubscribeLInsert' element={<SubscribeLInsert />} />
        <Route path='/SubscribeLRead/:sno' element={<SubscribeLRead />} />
        <Route path='/SubscribeLUpdate/:sno' element={<SubscribeLUpdate />} />
        <Route path='/SubscribeList' element={<SubscribeList />} />
        <Route path='/SubscribeInsert' element={<SubscribeInsert />} />
        <Route path='/SubscribeRead/:sno' element={<SubscribeRead />} />
        <Route path='/SubscribeUpdate/:sno' element={<SubscribeUpdate />} />
        <Route path='/ChallengeList' element={<ChallengeList />} />
        <Route path='/ChallengeRead/:bno' element={<ChallengeRead />} />
        <Route path='/ChallengeInsert' element={<ChallengeInsert />} />
        <Route path='/ChallengeUpdate/:bno' element={<ChallengeUpdate />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;


