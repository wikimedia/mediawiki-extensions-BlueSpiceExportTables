( function ( mw ) {
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
		data = _convertToCsvArray( data );
		var menu = new bs.exportTables.ExportMenu( {
			dataProvider: function() {
				const dfd = $.Deferred();
				let html = '<table>';
				data.forEach(row => {
					let entry = '<tr>';
					let elements = row.split( ',' );
					elements.forEach( element => {
						entry += '<td>' + element + '</td>';
					} );
					entry += '<tr>';
					html += entry;
				});
				dfd.resolve( html );
				return dfd;
			}
		} );

		var panel = new OO.ui.PanelLayout( { padded: true, expanded: false } );
		panel.$element.append( menu.$element );

		var exportTool = new OO.ui.PopupButtonWidget( {
			icon: 'download',
			indicator: 'down',
			framed: true,
			flags:[ 'primary', 'progressive' ],
			label: mw.message( 'bs-exporttables-statistics-btn-text' ).text(),
			tabIndex: 0,
			popup: {
				$content: panel.$element,
				padded: false,
				autoFlip: true,
				verticalPosition: 'top'
			}
		} );
		exportTool.setDisabled( data.length === 0 );
		$( '#statistic-selector' ).after( exportTool.$element );
	} );

}( mediaWiki ) );
