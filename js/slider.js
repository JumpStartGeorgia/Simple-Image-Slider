/*
function getScrollBarWidth ()
{
    var inner = document.createElement('p');
    inner.style.width = "100%";
    inner.style.height = "200px";

    var outer = document.createElement('div');
    outer.style.position = "absolute";
    outer.style.top = "0px";
    outer.style.left = "0px";
    outer.style.visibility = "hidden";
    outer.style.width = "200px";
    outer.style.height = "150px";
    outer.style.overflow = "hidden";
    outer.appendChild (inner);
  
    document.body.appendChild (outer);
    var w1 = inner.offsetWidth;
    outer.style.overflow = 'scroll';
    var w2 = inner.offsetWidth;
    if (w1 == w2) w2 = outer.clientWidth;

    document.body.removeChild (outer);

    return (w1 - w2);
};
*/

function Timer (callback, delay)
{
  var timerId, start, remaining = delay;

  this.pause = function ()
  {
    window.clearTimeout(timerId);
    remaining -= new Date() - start;
  };

  this.resume = function ()
  {
    start = new Date();
    timerId = window.setTimeout(callback, remaining);
  };

  this.restart = function ()
  {
    start = new Date();
    window.clearTimeout(timerId);
    remaining = delay;
    timerId = window.setTimeout(callback, remaining);
  };

  this.stop = function ()
  {
    window.clearTimeout(timerId);
  };

  this.resume();
}

function window_dimensions ()
{
  var winW, winH;
  /*if (screen && screen.width)
  {
    winW = ($(window).height() < $(document).height()) ? (screen.width - getScrollBarWidth()) : screen.width;
    winH = screen.height;
  }
  else */if (document.body && document.body.offsetWidth)
  {
    winW = document.body.offsetWidth;
    winH = document.body.offsetHeight;
  }
  else if (document.compatMode == 'CSS1Compat' && document.documentElement && document.documentElement.offsetWidth)
  {
    winW = document.documentElement.offsetWidth;
    winH = document.documentElement.offsetHeight;
  }
  else if (window.innerWidth && window.innerHeight)
  {
    winW = window.innerWidth;
    winH = window.innerHeight;
  }
  return {
    width: winW,
    height: winH
  };
}

var PX = 'px',
    math = Math;

function adjust_dimensions (e_w, e_h, max_w, max_h, vertical_limit)
{
  vertical_limit = vertical_limit || false;
  var k = vertical_limit ? math.max((e_h / max_h), (e_w / max_w)) : math.min((e_h / max_h), (e_w / max_w));

  return {
	  'width'  : e_w / k,
  	'height' : e_h / k
  };
}

/*
Element.prototype.find = function (term)
{
  term = term.split(' ');
  var element = this;
  for (i in term)
  {
    switch (term[i][0])
    {
      case '.':
        element = element.getElementsByClassName(term[i].substring(1))[0];
      break;
      case '#':
        element = element.getElementById(term[i].substring(1));
      break;
    }
  }
  return element;
}
*/

