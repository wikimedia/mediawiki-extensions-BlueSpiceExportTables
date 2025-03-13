( function ( mw ) {
	function _convertToCsvArray( originData ) { // eslint-disable-line no-underscore-dangle
		if ( originData.length === 0 ) {
			return [];
		}
		const keys = Object.keys( originData[ 0 ] );
		const valueKeys = [];
		keys.forEach( ( key ) => {
			if ( !Array.isArray( originData[ 0 ][ key ] ) ) {
				valueKeys.push( key );
			}
		} );
		const csvArray = [ valueKeys.toString() ];

		originData.forEach( ( d ) => {
			let dataString = '';
			valueKeys.forEach( ( key ) => {
				dataString += d[ key ] + ',';
			} );
			dataString = dataString.slice( 0, dataString.length - 1 );
			csvArray.push( dataString );
		} );

		return csvArray;
	}

	function _createExportTool( data ) { // eslint-disable-line no-underscore-dangle
		data = _convertToCsvArray( data );
		const menu = new bs.exportTables.ExportMenu( {
			dataProvider: function () {
				const dfd = $.Deferred();
				let html = '<table>';
				data.forEach( ( row ) => {
					let entry = '<tr>';
					const elements = row.split( ',' );
					elements.forEach( ( element ) => {
						entry += '<td>' + element + '</td>';
					} );
					entry += '<tr>';
					html += entry;
				} );
				dfd.resolve( html );
				return dfd;
			}
		} );

		const panel = new OO.ui.PanelLayout( { padded: true, expanded: false } );
		panel.$element.append( menu.$element );

		const exportTool = new OO.ui.PopupButtonWidget( {
			icon: 'download',
			indicator: 'down',
			framed: true,
			flags: [ 'primary', 'progressive' ],
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

		return exportTool;
	}

	mw.hook( 'aggregatedstatistics.addUI' ).add( ( data ) => {
		const exportTool = _createExportTool( data );
		const $selector = $( '#statistic-selector' );
		$selector.next( '.export-tool' ).remove();
		$selector.after( exportTool.$element.addClass( 'export-tool' ) );
	} );

}( mediaWiki ) );
