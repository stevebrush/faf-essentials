/*! Blackbaud Design | FAF Refresh Plugins | Last Updated: 02/04/2012 | Version: 3.0.8 */

/* ------------------------------------------------------------ */

/* Console Reset // usage: log('inside coolFunc', this, arguments); // paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/ */
window.log = function(){
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  if(this.console) {
    arguments.callee = arguments.callee.caller;
    var newarr = [].slice.call(arguments);
    (typeof console.log === 'object' ? log.apply.call(console.log, console, newarr) : console.log.apply(console, newarr));
  }
};
// make it safe to use console.log always
(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,timeStamp,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();){b[a]=b[a]||c}})((function(){try
{console.log();return window.console;}catch(err){return window.console={};}})());


/* ------------------------------------------------------------ */


/*
jQuery XML to JSON Plugin v1.1 - 2008-07-01
 *	http://www.fyneworks.com/ - diego@fyneworks.com
 *	Dual licensed under the MIT and GPL licenses:
 *	http://www.opensource.org/licenses/mit-license.php
 *	http://www.gnu.org/licenses/gpl.html
Website: http://www.fyneworks.com/jquery/xml-to-json/

INSPIRED BY: http://www.terracoder.com/
	AND: http://www.thomasfrank.se/xml_to_json.html
	AND: http://www.kawa.net/works/js/xml/objtree-e.html
This simple script converts XML (document of code) into a JSON object. It is the combination of 2
'xml to json' great parsers (see below) which allows for both 'simple' and 'extended' parsing modes.
*/
// Avoid collisions
;if(window.jQuery) (function($){
 // Add function to jQuery namespace
 $.extend({
  
  // converts xml documents and xml text to json object
  xml2json: function(xml, extended) {
   if(!xml) return {}; // quick fail
   
   //### PARSER LIBRARY
   // Core function
   function parseXML(node, simple){
    if(!node) return null;
    var txt = '', obj = null, att = null;
    var nt = node.nodeType, nn = jsVar(node.localName || node.nodeName);
    var nv = node.text || node.nodeValue || '';
    /*DBG*/ //if(window.console) console.log(['x2j',nn,nt,nv.length+' bytes']);
    if(node.childNodes){
     if(node.childNodes.length>0){
      /*DBG*/ //if(window.console) console.log(['x2j',nn,'CHILDREN',node.childNodes]);
      $.each(node.childNodes, function(n,cn){
       var cnt = cn.nodeType, cnn = jsVar(cn.localName || cn.nodeName);
       var cnv = cn.text || cn.nodeValue || '';
       /*DBG*/ //if(window.console) console.log(['x2j',nn,'node>a',cnn,cnt,cnv]);
       if(cnt == 8){
        /*DBG*/ //if(window.console) console.log(['x2j',nn,'node>b',cnn,'COMMENT (ignore)']);
        return; // ignore comment node
       }
       else if(cnt == 3 || cnt == 4 || !cnn){
        // ignore white-space in between tags
        if(cnv.match(/^\s+$/)){
         /*DBG*/ //if(window.console) console.log(['x2j',nn,'node>c',cnn,'WHITE-SPACE (ignore)']);
         return;
        };
        /*DBG*/ //if(window.console) console.log(['x2j',nn,'node>d',cnn,'TEXT']);
        txt += cnv.replace(/^\s+/,'').replace(/\s+$/,'');
								// make sure we ditch trailing spaces from markup
       }
       else{
        /*DBG*/ //if(window.console) console.log(['x2j',nn,'node>e',cnn,'OBJECT']);
        obj = obj || {};
        if(obj[cnn]){
         /*DBG*/ //if(window.console) console.log(['x2j',nn,'node>f',cnn,'ARRAY']);
         
									// http://forum.jquery.com/topic/jquery-jquery-xml2json-problems-when-siblings-of-the-same-tagname-only-have-a-textnode-as-a-child
									if(!obj[cnn].length) obj[cnn] = myArr(obj[cnn]);
									obj[cnn] = myArr(obj[cnn]);
         
									obj[cnn][ obj[cnn].length ] = parseXML(cn, true/* simple */);
         obj[cnn].length = obj[cnn].length;
        }
        else{
         /*DBG*/ //if(window.console) console.log(['x2j',nn,'node>g',cnn,'dig deeper...']);
         obj[cnn] = parseXML(cn);
        };
       };
      });
     };//node.childNodes.length>0
    };//node.childNodes
    if(node.attributes){
     if(node.attributes.length>0){
      /*DBG*/ //if(window.console) console.log(['x2j',nn,'ATTRIBUTES',node.attributes])
      att = {}; obj = obj || {};
      $.each(node.attributes, function(a,at){
       var atn = jsVar(at.name), atv = at.value;
       att[atn] = atv;
       if(obj[atn]){
        /*DBG*/ //if(window.console) console.log(['x2j',nn,'attr>',atn,'ARRAY']);
        
								// http://forum.jquery.com/topic/jquery-jquery-xml2json-problems-when-siblings-of-the-same-tagname-only-have-a-textnode-as-a-child
								//if(!obj[atn].length) obj[atn] = myArr(obj[atn]);//[ obj[ atn ] ];
        obj[cnn] = myArr(obj[cnn]);
								
								obj[atn][ obj[atn].length ] = atv;
        obj[atn].length = obj[atn].length;
       }
       else{
        /*DBG*/ //if(window.console) console.log(['x2j',nn,'attr>',atn,'TEXT']);
        obj[atn] = atv;
       };
      });
      //obj['attributes'] = att;
     };//node.attributes.length>0
    };//node.attributes
    if(obj){
     obj = $.extend( (txt!='' ? new String(txt) : {}),/* {text:txt},*/ obj || {}/*, att || {}*/);
     txt = (obj.text) ? (typeof(obj.text)=='object' ? obj.text : [obj.text || '']).concat([txt]) : txt;
     if(txt) obj.text = txt;
     txt = '';
    };
    var out = obj || txt;
    //console.log([extended, simple, out]);
    if(extended){
     if(txt) out = {};//new String(out);
     txt = out.text || txt || '';
     if(txt) out.text = txt;
     if(!simple) out = myArr(out);
    };
    return out;
   };// parseXML
   // Core Function End
   // Utility functions
   var jsVar = function(s){ return String(s || '').replace(/-/g,"_"); };
   
			// NEW isNum function: 01/09/2010
			// Thanks to Emile Grau, GigaTecnologies S.L., www.gigatransfer.com, www.mygigamail.com
			function isNum(s){
				// based on utility function isNum from xml2json plugin (http://www.fyneworks.com/ - diego@fyneworks.com)
				// few bugs corrected from original function :
				// - syntax error : regexp.test(string) instead of string.test(reg)
				// - regexp modified to accept  comma as decimal mark (latin syntax : 25,24 )
				// - regexp modified to reject if no number before decimal mark  : ".7" is not accepted
				// - string is "trimmed", allowing to accept space at the beginning and end of string
				var regexp=/^((-)?([0-9]+)(([\.\,]{0,1})([0-9]+))?$)/
				return (typeof s == "number") || regexp.test(String((s && typeof s == "string") ? jQuery.trim(s) : ''));
			};
			// OLD isNum function: (for reference only)
			//var isNum = function(s){ return (typeof s == "number") || String((s && typeof s == "string") ? s : '').test(/^((-)?([0-9]*)((\.{0,1})([0-9]+))?$)/); };
																
   var myArr = function(o){
    
				// http://forum.jquery.com/topic/jquery-jquery-xml2json-problems-when-siblings-of-the-same-tagname-only-have-a-textnode-as-a-child
				//if(!o.length) o = [ o ]; o.length=o.length;
    if(!$.isArray(o)) o = [ o ]; o.length=o.length;
				
				// here is where you can attach additional functionality, such as searching and sorting...
    return o;
   };
   // Utility functions End
   //### PARSER LIBRARY END
   
   // Convert plain text to xml
   if(typeof xml=='string') xml = $.text2xml(xml);
   
   // Quick fail if not xml (or if this is a node)
   if(!xml.nodeType) return;
   if(xml.nodeType == 3 || xml.nodeType == 4) return xml.nodeValue;
   
   // Find xml root node
   var root = (xml.nodeType == 9) ? xml.documentElement : xml;
   
   // Convert xml to json
   var out = parseXML(root, true /* simple */);
   
   // Clean-up memory
   xml = null; root = null;
   
   // Send output
   return out;
  },
  
  // Convert text to XML DOM
  text2xml: function(str) {
   // NOTE: I'd like to use jQuery for this, but jQuery makes all tags uppercase
   //return $(xml)[0];
   var out;
   try{
    var xml = ($.browser.msie)?new ActiveXObject("Microsoft.XMLDOM"):new DOMParser();
    xml.async = false;
   }catch(e){ throw new Error("XML Parser could not be instantiated") };
   try{
    if($.browser.msie) out = (xml.loadXML(str))?xml:false;
    else out = xml.parseFromString(str, "text/xml");
   }catch(e){ throw new Error("Error parsing XML string") };
   return out;
  }
		
 }); // extend $
})(jQuery);



/* ------------------------------------------------------------ */

