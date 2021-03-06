// Add polyfills
NodeList.prototype.forEach = Array.prototype.forEach;

// remove no-js class
document.documentElement.className = "js";

// MENU
// ========
(function(){

  // get menu elements
  var menu = document.querySelector('.site-menu');
  var menuBody = document.querySelector('.site-menu__body');
  var menuTrigger = document.querySelector('.site-menu__trigger');
  var wrap = document.querySelector('.site-wrap');

  menuTrigger.onclick = function(e){

  	e.preventDefault();

  	if(menu.getAttribute('aria-hidden') === 'true'){

  		menu.setAttribute('aria-hidden', 'false');
      document.body.onclick = function(e){

        if(!menu.contains(e.target)){
          e.preventDefault();
          menu.setAttribute('aria-hidden', 'true');
          document.body.onclick = null;

        }

      }
  	}

  	else {
  		menu.setAttribute('aria-hidden', 'true');
  	}
  }

  menuBody.ontouchstart = function(){

		var scrollTop = this.scrollTop;
		var scrollHeight = this.scrollHeight;
    var offsetHeight = this.offsetHeight;
    var contentHeight = scrollHeight - offsetHeight;
		
		if(scrollTop=== 0){
			this.scrollTop = 1;
		}

    if(contentHeight === scrollTop) {
    	this.scrollTop = (scrollTop-1);
    }
	}

})();

// TOP STORIES
// ========

(function(){

  var topstories = document.querySelectorAll('.top-100 .story-grid__item');
  var grid = document.querySelector('.story-grid__inner');

  if(topstories.length){

    topstories = Array.prototype.slice.call(topstories);

    topstories.sort(function(a, b){
      var scorea = parseFloat(a.querySelector('.article-score__num').textContent);
      var scoreb = parseFloat(b.querySelector('.article-score__num').textContent);
      return scoreb - scorea;
    })

    topstories.forEach(function(item){
      grid.appendChild(item);
    });

    grid.style.visibility = 'visible';
  }


})();

// VOTE
// ========
(function(){

  var vote = document.querySelector('.article-vote');

  if(!vote){
    return;
  }

  var score = vote.querySelector('.article-score big');
  var buttons = vote.querySelectorAll('.article-vote__button');
  var title = vote.id;

  if(window.localStorage.getItem(title)){
    vote.setAttribute('aria-disabled', true);
    vote.setAttribute('data-voted', window.localStorage.getItem(title));
  }

  else {
    buttons.forEach(function(item){

      item.onclick = function(e){

        e.preventDefault();

        if(this.getAttribute('data-vote') === 'yes'){
          vote.setAttribute('data-voted', 'yes');
          window.localStorage.setItem(title, 'yes');
          ga('send', 'pageview', location.pathname + '?action=voteup');

        }

        else {
          vote.setAttribute('data-voted', 'no');
          window.localStorage.setItem(title, 'no');
          ga('send', 'pageview', location.pathname + '?action=votedown');

        }

        vote.setAttribute('aria-disabled', true);
      }
    })
  }

})();

// LAZY IMAGES
// ================
(function(){
  
  var android = !!navigator.userAgent.match(/android/i);
  var images = document.getElementsByClassName('lazy-image');

  function isInViewPort(image){

    var rect = image.getBoundingClientRect();

    // return true if the image is visible and in the viewport top and bottom
    // otherwise return false

    if(rect.width === 0){

      // element is not visible
      return false;
    }

    if(rect.bottom < 0){

      // out of viewport top
      return false;
    }

    // @note - use a fallback for window.innerHeight in IE8
    if((window.innerHeight - rect.top) < 0){

      // out of viewport bottom
      return false;
    }

    // if it passes all that, its visible
    return true;

  }


  function loadedImage(){
    this.classList.remove('lazy-image');
  }

  function checkImages(){

    for(var i = -1;++i<images.length;){

      var image = images[i];

      if(isInViewPort(image)){
        image.addEventListener('load', loadedImage);

        if(window.isOldAndroid || window.isOldIOS){
          image.naturalWidth > 0 && loadedImage.call(image);
          image.readyState === 'complete' && loadedImage.call(image);
        }
      
        image.setAttribute('srcset', image.src);
        image.setAttribute('src', image.src);
      }
    }
    
    requestAnimationFrame(function(){
      setTimeout(function(){
        checkImages();
      },100);
    });
  }

  checkImages();

})();

// GA
// ================
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

if(!location.hostname.match(/localhost|192.168/)){
  
  ga('create', 'UA-61416169-1', 'auto');

  if(location.pathname.length < 2){
    ga('send', 'pageview', '/index.html');
  }

  else {
    ga('send', 'pageview');
  }
};

