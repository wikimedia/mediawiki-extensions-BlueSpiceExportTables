window.bs = window.bs || {};
window.bs.exportTables = window.bs.exportTables || {};

bs.exportTables.ExportMenu = function ( config ) {
	// Parent constructor
	bs.exportTables.ExportMenu.super.call( this, config );
	this.dataProvider = config.dataProvider || false;

	var modes = $.extend( {
		csv:  {
			label: mw.message('bs-exporttables-menu-csv').plain(),
			classes: ['export-button'],
			icon: 'csv'
		},
		xls:  {
			label: mw.message('bs-exporttables-menu-xls').plain(),
			classes: ['export-button'],
			icon: 'xls'
		},
		xlsx: {
			label: mw.message('bs-exporttables-menu-xlsx').plain(),
			classes: ['export-button'],
			icon: 'xlsx'
		}
	}, config.exportModes || {} );
	this.init( modes );
};

/* Inheritance */
OO.inheritClass( bs.exportTables.ExportMenu, OO.ui.Widget );

bs.exportTables.ExportMenu.prototype.init = function( modes ) {
	for ( var key in modes ) {
		if ( modes.hasOwnProperty( key ) ) {
			this.addMenuItem( key, modes[ key ] );
		}
	}
};

bs.exportTables.ExportMenu.prototype.addMenuItem = function( key, data ) {
	data.data = data.data || {};
	data.data.exportMode = key;
	data.framed = false;
	var button = new OO.ui.ButtonWidget( data ),
		menu = this;
	button.connect( button, {
		click: function() {
			menu.export( this.getData().exportMode );
		}
	} );
	button.$element.css( 'display', 'block' );
	// Fix for common OOJS layout issue
	button.$element.css( 'margin-left', 0 );
	this.$element.append( button.$element );
};

bs.exportTables.ExportMenu.prototype.export = function( mode ) {
	const dfd = $.Deferred();
	if ( !mode ) {
		return dfd.reject().promise();
	}
	// Get the data to export:
	// 1. Use cfg.provideExportData callback if passed in the grid config, or
	// 2. Use providerExportData function of the grid, if available, or
	// 3. Fallback to local function
	this.dataPromise = this.provideDataTable();
	this.dataPromise.done( function( $table ) {
		this.download( mode, $table )
		.done( async ( response, statusText, jqXHR ) => {
			const filename = jqXHR.getResponseHeader( 'X-Filename' ) || mw.config.get( 'wgPageName' ) + '.pdf';

			const url = window.URL.createObjectURL( response );
			const a = document.createElement( 'a' );
			a.href = url;
			a.download = filename;
			document.body.appendChild( a );
			a.click();
			a.remove();

			window.URL.revokeObjectURL( url );
			dfd.resolve();
		} )
		.fail( () => {
			console.error( 'Failed to download data for export' );
			dfd.reject();
		} );
	}.bind( this ) ).fail( function() {
		console.error( 'Failed to retrieve data for export' );
		dfd.reject();
	}.bind( this ) );

	return dfd.promise();
};

bs.exportTables.ExportMenu.prototype.provideDataTable = function() {
	if ( !this.dataProvider ) {
		return $.Deferred().reject().promise();
	}
	return this.dataProvider();
};

bs.exportTables.ExportMenu.prototype.download = function( mode, data ) {
	data = data || {};
	const dfd = $.Deferred();
	$.ajax( {
		method: 'POST',
		url: this.getURL( mode ),
		data: JSON.stringify( { data: { 'content': data } } ),
		contentType: 'application/json',
		accept: 'application/' + mode,
		xhrFields: {
			responseType: 'blob' // Explicitly handle binary data as a Blob
		}
	} ).done( ( response, statusText, jqXHR ) => {
		if ( typeof response === 'object' && response.success === false ) {
			dfd.reject();
			return;
		}
		dfd.resolve( response, statusText, jqXHR );
	} ).fail( ( jgXHR, type, status ) => {
		console.error( jgXHR, type, status );
		if ( type === 'error' ) {
			dfd.reject( {
				error: jgXHR.responseJSON || jgXHR.responseText
			} );
		}
		dfd.reject( { type: type, status: status } );
	} );

	return dfd.promise();
};

bs.exportTables.ExportMenu.prototype.getURL = function( mode ) {
	return mw.util.wikiScript( 'rest' ) + '/table2excel/' + mode;
};
