'use strict';

//Slidebar //Usage: https://www.adchsm.com/slidebars/help/usage/initializing-slidebars/
(function($) {
    // Create a new instance of Slidebars
    var controller = new slidebars();

    // Initialize Slidebars
    controller.init();

    // Left Slidebar controls
    $('.js-toggle-left-slidebar').on('click', function(event) {
        event.stopPropagation();
        controller.toggle('slidebar-1');
    });

    // Close any
    $(controller.events).on('opened', function() {
        $('[canvas="container"]').addClass('js-close-any-slidebar');
    });
    $(controller.events).on('closed', function() {
        $('[canvas="container"]').removeClass('js-close-any-slidebar');
    });
    $('body').on('click', '.js-close-any-slidebar', function(event) {
        event.stopPropagation();
        controller.close();
    });
})(jQuery);

//Sticky //Usage: https://github.com/garand/sticky
$(document).ready(function() {
    // $('#sticker').sticky({
    //   topSpacing: $('#navigation').outerHeight
    // });
    $('#sticker').sticky({ topSpacing: 63 });

    // Block Link
    $('a[href^="#"]').on('click', function(event) {
        event.preventDefault();

        var target = $(this).attr('href');
        var $target = $(target);
        $('[canvas="container"]').scrollTo($target, 800);
        // $('[canvas="container"]').stop().animate({
        //     scrollTop: $target.parent().scrollTop() + $target.offset().top - $target.parent().offset().top
        // }, 500, 'swing', function (e) {
        //     window.location.hash = target;
        // });
    });
});
//Index Slider
(function() {
    var sliders = [];
    var indexSlider;
    var resizeTimer;

    var element = $('.bxslider_banner');
    if (element.length > 0) {
        indexSlider = element.bxSlider({
            auto: true,
            pager: false,
            mode: 'fade',
            preloadImages: 'all'
        });

        //Resize
        $(window).on('resize', function(e) {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                indexSlider.reloadSlider();
            }, 250);
        });
        $(window).load(function() {
            //Parallax
            // var scene = document.getElementById('parallax-scene');
            // var parallax = new Parallax(scene);
            var parallaxArray = [];
            $('.parallax-scene').each(function(index) {
                $(this).context.id = 'parallax-scene' + index;
                parallaxArray.push('parallax-scene' + index);
            });
            for (var i = 0; i < parallaxArray.length; i++) {
                var pr = document.getElementById(parallaxArray[i]);
                new Parallax(pr);
            }
        });
    }
})();

//Sliders
$('.event-news').bxSlider({
    infiniteLoop: false,
    auto: true,
    hideControlOnEnd: true
});
$('.bxslider_product').bxSlider({
    infiniteLoop: false,
    auto: true,
    hideControlOnEnd: true
});
$('.bxslider-technical-request').bxSlider({
    mode: 'fade',
    auto: true,
    hideControlOnEnd: true
});

//如果指定元素存在才執行
if ($('.flatslider').length > 0) {
    //將 slider 存成 flatslider 物件，方便後續操作
    var flatslider = $('.flatslider').bxSlider({
        speed: 1000,
        pager: true,
        controls: false,
        preloadImages: 'all',
        auto: true
    });
    //此處綁定 windows 視窗改變尺寸的事件
    $(window).resize(function() {
        //只要尺寸改變就重整 slider
        flatslider.reloadSlider();
    });
}
////////////////////////////////////////////
////////// Magnificent Pop Start ///////////
$('.popup-gallery').magnificPopup({
    delegate: 'a',
    type: 'image',
    tLoading: 'Loading image #%curr%...',
    mainClass: 'mfp-img-mobile',
    gallery: {
        enabled: true,
        navigateByImgClick: true,
        preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
    },
    image: {
        tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
        titleSrc: function titleSrc(item) {
            return item.el.attr('title') + '<small>by positive</small>';
        }
    }
});

$('.open-popup-link').magnificPopup({
    type: 'ajax',
    overflowY: 'scroll' // as we know that popup content is tall we set scroll overflow by default to avoid jump
});

$('.popup-youtube').magnificPopup({
    disableOn: 280,
    type: 'iframe',
    mainClass: 'mfp-fade',
    removalDelay: 160,
    preloader: false,
    fixedContentPos: false
});
///////// POPUP END //////////

//EVENTS
$('.contact-form').on('click', function() {
    console.log('xx');
    $('.contact-open').slideDown('slow').promise().done(function() {
        $('html,body').animate({
            scrollTop: $('.contact-open').offset().top
        }, 1000);
    });
});

$('.contact-open .close').on('click', 'a', function() {
    console.log('xx');
    $('.contact-open').slideUp();
});

$('.rise-form').on('click', function() {
    console.log('xx');
    $('.contact-open-teach').slideDown('slow').promise().done(function() {
        $('html,body').animate({
            scrollTop: $('.contact-open-teach').offset().top
        }, 1000);
    });
});

$('.contact-open-teach .close').on('click', 'a', function() {
    console.log('xx');
    $('.contact-open-teach').slideUp();
});

