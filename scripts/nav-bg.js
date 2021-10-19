$(window).scroll(function () {
    var currentscrollTop = $(window).scrollTop();
    if (currentscrollTop >= 80) {
      if (!$('.nav-menu').hasClass('dark')) {
        $('.nav-menu').addClass('dark')
      }
    } else {
      if (!$('.toggle-nav').hasClass('active')) {
        $('.nav-menu').removeClass('dark')
      }
    }
  })