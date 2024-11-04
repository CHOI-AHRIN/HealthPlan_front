import React, { useEffect } from 'react';
import $ from 'jquery';

const Footer = () => {

  useEffect(() => {


    if (window.location.pathname.endsWith('/')) {
      $('footer').hide();

    }
    if (window.location.pathname.indexOf('/login') != -1) {
      $('footer').hide();
    }

    if (window.location.pathname.indexOf('/Register') != -1) {
      $('footer').hide();
    }
  }, []);


  return (
    <footer className="footer">
      <ul>
        <li className="priv"><a href="https://www.pipc.go.kr/np/default/page.do?mCode=H010000000">개인정보처리방침</a></li>
        <li className="em_bt"><a href="#n">이메일주소무단수집거부</a></li>
      </ul>
      <div className="ft_p">
        <span>주소 : 서울특별시 마포구 신촌로 94 그랜드플라자 7층 </span>
        <span>Tel : 02-716-1006</span>
      </div>
      <p>COPYRIGHT &copy; HealthPlan, ALL RIGHTS RESERVED.</p>
    </footer>
  );

}

export default Footer;