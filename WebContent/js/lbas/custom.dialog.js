
(function( $, undefined ) {
	
	//var uiDialogClasses = "ui-dialog ui-widget ui-widget-content roundbox";
	var uiDialogClasses = "ui-widget ";
	
	
	$.widget("custom.lbasdialog", $.ui.dialog, {
	
		
		_create: function() {
			var _super_create = $.ui.dialog.prototype._create;
			_super_create();
			/*
			this.originalTitle = this.element.attr( "title" );
			// #5742 - .attr() might return a DOMElement
			if ( typeof this.originalTitle !== "string" ) {
				this.originalTitle = "";
			}		
			this.oldPosition = { 
				parent: this.element.parent(), 
				index: this.element.parent().children().index( this.element ) 
			};
			this.options.title = this.options.title || this.originalTitle;
			var self = this,
				options = self.options,
	
				title = options.title || "&#160;",
				titleId = $.ui.dialog.getTitleId( self.element ),
			 	
				uiDialog = ( self.uiDialog = $( '<div class="lbasDialog"/>' ) )
				//uiDialog = ( self.uiDialogOriginal = $( '<div class="lbasDialog">' ) )
					.addClass( uiDialogClasses + options.dialogClass)
					// setting tabIndex makes the div focusable
					.attr( "tabIndex", -1)
					.keydown(function( event ) {
						if ( options.closeOnEscape && !event.isDefaultPrevented() && event.keyCode &&
								event.keyCode === $.ui.keyCode.ESCAPE ) {
							self.close( event );
							event.preventDefault();
						}
					})
					.attr({
						role: "dialog",
						"aria-labelledby": titleId
					})
					.mousedown(function( event ) {
						self.moveToTop( false, event );
					})
					.appendTo( "body" )
					.wrap('<div class="dialog"><div class="bd"><div class="c"><div class="s"></div></div></div></div>')
			
					//self.uiDialog = $('div.dialog');
					
					 $('div.dialog')
					   .prepend('<div class="hd">'+
					     '<div class="c"></div></div>')
					   .append('<div class="ft">'+
					     '<div class="c"></div></div>')
					   //.addClass( uiDialogClasses + options.dialogClass);
					   
			
	
				uiDialogContent = self.element
					.show()
					.removeAttr( "title" )
					.addClass( "ui-dialog-content ui-widget-content" )
					.appendTo( uiDialog ),
	
				uiDialogTitlebar = ( self.uiDialogTitlebar = $( "<div>" ) )
					.addClass( "ui-dialog-titlebar  ui-widget-header  " +
						"ui-corner-all  ui-helper-clearfix" )
					.prependTo( uiDialog ),
	
				uiDialogTitlebarClose = $( "<a href='#'></a>" )
					.addClass( "ui-dialog-titlebar-close  ui-corner-all" )
					.attr( "role", "button" )
					.click(function( event ) {
						event.preventDefault();
						self.close( event );
					})
					.appendTo( uiDialogTitlebar ),
	
				uiDialogTitlebarCloseText = ( self.uiDialogTitlebarCloseText = $( "<span>" ) )
					.addClass( "ui-icon ui-icon-closethick" )
					.text( options.closeText )
					.appendTo( uiDialogTitlebarClose ),
	
				uiDialogTitle = $( "<span>" )
					.addClass( "ui-dialog-title" )
					.attr( "id", titleId )
					.html( title )
					.prependTo( uiDialogTitlebar );
	
			uiDialogTitlebar.find( "*" ).add( uiDialogTitlebar ).disableSelection();
			//this._hoverable( uiDialogTitlebarClose );
			//this._focusable( uiDialogTitlebarClose );
			
			if ( options.draggable && $.fn.draggable ) {
				self._makeDraggable();
			}
			if ( options.resizable && $.fn.resizable ) {
				self._makeResizable();
			}

			self._createButtons( options.buttons );
			self._isOpen = false;
	
			if ( $.fn.bgiframe ) {
				uiDialog.bgiframe();
			}
			*/
		}
		
	});

}( jQuery ) );
