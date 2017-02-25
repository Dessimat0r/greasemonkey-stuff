// ==UserScript==
// @name        Show Maps on CWJobs
// @namespace   cwjobsmaps
// @description Show Maps on CWJobs
// @include     http://www.cwjobs.co.uk/jobs/*
// @include     https://www.cwjobs.co.uk/jobs/*
// @include     http://cwjobs.co.uk/jobs/*
// @include     https://cwjobs.co.uk/jobs/*
// @version     1
// @grant       none
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle(`.cvmap-tooltip {
  border:1px solid black;
  z-index: 100;
}`);
addGlobalStyle(`.cvmap-js {
  border-bottom: 1px solid;
  margin-left: 4px;
  vertical-align: super;
  font-size: 8px;
  cursor: default;
  display: inline-block;
}`);

(function($) {
    function closeTip( tip, uid )
    {
	var d = tip.data('pTooltip')

	// Do nothing if the calling uid and tip.uid don't match.
	// Don't close if the mouse has entered the tooltip. (In
	// this case the tip will be closed by a mouseleave event)
	if( uid === d.uid && !d.mouseEntered )
	    tip.hide();
    }
	
    $.fn.pTooltip = function( args )
    {
	// this: jQuery object with a list of items for which the tool tip is required.
	var options = {
	    tipCloseDelay: 500, /* ms after which we attempt to close the tip */

	    findToolTip: function(t) {
		/*
		 * Should return a jQuery object containining the tool tip for
		 * the jQuery object t. (Default: title attribute to each
		 * object contains the ID to the tool tip element.)
		 */
		return $( '#' + t.attr('title') );
	    },

	    tipPosition: function(t) {
		/*
		 * Returns the position at which the tip of "t" should be placed. 
		 */
		return { my: 'center top+15', at: 'center bottom', of: t,
			    collision: 'fit flip' };
	    }
	};
	$.extend( options, args );

	return this.each( function()
	{
	    // this is a DOM element. ID of tooltip element is in the title attribute
	    var t = $(this);
	    var tip = options.findToolTip(t);

	    // Debug check
	    if( tip.length === 0 )
		throw( 'No element with ID ' + t.attr('title') );

	    // Remove title attribute from element
	    t.removeAttr( 'title' );

	    // Show tooltip on mouse over.
	    t.mouseover( function()
		{
		    // Hide all visible tips
		    $(':visible:data(pTooltip)').hide();

		    // Set UID to 0 here to cancel any closeTip events that
		    // might fire from other elements that showed the same tip.
		    var d = $.extend( tip.data('pTooltip'),
			    { mouseEntered: false, uid: 0 } );
		    tip.data( 'pTooltip', d );

		    tip.show().position( options.tipPosition(t) );
		});

	    // Wait a little, and then call the close function.
	    t.mouseleave( function()
		{
		    // Use time (in miliseconds) as a UID
		    var uid = $.now();
		    var d = $.extend( tip.data('pTooltip'), { uid: uid} );
		    tip.data( 'pTooltip', d );

		    setTimeout( function() { closeTip( tip, uid ); },
			options.tipCloseDelay );
		});

	    // Set pTooltip.mouseEntered when the mouse enters.
	    tip.mouseover( function()
		    {
			var d = $.extend( tip.data('pTooltip'), { mouseEntered: true } );
			tip.data( 'pTooltip', d );
		    } );

	    // Close the tool tip when the mouse leaves
	    tip.mouseleave( function() { tip.hide(); } );

	    // Style the tip
	    tip.hide().addClass( 'ui-tooltip ui-widget ui-corner-all ui-widget-content' );
	    
	} );
    }
})(jQuery);

$(document).ready(function() {
  window.console && console.log('yes 1');
  window.console && console.log('yes 3');
  var i = 0;
  $('li.location').each(function() {
   window.console && console.log('yes 4');
   var loc = encodeURIComponent($(this).text());
   window.console && console.log('yes 4a');
   window.console && console.log('yes 4b');
   var curr = i++;
   var atime = new Date();
   atime.setDate(atime.getDate()+1);
   atime.setHours(9);
   atime.setMinutes(0);
   atime.setSeconds(0,0);
   var atime_s = atime.getTime() / 1000;
   var div = '<iframe id="cvmapif-'+curr+'" width="500" height="500" frameborder="0" style="border:1px solid black; z-index: 100; background-color: white; display: none;" src="https://www.google.com/maps/embed/v1/directions?key=AIzaSyDBZjErcijrftD_SmsmkHxsksmHH30VysE&origin=ch42+5pr&destination='+loc+'&mode=transit&units=imperial" allowfullscreen></iframe>';
   $('body').append(div);
   var span = $('<span class="cvmap-js" title="cvmapif-'+curr+'">map</span>');
   window.console && console.log('yes 5');
   $(this).append(span);
   span.pTooltip();
   window.console && console.log('yes 6');
  });
  $('.cvmap-js').pTooltip();
});