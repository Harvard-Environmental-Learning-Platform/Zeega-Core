/********************************************

	MAIN.JS
	
	VERSION 0.1
	
	LOADS JS FILES


*********************************************/

var loadFiles = [
	'jquery',
	
	//libraries
	'order!lib/underscore',
	'order!lib/backbone',
	'order!lib/jquery/ui/js/jquery-ui.min',
	
	//custom
	'order!ux/zeega.ux.header',
	'order!ux/zeega.ux.home',

	
	//plugins
	'order!lib/jquery/plugins/jeditable.min',
	'order!lib/jquery/plugins/jquery-cycle',
	'order!lib/jquery/plugins/jquery.paging',
	'order!lib/jquery/plugins/colorpicker/js/colorpicker',

	];

require(loadFiles, function($) {
    initUX();
	
});
