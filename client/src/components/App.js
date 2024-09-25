import React, { useState, useEffect } from 'react';
import { Route } from "react-router-dom";
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


const App = () => {
  const [name, setName] = useState(''); // 사용자 이름 저장
  const [token, setToken] = useState(cookie.load('token'));
 
  useEffect(() => {
    
    if (token) {
      axios
        .post('http://localhost:8080/member/loginCookie', { token })
        .then(response => {
          const uuid = response.data.uuid;
          if (uuid) {
            // uuid로 사용자 이름 가져오기
            axios.post('http://localhost:8080/member/readName', { uuid })
              .then(response => {
                setName(response.data.name); // 서버로부터 받은 이름 설정
              })
              .catch(error => {
                console.error('Error fetching user data:', error);
                noPermission();
              });
          } else {
            noPermission();
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
      <Route exact path='/' component={LoginForm} />
      <Route path='/login' component={LoginForm} />
      <Route path='/MainForm' component={MainForm} />
      <Route path='/Register' component={Register} />
      <Route path='/MyPage' component={MyPage} />
      <Route path='/Modify/' component={Modify} />
      {/* <Route path='/CarRegister' component={CarRegister} />
      <Route path='/FindStation' component={FindStation} />
      <Route path='/NboardRegister' component={NboardRegister} />
      <Route path='/NboardRead/:bno' component={NboardRead} />
      <Route path='/NboardModify/:bno' component={NboardModify} /> */}
      <Footer />
    </div>
  );
};

export default App;


