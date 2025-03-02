$(document).ready(() => {
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

    // 프로필 표출
    const profilePhotoEl = $('.profile-photo');
    profilePhotoEl.attr('src', profileImg);

    const userNameEl = $('#username');
    userNameEl.text(userName);

    // nav 작물명 표출
    plantList.forEach((item) => {
        const plantName = item;
        const navbarWrap = $('.navbar-wrap');
        const el = `<li class="sub-plant" onclick="chagePlant('${plantName}')">${plantName}</li>`;

        navbarWrap.append(el);
    });

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
            };
            break;
            
        case 'j' :
            userData = {
                userName : '이주영',
                profileImg : 'img/img_profile_2.jpg',
                plantList : ['딸기', '바질'],
            };
            break;
    }

    return userData;
}