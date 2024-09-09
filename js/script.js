$(function () {


  //HEADER
  $(window).scroll(function () {
        if($(this).scrollTop() > 200)
        {
            if (!$('.main_header').hasClass('fixed'))
            {
                $('.main_header').stop().addClass('fixed').css('top', '-100px').animate(
                    {
                        'top': '0px'
                    }, 500);
            }
        }
        else
        {
            $('.main_header').removeClass('fixed');
        }
  });


});


$('.number').each(function () {
  $(this).prop('Counter',0).animate({
      Counter: $(this).text()
  }, {
      duration: 4000,
      easing: 'swing',
      step: function (now) {
          $(this).text(Math.ceil(now));
      }
  });
});