(function(){

  function close(e){
    e.preventDefault();
    this.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('overlay-open');
  }

  var overlay = document.querySelector('.overlay');

  if(!overlay){
    return;
  }
  
  var link = overlay.querySelector('a');
  var overlayBody = overlay.querySelector('.overlay__body');
  var overlayLinks = document.querySelectorAll('.overlay-open');
  var overlayClose = document.querySelector('.overlay__close');

  overlay.close = close;
  overlayClose.onclick = close.bind(overlay);


  overlayLinks.forEach(function(item){
    item.onclick = function(e){
      e.preventDefault();
      overlay.setAttribute('aria-hidden', 'false');
      document.body.classList.add('overlay-open');
      link.focus();
    }
  });

  overlay.ontouchstart = function(e){
      e.preventDefault();
  }

  overlay.onclick = function(e){
    if(!overlayBody.contains(e.target)){
      overlay.close();
    }
  }

})();


// FASTCLICK
// ========
(function(){function e(a,b){function c(a,b){return function(){return a.apply(b,arguments)}}var d;b=b||{};this.trackingClick=!1;this.trackingClickStart=0;this.targetElement=null;this.lastTouchIdentifier=this.touchStartY=this.touchStartX=0;this.touchBoundary=b.touchBoundary||10;this.layer=a;this.tapDelay=b.tapDelay||200;this.tapTimeout=b.tapTimeout||700;if(!e.notNeeded(a)){for(var f="onMouse onClick onTouchStart onTouchMove onTouchEnd onTouchCancel".split(" "),h=0,k=f.length;h<k;h++)this[f[h]]=c(this[f[h]],
this);g&&(a.addEventListener("mouseover",this.onMouse,!0),a.addEventListener("mousedown",this.onMouse,!0),a.addEventListener("mouseup",this.onMouse,!0));a.addEventListener("click",this.onClick,!0);a.addEventListener("touchstart",this.onTouchStart,!1);a.addEventListener("touchmove",this.onTouchMove,!1);a.addEventListener("touchend",this.onTouchEnd,!1);a.addEventListener("touchcancel",this.onTouchCancel,!1);Event.prototype.stopImmediatePropagation||(a.removeEventListener=function(b,c,d){var e=Node.prototype.removeEventListener;
"click"===b?e.call(a,b,c.hijacked||c,d):e.call(a,b,c,d)},a.addEventListener=function(b,c,d){var e=Node.prototype.addEventListener;"click"===b?e.call(a,b,c.hijacked||(c.hijacked=function(a){a.propagationStopped||c(a)}),d):e.call(a,b,c,d)});"function"===typeof a.onclick&&(d=a.onclick,a.addEventListener("click",function(a){d(a)},!1),a.onclick=null)}}var k=0<=navigator.userAgent.indexOf("Windows Phone"),g=0<navigator.userAgent.indexOf("Android")&&!k,f=/iP(ad|hone|od)/.test(navigator.userAgent)&&!k,l=
f&&/OS 4_\d(_\d)?/.test(navigator.userAgent),m=f&&/OS [6-7]_\d/.test(navigator.userAgent),n=0<navigator.userAgent.indexOf("BB10");e.prototype.needsClick=function(a){switch(a.nodeName.toLowerCase()){case "button":case "select":case "textarea":if(a.disabled)return!0;break;case "input":if(f&&"file"===a.type||a.disabled)return!0;break;case "label":case "iframe":case "video":return!0}return/\bneedsclick\b/.test(a.className)};e.prototype.needsFocus=function(a){switch(a.nodeName.toLowerCase()){case "textarea":return!0;
case "select":return!g;case "input":switch(a.type){case "button":case "checkbox":case "file":case "image":case "radio":case "submit":return!1}return!a.disabled&&!a.readOnly;default:return/\bneedsfocus\b/.test(a.className)}};e.prototype.sendClick=function(a,b){var c,d;document.activeElement&&document.activeElement!==a&&document.activeElement.blur();d=b.changedTouches[0];c=document.createEvent("MouseEvents");c.initMouseEvent(this.determineEventType(a),!0,!0,window,1,d.screenX,d.screenY,d.clientX,d.clientY,
!1,!1,!1,!1,0,null);c.forwardedTouchEvent=!0;a.dispatchEvent(c)};e.prototype.determineEventType=function(a){return g&&"select"===a.tagName.toLowerCase()?"mousedown":"click"};e.prototype.focus=function(a){var b;f&&a.setSelectionRange&&0!==a.type.indexOf("date")&&"time"!==a.type&&"month"!==a.type?(b=a.value.length,a.setSelectionRange(b,b)):a.focus()};e.prototype.updateScrollParent=function(a){var b,c;b=a.fastClickScrollParent;if(!b||!b.contains(a)){c=a;do{if(c.scrollHeight>c.offsetHeight){b=c;a.fastClickScrollParent=
c;break}c=c.parentElement}while(c)}b&&(b.fastClickLastScrollTop=b.scrollTop)};e.prototype.getTargetElementFromEventTarget=function(a){return a.nodeType===Node.TEXT_NODE?a.parentNode:a};e.prototype.onTouchStart=function(a){var b,c,d;if(1<a.targetTouches.length)return!0;b=this.getTargetElementFromEventTarget(a.target);c=a.targetTouches[0];if(f){d=window.getSelection();if(d.rangeCount&&!d.isCollapsed)return!0;if(!l){if(c.identifier&&c.identifier===this.lastTouchIdentifier)return a.preventDefault(),!1;
this.lastTouchIdentifier=c.identifier;this.updateScrollParent(b)}}this.trackingClick=!0;this.trackingClickStart=a.timeStamp;this.targetElement=b;this.touchStartX=c.pageX;this.touchStartY=c.pageY;a.timeStamp-this.lastClickTime<this.tapDelay&&a.preventDefault();return!0};e.prototype.touchHasMoved=function(a){a=a.changedTouches[0];var b=this.touchBoundary;return Math.abs(a.pageX-this.touchStartX)>b||Math.abs(a.pageY-this.touchStartY)>b?!0:!1};e.prototype.onTouchMove=function(a){if(!this.trackingClick)return!0;
if(this.targetElement!==this.getTargetElementFromEventTarget(a.target)||this.touchHasMoved(a))this.trackingClick=!1,this.targetElement=null;return!0};e.prototype.findControl=function(a){return void 0!==a.control?a.control:a.htmlFor?document.getElementById(a.htmlFor):a.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")};e.prototype.onTouchEnd=function(a){var b,c,d=this.targetElement;if(!this.trackingClick)return!0;if(a.timeStamp-this.lastClickTime<
this.tapDelay)return this.cancelNextClick=!0;if(a.timeStamp-this.trackingClickStart>this.tapTimeout)return!0;this.cancelNextClick=!1;this.lastClickTime=a.timeStamp;b=this.trackingClickStart;this.trackingClick=!1;this.trackingClickStart=0;m&&(c=a.changedTouches[0],d=document.elementFromPoint(c.pageX-window.pageXOffset,c.pageY-window.pageYOffset)||d,d.fastClickScrollParent=this.targetElement.fastClickScrollParent);c=d.tagName.toLowerCase();if("label"===c){if(b=this.findControl(d)){this.focus(d);if(g)return!1;
d=b}}else if(this.needsFocus(d)){if(100<a.timeStamp-b||f&&window.top!==window&&"input"===c)return this.targetElement=null,!1;this.focus(d);this.sendClick(d,a);f&&"select"===c||(this.targetElement=null,a.preventDefault());return!1}if(f&&!l&&(b=d.fastClickScrollParent)&&b.fastClickLastScrollTop!==b.scrollTop)return!0;this.needsClick(d)||(a.preventDefault(),this.sendClick(d,a));return!1};e.prototype.onTouchCancel=function(){this.trackingClick=!1;this.targetElement=null};e.prototype.onMouse=function(a){return this.targetElement&&
!a.forwardedTouchEvent&&a.cancelable?!this.needsClick(this.targetElement)||this.cancelNextClick?(a.stopImmediatePropagation?a.stopImmediatePropagation():a.propagationStopped=!0,a.stopPropagation(),a.preventDefault(),!1):!0:!0};e.prototype.onClick=function(a){if(this.trackingClick)return this.targetElement=null,this.trackingClick=!1,!0;if("submit"===a.target.type&&0===a.detail)return!0;a=this.onMouse(a);a||(this.targetElement=null);return a};e.prototype.destroy=function(){var a=this.layer;g&&(a.removeEventListener("mouseover",
this.onMouse,!0),a.removeEventListener("mousedown",this.onMouse,!0),a.removeEventListener("mouseup",this.onMouse,!0));a.removeEventListener("click",this.onClick,!0);a.removeEventListener("touchstart",this.onTouchStart,!1);a.removeEventListener("touchmove",this.onTouchMove,!1);a.removeEventListener("touchend",this.onTouchEnd,!1);a.removeEventListener("touchcancel",this.onTouchCancel,!1)};e.notNeeded=function(a){var b,c;if("undefined"===typeof window.ontouchstart)return!0;if(c=+(/Chrome\/([0-9]+)/.exec(navigator.userAgent)||
[,0])[1])if(g){if((b=document.querySelector("meta[name=viewport]"))&&(-1!==b.content.indexOf("user-scalable=no")||31<c&&document.documentElement.scrollWidth<=window.outerWidth))return!0}else return!0;return n&&(b=navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/),10<=b[1]&&3<=b[2]&&(b=document.querySelector("meta[name=viewport]"))&&(-1!==b.content.indexOf("user-scalable=no")||document.documentElement.scrollWidth<=window.outerWidth))||"none"===a.style.msTouchAction||"manipulation"===a.style.touchAction||
27<=+(/Firefox\/([0-9]+)/.exec(navigator.userAgent)||[,0])[1]&&(b=document.querySelector("meta[name=viewport]"))&&(-1!==b.content.indexOf("user-scalable=no")||document.documentElement.scrollWidth<=window.outerWidth)?!0:"none"===a.style.touchAction||"manipulation"===a.style.touchAction?!0:!1};e.attach=function(a,b){return new e(a,b)};"function"===typeof define&&"object"===typeof define.amd&&define.amd?define(function(){return e}):"undefined"!==typeof module&&module.exports?(module.exports=e.attach,
module.exports.FastClick=e):window.FastClick=e})();

//attach
FastClick.attach(document.body);