//language
$(document).ready(function() {
    //自動滑出
    $('#quickmenu_container').animate({ 'top': 0, 'height': 36 }, { duration: 1000, easing: 'jswing' });
    //點選展開
    $('#btn_quickmenu').click(function() {
        console.log('xx');
        fn_control_quickmenu();
    });
    //控制選單的部分
    function fn_control_quickmenu() {
        var c_height = $('#quickmenu_content').outerHeight(true);
        if ($('#btn_quickmenu').hasClass('hide')) {
            $('#quickmenu_container').stop().animate({ 'top': 0 - c_height, 'height': 36 + c_height }, { duration: 1000, easing: 'jswing' });
            $('#btn_quickmenu').removeClass('hide').addClass('show');
            $('#Image3').attr('src', website.site_url('language/image/1'));
        } else {
            //隱藏
            $('#quickmenu_container').stop().animate({ 'top': 0, 'height': 36 }, { duration: 1000, easing: 'jswing' });
            $('#btn_quickmenu').removeClass('show').addClass('hide');
            $('#Image3').attr('src', website.site_url('language/image'));
        }
    }
});

//product-d
$(function() {
    $('.qa').click(function() {
        console.log('xx');
        var _this = $(this).attr('data-href');
        if ($(_this).css('display') == 'none') {
            $('.trclass').slideUp();
            $('.open').css('color', '#555555');
            $('.thisicon').attr('src', website.base_url('assets/images/icons/pro_left.png'));
            $(_this).slideDown();
            $(this).find('IMG.thisicon').attr('src', website.base_url('assets/images/icons/pro_down.png'));
            $(this).find('.open').css('color', '#d0021b');
        } else {
            $(_this).slideUp();
            $(this).find('IMG.thisicon').attr('src', website.base_url('assets/images/icons/pro_left.png'));
            $('.open').css('color', '#555555');
        }
        return false;
    });
    //預設第一筆
    $('#tr1').slideDown();
    $('.thisone_img').attr('src', website.base_url('assets/images/icons/pro_down.png'));
    $('.thisone_text').css('color', '#d0021b');

    //產品比較選單
    $('.qa02').on('click', function() {
        console.log('xx');
        console.log('once');
        $(this).parent().siblings().find('.qa02').siblings('.trclass02').slideUp().promise().done(function() {
            $(this).siblings().removeClass('active');
        });
        $(this).siblings('.trclass02').slideDown().promise().done(function() {
            $(this).siblings().addClass('active');
        });
    });

    //phone list
    $('.second-list-btn').on('click', function() {
        console.log('xx');
        console.log('once');
        $(this).parent().siblings().find('.second-list-btn').siblings('.second-list').slideUp().promise().done(function() {
            $(this).siblings().removeClass('active');
        });
        $(this).siblings('.second-list').slideDown().promise().done(function() {
            $(this).siblings().addClass('active');
        });
    });
});

//產品比較選取產品
$('.product-item .item input').on('click', function() {
    $(this).parents('.item').toggleClass('active');
    console.log($(this));
});

//index-news
if ($('#fiveAce').length > 0) {
    $('#fiveAce').fiveAce({
        gap: 48,
        itemHeight: 205
    });
}

//raid
$(document).ready(function() {
    $('#hdd-list .hard').on('click', function() {
        console.log('xx');
        $('.hard-drive-bg').addClass('active');
        $(this).addClass('active');
        $(this).siblings('.hard').removeClass('active');

        $('.hard-drive-bg').find('li h4').text($(this).children('h4').text());
    });
});

//index-phone-list
// $('.second-list-btn').on('click', 'a', function(){
//   console.log('xx');
//   $('.second-list').slideToggle('slow').show();
// });


//index-scrollbar
if ($('#content-rd').length > 0) {
    $('#content-rd').mCustomScrollbar({
        axis: 'x',
        advanced: { autoExpandHorizontalScroll: true },
        theme: 'rounded-dark',
        mouseWheel: { enable: false }
    });
}


//
$('.share-btn').on('click', function() {
    $('.share-content').slideToggle();
});

//
$('.filter-open').on('click', function() {
    $('.filter-wrapper').slideToggle();
    $(this).toggleClass('color');
});

//tabber
$('#tabber').tabber();


//TypeKit
(function(d) {
    var config = {
            kitId: 'daf4cqp',
            scriptTimeout: 3000,
            async: true
        },
        h = d.documentElement,
        t = setTimeout(function() {
            h.className = h.className.replace(/\bwf-loading\b/g, '') + ' wf-inactive';
        }, config.scriptTimeout),
        tk = d.createElement('script'),
        f = false,
        s = d.getElementsByTagName('script')[0],
        a;
    h.className += ' wf-loading';
    tk.src = 'https://use.typekit.net/' + config.kitId + '.js';
    tk.async = true;
    tk.onload = tk.onreadystatechange = function() {
        a = this.readyState;
        if (f || a && a != 'complete' && a != 'loaded') return;
        f = true;
        clearTimeout(t);
        try {
            Typekit.load(config);
        } catch (e) {}
    };
    s.parentNode.insertBefore(tk, s);
})(document);

//Fetch URL
$(window).load(function() {
    var url = window.location.toString();
    console.log(url);
    var loc = url.split('#')[1];
    if (loc != undefined) {
        var locObj = $('#' + loc);
        //Reset where animation starts.
        $(document).scrollTop(0);
        //Animate to
        $('html,body').animate({
            scrollTop: locObj.offset().top
        }, 1000);
    }
    if ($('#map_controls').length > 0) {
        $('#map_controls').mCustomScrollbar({
            theme: 'light',
            alwaysShowScrollbar: 2,
            mouseWheel: {
                enable: true
            }
        });
    }
});
//# sourceMappingURL=all.js.map