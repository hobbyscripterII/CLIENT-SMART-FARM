// 페이지 로드 시 공통 레이아웃 적용
$(document).ready(() => {
    const head = $('head');
    const header = $('header');
    const nav = $('nav');
    const footer = $('footer');

    head.load('/layout/head.html');
    header.load('/layout/header.html');
    nav.load('/layout/nav.html');
    footer.load('/layout/footer.html');
});