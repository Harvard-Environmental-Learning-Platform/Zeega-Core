
var MyCollectionsView = Backbone.View.extend({
	
	el: $('#browser-my-collections-drawer'),
	_views : [],
	
	initialize : function() {
		this.collection.bind('add',   this.addCollection, this);
		this.collection.bind('reset',   this.addCollections, this);
		
	},
	addCollection : function(m){
		var collectionView = new BrowserCollectionView({ model: m });
        this._views[m.id] = collectionView;
        var addThis = collectionView.render(); 
	    $(this.el).prepend(addThis.el);
       
	},
	addCollections : function(){
		var mainColl = this.collection;

		for (var i=0; i<this.collection.length; i++){
			var myBrowserCollection = this.collection.at(i);
			var collectionView = new BrowserCollectionView({ model: myBrowserCollection });
	        this._views[myBrowserCollection.id] = collectionView;
		}
		/*_.each(mainColl, function(myBrowserCollection){
				// item draws itself
				console.log('why dont i get here????');
				var collectionView = new BrowserCollectionView({ model: myBrowserCollection });
	        	this._views[myBrowserCollection.id] = collectionView;
	        	
			}, this);*/
		
       this.render();
	},
	
	render: function()
	{
		//draw the collections
		
		_.each(this._views, function(collectionView){
				// item draws itself
				
	        	var addThis = collectionView.render(); 
	        	$(this.el).prepend(addThis.el);

	        	
			}, this);

		
		return this;
	},
	
	events: {
		//"click" : "previewItem"
		//'dblclick' : "doubleClick",
		
	},
	
	
});

