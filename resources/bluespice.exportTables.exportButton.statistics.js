( function ( mw ) {

	function _makeHTMLTableProvider( data ) {
		return {
			getHTMLTable: function() {
				var dfd = $.Deferred();
				html = '<table>';
				data.forEach(row => {
					entry = '<tr>';
					elements = row.split( ',' );
					elements.forEach( element => {
						entry += '<td>' + element + '</td>';
					} );
					entry += '<tr>';
					html += entry;
				});
				dfd.resolve( html );
				return dfd;
			}
		};
	}

	function _convertToCsvArray( originData ) {
		if ( originData.length === 0 ) {
			return [];
		}
		var keys = Object.keys( originData[0] );
		var valueKeys = [];
		keys.forEach( function ( key ) {
			if ( !Array.isArray( originData[0][ key ] ) ) {
				valueKeys.push( key );
			}
		} );
		var csvArray = [ valueKeys.toString() ];

		originData.forEach( function (d) {
			var dataString = '';
			valueKeys.forEach( function ( key ) {
				dataString += d[key] + ',';
			} );
			dataString = dataString.slice( 0, dataString.length - 1 );
			csvArray.push( dataString );
		} );

		return csvArray;
	}

	mw.hook( 'aggregatedstatistics.addUI' ).add( function ( data ) {
		var $button =  $('#export-statistics');
		data = _convertToCsvArray( data );
		if ( $button.length === 0 ) {
			var exportButton = new OO.ui.ButtonWidget( {
				id: 'export-statistics',
				label: mw.message( 'bs-exporttables-statistics-btn-text' ).text(),
				icon: 'expand'
			} );
			$( '#statistic-selector' ).after( exportButton.$element );
			if ( data.length === 0 ) {
				exportButton.setDisabled( true );
			}
		} else {
			if ( data.length === 0 ) {
				if ( !$button.hasClass( 'oo-ui-widget-disabled') ) {
					$button.removeClass( 'oo-ui-widget-enabled' );
					$button.addClass( 'oo-ui-widget-disabled' );

					var $icon = $( $button.children()[0] ).children()[0];
					if ( !$( $icon ).hasClass( 'oo-ui-image-invert' ) ) {
						$( $icon ).addClass( 'oo-ui-image-invert' );
					}
				}
			} else {
				if ( !$button.hasClass( 'oo-ui-widget-enabled') ) {
					$button.removeClass( 'oo-ui-widget-disabled' );
					$button.addClass( 'oo-ui-widget-enabled' );

					var $icon = $( $button.children()[0] ).children()[0];
					if ( $( $icon ).hasClass( 'oo-ui-image-invert' ) ) {
						$( $icon ).removeClass( 'oo-ui-image-invert' );
					}
				}
			}
		}

		$( '#export-statistics' ).on( 'click', function( e ) {
			var $button = $( e.currentTarget );
			mw.loader.using( 'ext.bluespice.extjs' ).done( function() {
				Ext.require( 'BS.ExportTables.menu.TableExport', function() {
					var menu = new BS.ExportTables.menu.TableExport({
						htmlTableProvider: _makeHTMLTableProvider( data )
					});

					xPos = $button.offset().left;
					yPos = $button.offset().top + $button.height()
					menu.showAt( xPos, yPos );
				}, this);
			});
		} );
	} );

}( mediaWiki ) );
