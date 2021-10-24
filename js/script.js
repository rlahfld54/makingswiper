$(document).ready(function () {

    // 슬라이드 영역
    let slide_wrap = $('.slide-wrap');
    // 실제 슬라이드
    let slide = $('.slide');
    // 슬라이드 내용물들
    let slide_box = $('.slide-box');
    // 총 슬라이드 개수
    let slide_total = slide_box.length;
    // 슬라이드 너비
    let slide_w = slide_box.width();
    // 슬라이드 높이
    let slide_h = slide_box.height();
    // 좌측 버튼
    let slide_prev = slide_wrap.find('.slide-prev');
    // 우측 버튼
    let slide_next = slide_wrap.find('.slide-next');


    // 슬라이 모양을 만들자.
    // row : 가로
    // col : 세로
    // no  : 가운데 모두 정렬
    let slide_type = 'row';

    // 초기 위치 설정 함수
    function slideSetPos(_target, _dir, _w, _h) {
        if (_dir == 'col') {
            _w = 0;
        } else if (_dir == 'row') {
            _h = 0;
        } else {
            _w = 0;
            _h = 0;
        }
        $.each(_target, function (index, item) {
            $(this).css({
                left: index * _w,
                top: index * _h
            });
        });
    }
    slideSetPos(slide_box, slide_type, slide_w, slide_h);

    // 모션에 대한 처리
    // 'fade', 'left', 'right', 'up', 'down'
    let slide_motion_type = 'left';

    // 적용된 속도
    let slide_speed;
    // 클릭시 모션 속도
    let slide_speed_click = 50;
    // 일반 모션 속도
    let slide_speed_normal = 300;
    // 초기 속도 셋팅
    slide_speed = slide_speed_normal;

    // 버튼의 활성화 코드
    // 클릭을 하더라도 조건에 따라서 모션을 할지 안할지 결정한다.
    // 지금은 클릭하면 모션을 실행(true)
    let slide_bt_active = true;

    // 대기시간
    let slide_delay = 1500;

    // Auto Play 만들기 ( 추천하지 않는 방법 )
    let slide_index = 0; // 슬라이드 번호

    // 인터벌 생성할지 말지 결정하는 변수
    let slide_timer_active = true;

    // 자동실행 인터벌 만들기
    let slide_timer;

    clearInterval(slide_timer);
    // 모션의 종류에 따른 구분.
    if (slide_motion_type == 'fade') {

        slide_box.css('opacity', 0); // 모두 일단 투명하게 하기
        slide_box.eq(0).css('opacity', 1); // 첫번째 슬라이드는 보여주세요.
        slide_timer = setInterval(fadeMotion, slide_delay);

    } else if (slide_motion_type == 'left') {

        // 왼쪽으로 이동하는 인터벌 만들기
        slide_timer = setInterval(leftMotion, slide_delay);

    } else if (slide_motion_type == 'right') {

        // 오른쪽으로 이동하는 인터벌 만들기
        slide_timer = setInterval(rightMotion, slide_delay);

    } else if (slide_motion_type == 'up') {

        slide_timer = setInterval(upMotion, slide_delay);

    } else if (slide_motion_type == 'down') {
        slide_timer = setInterval(downMotion, slide_delay);
    }

    // 투명효과 기능
    function fadeMotion() {
        // 인터벌이 할일 다했다.
        clearInterval(slide_timer);

        // 모션시작
        slide_box.eq(slide_index).fadeTo(slide_speed, 0.0);

        // 현재 슬라이드 번호 갱신        
        slidePagePlus();
        // 포커스 이동
        slidePgFocus();

        slide_box.eq(slide_index).fadeTo(slide_speed, 1.0, function () {

            // 연속 버튼 활성화 
            slide_bt_active = true;

            // 모션이 완료되었다고 해서 무조건 인터벌 생성하지 않도록 처리
            if (slide_timer_active != true) {
                return;
            }

            // 모든 애니메이션이 끝났다는 시점을 알려준다.

            // 인터벌을 새로 만든다.
            clearInterval(slide_timer);
            slide_timer = setInterval(fadeMotion, slide_delay);
        });
    }
    // 왼쪽 이동 모션 기능
    function leftMotion() {
        // 인터벌은 할일 다했으므로 삭제
        clearInterval(slide_timer);
        // 연속된 클릭은 막아야 한다.
        
        // 현재 슬라이드 번호 갱신        
        slidePagePlus();
        // 포커스 이동
        slidePgFocus();

        $.each(slide_box, function (index, item) {
            let temp_x = $(this).css('left');
            let tg_x = parseInt(temp_x) - slide_w;

            if (tg_x < -slide_w) {
                // 새로운 위치 수정
                $(this).css('left', slide_w * (slide_total - 1));
                // 모션으로 도착할 위치 재 셋팅
                tg_x = slide_w * (slide_total - 2);
            }

            $(this).stop().animate({
                left: tg_x
            }, slide_speed, function () {

                // index       : 0 ~ 8
                // slide_total : 9
                if (index != slide_total - 1) {
                    return;
                }

                // 연속 버튼 활성화 
                slide_bt_active = true;

                // 모션이 완료되었다고 해서 무조건 인터벌 생성하지 않도록 처리
                if (slide_timer_active != true) {
                    return;
                }
                clearInterval(slide_timer);
                slide_timer = setInterval(leftMotion, slide_delay);
            });
        });
    }
    // 오른쪽 이동 모션 기능
    function rightMotion() {
        clearInterval(slide_timer);
            
        // 현재 슬라이드 번호 갱신        
        slidePageMinus();
        // 포커스 이동
        slidePgFocus();

        $.each(slide_box, function (index, item) {
            let temp_x = $(this).css('left');
            let tg_x = parseInt(temp_x) + slide_w;

            if (tg_x > slide_w * (slide_total - 1)) {
                // 위치를 즉시 옮긴다.
                $(this).css('left', -slide_w);
                // 가야할 위치
                tg_x = 0;
            }

            $(this).stop().animate({
                left: tg_x
            }, slide_speed, function () {

                if (index != slide_total - 1) {
                    return;
                }
                // 연속 버튼 활성화 
                slide_bt_active = true;
                // 모션이 완료되었다고 해서 무조건 인터벌 생성하지 않도록 처리
                if (slide_timer_active != true) {
                    return;
                }
                clearInterval(slide_timer);
                slide_timer = setInterval(rightMotion, slide_delay);
            });

        });
    }
    // 위로 이동 모션 기능 
    function upMotion() {
        clearInterval(slide_timer);

        // 현재 슬라이드 번호 갱신        
        slidePagePlus();
        // 포커스 이동
        slidePgFocus();

        $.each(slide_box, function (index, item) {
            // 현재 위치를 파악
            let temp_y = $(this).css('top');
            // 이동할 위치
            let tg_y = parseInt(temp_y) - slide_h;

            // 위치 재 설정
            if (tg_y < -slide_h) {
                $(this).css('top', slide_h * (slide_total - 1));
                tg_y = slide_h * (slide_total - 2);
            }

            $(this).stop().animate({
                top: tg_y

            }, slide_speed, function () {

                if (index != slide_total - 1) {
                    return;
                }
                // 연속 버튼 활성화 
                slide_bt_active = true;
                // 모션이 완료되었다고 해서 무조건 인터벌 생성하지 않도록 처리
                if (slide_timer_active != true) {
                    return;
                }
                clearInterval(slide_timer);
                slide_timer = setInterval(upMotion, slide_delay);
            });

        });
    }

    // 아래로 이동 모션 기능
    function downMotion() {

        clearInterval(slide_timer);
        // 현재 슬라이드 번호 갱신        
        slidePageMinus();
        // 포커스 이동
        slidePgFocus();

        $.each(slide_box, function (index, item) {
            let temp_y = $(this).css('top');
            let tg_y = parseInt(temp_y) + slide_h;
            // 위치 재 수정
            if (tg_y > slide_h * (slide_total - 1)) {
                $(this).css('top', -slide_h);
                tg_y = 0;
            }

            $(this).stop().animate({
                top: tg_y
            }, slide_speed, function () {

                if (index != slide_total - 1) {
                    return;
                }

                // 연속 버튼 활성화 
                slide_bt_active = true;

                // 모션이 완료되었다고 해서 무조건 인터벌 생성하지 않도록 처리
                if (slide_timer_active != true) {
                    return;
                }
                clearInterval(slide_timer);
                slide_timer = setInterval(downMotion, slide_delay);
            });
        });
    }

    // 슬라이드 위에 롤 오버 하면 자동 실행 멈추기
    slide_wrap.mouseenter(function () {
        // 인터벌 을 지운다. 
        clearInterval(slide_timer);

        // 모션 완료해도 인터벌 생성 못하게 막아줌.
        slide_timer_active = false;

        // 속도를 바꾼다.
        slide_speed = slide_speed_click;
    });

    // 슬라이드 위에 롤 아웃 하면 자동 실행
    slide_wrap.mouseleave(function () {

        clearInterval(slide_timer);
        // 인터벌을 새로 만든다.
        if (slide_motion_type == 'fade') {

            slide_timer = setInterval(fadeMotion, slide_delay);

        } else if (slide_motion_type == 'left') {

            slide_timer = setInterval(leftMotion, slide_delay);

        } else if (slide_motion_type == 'right') {

            slide_timer = setInterval(rightMotion, slide_delay);

        } else if (slide_motion_type == 'up') {

            slide_timer = setInterval(upMotion, slide_delay);

        } else if (slide_motion_type == 'down') {

            slide_timer = setInterval(downMotion, slide_delay);

        }

        // 모션 완료시 인터벌 생성 가능
        slide_timer_active = true;

        // 일반 속도로 돌려준다.
        slide_speed = slide_speed_normal;
    });

    // 좌측 이동 버튼
    slide_prev.click(function () {

        if (slide_bt_active == false) {
            return;
        }
        slide_bt_active = false;
        rightMotion();
    });

    // 우측 이동 버튼
    slide_next.click(function () {

        if (slide_bt_active == false) {
            return;
        }
        slide_bt_active = false;
        leftMotion();
    });


    //  Pagination 기능
    let slide_pg = slide_wrap.find('.slide-pg');
    let slide_pg_span = '';
    
    for(let i = 0; i < slide_total; i++) {
        slide_pg_span = slide_pg_span + '<span></span>';
    }
    slide_pg.html(slide_pg_span);

    // span 태그 찾아라.
    let slide_pg_span_tag = slide_pg.find('span');

    function slidePgFocus() {       
         // 포커스를 모두 해제한다.
         slide_pg_span_tag.removeClass('slide-pg-active');
         // tempIndex에 해당하는 span 만 포커스를 적용한다.
         // slide-pg-active 
         slide_pg_span_tag.eq(slide_index).addClass('slide-pg-active');
    }

    // 페이지 카운팅 함수
    function slidePagePlus(){
        slide_index ++;
        if(slide_index >= slide_total) {
            slide_index = 0;
        }
    }

    function slidePageMinus(){
        slide_index --;
        if(slide_index < 0) {
            slide_index = slide_total - 1;
        }
    }

    slidePgFocus();

    // pg 클릭 구현
    $.each(slide_pg_span_tag, function(index, item) {

        $(this).click(function(){
            slidePgMove(index);
            // 새로운 슬라이드 포커스 준다.
            slide_index = index;            
            slidePgFocus();            
        });
    });


    // pg 클릭시 슬라이드 이동
    function slidePgMove(_count) {     
        // 일단 모든 위치를 초기화 하자..
        for(let i = 0; i < slide_total; i++) {
            slide_box.eq(i).css('left', i * slide_w);
        }
        
        // 주어진 _count 만큼 위치를 돌려가면서 맞추어준 다.
        for(let i = 0; i < _count; i++) {

            for(let j = 0; j < slide_total; j++) {
                var temp = slide_box.eq(j).css('left');
                var temp_x = parseInt(temp) - slide_w;
                if(temp_x < -slide_w) {
                    temp_x = slide_w * (slide_total - 2);
                }
                slide_box.eq(j).css('left', temp_x);
            }

        }
    }

});