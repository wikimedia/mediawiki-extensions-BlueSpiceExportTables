(function(mw, $, bs){

	function _makeHTMLTableProvider( element ) {
		return {
			getHTMLTable: function() {
				var dfd = $.Deferred();
				dfd.resolve( '<table>' + $(element).html() + '</table>' );
				return dfd;
			}
		};
	}

	$(document).on( 'contextmenu', mw.config.get( 'bsgExportTablesMenuTargetSelector' ), function( e ) {
		if( e.ctrlKey ) {
			return true;
		}
		var me = this;
		mw.loader.using( 'ext.bluespice.extjs' ).done( function() {
			Ext.require( 'BS.ExportTables.menu.TableExport', function() {
				var menu = new BS.ExportTables.menu.TableExport({
					title: mw.message( 'bs-exporttables-menu' ).plain(),
					htmlTableProvider: _makeHTMLTableProvider( me )
				});
				menu.showAt(e.pageX, e.pageY);
			}, this);
		});
		e.preventDefault();
		return false;
	});

	$(document).on( 'mouseover', mw.config.get( 'bsgExportTablesMenuTargetSelector' ), function( e ) {
		$(this).addClass( 'bs-et-highlight' );
	});
	$(document).on( 'mouseout', mw.config.get( 'bsgExportTablesMenuTargetSelector' ), function( e ) {
		$(this).removeClass( 'bs-et-highlight' );
	});

})( mediaWiki, jQuery, blueSpice);