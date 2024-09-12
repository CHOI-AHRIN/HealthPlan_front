/*global kakao*/
import React, { useEffect } from 'react';
import $ from 'jquery';
import './App.css';
import axios from "axios";
const { kakao } = window;

const App = () => {

  useEffect(() => {
    callStationListApi();
  }, []);

  const callStationListApi = () => {
    axios.get('http://localhost:8000/api/charging-stations/', {
    })
      .then(response => {
        try {
          StationListAppend(response.data);
        } catch (error) {
          alert("충전소 정보 입력 오류");
        }
      })
      .catch(error => { alert("서버데이터 조회 실패"); return false; });
  }

  const StationListAppend = (STList) => {
    const mapContainer = document.getElementById('map'),
      mapOption = {
        center: new kakao.maps.LatLng(37.505496, 127.005116),
        level: 9
      }
    const map = new kakao.maps.Map(mapContainer, mapOption)
    const clusterer = new kakao.maps.MarkerClusterer({
      map: map,
      averageCenter: true,
      minLevel: 5
    });


    const markers = $(STList).map(function (i, position) {
      const imageSrc = require("./img/마킹123.gif")
      const imageSize = new kakao.maps.Size(60, 70)
      const imageOption = { offset: new kakao.maps.Point(27, 69) }
      const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption)
      const marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(position.lat, position.lng),
        image: markerImage
      });

      let str = '';
      $.each(position.charger, function (index, value) {

        let chargeType;

        switch (value.chgerType) {
          case '01':
            chargeType = 'DC차데모';
            break;
          case '02':
            chargeType = 'AC완속';
            break;
          case '03':
            chargeType = 'DC차데모+AC3상';
            break;
          case '04':
            chargeType = 'DC콤보';
            break;
          case '05':
            chargeType = 'DC차데모+DC콤보';
            break;
          case '06':
            chargeType = 'DC차데모+AC3상+DC콤보';
            break;
          case '07':
            chargeType = 'AC3상';
            break;
          case '08':
            chargeType = 'DC콤보';
            break;
          default:
            chargeType = '???';
        }

        let chargeStat;

        switch (value.stat) {
          case '1':
            chargeStat = '통신이상';
            break;
          case '2':
            chargeStat = '충전대기';
            break;
          case '3':
            chargeStat = '충전중';
            break;
          case '4':
            chargeStat = '운영중지';
            break;
          case '5':
            chargeStat = '점검중';
            break;
          case '9':
            chargeStat = '상태미확인';
            break;
          default:
            chargeStat = '???';
        }

        str +=
          `<tr> 
          <td colspan="2" style="background-color: #a4d1ae">충전기[No.${value.chgerId}]</td>
          </tr>
          <tr> 
          <td>충전타입</td>
          <td>${chargeType}</td>
          </tr>
          <td>충전기상태</td>
          <td>${chargeStat}</td>
          </tr>`
      });

      let parkingStatus;

      if (position.parkingFree === 'Y') {
        parkingStatus = '주차장 - 무료';
      } else if (position.parkingFree === 'N') {
        parkingStatus = '주차장 - 유료';
      }


      const content =
        `<div class="overlaybox">
          <table border="1">
        <tr> 
          <td colspan="2" class="boxtitle2" style="background-color: #103f05; color: white; text-align: center;">[X]</td>
        </tr>
        <tr>
          <td colspan="2" class="boxtitle" style="text-align: center;">${position.statNm}</td>
        </tr>
        <tr>
          <td colspan="2">${position.addr}</td>
        </tr>
        <tr>
          <td colspan="2">충전소 ID -${position.statId}</td>
        </tr>
          ${str}
        <tr>
          <td colspan="2">${parkingStatus}</td>
        </tr>
        <tr>
          <td colspan="2">${position.useTime}
        </tr>
        </table>
        </div>`;


      const lat = Number(position.lat);
      const lng = Number(position.lng);
      const lat_string = lat.toString();
      const lng_string = lng.toString();


      const customOverlay = new kakao.maps.CustomOverlay({
        position: new kakao.maps.LatLng(lat_string, lng_string),
        content: content,
        xAnchor: 0,
        yAnchor: 0,
      });


      const clickHandler1 = function (event) {
        customOverlay.setMap(map);

        $(".boxtitle2").click(function () {
          customOverlay.setMap(null);
        });

        $(".first_" + position.num).css({
          "background": "url(" + position.hospi_img + ")",
          "background-size": "247px 247px"
        });
      };

      kakao.maps.event.addListener(marker, 'click', clickHandler1);
      return marker;
    })

    clusterer.addMarkers(markers);

  }

  return (
    <div id="map" style={{ "width": "100%", "height": "700px" }}></div>
  )
}

export default App;