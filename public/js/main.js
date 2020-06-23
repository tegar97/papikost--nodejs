
var swiper = new Swiper('.swiper-container', {
  slidesPerView: 5,
  direction: getDirection(),
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
 
});
var swiper = new Swiper('.swiper-container-mobile', {
  slidesPerView: 2,
  direction: getDirection(),
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
 
});

function getDirection() {
  var windowWidth = window.innerWidth;
  var direction = window.innerWidth <= 760 ? 'vertical' : 'horizontal';

  return direction;
}
$('.navTrigger').click(function () {
  $(this).toggleClass('active');
  console.log("Clicked menu");
  $("#mainListDiv").toggleClass("show_list");
  $("#mainListDiv").fadeIn();

});




function showPassword(idName) {
  var x = document.querySelector(`#${idName}`);
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}


