mw.hook( 'oojsplus.grid.init' ).add( ( grid, cfg ) => {
	const exportable = cfg.exportable || false;
	if ( !exportable ) {
		return;
	}
	const menu = new bs.exportTables.GridExportMenu( {
		grid: grid,
		dataProvider: cfg.provideExportData || false
	} );

	const panel = new OO.ui.PanelLayout( { padded: true, expanded: false } );
	panel.$element.append( menu.$element );

	const exportTool = new OO.ui.PopupButtonWidget( {
		icon: 'download',
		framed: false,
		label: mw.message( 'bs-exporttables-oojs-btn-aria-label' ).text(),
		invisibleLabel: true,
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
