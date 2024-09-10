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
      duration: 3000,
      easing: 'swing',
      step: function (now) {
          $(this).text(Math.ceil(now));
      }
  });
});


  // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);

// We listen to the resize event
window.addEventListener('resize', () => {
  // We execute the same script as before
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});