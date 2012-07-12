/********************************************

	MAIN.JS
	
	VERSION 0.1
	
	LOADS JS FILES


*********************************************/

require.config({
	baseUrl : sessionStorage.getItem('hostname') + sessionStorage.getItem('directory')+'js/',
	paths : {
			'order' : sessionStorage.getItem('hostname') + sessionStorage.getItem('directory')+'js/lib/order',
			'text' : sessionStorage.getItem('hostname') + sessionStorage.getItem('directory')+'js/lib/text'
		}
})

var loadFiles = [
	'jquery',

	//libraries
	'order!lib/underscore',
	'order!lib/backbone',
	'order!lib/jquery/ui/js/jquery-ui.min',
	'order!lib/bootstrap',
	'order!lib/dropbox',
	
	//custom
	'order!ux/zeega.ux.header',
	'order!ux/zeega.ux.site',

	//mvc
	'order!app/views/editor.modals/editor.view.modal.ingest-dropbox',
	'order!app/views/editor.modals/editor.view.modal.ingest-dropbox-iframe',
	
	//plugins
	//'order!lib/jquery/plugins/jeditable.min',
	//'order!lib/jquery/plugins/jquery-cycle',
	//'order!lib/jquery/plugins/jquery.paging',
	//'order!lib/jquery/plugins/colorpicker/js/colorpicker',

	];

require(loadFiles, function($) {
    initUX();
});