// ColorBox v1.3.19.3 - jQuery lightbox plugin
// (c) 2011 Jack Moore - jacklmoore.com
// License: http://www.opensource.org/licenses/mit-license.php
(function ($, document, window) {
	var
	// Default settings object.	
	// See http://jacklmoore.com/colorbox for details.
	defaults = {
		transition: "elastic",
		speed: 300,
		width: false,
		initialWidth: "600",
		innerWidth: false,
		maxWidth: false,
		height: false,
		initialHeight: "450",
		innerHeight: false,
		maxHeight: false,
		scalePhotos: true,
		scrolling: true,
		inline: false,
		html: false,
		iframe: false,
		fastIframe: true,
		photo: false,
		href: false,
		title: false,
		rel: false,
		opacity: 0.9,
		preloading: true,

		current: "image {current} of {total}",
		previous: "previous",
		next: "next",
		close: "close",
		xhrError: "This content failed to load.",
		imgError: "This image failed to load.",

		open: false,
		returnFocus: true,
		reposition: true,
		loop: true,
		slideshow: false,
		slideshowAuto: true,
		slideshowSpeed: 2500,
		slideshowStart: "start slideshow",
		slideshowStop: "stop slideshow",
		onOpen: false,
		onLoad: false,
		onComplete: false,
		onCleanup: false,
		onClosed: false,
		overlayClose: true,		
		escKey: true,
		arrowKey: true,
		top: false,
		bottom: false,
		left: false,
		right: false,
		fixed: false,
		data: undefined
	},
	
	// Abstracting the HTML and event identifiers for easy rebranding
	colorbox = 'colorbox',
	prefix = 'cbox',
	boxElement = prefix + 'Element',
	
	// Events	
	event_open = prefix + '_open',
	event_load = prefix + '_load',
	event_complete = prefix + '_complete',
	event_cleanup = prefix + '_cleanup',
	event_closed = prefix + '_closed',
	event_purge = prefix + '_purge',
	
	// Special Handling for IE
	isIE = !$.support.opacity && !$.support.style, // IE7 & IE8
	isIE6 = isIE && !window.XMLHttpRequest, // IE6
	event_ie6 = prefix + '_IE6',

	// Cached jQuery Object Variables
	$overlay,
	$box,
	$wrap,
	$content,
	$topBorder,
	$leftBorder,
	$rightBorder,
	$bottomBorder,
	$related,
	$window,
	$loaded,
	$loadingBay,
	$loadingOverlay,
	$title,
	$current,
	$slideshow,
	$next,
	$prev,
	$close,
	$groupControls,
	
	// Variables for cached values or use across multiple functions
	settings,
	interfaceHeight,
	interfaceWidth,
	loadedHeight,
	loadedWidth,
	element,
	index,
	photo,
	open,
	active,
	closing,
	loadingTimer,
	publicMethod,
	div = "div",
	init;

	// ****************
	// HELPER FUNCTIONS
	// ****************
	
	// Convience function for creating new jQuery objects
	function $tag(tag, id, css) {
		var element = document.createElement(tag);

		if (id) {
			element.id = prefix + id;
		}

		if (css) {
			element.style.cssText = css;
		}

		return $(element);
	}

	// Determine the next and previous members in a group.
	function getIndex(increment) {
		var 
		max = $related.length, 
		newIndex = (index + increment) % max;
		
		return (newIndex < 0) ? max + newIndex : newIndex;
	}

	// Convert '%' and 'px' values to integers
	function setSize(size, dimension) {
		return Math.round((/%/.test(size) ? ((dimension === 'x' ? $window.width() : $window.height()) / 100) : 1) * parseInt(size, 10));
	}
	
	// Checks an href to see if it is a photo.
	// There is a force photo option (photo: true) for hrefs that cannot be matched by this regex.
	function isImage(url) {
		return settings.photo || /\.(gif|png|jpe?g|bmp|ico)((#|\?).*)?$/i.test(url);
	}
	
	// Assigns function results to their respective properties
	function makeSettings() {
		var i,
			data = $.data(element, colorbox);
		
		if (data == null) {
			settings = $.extend({}, defaults);
			if (console && console.log) {
				console.log('Error: cboxElement missing settings object')
			}
		} else {
			settings = $.extend({}, data);    		
		}
		
		for (i in settings) {
			if ($.isFunction(settings[i]) && i.slice(0, 2) !== 'on') { // checks to make sure the function isn't one of the callbacks, they will be handled at the appropriate time.
				settings[i] = settings[i].call(element);
			}
		}
		
		settings.rel = settings.rel || element.rel || 'nofollow';
		settings.href = settings.href || $(element).attr('href');
		settings.title = settings.title || element.title;
		
		if (typeof settings.href === "string") {
			settings.href = $.trim(settings.href);
		}
	}

	function trigger(event, callback) {
		$.event.trigger(event);
		if (callback) {
			callback.call(element);
		}
	}

	// Slideshow functionality
	function slideshow() {
		var
		timeOut,
		className = prefix + "Slideshow_",
		click = "click." + prefix,
		start,
		stop,
		clear;
		
		if (settings.slideshow && $related[1]) {
			start = function () {
				$slideshow
					.text(settings.slideshowStop)
					.unbind(click)
					.bind(event_complete, function () {
						if (settings.loop || $related[index + 1]) {
							timeOut = setTimeout(publicMethod.next, settings.slideshowSpeed);
						}
					})
					.bind(event_load, function () {
						clearTimeout(timeOut);
					})
					.one(click + ' ' + event_cleanup, stop);
				$box.removeClass(className + "off").addClass(className + "on");
				timeOut = setTimeout(publicMethod.next, settings.slideshowSpeed);
			};
			
			stop = function () {
				clearTimeout(timeOut);
				$slideshow
					.text(settings.slideshowStart)
					.unbind([event_complete, event_load, event_cleanup, click].join(' '))
					.one(click, function () {
						publicMethod.next();
						start();
					});
				$box.removeClass(className + "on").addClass(className + "off");
			};
			
			if (settings.slideshowAuto) {
				start();
			} else {
				stop();
			}
		} else {
			$box.removeClass(className + "off " + className + "on");
		}
	}

	function launch(target) {
		if (!closing) {
			
			element = target;
			
			makeSettings();
			
			$related = $(element);
			
			index = 0;
			
			if (settings.rel !== 'nofollow') {
				$related = $('.' + boxElement).filter(function () {
					var data = $.data(this, colorbox), 
						relRelated;

					if (data) {
						relRelated =  data.rel || this.rel;
					}
					
					return (relRelated === settings.rel);
				});
				index = $related.index(element);
				
				// Check direct calls to ColorBox.
				if (index === -1) {
					$related = $related.add(element);
					index = $related.length - 1;
				}
			}
			
			if (!open) {
				open = active = true; // Prevents the page-change action from queuing up if the visitor holds down the left or right keys.
				
				$box.show();
				
				if (settings.returnFocus) {
					$(element).blur().one(event_closed, function () {
						$(this).focus();
					});
				}
				
				// +settings.opacity avoids a problem in IE when using non-zero-prefixed-string-values, like '.5'
				$overlay.css({"opacity": +settings.opacity, "cursor": settings.overlayClose ? "pointer" : "auto"}).show();
				
				// Opens inital empty ColorBox prior to content being loaded.
				settings.w = setSize(settings.initialWidth, 'x');
				settings.h = setSize(settings.initialHeight, 'y');
				publicMethod.position();
				
				if (isIE6) {
					$window.bind('resize.' + event_ie6 + ' scroll.' + event_ie6, function () {
						$overlay.css({width: $window.width(), height: $window.height(), top: $window.scrollTop(), left: $window.scrollLeft()});
					}).trigger('resize.' + event_ie6);
				}
				
				trigger(event_open, settings.onOpen);
				
				$groupControls.add($title).hide();
				
				$close.html(settings.close).show();
			}
			
			publicMethod.load(true);
		}
	}

	// ColorBox's markup needs to be added to the DOM prior to being called
	// so that the browser will go ahead and load the CSS background images.
	function appendHTML() {
		if (!$box && document.body) {
			init = false;

			$window = $(window);
			$box = $tag(div).attr({id: colorbox, 'class': isIE ? prefix + (isIE6 ? 'IE6' : 'IE') : ''}).hide();
			$overlay = $tag(div, "Overlay", isIE6 ? 'position:absolute' : '').hide();
			$wrap = $tag(div, "Wrapper");
			$content = $tag(div, "Content").append(
				$loaded = $tag(div, "LoadedContent", 'width:0; height:0; overflow:hidden'),
				$loadingOverlay = $tag(div, "LoadingOverlay").add($tag(div, "LoadingGraphic")),
				$title = $tag(div, "Title"),
				$current = $tag(div, "Current"),
				$next = $tag(div, "Next"),
				$prev = $tag(div, "Previous"),
				$slideshow = $tag(div, "Slideshow").bind(event_open, slideshow),
				$close = $tag(div, "Close")
			);
			
			$wrap.append( // The 3x3 Grid that makes up ColorBox
				$tag(div).append(
					$tag(div, "TopLeft"),
					$topBorder = $tag(div, "TopCenter"),
					$tag(div, "TopRight")
				),
				$tag(div, false, 'clear:left').append(
					$leftBorder = $tag(div, "MiddleLeft"),
					$content,
					$rightBorder = $tag(div, "MiddleRight")
				),
				$tag(div, false, 'clear:left').append(
					$tag(div, "BottomLeft"),
					$bottomBorder = $tag(div, "BottomCenter"),
					$tag(div, "BottomRight")
				)
			).find('div div').css({'float': 'left'});
			
			$loadingBay = $tag(div, false, 'position:absolute; width:9999px; visibility:hidden; display:none');
			
			$groupControls = $next.add($prev).add($current).add($slideshow);

			$(document.body).append($overlay, $box.append($wrap, $loadingBay));
		}
	}

	// Add ColorBox's event bindings
	function addBindings() {
		if ($box) {
			if (!init) {
				init = true;

				// Cache values needed for size calculations
				interfaceHeight = $topBorder.height() + $bottomBorder.height() + $content.outerHeight(true) - $content.height();//Subtraction needed for IE6
				interfaceWidth = $leftBorder.width() + $rightBorder.width() + $content.outerWidth(true) - $content.width();
				loadedHeight = $loaded.outerHeight(true);
				loadedWidth = $loaded.outerWidth(true);
				
				// Setting padding to remove the need to do size conversions during the animation step.
				$box.css({"padding-bottom": interfaceHeight, "padding-right": interfaceWidth});

				// Anonymous functions here keep the public method from being cached, thereby allowing them to be redefined on the fly.
				$next.click(function () {
					publicMethod.next();
				});
				$prev.click(function () {
					publicMethod.prev();
				});
				$close.click(function () {
					publicMethod.close();
				});
				$overlay.click(function () {
					if (settings.overlayClose) {
						publicMethod.close();
					}
				});
				
				// Key Bindings
				$(document).bind('keydown.' + prefix, function (e) {
					var key = e.keyCode;
					if (open && settings.escKey && key === 27) {
						e.preventDefault();
						publicMethod.close();
					}
					if (open && settings.arrowKey && $related[1]) {
						if (key === 37) {
							e.preventDefault();
							$prev.click();
						} else if (key === 39) {
							e.preventDefault();
							$next.click();
						}
					}
				});

				$('.' + boxElement, document).live('click', function (e) {
					// ignore non-left-mouse-clicks and clicks modified with ctrl / command, shift, or alt.
					// See: http://jacklmoore.com/notes/click-events/
					if (!(e.which > 1 || e.shiftKey || e.altKey || e.metaKey)) {
						e.preventDefault();
						launch(this);
					}
				});
			}
			return true;
		}
		return false;
	}

	// Don't do anything if ColorBox already exists.
	if ($.colorbox) {
		return;
	}

	// Append the HTML when the DOM loads
	$(appendHTML);


	// ****************
	// PUBLIC FUNCTIONS
	// Usage format: $.fn.colorbox.close();
	// Usage from within an iframe: parent.$.fn.colorbox.close();
	// ****************
	
	publicMethod = $.fn[colorbox] = $[colorbox] = function (options, callback) {
		var $this = this;
		
		options = options || {};
		
		appendHTML();

		if (addBindings()) {
			if (!$this[0]) {
				if ($this.selector) { // if a selector was given and it didn't match any elements, go ahead and exit.
					return $this;
				}
				// if no selector was given (ie. $.colorbox()), create a temporary element to work with
				$this = $('<a/>');
				options.open = true; // assume an immediate open
			}
			
			if (callback) {
				options.onComplete = callback;
			}
			
			$this.each(function () {
				$.data(this, colorbox, $.extend({}, $.data(this, colorbox) || defaults, options));
			}).addClass(boxElement);
			
			if (($.isFunction(options.open) && options.open.call($this)) || options.open) {
				launch($this[0]);
			}
		}
		
		return $this;
	};

	publicMethod.position = function (speed, loadedCallback) {
		var 
		top = 0, 
		left = 0, 
		offset = $box.offset(),
		scrollTop, 
		scrollLeft;
		
		$window.unbind('resize.' + prefix);

		// remove the modal so that it doesn't influence the document width/height        
		$box.css({top: -9e4, left: -9e4});

		scrollTop = $window.scrollTop();
		scrollLeft = $window.scrollLeft();

		if (settings.fixed && !isIE6) {
			offset.top -= scrollTop;
			offset.left -= scrollLeft;
			$box.css({position: 'fixed'});
		} else {
			top = scrollTop;
			left = scrollLeft;
			$box.css({position: 'absolute'});
		}

		// keeps the top and left positions within the browser's viewport.
		if (settings.right !== false) {
			left += Math.max($window.width() - settings.w - loadedWidth - interfaceWidth - setSize(settings.right, 'x'), 0);
		} else if (settings.left !== false) {
			left += setSize(settings.left, 'x');
		} else {
			left += Math.round(Math.max($window.width() - settings.w - loadedWidth - interfaceWidth, 0) / 2);
		}
		
		if (settings.bottom !== false) {
			top += Math.max($window.height() - settings.h - loadedHeight - interfaceHeight - setSize(settings.bottom, 'y'), 0);
		} else if (settings.top !== false) {
			top += setSize(settings.top, 'y');
		} else {
			top += Math.round(Math.max($window.height() - settings.h - loadedHeight - interfaceHeight, 0) / 2);
		}

		$box.css({top: offset.top, left: offset.left});

		// setting the speed to 0 to reduce the delay between same-sized content.
		speed = ($box.width() === settings.w + loadedWidth && $box.height() === settings.h + loadedHeight) ? 0 : speed || 0;
		
		// this gives the wrapper plenty of breathing room so it's floated contents can move around smoothly,
		// but it has to be shrank down around the size of div#colorbox when it's done.  If not,
		// it can invoke an obscure IE bug when using iframes.
		$wrap[0].style.width = $wrap[0].style.height = "9999px";
		
		function modalDimensions(that) {
			$topBorder[0].style.width = $bottomBorder[0].style.width = $content[0].style.width = that.style.width;
			$content[0].style.height = $leftBorder[0].style.height = $rightBorder[0].style.height = that.style.height;
		}
		
		$box.dequeue().animate({width: settings.w + loadedWidth, height: settings.h + loadedHeight, top: top, left: left}, {
			duration: speed,
			complete: function () {
				modalDimensions(this);
				
				active = false;
				
				// shrink the wrapper down to exactly the size of colorbox to avoid a bug in IE's iframe implementation.
				$wrap[0].style.width = (settings.w + loadedWidth + interfaceWidth) + "px";
				$wrap[0].style.height = (settings.h + loadedHeight + interfaceHeight) + "px";
				
				if (settings.reposition) {
					setTimeout(function () {  // small delay before binding onresize due to an IE8 bug.
						$window.bind('resize.' + prefix, publicMethod.position);
					}, 1);
				}

				if (loadedCallback) {
					loadedCallback();
				}
			},
			step: function () {
				modalDimensions(this);
			}
		});
	};

	publicMethod.resize = function (options) {
		if (open) {
			options = options || {};
			
			if (options.width) {
				settings.w = setSize(options.width, 'x') - loadedWidth - interfaceWidth;
			}
			if (options.innerWidth) {
				settings.w = setSize(options.innerWidth, 'x');
			}
			$loaded.css({width: settings.w});
			
			if (options.height) {
				settings.h = setSize(options.height, 'y') - loadedHeight - interfaceHeight;
			}
			if (options.innerHeight) {
				settings.h = setSize(options.innerHeight, 'y');
			}
			if (!options.innerHeight && !options.height) {
				$loaded.css({height: "auto"});
				settings.h = $loaded.height();
			}
			$loaded.css({height: settings.h});
			
			publicMethod.position(settings.transition === "none" ? 0 : settings.speed);
		}
	};

	publicMethod.prep = function (object) {
		if (!open) {
			return;
		}
		
		var callback, speed = settings.transition === "none" ? 0 : settings.speed;
		
		$loaded.remove();
		$loaded = $tag(div, 'LoadedContent').append(object);
		
		function getWidth() {
			settings.w = settings.w || $loaded.width();
			settings.w = settings.mw && settings.mw < settings.w ? settings.mw : settings.w;
			return settings.w;
		}
		function getHeight() {
			settings.h = settings.h || $loaded.height();
			settings.h = settings.mh && settings.mh < settings.h ? settings.mh : settings.h;
			return settings.h;
		}
		
		$loaded.hide()
		.appendTo($loadingBay.show())// content has to be appended to the DOM for accurate size calculations.
		.css({width: getWidth(), overflow: settings.scrolling ? 'auto' : 'hidden'})
		.css({height: getHeight()})// sets the height independently from the width in case the new width influences the value of height.
		.prependTo($content);
		
		$loadingBay.hide();
		
		// floating the IMG removes the bottom line-height and fixed a problem where IE miscalculates the width of the parent element as 100% of the document width.
		//$(photo).css({'float': 'none', marginLeft: 'auto', marginRight: 'auto'});
		
		$(photo).css({'float': 'none'});
		
		// Hides SELECT elements in IE6 because they would otherwise sit on top of the overlay.
		if (isIE6) {
			$('select').not($box.find('select')).filter(function () {
				return this.style.visibility !== 'hidden';
			}).css({'visibility': 'hidden'}).one(event_cleanup, function () {
				this.style.visibility = 'inherit';
			});
		}
		
		callback = function () {
			var preload, 
				i, 
				total = $related.length, 
				iframe, 
				frameBorder = 'frameBorder', 
				allowTransparency = 'allowTransparency', 
				complete, 
				src, 
				img, 
				data;
			
			if (!open) {
				return;
			}
			
			function removeFilter() {
				if (isIE) {
					$box[0].style.removeAttribute('filter');
				}
			}
			
			complete = function () {
				clearTimeout(loadingTimer);
				$loadingOverlay.hide();
				trigger(event_complete, settings.onComplete);
			};
			
			if (isIE) {
				//This fadeIn helps the bicubic resampling to kick-in.
				if (photo) {
					$loaded.fadeIn(100);
				}
			}
			
			$title.html(settings.title).add($loaded).show();
			
			if (total > 1) { // handle grouping
				if (typeof settings.current === "string") {
					$current.html(settings.current.replace('{current}', index + 1).replace('{total}', total)).show();
				}
				
				$next[(settings.loop || index < total - 1) ? "show" : "hide"]().html(settings.next);
				$prev[(settings.loop || index) ? "show" : "hide"]().html(settings.previous);
				
				if (settings.slideshow) {
					$slideshow.show();
				}
				
				// Preloads images within a rel group
				if (settings.preloading) {
					preload = [
						getIndex(-1),
						getIndex(1)
					];
					while (i = $related[preload.pop()]) {
						data = $.data(i, colorbox);
						
						if (data && data.href) {
							src = data.href;
							if ($.isFunction(src)) {
								src = src.call(i);
							}
						} else {
							src = i.href;
						}

						if (isImage(src)) {
							img = new Image();
							img.src = src;
						}
					}
				}
			} else {
				$groupControls.hide();
			}
			
			if (settings.iframe) {
				iframe = $tag('iframe')[0];
				
				if (frameBorder in iframe) {
					iframe[frameBorder] = 0;
				}
				if (allowTransparency in iframe) {
					iframe[allowTransparency] = "true";
				}
				// give the iframe a unique name to prevent caching
				iframe.name = prefix + (+new Date());
				if (settings.fastIframe) {
					complete();
				} else {
					$(iframe).one('load', complete);
				}
				iframe.src = settings.href;
				if (!settings.scrolling) {
					iframe.scrolling = "no";
				}
				$(iframe).addClass(prefix + 'Iframe').appendTo($loaded).one(event_purge, function () {
					iframe.src = "//about:blank";
				});
			} else {
				complete();
			}
			
			if (settings.transition === 'fade') {
				$box.fadeTo(speed, 1, removeFilter);
			} else {
				removeFilter();
			}
		};
		
		if (settings.transition === 'fade') {
			$box.fadeTo(speed, 0, function () {
				publicMethod.position(0, callback);
			});
		} else {
			publicMethod.position(speed, callback);
		}
	};

	publicMethod.load = function (launched) {
		var href, setResize, prep = publicMethod.prep;
		
		active = true;
		
		photo = false;
		
		element = $related[index];
		
		if (!launched) {
			makeSettings();
		}
		
		trigger(event_purge);
		
		trigger(event_load, settings.onLoad);
		
		settings.h = settings.height ?
				setSize(settings.height, 'y') - loadedHeight - interfaceHeight :
				settings.innerHeight && setSize(settings.innerHeight, 'y');
		
		settings.w = settings.width ?
				setSize(settings.width, 'x') - loadedWidth - interfaceWidth :
				settings.innerWidth && setSize(settings.innerWidth, 'x');
		
		// Sets the minimum dimensions for use in image scaling
		settings.mw = settings.w;
		settings.mh = settings.h;
		
		// Re-evaluate the minimum width and height based on maxWidth and maxHeight values.
		// If the width or height exceed the maxWidth or maxHeight, use the maximum values instead.
		if (settings.maxWidth) {
			settings.mw = setSize(settings.maxWidth, 'x') - loadedWidth - interfaceWidth;
			settings.mw = settings.w && settings.w < settings.mw ? settings.w : settings.mw;
		}
		if (settings.maxHeight) {
			settings.mh = setSize(settings.maxHeight, 'y') - loadedHeight - interfaceHeight;
			settings.mh = settings.h && settings.h < settings.mh ? settings.h : settings.mh;
		}
		
		href = settings.href;
		
		loadingTimer = setTimeout(function () {
			$loadingOverlay.show();
		}, 100);
		
		if (settings.inline) {
			// Inserts an empty placeholder where inline content is being pulled from.
			// An event is bound to put inline content back when ColorBox closes or loads new content.
			$tag(div).hide().insertBefore($(href)[0]).one(event_purge, function () {
				$(this).replaceWith($loaded.children());
			});
			prep($(href));
		} else if (settings.iframe) {
			// IFrame element won't be added to the DOM until it is ready to be displayed,
			// to avoid problems with DOM-ready JS that might be trying to run in that iframe.
			prep(" ");
		} else if (settings.html) {
			prep(settings.html);
		} else if (isImage(href)) {
			$(photo = new Image())
			.addClass(prefix + 'Photo')
			.error(function () {
				settings.title = false;
				prep($tag(div, 'Error').html(settings.imgError));
			})
			.load(function () {
				var percent;
				photo.onload = null; //stops animated gifs from firing the onload repeatedly.
				
				if (settings.scalePhotos) {
					setResize = function () {
						photo.height -= photo.height * percent;
						photo.width -= photo.width * percent;	
					};
					if (settings.mw && photo.width > settings.mw) {
						percent = (photo.width - settings.mw) / photo.width;
						setResize();
					}
					if (settings.mh && photo.height > settings.mh) {
						percent = (photo.height - settings.mh) / photo.height;
						setResize();
					}
				}
				
				if (settings.h) {
					photo.style.marginTop = Math.max(settings.h - photo.height, 0) / 2 + 'px';
				}
				
				if ($related[1] && (settings.loop || $related[index + 1])) {
					photo.style.cursor = 'pointer';
					photo.onclick = function () {
						publicMethod.next();
					};
				}
				
				if (isIE) {
					photo.style.msInterpolationMode = 'bicubic';
				}
				
				setTimeout(function () { // A pause because Chrome will sometimes report a 0 by 0 size otherwise.
					prep(photo);
				}, 1);
			});
			
			setTimeout(function () { // A pause because Opera 10.6+ will sometimes not run the onload function otherwise.
				photo.src = href;
			}, 1);
		} else if (href) {
			$loadingBay.load(href, settings.data, function (data, status, xhr) {
				prep(status === 'error' ? $tag(div, 'Error').html(settings.xhrError) : $(this).contents());
			});
		}
	};
		
	// Navigates to the next page/image in a set.
	publicMethod.next = function () {
		if (!active && $related[1] && (settings.loop || $related[index + 1])) {
			index = getIndex(1);
			publicMethod.load();
		}
	};
	
	publicMethod.prev = function () {
		if (!active && $related[1] && (settings.loop || index)) {
			index = getIndex(-1);
			publicMethod.load();
		}
	};

	// Note: to use this within an iframe use the following format: parent.$.fn.colorbox.close();
	publicMethod.close = function () {
		if (open && !closing) {
			
			closing = true;
			
			open = false;
			
			trigger(event_cleanup, settings.onCleanup);
			
			$window.unbind('.' + prefix + ' .' + event_ie6);
			
			$overlay.fadeTo(200, 0);
			
			$box.stop().fadeTo(300, 0, function () {
				 
				$box.add($overlay).css({'opacity': 1, cursor: 'auto'}).hide();
				
				trigger(event_purge);
				
				$loaded.remove();
				
				setTimeout(function () {
					closing = false;
					trigger(event_closed, settings.onClosed);
				}, 1);
			});
		}
	};

	// Removes changes ColorBox made to the document, but does not remove the plugin
	// from jQuery.
	publicMethod.remove = function () {
		$([]).add($box).add($overlay).remove();
		$box = null;
		$('.' + boxElement)
			.removeData(colorbox)
			.removeClass(boxElement)
			.die();
	};

	// A method for fetching the current element ColorBox is referencing.
	// returns a jQuery object.
	publicMethod.element = function () {
		return $(element);
	};

	publicMethod.settings = defaults;

}(jQuery, document, this));


/* ------------------------------------------------------------ */


/*
	Totem Ticker Plugin
	Copyright (c) 2011 Zach Dunn / www.buildinternet.com
	Released under MIT License
	--------------------------
	Structure based on Doug Neiner's jQuery plugin blueprint: http://starter.pixelgraphics.us/
*/
(function( $ ){
	
	if(!$.omr){
		$.omr = new Object();
	};

	$.omr.totemticker = function(el, options ) {
	  	
	  	var base = this;
	  	
		//Define the DOM elements
	  	base.el = el;
	  	base.$el = $(el);
	  	
	  	// Add a reverse reference to the DOM object
        base.$el.data("omr.totemticker", base);
	  	
	  	base.init = function(){
            base.options = $.extend({},$.omr.totemticker.defaultOptions, options);
            
            //Define the ticker object
           	base.ticker;
			
			//Adjust the height of ticker if specified
			base.format_ticker();
			
			//Setup navigation links (if specified)
			base.setup_nav();
			
			//Start the ticker
			base.start_interval();
			
			//Debugging info in console
			//base.debug_info();
        };
		
		base.start_interval = function(){
			
			//Clear out any existing interval
			clearInterval(base.ticker);
			
	    	base.ticker = setInterval(function() {
	    	
	    		base.$el.find('li:first').animate({
	            	marginTop: '-' + base.options.row_height,
	            }, base.options.speed, function() {
	                $(this).detach().css('marginTop', '0').appendTo(base.$el);
	            });
	            
	    	}, base.options.interval);
	    }
	    
	    base.reset_interval = function(){
	    	clearInterval(base.ticker);
	    	base.start_interval();
	    }
	    
	    base.stop_interval = function(){
	    	clearInterval(base.ticker);
	    }
	
		base.format_ticker = function(){
		
			if(typeof(base.options.max_items) != "undefined" && base.options.max_items != null) {
				
				//Remove units of measurement (Should expand to cover EM and % later)
				var stripped_height = base.options.row_height.replace(/px/i, '');
				var ticker_height = stripped_height * base.options.max_items;
			
				base.$el.css({
					height		: ticker_height + 'px', 
					overflow	: 'hidden',	
				});
				
			}else{
				//No heights were specified, so just doublecheck overflow = hidden
				base.$el.css({
					overflow	: 'hidden',
				})
			}
			
		}
	
		base.setup_nav = function(){
			
			//Stop Button
			if (typeof(base.options.stop) != "undefined"  && base.options.stop != null){
				$(base.options.stop).click(function(){
					base.stop_interval();
					return false;
				});
			}
			
			//Start Button
			if (typeof(base.options.start) != "undefined"  && base.options.start != null){
				$(base.options.start).click(function(){
					base.start_interval();
					return false;
				});
			}
			
			//Previous Button
			if (typeof(base.options.previous) != "undefined"  && base.options.previous != null){
				$(base.options.previous).click(function(){
					base.$el.find('li:last').detach().prependTo(base.$el).css('marginTop', '-' + base.options.row_height);
					base.$el.find('li:first').animate({
				        marginTop: '0px',
				    }, base.options.speed, function () {
				        base.reset_interval();
				    });
				    return false;
				});
			}
			
			//Next Button
			if (typeof(base.options.next) != "undefined" && base.options.next != null){
				$(base.options.next).click(function(){
					base.$el.find('li:first').animate({
						marginTop: '-' + base.options.row_height,
			        }, base.options.speed, function() {
			            $(this).detach().css('marginTop', '0px').appendTo(base.$el);
			            base.reset_interval();
			        });
			        return false;
				});
			}
			
			//Stop on mouse hover
			if (typeof(base.options.mousestop) != "undefined" && base.options.mousestop === true) {
				base.$el.mouseenter(function(){
					base.stop_interval();
				}).mouseleave(function(){
					base.start_interval();
				});
			}
			
			/*
				TO DO List
				----------------
				Add a continuous scrolling mode
			*/
			
		}
		
		base.debug_info = function()
		{
			//Dump options into console
			console.log(base.options);
		}
		
		//Make it go!
		base.init();
  };
  
  $.omr.totemticker.defaultOptions = {
  		message		:	'Ticker Loaded',	/* Disregard */
  		next		:	null,		/* ID of next button or link */
  		previous	:	null,		/* ID of previous button or link */
  		stop		:	null,		/* ID of stop button or link */
  		start		:	null,		/* ID of start button or link */
  		row_height	:	'100px',	/* Height of each ticker row in PX. Should be uniform. */
  		speed		:	800,		/* Speed of transition animation in milliseconds */
  		interval	:	4000,		/* Time between change in milliseconds */
		max_items	: 	null, 		/* Integer for how many items to display at once. Resizes height accordingly (OPTIONAL) */
  };
  
  $.fn.totemticker = function( options ){
    return this.each(function(){
    	(new $.omr.totemticker(this, options));
  	});
  };
  
})( jQuery );


/* ------------------------------------------------------------ */

/*
 * jTweetsAnywhere V1.2.1
 * http://thomasbillenstein.com/jTweetsAnywhere/
 *
 * Copyright 2010, Thomas Billenstein
 * Licensed under the MIT license.
 * http://thomasbillenstein.com/jTweetsAnywhere/license.txt
 */
(function(e){e.fn.jTweetsAnywhere=function(a){a=e.extend({username:"tbillenstein",list:null,searchParams:null,count:0,tweetProfileImagePresent:null,tweetFilter:defaultTweetFilter,showTweetFeed:true,showFollowButton:false,showConnectButton:false,showLoginInfo:false,showTweetBox:false,mainDecorator:defaultMainDecorator,tweetFeedDecorator:defaultTweetFeedDecorator,tweetDecorator:defaultTweetDecorator,tweetProfileImageDecorator:defaultTweetProfileImageDecorator,tweetBodyDecorator:defaultTweetBodyDecorator, tweetUsernameDecorator:defaultTweetUsernameDecorator,tweetTextDecorator:defaultTweetTextDecorator,tweetAttributesDecorator:defaultTweetAttributesDecorator,tweetTimestampDecorator:defaultTweetTimestampDecorator,tweetSourceDecorator:defaultTweetSourceDecorator,tweetGeoLocationDecorator:defaultTweetGeoLocationDecorator,tweetInReplyToDecorator:defaultTweetInReplyToDecorator,tweetRetweeterDecorator:defaultTweetRetweeterDecorator,tweetFeedControlsDecorator:defaultTweetFeedControlsDecorator,tweetFeedControlsMoreBtnDecorator:defaultTweetFeedControlsMoreBtnDecorator, tweetFeedControlsPrevBtnDecorator:defaultTweetFeedControlsPrevBtnDecorator,tweetFeedControlsNextBtnDecorator:defaultTweetFeedControlsNextBtnDecorator,tweetFeedAutorefreshTriggerDecorator:defaultTweetFeedAutorefreshTriggerDecorator,tweetFeedAutorefreshTriggerContentDecorator:defaultTweetFeedAutorefreshTriggerContentDecorator,connectButtonDecorator:defaultConnectButtonDecorator,loginInfoDecorator:defaultLoginInfoDecorator,loginInfoContentDecorator:defaultLoginInfoContentDecorator,followButtonDecorator:defaultFollowButtonDecorator, tweetBoxDecorator:defaultTweetBoxDecorator,linkDecorator:defaultLinkDecorator,usernameDecorator:defaultUsernameDecorator,hashtagDecorator:defaultHashtagDecorator,loadingDecorator:defaultLoadingDecorator,errorDecorator:defaultErrorDecorator,noDataDecorator:defaultNoDataDecorator,tweetTimestampFormatter:defaultTweetTimestampFormatter,tweetTimestampTooltipFormatter:defaultTweetTimestampTooltipFormatter,tweetVisualizer:defaultTweetVisualizer,loadingIndicatorVisualizer:defaultLoadingIndicatorVisualizer, autorefreshTriggerVisualizer:defaultAutorefreshTriggerVisualizer,onDataRequestHandler:defaultOnDataRequestHandler,onRateLimitDataHandler:defaultOnRateLimitDataHandler,_tweetFeedConfig:{expandHovercards:false,showTimestamp:{refreshInterval:0},showSource:false,showGeoLocation:true,showInReplyTo:true,showProfileImages:null,showUserScreenNames:null,showUserFullNames:false,includeRetweets:true,paging:{mode:"none",_limit:0,_offset:0},autorefresh:{mode:"none",interval:60,duration:3600,_startTime:null,_triggerElement:null}, _pageParam:0,_maxId:null,_recLevel:0,_noData:false,_clearBeforePopulate:false},_tweetBoxConfig:{counter:true,width:515,height:65,label:"What's happening?",defaultContent:"",onTweet:function(){}},_connectButtonConfig:{size:"medium"},_baseSelector:null,_baseElement:null,_tweetFeedElement:null,_tweetFeedControlsElement:null,_followButtonElement:null,_loginInfoElement:null,_connectButtonElement:null,_tweetBoxElement:null,_loadingIndicatorElement:null,_noDataElement:null,_tweetsCache:[],_autorefreshTweetsCache:[], _stats:{dataRequestCount:0,rateLimitPreventionCount:0,rateLimit:{remaining_hits:150,hourly_limit:150}}},a);if(a.mainDecorator){a._baseSelector=this.selector;if(typeof a.username!="string"){if(!a.searchParams)a.searchParams=["q=from:"+a.username.join(" OR from:")];a.username=a.username[0]}typeof a.showTweetFeed=="object"&&e.extend(true,a._tweetFeedConfig,a.showTweetFeed);if(typeof a.showTweetBox=="object"){a._tweetBoxConfig=a.showTweetBox;a.showTweetBox=true}if(typeof a.showConnectButton=="object"){a._connectButtonConfig= a.showConnectButton;a.showConnectButton=true}if(a._tweetFeedConfig.showProfileImages==null)a._tweetFeedConfig.showProfileImages=a.tweetProfileImagePresent;if(a._tweetFeedConfig.showProfileImages==null)a._tweetFeedConfig.showProfileImages=(a.list||a.searchParams)&&a.tweetProfileImageDecorator;if(a._tweetFeedConfig.showUserScreenNames==null){if(a.list||a.searchParams)a._tweetFeedConfig.showUserScreenNames=true;if(!a.tweetUsernameDecorator)a._tweetFeedConfig.showUserScreenNames=false}if(a._tweetFeedConfig.showUserFullNames== null){if(a.list||a.searchParams)a._tweetFeedConfig.showUserFullNames=true;if(!a.tweetUsernameDecorator)a._tweetFeedConfig.showUserFullNames=false}a.count=validateRange(a.count,0,a.searchParams?100:20);a._tweetFeedConfig.autorefresh.interval=Math.max(30,a._tweetFeedConfig.autorefresh.interval);a._tweetFeedConfig.paging._offset=0;a._tweetFeedConfig.paging._limit=a.count;if(a.count==0||!a.showTweetFeed){a.tweetFeedDecorator=null;a.tweetFeedControlsDecorator=null}if(a._tweetFeedConfig.paging.mode=="none")a.tweetFeedControlsDecorator= null;if(!a.showFollowButton)a.followButtonDecorator=null;if(!a.showTweetBox)a.tweetBoxDecorator=null;if(!a.showConnectButton)a.connectButtonDecorator=null;if(!a.showLoginInfo)a.loginInfoDecorator=null;if(!a._tweetFeedConfig.showTimestamp)a.tweetTimestampDecorator=null;if(!a._tweetFeedConfig.showSource)a.tweetSourceDecorator=null;if(!a._tweetFeedConfig.showGeoLocation)a.tweetGeoLocationDecorator=null;if(!a._tweetFeedConfig.showInReplyTo)a.tweetInReplyToDecorator=null;e.ajaxSetup({cache:true});return this.each(function(){a._baseElement= e(this);a._tweetFeedElement=a.tweetFeedDecorator?e(a.tweetFeedDecorator(a)):null;a._tweetFeedControlsElement=a.tweetFeedControlsDecorator?e(a.tweetFeedControlsDecorator(a)):null;a._followButtonElement=a.followButtonDecorator?e(a.followButtonDecorator(a)):null;a._tweetBoxElement=a.tweetBoxDecorator?e(a.tweetBoxDecorator(a)):null;a._connectButtonElement=a.connectButtonDecorator?e(a.connectButtonDecorator(a)):null;a._loginInfoElement=a.loginInfoDecorator?e(a.loginInfoDecorator(a)):null;a.mainDecorator(a); populateTweetFeed(a);populateAnywhereControls(a);bindEventHandlers(a);a._tweetFeedConfig.autorefresh._startTime=(new Date).getTime();startAutorefresh(a);startTimestampRefresh(a)})}};defaultMainDecorator=function(a){a._tweetFeedElement&&a._baseElement.append(a._tweetFeedElement);a._tweetFeedControlsElement&&a._baseElement.append(a._tweetFeedControlsElement);a._connectButtonElement&&a._baseElement.append(a._connectButtonElement);a._loginInfoElement&&a._baseElement.append(a._loginInfoElement);a._followButtonElement&& a._baseElement.append(a._followButtonElement);a._tweetBoxElement&&a._baseElement.append(a._tweetBoxElement)};defaultTweetFeedControlsDecorator=function(a){var b="";if(a._tweetFeedConfig.paging.mode=="prev-next"){if(a.tweetFeedControlsPrevBtnDecorator)b+=a.tweetFeedControlsPrevBtnDecorator(a);if(a.tweetFeedControlsNextBtnDecorator)b+=a.tweetFeedControlsNextBtnDecorator(a)}else if(a._tweetFeedConfig.paging.mode!="endless-scroll")if(a.tweetFeedControlsMoreBtnDecorator)b+=a.tweetFeedControlsMoreBtnDecorator(a); return'<div class="jta-tweet-list-controls">'+b+"</div>"};defaultTweetFeedControlsMoreBtnDecorator=function(){return'<span class="jta-tweet-list-controls-button jta-tweet-list-controls-button-more">More</span>'};defaultTweetFeedControlsPrevBtnDecorator=function(){return'<span class="jta-tweet-list-controls-button jta-tweet-list-controls-button-prev">Prev</span>'};defaultTweetFeedControlsNextBtnDecorator=function(){return'<span class="jta-tweet-list-controls-button jta-tweet-list-controls-button-next">Next</span>'}; defaultTweetFeedAutorefreshTriggerDecorator=function(a,b){var c="";if(b.tweetFeedAutorefreshTriggerContentDecorator)c=b.tweetFeedAutorefreshTriggerContentDecorator(a,b);return'<li class="jta-tweet-list-autorefresh-trigger">'+c+"</li>"};defaultTweetFeedAutorefreshTriggerContentDecorator=function(a){return'<span class="jta-tweet-list-autorefresh-trigger-content">'+(""+a+" new "+(a>1?" tweets":" tweet"))+"</span>"};defaultTweetFeedDecorator=function(){return'<ul class="jta-tweet-list"></ul>'};defaultTweetDecorator= function(a,b){var c="";if(b._tweetFeedConfig.showProfileImages)c+=b.tweetProfileImageDecorator(a,b);if(b.tweetBodyDecorator)c+=b.tweetBodyDecorator(a,b);c+='<div class="jta-clear">&nbsp;</div>';return'<li class="jta-tweet-list-item">'+c+"</li>"};defaultTweetProfileImageDecorator=function(a){a=a.retweeted_status||a;var b=a.user?a.user.screen_name:a.from_user;return'<div class="jta-tweet-profile-image">'+('<a class="jta-tweet-profile-image-link" href="http://twitter.com/'+b+'" target="_blank"><img src="'+ (a.user?a.user.profile_image_url:a.profile_image_url)+'" alt="'+b+'"'+(isAnywherePresent()?"":' title="'+b+'"')+"/></a>")+"</div>"};defaultTweetBodyDecorator=function(a,b){var c="";if(b.tweetTextDecorator)c+=b.tweetTextDecorator(a,b);if(b.tweetAttributesDecorator)c+=b.tweetAttributesDecorator(a,b);return'<div class="jta-tweet-body '+(b._tweetFeedConfig.showProfileImages?"jta-tweet-body-list-profile-image-present":"")+'">'+c+"</div>"};defaultTweetTextDecorator=function(a,b){var c=a.text;if(a.retweeted_status&& (b._tweetFeedConfig.showUserScreenNames||b._tweetFeedConfig.showUserScreenNames==null||b._tweetFeedConfig.showUserFullNames||b._tweetFeedConfig.showUserFullNames==null))c=a.retweeted_status.text;if(b.linkDecorator)c=b.linkDecorator(c,b);if(b.usernameDecorator)c=b.usernameDecorator(c,b);if(b.hashtagDecorator)c=b.hashtagDecorator(c,b);if(b._tweetFeedConfig.showUserScreenNames||b._tweetFeedConfig.showUserFullNames||a.retweeted_status&&(b._tweetFeedConfig.showUserScreenNames==null||b._tweetFeedConfig.showUserFullNames== null))c=b.tweetUsernameDecorator(a,b)+" "+c;return'<span class="jta-tweet-text">'+c+"</span>"};defaultTweetUsernameDecorator=function(a,b){var c=a.retweeted_status||a,d=c.user?c.user.screen_name:c.from_user;c=c.user?c.user.name:null;var f;if(d&&(b._tweetFeedConfig.showUserScreenNames||b._tweetFeedConfig.showUserScreenNames==null&&a.retweeted_status))f='<span class="jta-tweet-user-screen-name"><a class="jta-tweet-user-screen-name-link" href="http://twitter.com/'+d+'" target="_blank">'+d+"</a></span>"; var g;if(c&&(b._tweetFeedConfig.showUserFullNames||b._tweetFeedConfig.showUserFullNames==null&&a.retweeted_status))g='<span class="jta-tweet-user-full-name">'+(f?" (":"")+'<a class="jta-tweet-user-full-name-link" href="http://twitter.com/'+d+'" name="'+d+'" target="_blank">'+c+"</a>"+(f?")":"")+"</span>";d="";if(f)d+=f;if(g){if(f)d+=" ";d+=g}if(f||g)d='<span class="jta-tweet-user-name">'+(a.retweeted_status?"RT ":"")+d+"</span>";return d};defaultTweetAttributesDecorator=function(a,b){var c="";if(b.tweetTimestampDecorator|| b.tweetSourceDecorator||b.tweetGeoLocationDecorator||b.tweetInReplyToDecorator||a.retweeted_status&&b.tweetRetweeterDecorator){c+='<span class="jta-tweet-attributes">';if(b.tweetTimestampDecorator)c+=b.tweetTimestampDecorator(a,b);if(b.tweetSourceDecorator)c+=b.tweetSourceDecorator(a,b);if(b.tweetGeoLocationDecorator)c+=b.tweetGeoLocationDecorator(a,b);if(b.tweetInReplyToDecorator)c+=b.tweetInReplyToDecorator(a,b);if(a.retweeted_status&&b.tweetRetweeterDecorator)c+=b.tweetRetweeterDecorator(a,b); c+="</span>"}return c};defaultTweetTimestampDecorator=function(a,b){var c=a.retweeted_status||a,d=formatDate(c.created_at),f=b.tweetTimestampFormatter(d),g=b.tweetTimestampTooltipFormatter(d);return'<span class="jta-tweet-timestamp"><a class="jta-tweet-timestamp-link" data-timestamp="'+d+'" href="http://twitter.com/'+(c.user?c.user.screen_name:c.from_user)+"/status/"+c.id+'" target="_blank" title="'+g+'">'+f+"</a></span>"};defaultTweetTimestampTooltipFormatter=function(a){return(new Date(a)).toLocaleString()}; defaultTweetTimestampFormatter=function(a){var b=new Date,c=parseInt((b.getTime()-Date.parse(a))/1E3),d="";if(c<60)d+=c+" second"+(c==1?"":"s")+" ago";else if(c<3600){b=parseInt((c+30)/60);d+=b+" minute"+(b==1?"":"s")+" ago"}else if(c<86400){b=parseInt((c+1800)/3600);d+=b+" hour"+(b==1?"":"s")+" ago"}else{a=new Date(a);a.getHours();a.getMinutes();d+=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][a.getMonth()]+" "+a.getDate();if(a.getFullYear()<b.getFullYear())d+=", "+a.getFullYear(); b=parseInt((c+43200)/86400);d+=" ("+b+" day"+(b==1?"":"s")+" ago)"}return d};exTimestampFormatter=function(a){var b=parseInt(((new Date).getTime()-Date.parse(a))/1E3),c="";if(b<60)c+="less than a minute ago";else if(b<3600){b=parseInt((b+30)/60);c+=b+" minute"+(b==1?"":"s")+" ago"}else if(b<86400){b=parseInt((b+1800)/3600);c+="about "+b+" hour"+(b==1?"":"s")+" ago"}else{b=parseInt((b+43200)/86400);c+="about "+b+" day"+(b==1?"":"s")+" ago";a=new Date(a);b="AM";var d=a.getHours();if(d>12){d-=12;b="PM"}var f= a.getMinutes();c+=" ("+d+":"+((f<10?"0":"")+f)+" "+b+" "+(a.getMonth()+1)+"/"+a.getDate()+"/"+a.getFullYear()+")"}return c};defaultTweetSourceDecorator=function(a){return'<span class="jta-tweet-source"> via <span class="jta-tweet-source-link">'+(a.retweeted_status||a).source.replace(/\&lt\;/gi,"<").replace(/\&gt\;/gi,">").replace(/\&quot\;/gi,'"')+"</span></span>"};defaultTweetGeoLocationDecorator=function(a){var b="";a=a.retweeted_status||a;var c;if(a.geo&&a.geo.coordinates)c=a.geo.coordinates.join(); else if(a.place&&a.place.full_name)c=a.place.full_name;if(c){b="here";if(a.place&&a.place.full_name)b=a.place.full_name;b='<span class="jta-tweet-location"> from <a class="jta-tweet-location-link" href="'+("http://maps.google.com/maps?q="+c)+'" target="_blank">'+b+"</a></span>"}return b};defaultTweetInReplyToDecorator=function(a){a=a.retweeted_status||a;var b="";if(a.in_reply_to_status_id&&a.in_reply_to_screen_name)b='<span class="jta-tweet-inreplyto"> <a class="jta-tweet-inreplyto-link" href="http://twitter.com/'+ a.in_reply_to_screen_name+"/status/"+a.in_reply_to_status_id+'" target="_blank">in reply to '+a.in_reply_to_screen_name+"</a></span>";return b};defaultTweetRetweeterDecorator=function(a){var b="";if(a.retweeted_status){b=a.user?a.user.screen_name:a.from_user;a=(a.retweeted_status.retweet_count||0)-1;var c=" and "+a+(a>1?" others":" other");b='<br/><span class="jta-tweet-retweeter">Retweeted by '+('<a class="jta-tweet-retweeter-link" href="http://twitter.com/'+b+'" target="_blank">'+b+"</a>")+(a>0? c:"")+"</span>"}return b};defaultConnectButtonDecorator=function(){return'<div class="jta-connect-button"></div>'};defaultLoginInfoDecorator=function(){return'<div class="jta-login-info"></div>'};defaultLoginInfoContentDecorator=function(a,b){var c="";if(b.isConnected()){c=b.currentUser.data("screen_name");var d=b.currentUser.data("profile_image_url");c='<div class="jta-login-info-profile-image"><a href="http://twitter.com/'+c+'" target="_blank"><img src="'+d+'" alt="'+c+'" title="'+c+'"/></a></div><div class="jta-login-info-block"><div class="jta-login-info-screen-name"><a href="http://twitter.com/'+ c+'" target="_blank">'+c+'</a></div><div class="jta-login-info-sign-out">Sign out</div></div><div class="jta-clear">&nbsp;</div>'}return c};defaultFollowButtonDecorator=function(){return'<div class="jta-follow-button"></div>'};defaultTweetBoxDecorator=function(){return'<div class="jta-tweet-box"></div>'};defaultLinkDecorator=function(a){return a.replace(/((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi,'<a href="$1" class="jta-tweet-a jta-tweet-link" target="_blank" rel="nofollow">$1</a>')}; defaultUsernameDecorator=function(a){return isAnywherePresent()?a:a.replace(/@([a-zA-Z0-9_]+)/gi,'@<a href="http://twitter.com/$1" class="jta-tweet-a twitter-anywhere-user" target="_blank" rel="nofollow">$1</a>')};defaultHashtagDecorator=function(a){return a.replace(/#([a-zA-Z0-9_]+)/gi,'<a href="http://search.twitter.com/search?q=%23$1" class="jta-tweet-a jta-tweet-hashtag" title="#$1" target="_blank" rel="nofollow">#$1</a>')};defaultLoadingDecorator=function(){return'<li class="jta-loading">loading ...</li>'}; defaultErrorDecorator=function(a){return'<li class="jta-error">ERROR: '+a+"</li>"};defaultNoDataDecorator=function(){return'<li class="jta-nodata">No more data</li>'};defaultTweetFilter=function(){return true};defaultTweetVisualizer=function(a,b,c){a[c](b)};defaultLoadingIndicatorVisualizer=function(a,b,c,d){defaultVisualizer(a,b,"append","fadeIn",600,"fadeOut",200,d)};defaultAutorefreshTriggerVisualizer=function(a,b,c,d){defaultVisualizer(a,b,"prepend","slideDown",600,"fadeOut",200,d)};defaultVisualizer= function(a,b,c,d,f,g,k,h){var j=function(){h&&h()};if(a){b.hide();a[c](b);b[d](f,j)}else b[g](k,function(){b.remove();j()})};defaultOnDataRequestHandler=function(){return true};defaultOnRateLimitDataHandler=function(){};updateLoginInfoElement=function(a,b){if(a._loginInfoElement&&a.loginInfoContentDecorator){a._loginInfoElement.children().remove();a._loginInfoElement.append(a.loginInfoContentDecorator(a,b));e(a._baseSelector+" .jta-login-info-sign-out").bind("click",function(){twttr.anywhere.signOut()})}}; getFeedUrl=function(a,b){var c="https:"==document.location.protocol?"https:":"http:";if(a.searchParams)c+="//search.twitter.com/search.json?"+(a.searchParams instanceof Array?a.searchParams.join("&"):a.searchParams)+"&rpp=100";else if(a.list)c+="//api.twitter.com/1/"+a.username+"/lists/"+a.list+"/statuses.json?per_page=20";else{c+="//api.twitter.com/1/statuses/user_timeline.json?screen_name="+a.username+"&count=20";if(a._tweetFeedConfig.includeRetweets)c+="&include_rts=true"}if(b)c+=(a._tweetFeedConfig._maxId? "&max_id="+a._tweetFeedConfig._maxId:"")+"&page="+a._tweetFeedConfig._pageParam;c+="&callback=?";return c};isAnywherePresent=function(){return typeof twttr!="undefined"};clearTweetFeed=function(a){a._tweetFeedElement&&a._tweetFeedElement.empty()};populateTweetFeed=function(a){a.tweetDecorator&&a._tweetFeedElement&&getPagedTweets(a,function(b,c){c._tweetFeedConfig._clearBeforePopulate&&clearTweetFeed(c);hideLoadingIndicator(c,function(){e.each(b,function(d,f){c.tweetVisualizer(c._tweetFeedElement, e(c.tweetDecorator(f,c)),"append",c)});if(c._tweetFeedConfig._noData&&c.noDataDecorator&&!c._tweetFeedConfig._noDataElement){c._tweetFeedConfig._noDataElement=e(c.noDataDecorator(c));c._tweetFeedElement.append(c._tweetFeedConfig._noDataElement)}c._tweetFeedConfig._clearBeforePopulate&&c._tweetFeedElement.scrollTop(0);addHovercards(c)})})};populateTweetFeed2=function(a){if(a._tweetFeedElement&&a._autorefreshTweetsCache.length>0)if(a._tweetFeedConfig.autorefresh.mode=="trigger-insert")if(a._tweetFeedConfig.autorefresh._triggerElement)a.tweetFeedAutorefreshTriggerContentDecorator&& a._tweetFeedConfig.autorefresh._triggerElement.html(a.tweetFeedAutorefreshTriggerContentDecorator(a._autorefreshTweetsCache.length,a));else{if(a.tweetFeedAutorefreshTriggerDecorator){a._tweetFeedConfig.autorefresh._triggerElement=e(a.tweetFeedAutorefreshTriggerDecorator(a._autorefreshTweetsCache.length,a));a._tweetFeedConfig.autorefresh._triggerElement.bind("click",function(){a.autorefreshTriggerVisualizer(null,a._tweetFeedConfig.autorefresh._triggerElement,a,function(){insertTriggerTweets(a)});a._tweetFeedConfig.autorefresh._triggerElement= null});a.autorefreshTriggerVisualizer(a._tweetFeedElement,a._tweetFeedConfig.autorefresh._triggerElement,a)}}else insertTriggerTweets(a)};insertTriggerTweets=function(a){if(a.tweetDecorator&&a._autorefreshTweetsCache.length>0){for(;a._autorefreshTweetsCache.length>0;){var b=a._autorefreshTweetsCache.pop();a._tweetsCache.unshift(b);a._tweetFeedConfig.paging._offset++;a.tweetVisualizer(a._tweetFeedElement,e(a.tweetDecorator(b,a)),"prepend",a)}addHovercards(a)}};addHovercards=function(a){isAnywherePresent()&& twttr.anywhere(function(b){b(a._baseSelector+" .jta-tweet-list").hovercards({expanded:a._tweetFeedConfig.expandHovercards});b(a._baseSelector+" .jta-tweet-profile-image img").hovercards({expanded:a._tweetFeedConfig.expandHovercards,username:function(c){return c.alt}});b(a._baseSelector+" .jta-tweet-retweeter-link").hovercards({expanded:a._tweetFeedConfig.expandHovercards,username:function(c){return c.text}});b(a._baseSelector+" .jta-tweet-user-screen-name-link").hovercards({expanded:a._tweetFeedConfig.expandHovercards, username:function(c){return c.text}});b(a._baseSelector+" .jta-tweet-user-full-name-link").hovercards({expanded:a._tweetFeedConfig.expandHovercards,username:function(c){return c.name}})})};populateAnywhereControls=function(a){isAnywherePresent()&&twttr.anywhere(function(b){a.tweetBoxDecorator&&b(a._baseSelector+" .jta-tweet-box").tweetBox(a._tweetBoxConfig);a.followButtonDecorator&&b(a._baseSelector+" .jta-follow-button").followButton(a.username);if(a.connectButtonDecorator){var c=e.extend({authComplete:function(){updateLoginInfoElement(a, b)},signOut:function(){updateLoginInfoElement(a,b)}},a._connectButtonConfig);b(a._baseSelector+" .jta-connect-button").connectButton(c);updateLoginInfoElement(a,b)}})};bindEventHandlers=function(a){if(a.tweetFeedControlsDecorator)if(a._tweetFeedConfig.paging.mode=="prev-next"){e(a._baseSelector+" .jta-tweet-list-controls-button-prev").bind("click",function(){!isLoading(a)&&a._tweetFeedConfig.paging._offset>0&&prevPage(a,true)});e(a._baseSelector+" .jta-tweet-list-controls-button-next").bind("click", function(){isLoading(a)||nextPage(a,true)})}else a._tweetFeedConfig.paging.mode=="endless-scroll"?a._tweetFeedElement.bind("scroll",function(){!isLoading(a)&&e(this)[0].scrollHeight-e(this).scrollTop()==e(this).outerHeight()&&nextPage(a,false)}):e(a._baseSelector+" .jta-tweet-list-controls-button-more").bind("click",function(){isLoading(a)||nextPage(a,false)})};nextPage=function(a,b){doPage(a,b,Math.min(a._tweetFeedConfig.paging._offset+a._tweetFeedConfig.paging._limit,a._tweetsCache.length))};prevPage= function(a,b){doPage(a,b,Math.max(0,a._tweetFeedConfig.paging._offset-a._tweetFeedConfig.paging._limit))};doPage=function(a,b,c){a._tweetFeedConfig.paging._offset=c;a._tweetFeedConfig._clearBeforePopulate=b;populateTweetFeed(a)};startAutorefresh=function(a){if(a._tweetFeedConfig.autorefresh.mode!="none"&&a._tweetFeedConfig.paging.mode!="prev-next"&&a._tweetFeedConfig.autorefresh.duration!=0&&(a._tweetFeedConfig.autorefresh.duration<0||(new Date).getTime()-a._tweetFeedConfig.autorefresh._startTime<= a._tweetFeedConfig.autorefresh.duration*1E3))window.setTimeout(function(){processAutorefresh(a)},a._tweetFeedConfig.autorefresh.interval*1E3)};stopAutorefresh=function(a){a._tweetFeedConfig.autorefresh.duration=0};processAutorefresh=function(a){if(a._tweetFeedConfig.autorefresh.duration!=0){getRateLimitedData(a,true,getFeedUrl(a,false),function(b,c){var d=(b.results||b).slice(0);d.reverse();e.each(d,function(f,g){isTweetInCache(g,c)||c.tweetFilter(g,c)&&c._autorefreshTweetsCache.unshift(g)});populateTweetFeed2(c)}); startAutorefresh(a)}};startTimestampRefresh=function(a){a.tweetTimestampDecorator&&typeof a._tweetFeedConfig.showTimestamp=="object"&&a._tweetFeedConfig.showTimestamp.refreshInterval>0&&window.setTimeout(function(){processTimestampRefresh(a)},a._tweetFeedConfig.showTimestamp.refreshInterval*1E3)};processTimestampRefresh=function(a){e.each(a._tweetFeedElement.find(".jta-tweet-timestamp-link"),function(b,c){var d=e(c).attr("data-timestamp");e(c).html(a.tweetTimestampFormatter(d))});startTimestampRefresh(a)}; isTweetInCache=function(a,b){for(var c=b._tweetsCache.length,d=0;d<c;d++)if(a.id==b._tweetsCache[d].id)return true;return false};showLoadingIndicator=function(a){if(a._tweetFeedElement&&a.loadingDecorator&&!a._loadingIndicatorElement){a._loadingIndicatorElement=e(a.loadingDecorator(a));a.loadingIndicatorVisualizer(a._tweetFeedElement,a._loadingIndicatorElement,a,null);a._tweetFeedElement.scrollTop(1E6)}};hideLoadingIndicator=function(a,b){if(a._loadingIndicatorElement){a.loadingIndicatorVisualizer(null, a._loadingIndicatorElement,a,b);a._loadingIndicatorElement=null}else b&&b()};isLoading=function(a){return a._loadingIndicatorElement!=null};formatDate=function(a){return a.replace(/^([a-z]{3})( [a-z]{3} \d\d?)(.*)( \d{4})$/i,"$1,$2$4$3")};validateRange=function(a,b,c){if(a<b)a=b;if(a>c)a=c;return a};showError=function(a,b){a.errorDecorator&&a._tweetFeedElement&&a._tweetFeedElement.append(a.errorDecorator(b,a))};getPagedTweets=function(a,b){a._tweetFeedConfig._recLevel=0;getRecPagedTweets(a,a._tweetFeedConfig.paging._offset, a._tweetFeedConfig.paging._limit,b)};getRecPagedTweets=function(a,b,c,d){++a._tweetFeedConfig._recLevel;if(b+c<=a._tweetsCache.length||a._tweetFeedConfig._recLevel>3||a._tweetFeedConfig._noData){if(b+c>a._tweetsCache.length)c=Math.max(0,a._tweetsCache.length-b);for(var f=[],g=0;g<c;g++)f[g]=a._tweetsCache[b+g];d(f,a)}else{++a._tweetFeedConfig._pageParam;getRateLimitedData(a,false,getFeedUrl(a,true),function(k,h){var j=k.results||k;if(j.length==0)h._tweetFeedConfig._noData=true;else e.each(j,function(l, i){if(i.id_str)i.id=i.id_str;if(i.in_reply_to_status_id_str)i.in_reply_to_status_id=i.in_reply_to_status_id_str;if(!h._tweetFeedConfig._maxId)h._tweetFeedConfig._maxId=i.id;h.tweetFilter(i,h)&&h._tweetsCache.push(i)});getRecPagedTweets(h,b,c,d)})}};getRateLimitedData=function(a,b,c,d){getRateLimit(a,function(f){if(f&&f.remaining_hits<=0){a._stats.rateLimitPreventionCount++;hideLoadingIndicator(a,null)}else getData(a,b,c,d)})};getData=function(a,b,c,d){a._stats.dataRequestCount++;if(a.onDataRequestHandler(a._stats, a)){b||showLoadingIndicator(a);e.getJSON(c,function(f){f.error?showError(a,f.error):d(f,a)})}else hideLoadingIndicator(a,null)};getRateLimit=function(a,b){e.getJSON("http://api.twitter.com/1/account/rate_limit_status.json?callback=?",function(c){a._stats.rateLimit=c;a.onRateLimitDataHandler(a._stats,a);b(c)})}})(jQuery);


/* ------------------------------------------------------------ */

//  Original FAF Currency Formatting function
function formatCurrency(strValue,doCents){
    strValue = strValue.toString().replace(/\$|\,/g,'');
    dblValue = parseFloat(strValue);

    blnSign = (dblValue == (dblValue = Math.abs(dblValue)));
    dblValue = Math.floor(dblValue*100+0.50000000001);
    intCents = dblValue%100;
    strCents = intCents.toString();
    dblValue = Math.floor(dblValue/100).toString();
    if(intCents<10)
        strCents = "0" + strCents;
    for (var i = 0; i < Math.floor((dblValue.length-(1+i))/3); i++)
        dblValue = dblValue.substring(0,dblValue.length-(4*i+3))+','+
        dblValue.substring(dblValue.length-(4*i+3));
    if(doCents)
        return (((blnSign)?'':'-') + dblValue + '.' + strCents);
    else
        return (((blnSign)?'':'-') + dblValue);
};

function jsDV_isValidMoney(str){
	// str must not be empty string
	var pointPos;
	var pointCount = 0;
	var zeroFlag = 1;
	
	if (str.length < 1) return "0"; //empty input

	//start with '.'
	if (str.charAt(0) == '.'){
		if (str.length == 1) return "-1";
		else str = "0" + str;
	}

	if (str.charAt(str.length - 1) == '.') return "-1"; //end with '.'

	//check the character set
	for (i = 0; i < str.length; i++){
		if ((str.charAt(i) >= '0' && str.charAt(i) <= '9') || (str.charAt(i) == '.')){
			if (str.charAt(i) != '0' && str.charAt(i) != '.') zeroFlag = 0;
			if (str.charAt(i) == '.') pointCount++;
			if (pointCount > 1) return "-1";
			continue;
		}
		else return "-1";
	}

	pointPos = str.indexOf(".", 0);
	if (pointPos >= 0){
		//e.g. 09.89
		if (pointPos > 1 && str.charAt(0) == '0') return "-1";
		//cut the long decimal part
		if (str.length - pointPos -1 > 2) str = str.substring(0, pointPos + 3);
	}
	else {
		if (str.length > 1){
			//e.g. 0898
			if (str.charAt(0) == '0') return "-1";
		}
	}
	//multiple valid '0', just return single '0'
	return (zeroFlag) ? "0" : str;
}

//check a string for a specific character. getVal - string, findChar - char to find, charLimit - number of times char can exist
function checkMatching(getVal,findChar,charLimit){
    var i=0,t=0;
    for(i=0;i<=getVal.length;i++){
        if(getVal.indexOf(findChar,i) == i) t++;
    }
    return (t>charLimit)? false : true;
}

function checkMatchingChars(getVal,findChar,charLimit){
	var i=0, t=0;
	for(i=0 ; i <= getVal.length;i++){
		if(getVal.indexOf(findChar,i) == i) t++;
	}
	return (t > charLimit) ? false : true;
}

function isNumber(pVal) {
	if(jsDV_isValidMoney(formPointer.elements['addAmount'].value) == "-1"){
		return false;
	}else{
		return true;
	}
}

function parseChars(strField, removeChar) {
	var strVal = strField;
	if(strVal != ""){
		while(strVal.indexOf(removeChar) != -1){
			strVal = strVal.replace(removeChar, "");
		}
		return strVal;
	}
}

function parseDonationAmount(strField) {
	if(formPointer.elements['addAmount'].value != ""){
		formPointer.elements['addAmount'].value = parseChars(strField, ",");
		return parseChars(strField, ",");
	}
}

function customselectLevel2(amount) {
	if(amount != ""){
		amount = parseDonationAmount(amount);
		if(!isNumber(amount)) {
			alert("The donation amount can not contain any punctuation.\nPlease re-enter your donation amount.");
			formPointer.addAmount.value = "";
			formPointer.addAmount.focus();
			return false;
		}
		var ls = parseFloat(amount);
		if(ls < FAF.minDonation) {
			alert("For credit card donations a minimum donation of $"+FAF.minDonation+" is required ");
			formPointer.addAmount.value = "";
			formPointer.addAmount.focus();
			return false;
		}
		/*if(ls >= 100){formPointer.level[0].checked=true;}
 		else if(ls >= 50){formPointer.level[1].checked=true;}
 		else if(ls >= 25){formPointer.level[2].checked=true;}*/
	}
	return true;
}

function selectAmount(defaultAmount) {
	formPointer.addAmount.value = defaultAmount;
	formPointer.addAmount.focus();
}

function customCheckRequiredFields() {
	var fieldname = formPointer;
	if(jsTools_strTrim(fieldname.elements['addAmount'].value) == ""){
//	if(jsTools_strTrim($('form.registrationForm').find('input[name=addAmount]').val()) == ""){
		return true;
	}else{
		return false;
	}
}

function customFormCheck() {
	var errorString = "";
	if (customCheckRequiredFields()){
		errorString = "\nPlease select a giving level or enter a donation amount.";
	}else{
		for(i = 0; i <= formPointer.elements['addAmount'].value.length -1; i++) 
			formPointer.elements['addAmount'].value = formPointer.elements['addAmount'].value.replace(",","");
		if((jsDV_isValidMoney(formPointer.elements['addAmount'].value) == "-1") || (checkMatching(formPointer.elements['addAmount'].value,".",1) == false)){
			errorString = errorString + "The donation amount can not contain any punctuation. \nPlease re-enter your donation amount."
		}else{
			if(formPointer.elements['addAmount'].value < FAF.minDonation){
				errorString = errorString + "\nPlease enter a donation amount greater than or equal to $"+FAF.minDonation+"."
			}
			else if(formPointer.elements['addAmount'].value == "0")
			{
			    errorString = errorString + "\nA $0 donation cannot be entered. \nPlease re-enter your donation amount."
			}
			
		}
	}
    if(document.getElementById("radioDonationOrgY")!=null)
    {
        if(document.getElementById("radioDonationOrgY").checked == false && document.getElementById("radioDonationOrgN").checked == false)
        {
            errorString = errorString + "\nPlease select Yes/No for donation organization.";
        }
	}
	if(errorString == ""){
		return customselectLevel2(formPointer.elements['addAmount'].value);
	}else{
		alert(errorString);
		return false;
	}
}


/**  Document.write override functions  **/
function newWrite(str) {
    //if (str.indexOf("Applet") == -1) { return "(" + str + ")"; }
    if (str.indexOf("Applet") == -1) { return "" + str + ""; }
    else { return ""; }
}
if (!($.browser.msie && $.browser.version.substr(0,1)<8)){	
  document.write = function(w) {
    return function(s) {
        w.call(this, newWrite(s));
    };
  }(document.write);
} else {
	document.write = function(w) {
    return function(s) {
        w.call(this, newWrite(s));
    };
  };
}



/*!
 * jQuery Cycle Plugin (with Transition Definitions)
 * Examples and documentation at: http://jquery.malsup.com/cycle/
 * Copyright (c) 2007-2010 M. Alsup
 * Version: 2.9999.5 (10-APR-2012)
 * Dual licensed under the MIT and GPL licenses.
 * http://jquery.malsup.com/license.html
 * Requires: jQuery v1.3.2 or later
 */
;(function($, undefined) {
"use strict";

var ver = '2.9999.5';

// if $.support is not defined (pre jQuery 1.3) add what I need
if ($.support === undefined) {
	$.support = {
		opacity: !($.browser.msie)
	};
}

function debug(s) {
	if ($.fn.cycle.debug)
		log(s);
}		
function log() {
	if (window.console && console.log)
		console.log('[cycle] ' + Array.prototype.join.call(arguments,' '));
}
$.expr[':'].paused = function(el) {
	return el.cyclePause;
};


// the options arg can be...
//   a number  - indicates an immediate transition should occur to the given slide index
//   a string  - 'pause', 'resume', 'toggle', 'next', 'prev', 'stop', 'destroy' or the name of a transition effect (ie, 'fade', 'zoom', etc)
//   an object - properties to control the slideshow
//
// the arg2 arg can be...
//   the name of an fx (only used in conjunction with a numeric value for 'options')
//   the value true (only used in first arg == 'resume') and indicates
//	 that the resume should occur immediately (not wait for next timeout)

$.fn.cycle = function(options, arg2) {
	var o = { s: this.selector, c: this.context };

	// in 1.3+ we can fix mistakes with the ready state
	if (this.length === 0 && options != 'stop') {
		if (!$.isReady && o.s) {
			log('DOM not ready, queuing slideshow');
			$(function() {
				$(o.s,o.c).cycle(options,arg2);
			});
			return this;
		}
		// is your DOM ready?  http://docs.jquery.com/Tutorials:Introducing_$(document).ready()
		log('terminating; zero elements found by selector' + ($.isReady ? '' : ' (DOM not ready)'));
		return this;
	}

	// iterate the matched nodeset
	return this.each(function() {
		var opts = handleArguments(this, options, arg2);
		if (opts === false)
			return;

		opts.updateActivePagerLink = opts.updateActivePagerLink || $.fn.cycle.updateActivePagerLink;
		
		// stop existing slideshow for this container (if there is one)
		if (this.cycleTimeout)
			clearTimeout(this.cycleTimeout);
		this.cycleTimeout = this.cyclePause = 0;
		this.cycleStop = 0; // issue #108

		var $cont = $(this);
		var $slides = opts.slideExpr ? $(opts.slideExpr, this) : $cont.children();
		var els = $slides.get();

		if (els.length < 2) {
			log('terminating; too few slides: ' + els.length);
			return;
		}

		var opts2 = buildOptions($cont, $slides, els, opts, o);
		if (opts2 === false)
			return;

		var startTime = opts2.continuous ? 10 : getTimeout(els[opts2.currSlide], els[opts2.nextSlide], opts2, !opts2.backwards);

		// if it's an auto slideshow, kick it off
		if (startTime) {
			startTime += (opts2.delay || 0);
			if (startTime < 10)
				startTime = 10;
			debug('first timeout: ' + startTime);
			this.cycleTimeout = setTimeout(function(){go(els,opts2,0,!opts.backwards);}, startTime);
		}
	});
};

function triggerPause(cont, byHover, onPager) {
	var opts = $(cont).data('cycle.opts');
	var paused = !!cont.cyclePause;
	if (paused && opts.paused)
		opts.paused(cont, opts, byHover, onPager);
	else if (!paused && opts.resumed)
		opts.resumed(cont, opts, byHover, onPager);
}

// process the args that were passed to the plugin fn
function handleArguments(cont, options, arg2) {
	if (cont.cycleStop === undefined)
		cont.cycleStop = 0;
	if (options === undefined || options === null)
		options = {};
	if (options.constructor == String) {
		switch(options) {
		case 'destroy':
		case 'stop':
			var opts = $(cont).data('cycle.opts');
			if (!opts)
				return false;
			cont.cycleStop++; // callbacks look for change
			if (cont.cycleTimeout)
				clearTimeout(cont.cycleTimeout);
			cont.cycleTimeout = 0;
			if (opts.elements)
				$(opts.elements).stop();
			$(cont).removeData('cycle.opts');
			if (options == 'destroy')
				destroy(cont, opts);
			return false;
		case 'toggle':
			cont.cyclePause = (cont.cyclePause === 1) ? 0 : 1;
			checkInstantResume(cont.cyclePause, arg2, cont);
			triggerPause(cont);
			return false;
		case 'pause':
			cont.cyclePause = 1;
			triggerPause(cont);
			return false;
		case 'resume':
			cont.cyclePause = 0;
			checkInstantResume(false, arg2, cont);
			triggerPause(cont);
			return false;
		case 'prev':
		case 'next':
			opts = $(cont).data('cycle.opts');
			if (!opts) {
				log('options not found, "prev/next" ignored');
				return false;
			}
			$.fn.cycle[options](opts);
			return false;
		default:
			options = { fx: options };
		}
		return options;
	}
	else if (options.constructor == Number) {
		// go to the requested slide
		var num = options;
		options = $(cont).data('cycle.opts');
		if (!options) {
			log('options not found, can not advance slide');
			return false;
		}
		if (num < 0 || num >= options.elements.length) {
			log('invalid slide index: ' + num);
			return false;
		}
		options.nextSlide = num;
		if (cont.cycleTimeout) {
			clearTimeout(cont.cycleTimeout);
			cont.cycleTimeout = 0;
		}
		if (typeof arg2 == 'string')
			options.oneTimeFx = arg2;
		go(options.elements, options, 1, num >= options.currSlide);
		return false;
	}
	return options;
	
	function checkInstantResume(isPaused, arg2, cont) {
		if (!isPaused && arg2 === true) { // resume now!
			var options = $(cont).data('cycle.opts');
			if (!options) {
				log('options not found, can not resume');
				return false;
			}
			if (cont.cycleTimeout) {
				clearTimeout(cont.cycleTimeout);
				cont.cycleTimeout = 0;
			}
			go(options.elements, options, 1, !options.backwards);
		}
	}
}

function removeFilter(el, opts) {
	if (!$.support.opacity && opts.cleartype && el.style.filter) {
		try { el.style.removeAttribute('filter'); }
		catch(smother) {} // handle old opera versions
	}
}

// unbind event handlers
function destroy(cont, opts) {
	if (opts.next)
		$(opts.next).unbind(opts.prevNextEvent);
	if (opts.prev)
		$(opts.prev).unbind(opts.prevNextEvent);
	
	if (opts.pager || opts.pagerAnchorBuilder)
		$.each(opts.pagerAnchors || [], function() {
			this.unbind().remove();
		});
	opts.pagerAnchors = null;
	$(cont).unbind('mouseenter.cycle mouseleave.cycle');
	if (opts.destroy) // callback
		opts.destroy(opts);
}

// one-time initialization
function buildOptions($cont, $slides, els, options, o) {
	var startingSlideSpecified;
	// support metadata plugin (v1.0 and v2.0)
	var opts = $.extend({}, $.fn.cycle.defaults, options || {}, $.metadata ? $cont.metadata() : $.meta ? $cont.data() : {});
	var meta = $.isFunction($cont.data) ? $cont.data(opts.metaAttr) : null;
	if (meta)
		opts = $.extend(opts, meta);
	if (opts.autostop)
		opts.countdown = opts.autostopCount || els.length;

	var cont = $cont[0];
	$cont.data('cycle.opts', opts);
	opts.$cont = $cont;
	opts.stopCount = cont.cycleStop;
	opts.elements = els;
	opts.before = opts.before ? [opts.before] : [];
	opts.after = opts.after ? [opts.after] : [];

	// push some after callbacks
	if (!$.support.opacity && opts.cleartype)
		opts.after.push(function() { removeFilter(this, opts); });
	if (opts.continuous)
		opts.after.push(function() { go(els,opts,0,!opts.backwards); });

	saveOriginalOpts(opts);

	// clearType corrections
	if (!$.support.opacity && opts.cleartype && !opts.cleartypeNoBg)
		clearTypeFix($slides);

	// container requires non-static position so that slides can be position within
	if ($cont.css('position') == 'static')
		$cont.css('position', 'relative');
	if (opts.width)
		$cont.width(opts.width);
	if (opts.height && opts.height != 'auto')
		$cont.height(opts.height);

	if (opts.startingSlide !== undefined) {
		opts.startingSlide = parseInt(opts.startingSlide,10);
		if (opts.startingSlide >= els.length || opts.startSlide < 0)
			opts.startingSlide = 0; // catch bogus input
		else 
			startingSlideSpecified = true;
	}
	else if (opts.backwards)
		opts.startingSlide = els.length - 1;
	else
		opts.startingSlide = 0;

	// if random, mix up the slide array
	if (opts.random) {
		opts.randomMap = [];
		for (var i = 0; i < els.length; i++)
			opts.randomMap.push(i);
		opts.randomMap.sort(function(a,b) {return Math.random() - 0.5;});
		if (startingSlideSpecified) {
			// try to find the specified starting slide and if found set start slide index in the map accordingly
			for ( var cnt = 0; cnt < els.length; cnt++ ) {
				if ( opts.startingSlide == opts.randomMap[cnt] ) {
					opts.randomIndex = cnt;
				}
			}
		}
		else {
			opts.randomIndex = 1;
			opts.startingSlide = opts.randomMap[1];
		}
	}
	else if (opts.startingSlide >= els.length)
		opts.startingSlide = 0; // catch bogus input
	opts.currSlide = opts.startingSlide || 0;
	var first = opts.startingSlide;

	// set position and zIndex on all the slides
	$slides.css({position: 'absolute', top:0, left:0}).hide().each(function(i) {
		var z;
		if (opts.backwards)
			z = first ? i <= first ? els.length + (i-first) : first-i : els.length-i;
		else
			z = first ? i >= first ? els.length - (i-first) : first-i : els.length-i;
		$(this).css('z-index', z);
	});

	// make sure first slide is visible
	$(els[first]).css('opacity',1).show(); // opacity bit needed to handle restart use case
	removeFilter(els[first], opts);

	// stretch slides
	if (opts.fit) {
		if (!opts.aspect) {
	        if (opts.width)
	            $slides.width(opts.width);
	        if (opts.height && opts.height != 'auto')
	            $slides.height(opts.height);
		} else {
			$slides.each(function(){
				var $slide = $(this);
				var ratio = (opts.aspect === true) ? $slide.width()/$slide.height() : opts.aspect;
				if( opts.width && $slide.width() != opts.width ) {
					$slide.width( opts.width );
					$slide.height( opts.width / ratio );
				}

				if( opts.height && $slide.height() < opts.height ) {
					$slide.height( opts.height );
					$slide.width( opts.height * ratio );
				}
			});
		}
	}

	if (opts.center && ((!opts.fit) || opts.aspect)) {
		$slides.each(function(){
			var $slide = $(this);
			$slide.css({
				"margin-left": opts.width ?
					((opts.width - $slide.width()) / 2) + "px" :
					0,
				"margin-top": opts.height ?
					((opts.height - $slide.height()) / 2) + "px" :
					0
			});
		});
	}

	if (opts.center && !opts.fit && !opts.slideResize) {
		$slides.each(function(){
			var $slide = $(this);
			$slide.css({
				"margin-left": opts.width ? ((opts.width - $slide.width()) / 2) + "px" : 0,
				"margin-top": opts.height ? ((opts.height - $slide.height()) / 2) + "px" : 0
			});
		});
	}
		
	// stretch container
	var reshape = opts.containerResize && !$cont.innerHeight();
	if (reshape) { // do this only if container has no size http://tinyurl.com/da2oa9
		var maxw = 0, maxh = 0;
		for(var j=0; j < els.length; j++) {
			var $e = $(els[j]), e = $e[0], w = $e.outerWidth(), h = $e.outerHeight();
			if (!w) w = e.offsetWidth || e.width || $e.attr('width');
			if (!h) h = e.offsetHeight || e.height || $e.attr('height');
			maxw = w > maxw ? w : maxw;
			maxh = h > maxh ? h : maxh;
		}
		if (maxw > 0 && maxh > 0)
			$cont.css({width:maxw+'px',height:maxh+'px'});
	}

	var pauseFlag = false;  // https://github.com/malsup/cycle/issues/44
	if (opts.pause)
		$cont.bind('mouseenter.cycle', function(){
			pauseFlag = true;
			this.cyclePause++;
			triggerPause(cont, true);
		}).bind('mouseleave.cycle', function(){
				if (pauseFlag)
					this.cyclePause--;
				triggerPause(cont, true);
		});

	if (supportMultiTransitions(opts) === false)
		return false;

	// apparently a lot of people use image slideshows without height/width attributes on the images.
	// Cycle 2.50+ requires the sizing info for every slide; this block tries to deal with that.
	var requeue = false;
	options.requeueAttempts = options.requeueAttempts || 0;
	$slides.each(function() {
		// try to get height/width of each slide
		var $el = $(this);
		this.cycleH = (opts.fit && opts.height) ? opts.height : ($el.height() || this.offsetHeight || this.height || $el.attr('height') || 0);
		this.cycleW = (opts.fit && opts.width) ? opts.width : ($el.width() || this.offsetWidth || this.width || $el.attr('width') || 0);

		if ( $el.is('img') ) {
			// sigh..  sniffing, hacking, shrugging...  this crappy hack tries to account for what browsers do when
			// an image is being downloaded and the markup did not include sizing info (height/width attributes);
			// there seems to be some "default" sizes used in this situation
			var loadingIE	= ($.browser.msie  && this.cycleW == 28 && this.cycleH == 30 && !this.complete);
			var loadingFF	= ($.browser.mozilla && this.cycleW == 34 && this.cycleH == 19 && !this.complete);
			var loadingOp	= ($.browser.opera && ((this.cycleW == 42 && this.cycleH == 19) || (this.cycleW == 37 && this.cycleH == 17)) && !this.complete);
			var loadingOther = (this.cycleH === 0 && this.cycleW === 0 && !this.complete);
			// don't requeue for images that are still loading but have a valid size
			if (loadingIE || loadingFF || loadingOp || loadingOther) {
				if (o.s && opts.requeueOnImageNotLoaded && ++options.requeueAttempts < 100) { // track retry count so we don't loop forever
					log(options.requeueAttempts,' - img slide not loaded, requeuing slideshow: ', this.src, this.cycleW, this.cycleH);
					setTimeout(function() {$(o.s,o.c).cycle(options);}, opts.requeueTimeout);
					requeue = true;
					return false; // break each loop
				}
				else {
					log('could not determine size of image: '+this.src, this.cycleW, this.cycleH);
				}
			}
		}
		return true;
	});

	if (requeue)
		return false;

	opts.cssBefore = opts.cssBefore || {};
	opts.cssAfter = opts.cssAfter || {};
	opts.cssFirst = opts.cssFirst || {};
	opts.animIn = opts.animIn || {};
	opts.animOut = opts.animOut || {};

	$slides.not(':eq('+first+')').css(opts.cssBefore);
	$($slides[first]).css(opts.cssFirst);

	if (opts.timeout) {
		opts.timeout = parseInt(opts.timeout,10);
		// ensure that timeout and speed settings are sane
		if (opts.speed.constructor == String)
			opts.speed = $.fx.speeds[opts.speed] || parseInt(opts.speed,10);
		if (!opts.sync)
			opts.speed = opts.speed / 2;
		
		var buffer = opts.fx == 'none' ? 0 : opts.fx == 'shuffle' ? 500 : 250;
		while((opts.timeout - opts.speed) < buffer) // sanitize timeout
			opts.timeout += opts.speed;
	}
	if (opts.easing)
		opts.easeIn = opts.easeOut = opts.easing;
	if (!opts.speedIn)
		opts.speedIn = opts.speed;
	if (!opts.speedOut)
		opts.speedOut = opts.speed;

	opts.slideCount = els.length;
	opts.currSlide = opts.lastSlide = first;
	if (opts.random) {
		if (++opts.randomIndex == els.length)
			opts.randomIndex = 0;
		opts.nextSlide = opts.randomMap[opts.randomIndex];
	}
	else if (opts.backwards)
		opts.nextSlide = opts.startingSlide === 0 ? (els.length-1) : opts.startingSlide-1;
	else
		opts.nextSlide = opts.startingSlide >= (els.length-1) ? 0 : opts.startingSlide+1;

	// run transition init fn
	if (!opts.multiFx) {
		var init = $.fn.cycle.transitions[opts.fx];
		if ($.isFunction(init))
			init($cont, $slides, opts);
		else if (opts.fx != 'custom' && !opts.multiFx) {
			log('unknown transition: ' + opts.fx,'; slideshow terminating');
			return false;
		}
	}

	// fire artificial events
	var e0 = $slides[first];
	if (!opts.skipInitializationCallbacks) {
		if (opts.before.length)
			opts.before[0].apply(e0, [e0, e0, opts, true]);
		if (opts.after.length)
			opts.after[0].apply(e0, [e0, e0, opts, true]);
	}
	if (opts.next)
		$(opts.next).bind(opts.prevNextEvent,function(){return advance(opts,1);});
	if (opts.prev)
		$(opts.prev).bind(opts.prevNextEvent,function(){return advance(opts,0);});
	if (opts.pager || opts.pagerAnchorBuilder)
		buildPager(els,opts);

	exposeAddSlide(opts, els);

	return opts;
}

// save off original opts so we can restore after clearing state
function saveOriginalOpts(opts) {
	opts.original = { before: [], after: [] };
	opts.original.cssBefore = $.extend({}, opts.cssBefore);
	opts.original.cssAfter  = $.extend({}, opts.cssAfter);
	opts.original.animIn	= $.extend({}, opts.animIn);
	opts.original.animOut   = $.extend({}, opts.animOut);
	$.each(opts.before, function() { opts.original.before.push(this); });
	$.each(opts.after,  function() { opts.original.after.push(this); });
}

function supportMultiTransitions(opts) {
	var i, tx, txs = $.fn.cycle.transitions;
	// look for multiple effects
	if (opts.fx.indexOf(',') > 0) {
		opts.multiFx = true;
		opts.fxs = opts.fx.replace(/\s*/g,'').split(',');
		// discard any bogus effect names
		for (i=0; i < opts.fxs.length; i++) {
			var fx = opts.fxs[i];
			tx = txs[fx];
			if (!tx || !txs.hasOwnProperty(fx) || !$.isFunction(tx)) {
				log('discarding unknown transition: ',fx);
				opts.fxs.splice(i,1);
				i--;
			}
		}
		// if we have an empty list then we threw everything away!
		if (!opts.fxs.length) {
			log('No valid transitions named; slideshow terminating.');
			return false;
		}
	}
	else if (opts.fx == 'all') {  // auto-gen the list of transitions
		opts.multiFx = true;
		opts.fxs = [];
		for (var p in txs) {
			if (txs.hasOwnProperty(p)) {
				tx = txs[p];
				if (txs.hasOwnProperty(p) && $.isFunction(tx))
					opts.fxs.push(p);
			}
		}
	}
	if (opts.multiFx && opts.randomizeEffects) {
		// munge the fxs array to make effect selection random
		var r1 = Math.floor(Math.random() * 20) + 30;
		for (i = 0; i < r1; i++) {
			var r2 = Math.floor(Math.random() * opts.fxs.length);
			opts.fxs.push(opts.fxs.splice(r2,1)[0]);
		}
		debug('randomized fx sequence: ',opts.fxs);
	}
	return true;
}

// provide a mechanism for adding slides after the slideshow has started
function exposeAddSlide(opts, els) {
	opts.addSlide = function(newSlide, prepend) {
		var $s = $(newSlide), s = $s[0];
		if (!opts.autostopCount)
			opts.countdown++;
		els[prepend?'unshift':'push'](s);
		if (opts.els)
			opts.els[prepend?'unshift':'push'](s); // shuffle needs this
		opts.slideCount = els.length;

		// add the slide to the random map and resort
		if (opts.random) {
			opts.randomMap.push(opts.slideCount-1);
			opts.randomMap.sort(function(a,b) {return Math.random() - 0.5;});
		}

		$s.css('position','absolute');
		$s[prepend?'prependTo':'appendTo'](opts.$cont);

		if (prepend) {
			opts.currSlide++;
			opts.nextSlide++;
		}

		if (!$.support.opacity && opts.cleartype && !opts.cleartypeNoBg)
			clearTypeFix($s);

		if (opts.fit && opts.width)
			$s.width(opts.width);
		if (opts.fit && opts.height && opts.height != 'auto')
			$s.height(opts.height);
		s.cycleH = (opts.fit && opts.height) ? opts.height : $s.height();
		s.cycleW = (opts.fit && opts.width) ? opts.width : $s.width();

		$s.css(opts.cssBefore);

		if (opts.pager || opts.pagerAnchorBuilder)
			$.fn.cycle.createPagerAnchor(els.length-1, s, $(opts.pager), els, opts);

		if ($.isFunction(opts.onAddSlide))
			opts.onAddSlide($s);
		else
			$s.hide(); // default behavior
	};
}

// reset internal state; we do this on every pass in order to support multiple effects
$.fn.cycle.resetState = function(opts, fx) {
	fx = fx || opts.fx;
	opts.before = []; opts.after = [];
	opts.cssBefore = $.extend({}, opts.original.cssBefore);
	opts.cssAfter  = $.extend({}, opts.original.cssAfter);
	opts.animIn	= $.extend({}, opts.original.animIn);
	opts.animOut   = $.extend({}, opts.original.animOut);
	opts.fxFn = null;
	$.each(opts.original.before, function() { opts.before.push(this); });
	$.each(opts.original.after,  function() { opts.after.push(this); });

	// re-init
	var init = $.fn.cycle.transitions[fx];
	if ($.isFunction(init))
		init(opts.$cont, $(opts.elements), opts);
};

// this is the main engine fn, it handles the timeouts, callbacks and slide index mgmt
function go(els, opts, manual, fwd) {
	var p = opts.$cont[0], curr = els[opts.currSlide], next = els[opts.nextSlide];

	// opts.busy is true if we're in the middle of an animation
	if (manual && opts.busy && opts.manualTrump) {
		// let manual transitions requests trump active ones
		debug('manualTrump in go(), stopping active transition');
		$(els).stop(true,true);
		opts.busy = 0;
		clearTimeout(p.cycleTimeout);
	}

	// don't begin another timeout-based transition if there is one active
	if (opts.busy) {
		debug('transition active, ignoring new tx request');
		return;
	}


	// stop cycling if we have an outstanding stop request
	if (p.cycleStop != opts.stopCount || p.cycleTimeout === 0 && !manual)
		return;

	// check to see if we should stop cycling based on autostop options
	if (!manual && !p.cyclePause && !opts.bounce &&
		((opts.autostop && (--opts.countdown <= 0)) ||
		(opts.nowrap && !opts.random && opts.nextSlide < opts.currSlide))) {
		if (opts.end)
			opts.end(opts);
		return;
	}

	// if slideshow is paused, only transition on a manual trigger
	var changed = false;
	if ((manual || !p.cyclePause) && (opts.nextSlide != opts.currSlide)) {
		changed = true;
		var fx = opts.fx;
		// keep trying to get the slide size if we don't have it yet
		curr.cycleH = curr.cycleH || $(curr).height();
		curr.cycleW = curr.cycleW || $(curr).width();
		next.cycleH = next.cycleH || $(next).height();
		next.cycleW = next.cycleW || $(next).width();

		// support multiple transition types
		if (opts.multiFx) {
			if (fwd && (opts.lastFx === undefined || ++opts.lastFx >= opts.fxs.length))
				opts.lastFx = 0;
			else if (!fwd && (opts.lastFx === undefined || --opts.lastFx < 0))
				opts.lastFx = opts.fxs.length - 1;
			fx = opts.fxs[opts.lastFx];
		}

		// one-time fx overrides apply to:  $('div').cycle(3,'zoom');
		if (opts.oneTimeFx) {
			fx = opts.oneTimeFx;
			opts.oneTimeFx = null;
		}

		$.fn.cycle.resetState(opts, fx);

		// run the before callbacks
		if (opts.before.length)
			$.each(opts.before, function(i,o) {
				if (p.cycleStop != opts.stopCount) return;
				o.apply(next, [curr, next, opts, fwd]);
			});

		// stage the after callacks
		var after = function() {
			opts.busy = 0;
			$.each(opts.after, function(i,o) {
				if (p.cycleStop != opts.stopCount) return;
				o.apply(next, [curr, next, opts, fwd]);
			});
			if (!p.cycleStop) {
				// queue next transition
				queueNext();
			}
		};

		debug('tx firing('+fx+'); currSlide: ' + opts.currSlide + '; nextSlide: ' + opts.nextSlide);
		
		// get ready to perform the transition
		opts.busy = 1;
		if (opts.fxFn) // fx function provided?
			opts.fxFn(curr, next, opts, after, fwd, manual && opts.fastOnEvent);
		else if ($.isFunction($.fn.cycle[opts.fx])) // fx plugin ?
			$.fn.cycle[opts.fx](curr, next, opts, after, fwd, manual && opts.fastOnEvent);
		else
			$.fn.cycle.custom(curr, next, opts, after, fwd, manual && opts.fastOnEvent);
	}
	else {
		queueNext();
	}

	if (changed || opts.nextSlide == opts.currSlide) {
		// calculate the next slide
		var roll;
		opts.lastSlide = opts.currSlide;
		if (opts.random) {
			opts.currSlide = opts.nextSlide;
			if (++opts.randomIndex == els.length) {
				opts.randomIndex = 0;
				opts.randomMap.sort(function(a,b) {return Math.random() - 0.5;});
			}
			opts.nextSlide = opts.randomMap[opts.randomIndex];
			if (opts.nextSlide == opts.currSlide)
				opts.nextSlide = (opts.currSlide == opts.slideCount - 1) ? 0 : opts.currSlide + 1;
		}
		else if (opts.backwards) {
			roll = (opts.nextSlide - 1) < 0;
			if (roll && opts.bounce) {
				opts.backwards = !opts.backwards;
				opts.nextSlide = 1;
				opts.currSlide = 0;
			}
			else {
				opts.nextSlide = roll ? (els.length-1) : opts.nextSlide-1;
				opts.currSlide = roll ? 0 : opts.nextSlide+1;
			}
		}
		else { // sequence
			roll = (opts.nextSlide + 1) == els.length;
			if (roll && opts.bounce) {
				opts.backwards = !opts.backwards;
				opts.nextSlide = els.length-2;
				opts.currSlide = els.length-1;
			}
			else {
				opts.nextSlide = roll ? 0 : opts.nextSlide+1;
				opts.currSlide = roll ? els.length-1 : opts.nextSlide-1;
			}
		}
	}
	if (changed && opts.pager)
		opts.updateActivePagerLink(opts.pager, opts.currSlide, opts.activePagerClass);
	
	function queueNext() {
		// stage the next transition
		var ms = 0, timeout = opts.timeout;
		if (opts.timeout && !opts.continuous) {
			ms = getTimeout(els[opts.currSlide], els[opts.nextSlide], opts, fwd);
         if (opts.fx == 'shuffle')
            ms -= opts.speedOut;
      }
		else if (opts.continuous && p.cyclePause) // continuous shows work off an after callback, not this timer logic
			ms = 10;
		if (ms > 0)
			p.cycleTimeout = setTimeout(function(){ go(els, opts, 0, !opts.backwards); }, ms);
	}
}

// invoked after transition
$.fn.cycle.updateActivePagerLink = function(pager, currSlide, clsName) {
   $(pager).each(function() {
       $(this).children().removeClass(clsName).eq(currSlide).addClass(clsName);
   });
};

// calculate timeout value for current transition
function getTimeout(curr, next, opts, fwd) {
	if (opts.timeoutFn) {
		// call user provided calc fn
		var t = opts.timeoutFn.call(curr,curr,next,opts,fwd);
		while (opts.fx != 'none' && (t - opts.speed) < 250) // sanitize timeout
			t += opts.speed;
		debug('calculated timeout: ' + t + '; speed: ' + opts.speed);
		if (t !== false)
			return t;
	}
	return opts.timeout;
}

// expose next/prev function, caller must pass in state
$.fn.cycle.next = function(opts) { advance(opts,1); };
$.fn.cycle.prev = function(opts) { advance(opts,0);};

// advance slide forward or back
function advance(opts, moveForward) {
	var val = moveForward ? 1 : -1;
	var els = opts.elements;
	var p = opts.$cont[0], timeout = p.cycleTimeout;
	if (timeout) {
		clearTimeout(timeout);
		p.cycleTimeout = 0;
	}
	if (opts.random && val < 0) {
		// move back to the previously display slide
		opts.randomIndex--;
		if (--opts.randomIndex == -2)
			opts.randomIndex = els.length-2;
		else if (opts.randomIndex == -1)
			opts.randomIndex = els.length-1;
		opts.nextSlide = opts.randomMap[opts.randomIndex];
	}
	else if (opts.random) {
		opts.nextSlide = opts.randomMap[opts.randomIndex];
	}
	else {
		opts.nextSlide = opts.currSlide + val;
		if (opts.nextSlide < 0) {
			if (opts.nowrap) return false;
			opts.nextSlide = els.length - 1;
		}
		else if (opts.nextSlide >= els.length) {
			if (opts.nowrap) return false;
			opts.nextSlide = 0;
		}
	}

	var cb = opts.onPrevNextEvent || opts.prevNextClick; // prevNextClick is deprecated
	if ($.isFunction(cb))
		cb(val > 0, opts.nextSlide, els[opts.nextSlide]);
	go(els, opts, 1, moveForward);
	return false;
}

function buildPager(els, opts) {
	var $p = $(opts.pager);
	$.each(els, function(i,o) {
		$.fn.cycle.createPagerAnchor(i,o,$p,els,opts);
	});
	opts.updateActivePagerLink(opts.pager, opts.startingSlide, opts.activePagerClass);
}

$.fn.cycle.createPagerAnchor = function(i, el, $p, els, opts) {
	var a;
	if ($.isFunction(opts.pagerAnchorBuilder)) {
		a = opts.pagerAnchorBuilder(i,el);
		debug('pagerAnchorBuilder('+i+', el) returned: ' + a);
	}
	else
		a = '<a href="#">'+(i+1)+'</a>';
		
	if (!a)
		return;
	var $a = $(a);
	// don't reparent if anchor is in the dom
	if ($a.parents('body').length === 0) {
		var arr = [];
		if ($p.length > 1) {
			$p.each(function() {
				var $clone = $a.clone(true);
				$(this).append($clone);
				arr.push($clone[0]);
			});
			$a = $(arr);
		}
		else {
			$a.appendTo($p);
		}
	}

	opts.pagerAnchors =  opts.pagerAnchors || [];
	opts.pagerAnchors.push($a);
	
	var pagerFn = function(e) {
		e.preventDefault();
		opts.nextSlide = i;
		var p = opts.$cont[0], timeout = p.cycleTimeout;
		if (timeout) {
			clearTimeout(timeout);
			p.cycleTimeout = 0;
		}
		var cb = opts.onPagerEvent || opts.pagerClick; // pagerClick is deprecated
		if ($.isFunction(cb))
			cb(opts.nextSlide, els[opts.nextSlide]);
		go(els,opts,1,opts.currSlide < i); // trigger the trans
//		return false; // <== allow bubble
	};
	
	if ( /mouseenter|mouseover/i.test(opts.pagerEvent) ) {
		$a.hover(pagerFn, function(){/* no-op */} );
	}
	else {
		$a.bind(opts.pagerEvent, pagerFn);
	}
	
	if ( ! /^click/.test(opts.pagerEvent) && !opts.allowPagerClickBubble)
		$a.bind('click.cycle', function(){return false;}); // suppress click
	
	var cont = opts.$cont[0];
	var pauseFlag = false; // https://github.com/malsup/cycle/issues/44
	if (opts.pauseOnPagerHover) {
		$a.hover(
			function() { 
				pauseFlag = true;
				cont.cyclePause++; 
				triggerPause(cont,true,true);
			}, function() { 
				if (pauseFlag)
					cont.cyclePause--; 
				triggerPause(cont,true,true);
			} 
		);
	}
};

// helper fn to calculate the number of slides between the current and the next
$.fn.cycle.hopsFromLast = function(opts, fwd) {
	var hops, l = opts.lastSlide, c = opts.currSlide;
	if (fwd)
		hops = c > l ? c - l : opts.slideCount - l;
	else
		hops = c < l ? l - c : l + opts.slideCount - c;
	return hops;
};

// fix clearType problems in ie6 by setting an explicit bg color
// (otherwise text slides look horrible during a fade transition)
function clearTypeFix($slides) {
	debug('applying clearType background-color hack');
	function hex(s) {
		s = parseInt(s,10).toString(16);
		return s.length < 2 ? '0'+s : s;
	}
	function getBg(e) {
		for ( ; e && e.nodeName.toLowerCase() != 'html'; e = e.parentNode) {
			var v = $.css(e,'background-color');
			if (v && v.indexOf('rgb') >= 0 ) {
				var rgb = v.match(/\d+/g);
				return '#'+ hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
			}
			if (v && v != 'transparent')
				return v;
		}
		return '#ffffff';
	}
	$slides.each(function() { $(this).css('background-color', getBg(this)); });
}

// reset common props before the next transition
$.fn.cycle.commonReset = function(curr,next,opts,w,h,rev) {
	$(opts.elements).not(curr).hide();
	if (typeof opts.cssBefore.opacity == 'undefined')
		opts.cssBefore.opacity = 1;
	opts.cssBefore.display = 'block';
	if (opts.slideResize && w !== false && next.cycleW > 0)
		opts.cssBefore.width = next.cycleW;
	if (opts.slideResize && h !== false && next.cycleH > 0)
		opts.cssBefore.height = next.cycleH;
	opts.cssAfter = opts.cssAfter || {};
	opts.cssAfter.display = 'none';
	$(curr).css('zIndex',opts.slideCount + (rev === true ? 1 : 0));
	$(next).css('zIndex',opts.slideCount + (rev === true ? 0 : 1));
};

// the actual fn for effecting a transition
$.fn.cycle.custom = function(curr, next, opts, cb, fwd, speedOverride) {
	var $l = $(curr), $n = $(next);
	var speedIn = opts.speedIn, speedOut = opts.speedOut, easeIn = opts.easeIn, easeOut = opts.easeOut;
	$n.css(opts.cssBefore);
	if (speedOverride) {
		if (typeof speedOverride == 'number')
			speedIn = speedOut = speedOverride;
		else
			speedIn = speedOut = 1;
		easeIn = easeOut = null;
	}
	var fn = function() {
		$n.animate(opts.animIn, speedIn, easeIn, function() {
			cb();
		});
	};
	$l.animate(opts.animOut, speedOut, easeOut, function() {
		$l.css(opts.cssAfter);
		if (!opts.sync) 
			fn();
	});
	if (opts.sync) fn();
};

// transition definitions - only fade is defined here, transition pack defines the rest
$.fn.cycle.transitions = {
	fade: function($cont, $slides, opts) {
		$slides.not(':eq('+opts.currSlide+')').css('opacity',0);
		opts.before.push(function(curr,next,opts) {
			$.fn.cycle.commonReset(curr,next,opts);
			opts.cssBefore.opacity = 0;
		});
		opts.animIn	   = { opacity: 1 };
		opts.animOut   = { opacity: 0 };
		opts.cssBefore = { top: 0, left: 0 };
	}
};

$.fn.cycle.ver = function() { return ver; };

// override these globally if you like (they are all optional)
$.fn.cycle.defaults = {
    activePagerClass: 'activeSlide', // class name used for the active pager link
    after:            null,     // transition callback (scope set to element that was shown):  function(currSlideElement, nextSlideElement, options, forwardFlag)
    allowPagerClickBubble: false, // allows or prevents click event on pager anchors from bubbling
    animIn:           null,     // properties that define how the slide animates in
    animOut:          null,     // properties that define how the slide animates out
    aspect:           false,    // preserve aspect ratio during fit resizing, cropping if necessary (must be used with fit option)
    autostop:         0,        // true to end slideshow after X transitions (where X == slide count)
    autostopCount:    0,        // number of transitions (optionally used with autostop to define X)
    backwards:        false,    // true to start slideshow at last slide and move backwards through the stack
    before:           null,     // transition callback (scope set to element to be shown):     function(currSlideElement, nextSlideElement, options, forwardFlag)
    center:           null,     // set to true to have cycle add top/left margin to each slide (use with width and height options)
    cleartype:        !$.support.opacity,  // true if clearType corrections should be applied (for IE)
    cleartypeNoBg:    false,    // set to true to disable extra cleartype fixing (leave false to force background color setting on slides)
    containerResize:  1,        // resize container to fit largest slide
    continuous:       0,        // true to start next transition immediately after current one completes
    cssAfter:         null,     // properties that defined the state of the slide after transitioning out
    cssBefore:        null,     // properties that define the initial state of the slide before transitioning in
    delay:            0,        // additional delay (in ms) for first transition (hint: can be negative)
    easeIn:           null,     // easing for "in" transition
    easeOut:          null,     // easing for "out" transition
    easing:           null,     // easing method for both in and out transitions
    end:              null,     // callback invoked when the slideshow terminates (use with autostop or nowrap options): function(options)
    fastOnEvent:      0,        // force fast transitions when triggered manually (via pager or prev/next); value == time in ms
    fit:              0,        // force slides to fit container
    fx:               'fade',   // name of transition effect (or comma separated names, ex: 'fade,scrollUp,shuffle')
    fxFn:             null,     // function used to control the transition: function(currSlideElement, nextSlideElement, options, afterCalback, forwardFlag)
    height:           'auto',   // container height (if the 'fit' option is true, the slides will be set to this height as well)
    manualTrump:      true,     // causes manual transition to stop an active transition instead of being ignored
    metaAttr:         'cycle',  // data- attribute that holds the option data for the slideshow
    next:             null,     // element, jQuery object, or jQuery selector string for the element to use as event trigger for next slide
    nowrap:           0,        // true to prevent slideshow from wrapping
    onPagerEvent:     null,     // callback fn for pager events: function(zeroBasedSlideIndex, slideElement)
    onPrevNextEvent:  null,     // callback fn for prev/next events: function(isNext, zeroBasedSlideIndex, slideElement)
    pager:            null,     // element, jQuery object, or jQuery selector string for the element to use as pager container
    pagerAnchorBuilder: null,   // callback fn for building anchor links:  function(index, DOMelement)
    pagerEvent:       'click.cycle', // name of event which drives the pager navigation
    pause:            0,        // true to enable "pause on hover"
    pauseOnPagerHover: 0,       // true to pause when hovering over pager link
    prev:             null,     // element, jQuery object, or jQuery selector string for the element to use as event trigger for previous slide
    prevNextEvent:    'click.cycle',// event which drives the manual transition to the previous or next slide
    random:           0,        // true for random, false for sequence (not applicable to shuffle fx)
    randomizeEffects: 1,        // valid when multiple effects are used; true to make the effect sequence random
    requeueOnImageNotLoaded: true, // requeue the slideshow if any image slides are not yet loaded
    requeueTimeout:   250,      // ms delay for requeue
    rev:              0,        // causes animations to transition in reverse (for effects that support it such as scrollHorz/scrollVert/shuffle)
    shuffle:          null,     // coords for shuffle animation, ex: { top:15, left: 200 }
    skipInitializationCallbacks: false, // set to true to disable the first before/after callback that occurs prior to any transition
    slideExpr:        null,     // expression for selecting slides (if something other than all children is required)
    slideResize:      1,        // force slide width/height to fixed size before every transition
    speed:            1000,     // speed of the transition (any valid fx speed value)
    speedIn:          null,     // speed of the 'in' transition
    speedOut:         null,     // speed of the 'out' transition
    startingSlide:    undefined,// zero-based index of the first slide to be displayed
    sync:             1,        // true if in/out transitions should occur simultaneously
    timeout:          4000,     // milliseconds between slide transitions (0 to disable auto advance)
    timeoutFn:        null,     // callback for determining per-slide timeout value:  function(currSlideElement, nextSlideElement, options, forwardFlag)
    updateActivePagerLink: null,// callback fn invoked to update the active pager link (adds/removes activePagerClass style)
    width:            null      // container width (if the 'fit' option is true, the slides will be set to this width as well)
};

})(jQuery);


/*!
 * jQuery Cycle Plugin Transition Definitions
 * This script is a plugin for the jQuery Cycle Plugin
 * Examples and documentation at: http://malsup.com/jquery/cycle/
 * Copyright (c) 2007-2010 M. Alsup
 * Version:	 2.73
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 */
(function($) {
"use strict";

//
// These functions define slide initialization and properties for the named
// transitions. To save file size feel free to remove any of these that you
// don't need.
//
$.fn.cycle.transitions.none = function($cont, $slides, opts) {
	opts.fxFn = function(curr,next,opts,after){
		$(next).show();
		$(curr).hide();
		after();
	};
};

// not a cross-fade, fadeout only fades out the top slide
$.fn.cycle.transitions.fadeout = function($cont, $slides, opts) {
	$slides.not(':eq('+opts.currSlide+')').css({ display: 'block', 'opacity': 1 });
	opts.before.push(function(curr,next,opts,w,h,rev) {
		$(curr).css('zIndex',opts.slideCount + (rev !== true ? 1 : 0));
		$(next).css('zIndex',opts.slideCount + (rev !== true ? 0 : 1));
	});
	opts.animIn.opacity = 1;
	opts.animOut.opacity = 0;
	opts.cssBefore.opacity = 1;
	opts.cssBefore.display = 'block';
	opts.cssAfter.zIndex = 0;
};

// scrollUp/Down/Left/Right
$.fn.cycle.transitions.scrollUp = function($cont, $slides, opts) {
	$cont.css('overflow','hidden');
	opts.before.push($.fn.cycle.commonReset);
	var h = $cont.height();
	opts.cssBefore.top = h;
	opts.cssBefore.left = 0;
	opts.cssFirst.top = 0;
	opts.animIn.top = 0;
	opts.animOut.top = -h;
};
$.fn.cycle.transitions.scrollDown = function($cont, $slides, opts) {
	$cont.css('overflow','hidden');
	opts.before.push($.fn.cycle.commonReset);
	var h = $cont.height();
	opts.cssFirst.top = 0;
	opts.cssBefore.top = -h;
	opts.cssBefore.left = 0;
	opts.animIn.top = 0;
	opts.animOut.top = h;
};
$.fn.cycle.transitions.scrollLeft = function($cont, $slides, opts) {
	$cont.css('overflow','hidden');
	opts.before.push($.fn.cycle.commonReset);
	var w = $cont.width();
	opts.cssFirst.left = 0;
	opts.cssBefore.left = w;
	opts.cssBefore.top = 0;
	opts.animIn.left = 0;
	opts.animOut.left = 0-w;
};
$.fn.cycle.transitions.scrollRight = function($cont, $slides, opts) {
	$cont.css('overflow','hidden');
	opts.before.push($.fn.cycle.commonReset);
	var w = $cont.width();
	opts.cssFirst.left = 0;
	opts.cssBefore.left = -w;
	opts.cssBefore.top = 0;
	opts.animIn.left = 0;
	opts.animOut.left = w;
};
$.fn.cycle.transitions.scrollHorz = function($cont, $slides, opts) {
	$cont.css('overflow','hidden').width();
	opts.before.push(function(curr, next, opts, fwd) {
		if (opts.rev)
			fwd = !fwd;
		$.fn.cycle.commonReset(curr,next,opts);
		opts.cssBefore.left = fwd ? (next.cycleW-1) : (1-next.cycleW);
		opts.animOut.left = fwd ? -curr.cycleW : curr.cycleW;
	});
	opts.cssFirst.left = 0;
	opts.cssBefore.top = 0;
	opts.animIn.left = 0;
	opts.animOut.top = 0;
};
$.fn.cycle.transitions.scrollVert = function($cont, $slides, opts) {
	$cont.css('overflow','hidden');
	opts.before.push(function(curr, next, opts, fwd) {
		if (opts.rev)
			fwd = !fwd;
		$.fn.cycle.commonReset(curr,next,opts);
		opts.cssBefore.top = fwd ? (1-next.cycleH) : (next.cycleH-1);
		opts.animOut.top = fwd ? curr.cycleH : -curr.cycleH;
	});
	opts.cssFirst.top = 0;
	opts.cssBefore.left = 0;
	opts.animIn.top = 0;
	opts.animOut.left = 0;
};

// slideX/slideY
$.fn.cycle.transitions.slideX = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$(opts.elements).not(curr).hide();
		$.fn.cycle.commonReset(curr,next,opts,false,true);
		opts.animIn.width = next.cycleW;
	});
	opts.cssBefore.left = 0;
	opts.cssBefore.top = 0;
	opts.cssBefore.width = 0;
	opts.animIn.width = 'show';
	opts.animOut.width = 0;
};
$.fn.cycle.transitions.slideY = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$(opts.elements).not(curr).hide();
		$.fn.cycle.commonReset(curr,next,opts,true,false);
		opts.animIn.height = next.cycleH;
	});
	opts.cssBefore.left = 0;
	opts.cssBefore.top = 0;
	opts.cssBefore.height = 0;
	opts.animIn.height = 'show';
	opts.animOut.height = 0;
};

// shuffle
$.fn.cycle.transitions.shuffle = function($cont, $slides, opts) {
	var i, w = $cont.css('overflow', 'visible').width();
	$slides.css({left: 0, top: 0});
	opts.before.push(function(curr,next,opts) {
		$.fn.cycle.commonReset(curr,next,opts,true,true,true);
	});
	// only adjust speed once!
	if (!opts.speedAdjusted) {
		opts.speed = opts.speed / 2; // shuffle has 2 transitions
		opts.speedAdjusted = true;
	}
	opts.random = 0;
	opts.shuffle = opts.shuffle || {left:-w, top:15};
	opts.els = [];
	for (i=0; i < $slides.length; i++)
		opts.els.push($slides[i]);

	for (i=0; i < opts.currSlide; i++)
		opts.els.push(opts.els.shift());

	// custom transition fn (hat tip to Benjamin Sterling for this bit of sweetness!)
	opts.fxFn = function(curr, next, opts, cb, fwd) {
		if (opts.rev)
			fwd = !fwd;
		var $el = fwd ? $(curr) : $(next);
		$(next).css(opts.cssBefore);
		var count = opts.slideCount;
		$el.animate(opts.shuffle, opts.speedIn, opts.easeIn, function() {
			var hops = $.fn.cycle.hopsFromLast(opts, fwd);
			for (var k=0; k < hops; k++) {
				if (fwd)
					opts.els.push(opts.els.shift());
				else
					opts.els.unshift(opts.els.pop());
			}
			if (fwd) {
				for (var i=0, len=opts.els.length; i < len; i++)
					$(opts.els[i]).css('z-index', len-i+count);
			}
			else {
				var z = $(curr).css('z-index');
				$el.css('z-index', parseInt(z,10)+1+count);
			}
			$el.animate({left:0, top:0}, opts.speedOut, opts.easeOut, function() {
				$(fwd ? this : curr).hide();
				if (cb) cb();
			});
		});
	};
	$.extend(opts.cssBefore, { display: 'block', opacity: 1, top: 0, left: 0 });
};

// turnUp/Down/Left/Right
$.fn.cycle.transitions.turnUp = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,true,false);
		opts.cssBefore.top = next.cycleH;
		opts.animIn.height = next.cycleH;
		opts.animOut.width = next.cycleW;
	});
	opts.cssFirst.top = 0;
	opts.cssBefore.left = 0;
	opts.cssBefore.height = 0;
	opts.animIn.top = 0;
	opts.animOut.height = 0;
};
$.fn.cycle.transitions.turnDown = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,true,false);
		opts.animIn.height = next.cycleH;
		opts.animOut.top   = curr.cycleH;
	});
	opts.cssFirst.top = 0;
	opts.cssBefore.left = 0;
	opts.cssBefore.top = 0;
	opts.cssBefore.height = 0;
	opts.animOut.height = 0;
};
$.fn.cycle.transitions.turnLeft = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,false,true);
		opts.cssBefore.left = next.cycleW;
		opts.animIn.width = next.cycleW;
	});
	opts.cssBefore.top = 0;
	opts.cssBefore.width = 0;
	opts.animIn.left = 0;
	opts.animOut.width = 0;
};
$.fn.cycle.transitions.turnRight = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,false,true);
		opts.animIn.width = next.cycleW;
		opts.animOut.left = curr.cycleW;
	});
	$.extend(opts.cssBefore, { top: 0, left: 0, width: 0 });
	opts.animIn.left = 0;
	opts.animOut.width = 0;
};

