function getCurrentDate() {
    let currentDate = new Date();

    let year = currentDate.getFullYear();
    let month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    let day = currentDate.getDate().toString().padStart(2, '0');
    let hours = currentDate.getHours().toString().padStart(2, '0');
    let minutes = currentDate.getMinutes().toString().padStart(2, '0');
    let seconds = currentDate.getSeconds().toString().padStart(2, '0');

    let resultDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    $('#time').html(resultDate);
}

$(document).ready(() => {
    // 현재 시간 표출
    getCurrentDate();
    setInterval(getCurrentDate, 1000);

    // ajax 호출

    // serialNumber에 저장된 정보 확인

    // [참고] API 연결 전까지는 아래 더미 데이터로 동적 처리

    let user = null;
    const localStorageUser = localStorage.getItem('user');
    const params = new URLSearchParams(window.location.search);
    const queryStringUser = params.get('user');

    if(queryStringUser) {
        user = queryStringUser;
        localStorage.setItem('user', user);
    } else if(localStorageUser) {
        user = localStorageUser;
        localStorage.setItem('user', user);
    } else {
        location.href = 'error.html';
        return false;
    }

    const userData = getUserDummyData(user);

    // 작물 기본 정보 세팅
    const userName = userData.userName;
    const profileImg = userData.profileImg;
    const plantList = userData.plantList;
    const role = userData.role;

    // 프로필 표출
    const profilePhotoEl = $('.profile-photo');
    profilePhotoEl.attr('src', profileImg);

    const userNameEl = $('#username');
    userNameEl.text(userName);

    // nav 세팅
    // 작물 목록 표출
    const navbarWrap = $('.navbar-wrap');
    let el = `<li class="main-plant"><img src="https://img.icons8.com/?size=20&id=88608&format=png"><span>작물 목록</span></li>`;
    
    plantList.forEach((item) => {
        const plantName = item;
        el += `<li class="sub-plant" onclick="chagePlant('${plantName}')">${plantName}</li>`;
    });
    
    // 온습도 변화량 조회
    el += `<li class="main-plant"><img src="https://img.icons8.com/?size=20&id=88608&format=png"><span>온습도 변화량 조회</span></li>`;
    el += `<li class="sub-plant">변화 시점 기기 및 모듈 상태 조회</li>`;
    el += `<li class="sub-plant">IP 카메라 이미지 조회</li>`;
    // el += `<li class="sub-plant" onclick="chagePlant('${plantName}')">${plantName}</li>`;
    
    // 관수 시설 상태 변화량 조회
    el += `<li class="main-plant"><img src="https://img.icons8.com/?size=20&id=88608&format=png"><span>관수 시설 상태 변화량 조회</span></li>`;
    el += `<li class="sub-plant">물탱크 수위계 조회</li>`;
    el += `<li class="sub-plant">관수량 측정계 조회</li>`;

    // 시간별 변화량 조회
    el += `<li class="main-plant"><img src="https://img.icons8.com/?size=20&id=88608&format=png"><span>시간별 변화량 조회</span></li>`;
    el += `<li class="sub-plant">개폐량 조회</li>`;
    el += `<li class="sub-plant">일조량 조회</li>`;

    // 양액용 모듈 관리
    el += `<li class="main-plant"><img src="https://img.icons8.com/?size=20&id=88608&format=png"><span>양액용 모듈 관리</span></li>`;
    el += `<li class="sub-plant">양액 투입량 조회</li>`;
    el += `<li class="sub-plant">양액 투입량 수정</li>`;
    el += `<li class="sub-plant">양액 종류 조회</li>`;
    el += `<li class="sub-plant">양액 종류 수정</li>`;

    // 작물 관리
    el += `<li class="main-plant"><img src="https://img.icons8.com/?size=20&id=88608&format=png"><span>작물 관리</span></li>`;
    el += `<li class="sub-plant">작물 정보 조회</li>`;
    el += `<li class="sub-plant">작물 정보 수정</li>`;
    el += `<li class="sub-plant">작물 성장상태 조회</li>`;

    if(role == 'ROOT' || role == 'MANAGER') {
        // 지역 관리
        el += `<li class="main-plant"><img src="https://img.icons8.com/?size=20&id=88608&format=png"><span>지역 관리</span></li>`;
        el += `<li class="sub-plant"><a href="region.html">지역 조회</a></li>`;
        /* el += `<li class="sub-plant">지역 수정</li>`; */
    }

    navbarWrap.append(el);

    // 첫 화면에 보여줄 센서 데이터 및 차트
    const defaultPlant = plantList[0]; // 첫번째 작물
    chagePlant(defaultPlant);
});

function getUserDummyData(user) {
    let userData = {};

    switch(user) {
        case 's' :
            userData = {
                userName : '정성운',
                profileImg : '/img/img_profile_1.jpg',
                plantList : ['방울 토마토', '고수'],
                role : 'ROOT'
            };
            break;
            
        case 'j' :
            userData = {
                userName : '이주영',
                profileImg : 'img/img_profile_2.jpg',
                plantList : ['딸기', '바질'],
                role : 'MANAGER'
            };
            break;

        case 'g' :
            userData = {
                userName : '게스트',
                profileImg : 'img/img_profile_2.jpg',
                plantList : ['딸기', '바질'],
                role : 'GUEST'
            };
            break;
    }

    return userData;
}