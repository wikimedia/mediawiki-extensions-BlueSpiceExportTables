window.bs = window.bs || {};
window.bs.exportTables = window.bs.exportTables || {};

bs.exportTables.ExportMenu = function ( config ) {
	// Parent constructor
	bs.exportTables.ExportMenu.super.call( this, config );
	this.grid = config.grid;
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
	this.showExportProgressDialog = config.showExportProgressDialog || false;
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
	if ( !mode ) {
		return;
	}
	this.grid.setLoading( true );
	this.maybeShowProgressDialog();
	// Get the data to export:
	// 1. Use cfg.provideExportData callback if passed in the grid config, or
	// 2. Use providerExportData function of the grid, if available, or
	// 3. Fallback to local function
	this.dataPromise =
		typeof this.dataProvider === 'function' ? this.dataProvider() :
			typeof this.grid.provideExportData === 'function' ? this.grid.provideExportData() :
				this.provideDataTable();

	this.dataPromise.done( function( $table ) {
		var url = mw.util.getUrl( 'Special:UniversalExport/' + mw.config.get('wgPageName'), {
			'ue[module]': 'table2excel'
		} );

		var formElements = [
			new OO.ui.HiddenInputWidget( { name: 'ModeFrom', value: 'html' } ),
			new OO.ui.HiddenInputWidget( { name: 'ModeTo', value: mode } ),
			new OO.ui.HiddenInputWidget( { name: 'content', value: $table } ),
		];

		var formLayout = new OO.ui.FormLayout( {
			items: formElements,
			action: url,
			method: 'post'
		} );
		this.$element.append( formLayout.$element );
		formLayout.$element.submit();
		formLayout.$element.remove();
		this.grid.setLoading( false );
		this.maybeHideProgressDialog();
	}.bind( this ) ).fail( function() {
		console.error( 'Failed to retrieve data for export' );
		this.grid.setLoading( false );
		this.maybeHideProgressDialog();
	}.bind( this ) );
};

bs.exportTables.ExportMenu.prototype.provideDataTable = function() {
	var $dfd = $.Deferred(),
		$tmp = $( '<div>' ).append( this.grid.$table.clone() );
	$dfd.resolve( $tmp.html() );
	return $dfd.promise();
};

bs.exportTables.ExportMenu.prototype.maybeShowProgressDialog = function() {
	if ( !this.showExportProgressDialog ) {
		return;
	}
	this.progressDialog = new bs.exportTables.ExportProgressDialog( {
		size: 'medium'
	} );
	const windowManager = new OO.ui.WindowManager();
	$( document.body ).append( windowManager.$element );
	windowManager.addWindows( [ this.progressDialog ] );
	// Open the window!
	windowManager.openWindow( this.progressDialog );
};

bs.exportTables.ExportMenu.prototype.maybeHideProgressDialog = function() {
	if ( !this.progressDialog ) {
		return;
	}
	setTimeout( () => {
		// Make sure dialog doesn't flicker
		this.progressDialog.close();
	}, 1000 );
};