// zoom
$.fn.cycle.transitions.zoom = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,false,false,true);
		opts.cssBefore.top = next.cycleH/2;
		opts.cssBefore.left = next.cycleW/2;
		$.extend(opts.animIn, { top: 0, left: 0, width: next.cycleW, height: next.cycleH });
		$.extend(opts.animOut, { width: 0, height: 0, top: curr.cycleH/2, left: curr.cycleW/2 });
	});
	opts.cssFirst.top = 0;
	opts.cssFirst.left = 0;
	opts.cssBefore.width = 0;
	opts.cssBefore.height = 0;
};

// fadeZoom
$.fn.cycle.transitions.fadeZoom = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,false,false);
		opts.cssBefore.left = next.cycleW/2;
		opts.cssBefore.top = next.cycleH/2;
		$.extend(opts.animIn, { top: 0, left: 0, width: next.cycleW, height: next.cycleH });
	});
	opts.cssBefore.width = 0;
	opts.cssBefore.height = 0;
	opts.animOut.opacity = 0;
};

// blindX
$.fn.cycle.transitions.blindX = function($cont, $slides, opts) {
	var w = $cont.css('overflow','hidden').width();
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts);
		opts.animIn.width = next.cycleW;
		opts.animOut.left   = curr.cycleW;
	});
	opts.cssBefore.left = w;
	opts.cssBefore.top = 0;
	opts.animIn.left = 0;
	opts.animOut.left = w;
};
// blindY
$.fn.cycle.transitions.blindY = function($cont, $slides, opts) {
	var h = $cont.css('overflow','hidden').height();
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts);
		opts.animIn.height = next.cycleH;
		opts.animOut.top   = curr.cycleH;
	});
	opts.cssBefore.top = h;
	opts.cssBefore.left = 0;
	opts.animIn.top = 0;
	opts.animOut.top = h;
};
// blindZ
$.fn.cycle.transitions.blindZ = function($cont, $slides, opts) {
	var h = $cont.css('overflow','hidden').height();
	var w = $cont.width();
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts);
		opts.animIn.height = next.cycleH;
		opts.animOut.top   = curr.cycleH;
	});
	opts.cssBefore.top = h;
	opts.cssBefore.left = w;
	opts.animIn.top = 0;
	opts.animIn.left = 0;
	opts.animOut.top = h;
	opts.animOut.left = w;
};

