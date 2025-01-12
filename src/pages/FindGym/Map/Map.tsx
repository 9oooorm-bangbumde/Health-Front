import React, { useEffect, useState } from 'react';

declare global {
    interface Window {
        kakao: any;
    }
}

const Map = () => {
    const [keyword, setKeyword] = useState('');
    useEffect(() => {
        const kakaoMapsLoaded = () => {
            let container = document.getElementById("map");
            let options = {
                center: new window.kakao.maps.LatLng(33.450701, 126.570667),
                level: 3,
            };

            let markers: any = [];
            let map = new window.kakao.maps.Map(container, options);
            let ps = new window.kakao.maps.services.Places();
            let infowindow = new window.kakao.maps.InfoWindow({ zIndex: 1 });

            // 키워드 검색을 요청하는 함수입니다
            const searchPlaces = () => {
                if (!keyword.replace(/^\s+|\s+$/g, '')) {
                    alert('키워드를 입력해주세요!');
                    return false;
                }

                // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
                ps.keywordSearch(keyword, placesSearchCB);
            }

            function placesSearchCB(data: any, status: any, pagination: any) {
                if (status === window.kakao.maps.services.Status.OK) {
            
                    // 정상적으로 검색이 완료됐으면
                    // 검색 목록과 마커를 표출합니다
                    displayPlaces(data);
            
                    // 페이지 번호를 표출합니다
                    displayPagination(pagination);
            
                } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
            
                    alert('검색 결과가 존재하지 않습니다.');
                    return;
            
                } else if (status === window.kakao.maps.services.Status.ERROR) {
            
                    alert('검색 결과 중 오류가 발생했습니다.');
                    return;
            
                }
            }

            // 검색 결과 목록과 마커를 표출하는 함수입니다
            function displayPlaces(places: any) {

                var listEl = document.getElementById('placesList'); 
                let menuEl = document.getElementById('menu_wrap');
                let fragment = document.createDocumentFragment();
                let bounds = new window.kakao.maps.LatLngBounds(); 

                if(!listEl || !menuEl) return;
                
                // 검색 결과 목록에 추가된 항목들을 제거합니다
                removeAllChildNods(listEl);

                // 지도에 표시되고 있는 마커를 제거합니다
                removeMarker();
                
                for ( let i=0; i<places.length; i++ ) {
                    // 마커를 생성하고 지도에 표시합니다
                    var placePosition = new window.kakao.maps.LatLng(places[i].y, places[i].x),
                        marker = addMarker(placePosition, i, places[i].place_name), 
                        itemEl = getListItem(i, places[i]); // 검색 결과 항목 Element를 생성합니다

                    // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
                    // LatLngBounds 객체에 좌표를 추가합니다
                    bounds.extend(placePosition);

                    // 마커와 검색결과 항목에 mouseover 했을때
                    // 해당 장소에 인포윈도우에 장소명을 표시합니다
                    // mouseout 했을 때는 인포윈도우를 닫습니다
                    if(itemEl) {
                        (function(marker, title, itemEl) {
                            window.kakao.maps.event.addListener(marker, 'mouseover', function() {
                                displayInfowindow(marker, title);
                            });
    
                            window.kakao.maps.event.addListener(marker, 'mouseout', function() {
                                infowindow.close();
                            });
    
                            itemEl.onmouseover =  function () {
                                displayInfowindow(marker, title);
                            };
    
                            itemEl.onmouseout =  function () {
                                infowindow.close();
                            };
                        })(marker, places[i].place_name, itemEl);
                    }

                    fragment.appendChild(itemEl);
                }

                // 검색결과 항목들을 검색결과 목록 Element에 추가합니다
                listEl.appendChild(fragment);
                menuEl.scrollTop = 0;

                // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
                map.setBounds(bounds);
            }

            // 검색결과 항목을 Element로 반환하는 함수입니다
            function getListItem(index: any, places: any) {
                const el = document.createElement('li');
                let itemStr = `<span class="markerbg marker_${index + 1}"></span>` +
                    `<div class="info">` +
                    `<h5>${places.place_name}</h5>`;

                if (places.road_address_name) {
                    itemStr += `<span>${places.road_address_name}</span>` +
                        `<span class="jibun gray">${places.address_name}</span>`;
                } else {
                    itemStr += `<span>${places.address_name}</span>`;
                }

                itemStr += `<span class="tel">${places.phone}</span>` +
                    `</div>`;

                el.innerHTML = itemStr;
                el.className = 'item';
                return el;
            }

            // 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
            function addMarker(position: any, idx: any, title: string) {
                var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
                    imageSize = new window.kakao.maps.Size(36, 37),  // 마커 이미지의 크기
                    imgOptions =  {
                        spriteSize : new window.kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
                        spriteOrigin : new window.kakao.maps.Point(0, (idx*46)+10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
                        offset: new window.kakao.maps.Point(13, 37) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
                    },
                    markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
                        marker = new window.kakao.maps.Marker({
                        position: position, // 마커의 위치
                        image: markerImage 
                    });

                marker.setMap(map); // 지도 위에 마커를 표출합니다
                markers.push(marker);  // 배열에 생성된 마커를 추가합니다

                return marker;
            }

            // 지도 위에 표시되고 있는 마커를 모두 제거합니다
            function removeMarker() {
                for ( var i = 0; i < markers.length; i++ ) {
                    markers[i].setMap(null);
                }   
                markers = [];
            }

            // 검색결과 목록 하단에 페이지번호를 표시는 함수입니다
            function displayPagination(pagination: any) {
                var paginationEl = document.getElementById('pagination');
                let fragment = document.createDocumentFragment();
                let i;

                if(!paginationEl) return;

                // 기존에 추가된 페이지번호를 삭제합니다
                while (paginationEl.hasChildNodes()) {
                    paginationEl.removeChild (paginationEl.lastChild!);
                }

                for (i=1; i<=pagination.last; i++) {
                    var el = document.createElement('a');
                    el.href = "#";
                    el.innerHTML = String(i);

                    if (i===pagination.current) {
                        el.className = 'on';
                    } else {
                        el.onclick = (function(i) {
                            return function() {
                                pagination.gotoPage(i);
                            }
                        })(i);
                    }

                    fragment.appendChild(el);
                }
                paginationEl.appendChild(fragment);
            }

            // 검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수입니다
            // 인포윈도우에 장소명을 표시합니다
            function displayInfowindow(marker: any, title: string) {
                var content = '<div style="padding:5px;z-index:1;">' + title + '</div>';

                infowindow.setContent(content);
                infowindow.open(map, marker);
            }

            // 검색결과 목록의 자식 Element를 제거하는 함수입니다
            function removeAllChildNods(el: any) {   
                while (el.hasChildNodes()) {
                    el.removeChild (el.lastChild);
                }
            }
            document.getElementById('searchButton')?.addEventListener('click', searchPlaces);
        };

        if (window.kakao && window.kakao.maps && window.kakao.maps.load) {
            window.kakao.maps.load(kakaoMapsLoaded);
        } else {
            const script = document.createElement('script');
            script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_REAL_API_KEY&libraries=services`;
            script.onload = kakaoMapsLoaded;
            document.head.appendChild(script);
        }
    }, [keyword]);

    return (
        <div>
            <div>
                <h2>주변 헬스장 검색</h2>
                <div>
                    <label htmlFor='keyword'>헬스장 검색</label>
                    <input 
                        id="keyword" 
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                    <button id="searchButton">검색</button>
                </div>
            </div>
            <div id="menu_wrap" className="bg_white">
                <ul id="placesList"></ul>
                <div id="pagination"></div>
            </div>
            <div id='map' style={{ width: '100%', height: '500px' }}></div>
        </div>
    );
}

export default Map;
