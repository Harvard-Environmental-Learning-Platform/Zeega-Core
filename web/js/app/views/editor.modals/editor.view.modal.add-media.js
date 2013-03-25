(function(Modal) {
    
    Modal.Views.AddMedia = Backbone.View.extend({
        
        className : "modal",
        
        render: function()
        {
            this.imageUrls = [];
            this.$el.html( this.getTemplate() );
            return this;
        },

        events : {
            "click .close" : "hide",
            "change .add-photo input" : "imageUpload"
        },

        show : function(){ this.$el.modal("show"); },
        hide : function(){ this.$el.modal("hide"); },
        imageUpload: function(event) {
            var fileInput = event.target, imageData;
            imageData = new FormData();
            
            imageData.append( "file", fileInput.files[0] );

            $.ajax({
                url: sessionStorage.getItem("hostname") + "kinok/image",
                type: "POST",
                data: imageData,
                dataType: "json",
                processData: false,
                contentType: false,
                fileElementId: "imagefile",
                
                success: function( data ) {

                    $(fileInput).parent('span').css({
                        "background-image" : "url(" + data.image_url_4 + ")",
                        "background-size" : "cover"
                    });
                    
                    zeega.app.addItem( data );

                    this.$el.find("#image-uploads").append("<span class='add-photo' href='#'><input id = 'imagefile' name = 'imagefile' type='file' href='#'></input></span>");
                    
                }.bind(this)
            });
        },

        getTemplate : function()
        {



            var html =    //Step 1
                "<div class='modal-header'>"+
                    "<button class='close'>&times;</button>"+
                    "<h3>Add Media to Zeega!</h3>"+
                "</div>"+

                "<div class='modal-body clearfix'>"+
                    "<div id = 'image-uploads' >"+
                        "<p>upload images for your computer</p>"+
                        "<span class='add-photo' href='#'>"+
                            "<input id = 'imagefile'  name = 'imagefile'  type='file' href='#'></input>"+
                        "</span>"+
                    "</div>"+
                    "<div id = 'bookmarklet-instructions' >"+
                        "<div>"+
                            "<a style='float:left' href=\"javascript:(function()%7Bvar%20head=document.getElementsByTagName('body')%5B0%5D,script=document.createElement('script');script.id='zeegabm';script.type='text/javascript';script.src='"+ zeega.app.url_prefix +"js/widget/zeega.bookmarklet.js?'%20+%20Math.floor(Math.random()*99999);head.appendChild(script);%7D)();%20void%200\">"+
                                "<img src='"+ zeega.app.url_prefix +"images/drag-zeega.gif' alt='Add to Zeega'/>"+
                            "</a>"+
                            "<ul style='width:393px; float:left'>"+
                                "Drag the icon to the left to the Bookmarks Bar within the browser. Simply click 'Add to Zeega' when viewing any media on Instagram, Flickr, YouTube, Tumblr or SoundCloud. The media will be available for you to use in your Zeega!"+

                            "</ul>"+
                        "</div>"+
                    "</div>"+
                    //"javascript:(function()%7Bvar%20head=document.getElementsByTagName("body")%5B0%5D,script=document.createElement("script");script.id="zeegabm";script.type="text/javascript";script.src=""+ zeega.app.url_prefix +"js/widget/zeega.bookmarklet.js?"%20+%20Math.floor(Math.random()*99999);head.appendChild(script);%7D)();%20void%200"+

                    "<div class='publish-footer'>"+
                        "<button class='btn secondary pull-right close' ><i class='icon-ok-circle'></i> Done</button>"+
                    "</div>"+
                "</div>";
            return html;
        }
    });
    
})(zeega.module("modal"));