// growX - grow horizontally from centered 0 width
$.fn.cycle.transitions.growX = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,false,true);
		opts.cssBefore.left = this.cycleW/2;
		opts.animIn.left = 0;
		opts.animIn.width = this.cycleW;
		opts.animOut.left = 0;
	});
	opts.cssBefore.top = 0;
	opts.cssBefore.width = 0;
};
// growY - grow vertically from centered 0 height
$.fn.cycle.transitions.growY = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,true,false);
		opts.cssBefore.top = this.cycleH/2;
		opts.animIn.top = 0;
		opts.animIn.height = this.cycleH;
		opts.animOut.top = 0;
	});
	opts.cssBefore.height = 0;
	opts.cssBefore.left = 0;
};

// curtainX - squeeze in both edges horizontally
$.fn.cycle.transitions.curtainX = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,false,true,true);
		opts.cssBefore.left = next.cycleW/2;
		opts.animIn.left = 0;
		opts.animIn.width = this.cycleW;
		opts.animOut.left = curr.cycleW/2;
		opts.animOut.width = 0;
	});
	opts.cssBefore.top = 0;
	opts.cssBefore.width = 0;
};
// curtainY - squeeze in both edges vertically
$.fn.cycle.transitions.curtainY = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,true,false,true);
		opts.cssBefore.top = next.cycleH/2;
		opts.animIn.top = 0;
		opts.animIn.height = next.cycleH;
		opts.animOut.top = curr.cycleH/2;
		opts.animOut.height = 0;
	});
	opts.cssBefore.height = 0;
	opts.cssBefore.left = 0;
};

