mw.hook( 'oojsplus.grid.init' ).add( function( grid, cfg ) {
	var exportable = cfg.exportable || false;
	if ( !exportable ) {
		return;
	}
	var menu = new bs.exportTables.ExportMenu( {
		grid: grid,
		dataProvider: cfg.provideExportData || false
	} );

	var panel = new OO.ui.PanelLayout( { padded: true, expanded: false } );
	panel.$element.append( menu.$element );

	var exportTool = new OO.ui.PopupButtonWidget( {
		icon: 'download',
		framed: false,
		popup: {
			$content: panel.$element,
			padded: false,
			align: 'backwards',
			autoFlip: true,
			verticalPosition: 'top'
		}
	} );

	cfg.tools = cfg.tools || [];
	cfg.tools.push( exportTool );
} );
