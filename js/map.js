/**
 * 지도 설정 — 본사·지사 각각 표시
 * 카카오맵: https://developers.kakao.com JavaScript 키를 kakaoKey에 입력
 * 비어 있으면 구글맵 iframe 사용
 */
window.NMTI_MAP = {
  kakaoKey: '',
  level: 3,
  locations: [
    {
      id: 'mapHq',
      title: '(주)신계측기술정보 본사',
      lat: 37.4783,
      lng: 126.8820,
      googleEmbedUrl:
        'https://maps.google.com/maps?q=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C+%EA%B8%88%EC%B2%9C%EA%B5%AC+%EA%B0%80%EC%82%B0%EB%94%94%EC%A7%80%ED%84%B81%EB%A1%9C+84+%EC%97%90%EC%9D%B4%EC%8A%A4%ED%95%98%EC%9D%B4%EC%97%94%EB%93%9C%ED%83%80%EC%9B%8C8%EC%B0%A8&hl=ko&z=16&output=embed'
    },
    {
      id: 'mapBranch',
      title: '(주)신계측기술정보 지사',
      lat: 36.3582,
      lng: 127.3378,
      googleEmbedUrl:
        'https://maps.google.com/maps?q=%EB%8C%80%EC%A0%84%EA%B4%91%EC%97%AD%EC%8B%9C+%EC%9C%A0%EC%84%B1%EA%B5%AC+%EB%B3%B5%EC%9A%A9%EB%8F%99%EB%A1%9C+43+%EB%8D%94%EB%A6%AC%EB%B8%8C%EC%8B%9C%EA%B7%B8%EB%8B%88%EC%B2%98&hl=ko&z=16&output=embed'
    }
  ]
};

(function () {
  'use strict';

  var config = window.NMTI_MAP;
  var loadingHtml = '<p class="map-loading">지도 로딩</p>';

  function showGoogleMap(container, loc) {
    container.innerHTML =
      '<iframe title="' +
      loc.title +
      '" src="' +
      loc.googleEmbedUrl +
      '" width="100%" height="280" style="border:0;height:280px;" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';
  }

  function initKakaoMap(container, loc) {
    var mapOption = {
      center: new kakao.maps.LatLng(loc.lat, loc.lng),
      level: config.level
    };
    var map = new kakao.maps.Map(container, mapOption);
    var marker = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(loc.lat, loc.lng)
    });
    marker.setMap(map);
    var infowindow = new kakao.maps.InfoWindow({
      content: '<div style="padding:6px 10px;font-size:13px;">' + loc.title + '</div>'
    });
    infowindow.open(map, marker);
  }

  function initLocation(loc) {
    var container = document.getElementById(loc.id);
    if (!container) return;

    container.innerHTML = loadingHtml;

    if (!config.kakaoKey) {
      showGoogleMap(container, loc);
      return;
    }

    initKakaoMap(container, loc);
  }

  if (!config.locations || !config.locations.length) return;

  if (!config.kakaoKey) {
    config.locations.forEach(initLocation);
    return;
  }

  var script = document.createElement('script');
  script.src = '//dapi.kakao.com/v2/maps/sdk.js?appkey=' + config.kakaoKey + '&autoload=false';
  script.onload = function () {
    kakao.maps.load(function () {
      config.locations.forEach(initLocation);
    });
  };
  script.onerror = function () {
    config.locations.forEach(function (loc) {
      var container = document.getElementById(loc.id);
      if (container) showGoogleMap(container, loc);
    });
  };
  document.head.appendChild(script);
})();