// cover - curr slide covered by next slide
$.fn.cycle.transitions.cover = function($cont, $slides, opts) {
	var d = opts.direction || 'left';
	var w = $cont.css('overflow','hidden').width();
	var h = $cont.height();
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts);
		if (d == 'right')
			opts.cssBefore.left = -w;
		else if (d == 'up')
			opts.cssBefore.top = h;
		else if (d == 'down')
			opts.cssBefore.top = -h;
		else
			opts.cssBefore.left = w;
	});
	opts.animIn.left = 0;
	opts.animIn.top = 0;
	opts.cssBefore.top = 0;
	opts.cssBefore.left = 0;
};

// uncover - curr slide moves off next slide
$.fn.cycle.transitions.uncover = function($cont, $slides, opts) {
	var d = opts.direction || 'left';
	var w = $cont.css('overflow','hidden').width();
	var h = $cont.height();
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,true,true,true);
		if (d == 'right')
			opts.animOut.left = w;
		else if (d == 'up')
			opts.animOut.top = -h;
		else if (d == 'down')
			opts.animOut.top = h;
		else
			opts.animOut.left = -w;
	});
	opts.animIn.left = 0;
	opts.animIn.top = 0;
	opts.cssBefore.top = 0;
	opts.cssBefore.left = 0;
};

