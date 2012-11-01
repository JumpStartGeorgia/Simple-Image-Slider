var slider_data, f_data;

$(function(){


  slider_data = f_data = [
    {"img_src": "images/slider/1.jpg"},
    {"img_src": "images/slider/10.jpg"},
    {"img_src": "images/slider/11.jpg"},
    {"img_src": "images/slider/12.jpg"},
    {"img_src": "images/slider/13.jpg"},
    {"img_src": "images/slider/14.jpg"},
    {"img_src": "images/slider/15.jpg"},
    {"img_src": "images/slider/16.jpg"},
    {"img_src": "images/slider/17.jpg"},
    {"img_src": "images/slider/18.jpg"},
    {"img_src": "images/slider/19.jpg"},
    {"img_src": "images/slider/2.jpg"},
    {"img_src": "images/slider/3.jpg"},
    {"img_src": "images/slider/4.jpg"},
    {"img_src": "images/slider/20.jpg"},
    {"img_src": "images/slider/5.jpg"},
    {"img_src": "images/slider/6.jpg"},
    {"img_src": "images/slider/7.jpg"},
    {"img_src": "images/slider/8.jpg"},
    {"img_src": "images/slider/9.jpg"}
  ];
  // this can also have url and title. for example:
  //{"img_src": "images/slider/10.jpg", "url": "http://google.com/", "title": "Google Inc."},
  // if you use url or title parameter, you have to set show_overlay property to none, otherwise <a> tags won't be clickable

  var options =
  {
    width:         700,
    height:        210,
    element:       $('#s1'),
    data:          slider_data
  };

  var s1 = new Va_slider(options);

  options.max_circles = 9;
  options.element = $('#s2');

  var s2 = new Va_slider(options);

  options.width = 600;
  options.height = 300;
  options.element = $('#s3');

  var s3 = new Va_slider(options);


  slider_data = [
    {"img_src": "images/small/1s.jpg", "url": "http://google.com/search?q=led+zeppelin", "title": "Led Zeppelin"},
    {"img_src": "images/small/2s.jpg"},
    {"img_src": "images/small/3s.jpg"},
    {"img_src": "images/small/4s.jpg"},
    {"img_src": "images/small/5s.jpg"},
    {"img_src": "images/small/6s.jpg"},
    {"img_src": "images/small/7s.jpg", "title": "Nathan from Misfits"},
    {"img_src": "images/small/8s.jpg", "title": "Guns N' Roses"},
    {"img_src": "images/small/9s.jpg"},
    {"img_src": "images/small/10s.jpg"},
    {"img_src": "images/small/11s.jpg"},
    {"img_src": "images/small/12s.jpg"},
    {"img_src": "images/small/13s.jpg"},
    {"img_src": "images/small/14s.jpg"},
    {"img_src": "images/small/15s.jpg"}
  ];

  options =
  {
    width:          700,
    height:         210,
    view_groups:    true,
    resize_if_many: true,
    element:        $('#s4'),
    data:           slider_data
  };

  var s4 = new Va_slider(options);


  options.vPadding = 10;
  options.hMargin = 13;
  options.element = $('#s5');

  var s5 = new Va_slider(options);


  options =
  {
    width:         700,
    height:        210,
    timeout:       2000,
    delay:         3000,
    element:       $('#s6'),
    data:          f_data
  };

  var s6 = new Va_slider(options);









  $('#examples, #options').click(function ()
  {
    $('#' + $(this).attr('id') + '-container').slideToggle();
  });


});