function Va_slider (options)
{
  if (options.element.length == 0)
  {
    // return if the element doesn't exist
    return;
  }

  // save the current t of a function in a variable
  var t = this;

  this.switch_circle = function (index)
  {
    // find the current selected circle and deselect it
    t.slider.element.find('.circle_selected').attr('class', 'circle');
    // select the one with attribute index equal to index argument
    t.slider.element.find('.circle[index=' + index + ']').attr('class', 'circle_selected');
    // t.slider.element.find('.circle[index=' + index + ']')[0].setAttribute('class', 'circle_selected');
  }

  this.change_slide = function (index)
  {
    // stop all animations
    t.slider.element.find('*').stop(true, true);

    // fade out the current slide
    $(t.slider.slides[t.slider.active]).fadeOut(t.slider.timeout);
    // fade in the 'index'-th one
    $(t.slider.slides[index]).fadeIn(t.slider.timeout);

    // if the switcher circles are shown
    if (show_circles)
    {
      window.setTimeout(function (){ t.switch_circle(index); }, t.slider.timeout / 4);
    }

    // save the index of current slide so then we can fade it out
    t.slider.active = index;
  }

  this.change_slide_automatically = function (index)
  {
    // calculate index of a next slide
    // if the current one is the last one, start from 0, otherwise increase it by 1
    index = (t.slider.slides.length <= (+ t.slider.active + 1)) ? 0 : + t.slider.active + 1;
    t.change_slide(index);
    // restart timer so slideshow doesn't stop
    t.slider.timer.restart();
  }

  var images = [],
      parent = [],
      group,
      innercont,
      gwidth = 0,
      img_obj;

  // process images; this function processes data[i] at a time
  this.proc_images = function (data, i)
  {
		// check if data exists
		if (data.length <= i || typeof(data[i]) == 'undefined')
		{
		  return;
		}

	  // if there is no image url
	  if (typeof(data[i].img_src) != 'string')
	  {
	    if ((i + 1) < data.length)
	    {
	      // continue with i+1 if i is less than length of data
	      t.proc_images(data, i + 1);
	    }
	    else
	    {
	      // return as there is nothing left
	      return;
	    }
	  }

	  // create a image object for each data[i]
	  // src attribute will be set at the end because otherwise it doesn't trigger onload event in IE
	  images[i] = new Image();
	  img_obj = $(images[i]);

	  // check if data[i] contains url to go to (not the image src)
	  // create a parent element for each slide
	  if (typeof (data[i].url) == 'string' && data[i].url.length > 1)
	  {
	    // create 'a' tag
	    parent[i] = $(document.createElement('a'));
	    // set it's href attribute
	    parent[i].attr('href', data[i].url);
	    // parent[i].setAttribute('href', data[i].url);
	  }
	  else
	  {
	    // create simple 'div' tag as data[i] has no url except for image src
	    parent[i] = $(document.createElement('div'));
	  }

	  // check if data[i] has a title and use it as a title attribute for slides
	  if (typeof (data[i].title) == 'string' && data[i].title.length > 0)
	  {
	    parent[i].attr('title', data[i].title);
	    img_obj.attr('alt', data[i].title);
	    // parent[i].setAttribute('title', data[i].title);
	    // images[i].setAttribute('alt', data[i].title);
	  }

	  // the parent is given the classname of slide
	  parent[i].attr('class', 'slide');
	  // parent[i].setAttribute('class', 'slide');

	  // if not veiwing slides in groups, append parent to the container of slides and append image to the parent
	  // if slider shows slides in groups, parent and image tags will be added afterwards in 'image.onload' function
	  // it's because many slides need to be in groups and group widths are depending on each of image widths
	  // we can't get the width of image befote it's loaded so they cannot be added yet
	  if (!t.slider.view_groups)
	  {
	    t.slider.container.append(parent[i]);
	    parent[i].append(img_obj);
	    // parent[i] = t.slider.container.appendChild(parent[i]);
	    // parent[i].appendChild(images[i]);
	  }


	  // create a first group in case of viewing slides in groups
	  // set its current width to 0
	  // also create an inner container for the group
	  // groups have css position property of absolute in order for the animation to work properly
	  // it means they cannot be centered with css in slider container
	  // so the inner containers are needed to center the content of each group
	  if (t.slider.view_groups && i == 0)
	  {
	    gwidth = - 2 * t.slider.hMargin;
	    group = $(document.createElement('div'));
	    // group.setAttribute('class', 'group');
	    group.attr('class', 'group');
	    t.slider.container.append(group);
	    // group = t.slider.container.appendChild(group);
	    innercont = $(document.createElement('div'));
	    innercont.attr('class', 'inner-cont');
	    // innercont.setAttribute('class', 'inner-cont');
	    group.append(innercont);
	    // innercont = group.appendChild(innercont);
	  }

	  images[i].onerror = function ()
	  {
	    console.log('error loading slider image, index: ' + i);
	    if (i < (data.length - 1))
	    {
	      t.proc_images(data, i + 1);
	    }
	  }

	  images[i].onload = function ()
	  {
	    if (!t.slider.view_groups)
	    {
	      // if not viewing slides in groups,
	      // it's needed to resize each image to match the 100% of container's width
	      new_ds = adjust_dimensions(this.width, this.height, t.slider.width, t.slider.height);
	      this.width  = this.style.width  = new_ds.width;
	      this.height = this.style.height = new_ds.height;

	      // this variable will be needed later to start the slideshow and
	      // to collect all the slides with the classname in one array
	      slide_classname = 'slide';
	    }
	    else
	    {
	      // if we want to resize images in case of viewing them in groups too,
	      // it's needed to resize each image to match the (100% - paddintTop - paddingBottom) of container's height
	      if (t.slider.resize_if_many)
	      {
	        new_ds = adjust_dimensions
	                 (
	                   this.width,
	                   this.height,
	                   t.slider.width,
	                   t.slider.height - 2 * t.slider.vPadding,
	                   true
	                 );
	        this.width  = this.style.width  = new_ds.width;
	        this.height = this.style.height = new_ds.height;
	      }

	      // check if current width of a group is less than the container's width
	      if (t.slider.width >= (gwidth + this.width + 2 * t.slider.hMargin + 3))
	      {
	        // add the total width (inner width + margin) to the current width if so
	        gwidth += this.width + 2 * t.slider.hMargin;
	      }
	      else
	      {
	        // create a new group and its inner container
	        group = $(document.createElement('div'));
	        group.attr('class', 'group');
	        // group.setAttribute('class', 'group');
	        t.slider.container.append(group);
	        // group = t.slider.container.appendChild(group);
	        innercont = $(document.createElement('div'));
	        innercont.attr('class', 'inner-cont');
	        // innercont.setAttribute('class', 'inner-cont');
	        group.append(innercont);
	        // innercont = group.appendChild(innercont);

	        // set its current width to the width of current image
	        gwidth = this.width;
	      }

	      // append the image to its parent and parent to the inner container
	      innercont.append(parent[i]);
	      parent[i].append(img_obj);
	      // parent[i] = innercont.appendChild(parent[i]);
	      // parent[i].appendChild(images[i]);
	      parent[i].css('margin-right', t.slider.hMargin + 'px');
	      parent[i].css('margin-left', t.slider.hMargin + 'px');

	      // vertically center each group in the main container
	      var p = (t.slider.height - this.height) / 2;
	      group.css('padding-top', p + 'px');
	      group.css('padding-bottom', p + 'px');

	      // set the classname in the variable as before
	      slide_classname = 'group';
	    }

	    // calculate how many percents of images are already loaded and add the text to the loader div
	    if (t.slider.load_all)
	    {
	      t.slider.container.find('.loader div').html(math.round((+ i + 1) / data.length * 100) + '%');
	    }

	    // do this stuff if it's the last image
	    if ((i == (data.length - 1) || (!t.slider.load_all && i == 0)) && (typeof t.fsa == 'undefined' || !t.fsa))
	    {
	      t.fsa = true;
	      // fade in the first one with the class of slide_classname
	      t.slider.container.find('.' + slide_classname).first().fadeIn('fast');
	      // $(t.slider.container.find('.' + slide_classname)).fadeIn('fast');

	      // fade out the loader div tag
	      t.slider.container.find('.loader').first().fadeOut('fast', function (){ $(this).remove(); });
	      // $(t.slider.container.find('.loader')).fadeOut('fast', function (){ $(this).remove(); });

	      // overlay div tag has a default css display property of 'none'
	      // show it if not viewing slides in groups
	      if (!t.slider.view_groups && t.slider.show_overlay)
	      {
	        t.slider.element.find('.overlay').show();
	      }

	      // if showing switcher circles, show their container, as its default css display property is 'none'
	      if (show_circles)
	      {
	        t.slider.element.find('.switcher_circles').show();
	      }
	    }

      if (!t.slider.load_all)
      {
        t.slider.slides = t.slider.container[0].getElementsByClassName(slide_classname);
      }

	    if (i == (data.length - 1))
	    {
	      // set all the slides with classname of slide_classname in an t variable
	      // which later will be used to switch between slides easily,
	      // not having to search for the slides each time
	      t.slider.slides = t.slider.container[0].getElementsByClassName(slide_classname);

	      // start a timer for slideshow
	      t.slider.timer = new Timer(t.change_slide_automatically, t.slider.delay);
	    }
	    else
	    {
	      // run the same function again but for the next image
	      t.proc_images(data, i + 1);
	    }
	  }

	  images[i].src = data[i].img_src;
  }

  // set the options and variables for the t
  t.slider =
  {
    width:         options.width         || 900,
    height:        options.height        || 300,    // it's the minimum height
    vPadding:      options.vPadding      || 0,      // vertical padding (this only works if you're viewing images in groups and resize_if_many == true)
    hMargin:       options.hMargin       || 10,     // if viewing slides in groups, margin between the slides in each group
    delay:         options.delay         || 5000,   // time each slide will stay visible
    timeout:       options.timeout       || 1000,   // time the process of changing a slide will take
    max_circles:   options.max_circles   || 9999,   // maximum number of slides to show circles
    data:          options.data,                    // data
    element:       options.element,                 // jquery element selector where everything will be added
    timer:         null,
    active:        0                                // index of the current (active) visible slide
  };

  if (typeof t.slider.width == 'string' && t.slider.width.slice(-1) == '%')
  {
    t.slider.width = t.slider.element.parent().width() * +t.slider.width.slice(0, -1) / 100;
  }

  t.slider.show_overlay = (typeof options.show_overlay == 'undefined') ? true : options.show_overlay;
  t.slider.resize_if_many = (typeof options.resize_if_many == 'undefined') ? false : options.resize_if_many;
  t.slider.view_groups = (typeof options.view_groups == 'undefined') ? false : options.view_groups;
  t.slider.load_all = (typeof options.load_all == 'undefined') ? true : options.load_all;
  t.slider.vertical_stretch = (typeof options.vertical_stretch == 'undefined') ? false : options.vertical_stretch;


  if (!t.slider.element.hasClass('slider'))
  {
    t.slider.element.addClass('slider');
  }

  // add some height to the minimum height
  if (t.slider.vertical_stretch && screen.height && !t.slider.view_groups)
  {
    t.slider.height += screen.height / 15.9;
  }

  // resize the element according to options
  t.slider.element.height(t.slider.height);
  t.slider.element.width(t.slider.width);

  if (typeof(t.slider.data) == 'undefined' || t.slider.data.length == 0)
  {
    return;
  }
  data = t.slider.data;

  // check if the number of slides exceed the maximum quantity of circles and set it to show_circles variable
  var show_circles = (data.length <= t.slider.max_circles && !t.slider.view_groups) ? true : false,
      circles_html = '';

  // generate html for circles
  if (show_circles)
  {
    // make the same quantity of switcher circles as data.length
    for (i = 0; i < data.length; i ++)
    {
      // make the first one selected
      classname = (i == 0) ? 'circle_selected' : 'circle';
      // add an index attribute to each, which later will be used to switch between circles
      circles_html += '<div class="' + classname + '" index="' + i + '"></div>';
    }

    circles_html = '<div class="switcher_circles">' + circles_html + '</div>';
  }

  // html for slider overlay, loader, switcher buttons and circles and container
  html = '<div class="overlay"></div>' + circles_html +
         '<div class="switcher_button" direction="left"></div>' +
         '<div class="switcher_button" direction="right"></div>' +
         '<div class="container"><div class="loader"><div></div></div>';

  t.slider.element.prepend(html);
  // set the container to an t variable which later will be used to add slides to
  t.slider.container = t.slider.element.find('.container');

  // start processing images and adding them to the slider
  t.proc_images(data, 0);

  if (show_circles)
  {
    // make a click event for switcher circles if they exist
    t.slider.element.find('.circle, .circle_selected').click(function()
    {
      if ($(this).attr('class') == 'circle_selected')
      // if (this.getAttribute('class') == 'circle_selected')
      {
        // return if clicked circle is already selected
        return;
      }
      // change slide according to the clicked circle's index attribute
      // e.g. if circle with index="3" is clicked, 4th (as the indexes start from 0) slide will show up
      t.change_slide($(this).attr('index'));
      // t.change_slide(this.getAttribute('index'));

      // restart timer so the slideshow doesn't stop
      if (typeof t.slider.timer != 'undefined' && t.slider.timer != null)
      {
        t.slider.timer.restart();
      }
    });
  }

  // click event for left and right buttons
  t.slider.element.find('.switcher_button').click(function()
  {
    // get which one was clicked, left or right
    var direction = $(this).attr('direction');
    // var direction = this.getAttribute('direction');

    if (direction == 'left')
    {
      // if the current (active) one is the first one, move to the last, otherwise decrease index by 1
      index = (t.slider.active == 0) ? + t.slider.slides.length - 1 : + t.slider.active - 1;
    }
    else
    {
      // if the current (active) one is the last one, move to the first, otherwise increase index by 1
      index = (t.slider.slides.length <= (+ t.slider.active + 1)) ? 0 : + t.slider.active + 1;
    }

    // change slide according to calculated index
    t.change_slide(index);

    // restart timer so the slideshow doesn't stop
    if (typeof t.slider.timer != 'undefined' && t.slider.timer != null)
    {
      t.slider.timer.restart();
    }
  });
};