// toss - move top slide and fade away
$.fn.cycle.transitions.toss = function($cont, $slides, opts) {
	var w = $cont.css('overflow','visible').width();
	var h = $cont.height();
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,true,true,true);
		// provide default toss settings if animOut not provided
		if (!opts.animOut.left && !opts.animOut.top)
			$.extend(opts.animOut, { left: w*2, top: -h/2, opacity: 0 });
		else
			opts.animOut.opacity = 0;
	});
	opts.cssBefore.left = 0;
	opts.cssBefore.top = 0;
	opts.animIn.left = 0;
};

// wipe - clip animation
$.fn.cycle.transitions.wipe = function($cont, $slides, opts) {
	var w = $cont.css('overflow','hidden').width();
	var h = $cont.height();
	opts.cssBefore = opts.cssBefore || {};
	var clip;
	if (opts.clip) {
		if (/l2r/.test(opts.clip))
			clip = 'rect(0px 0px '+h+'px 0px)';
		else if (/r2l/.test(opts.clip))
			clip = 'rect(0px '+w+'px '+h+'px '+w+'px)';
		else if (/t2b/.test(opts.clip))
			clip = 'rect(0px '+w+'px 0px 0px)';
		else if (/b2t/.test(opts.clip))
			clip = 'rect('+h+'px '+w+'px '+h+'px 0px)';
		else if (/zoom/.test(opts.clip)) {
			var top = parseInt(h/2,10);
			var left = parseInt(w/2,10);
			clip = 'rect('+top+'px '+left+'px '+top+'px '+left+'px)';
		}
	}

	opts.cssBefore.clip = opts.cssBefore.clip || clip || 'rect(0px 0px 0px 0px)';

	var d = opts.cssBefore.clip.match(/(\d+)/g);
	var t = parseInt(d[0],10), r = parseInt(d[1],10), b = parseInt(d[2],10), l = parseInt(d[3],10);

	opts.before.push(function(curr, next, opts) {
		if (curr == next) return;
		var $curr = $(curr), $next = $(next);
		$.fn.cycle.commonReset(curr,next,opts,true,true,false);
		opts.cssAfter.display = 'block';

		var step = 1, count = parseInt((opts.speedIn / 13),10) - 1;
		(function f() {
			var tt = t ? t - parseInt(step * (t/count),10) : 0;
			var ll = l ? l - parseInt(step * (l/count),10) : 0;
			var bb = b < h ? b + parseInt(step * ((h-b)/count || 1),10) : h;
			var rr = r < w ? r + parseInt(step * ((w-r)/count || 1),10) : w;
			$next.css({ clip: 'rect('+tt+'px '+rr+'px '+bb+'px '+ll+'px)' });
			(step++ <= count) ? setTimeout(f, 13) : $curr.css('display', 'none');
		})();
	});
	$.extend(opts.cssBefore, { display: 'block', opacity: 1, top: 0, left: 0 });
	opts.animIn	   = { left: 0 };
	opts.animOut   = { left: 0 };
};

})(jQuery);