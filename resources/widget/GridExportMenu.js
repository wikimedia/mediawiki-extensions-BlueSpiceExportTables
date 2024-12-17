window.bs = window.bs || {};
window.bs.exportTables = window.bs.exportTables || {};

bs.exportTables.GridExportMenu = function ( config ) {
	this.grid = config.grid;
	bs.exportTables.GridExportMenu.super.call( this, config );
};

OO.inheritClass( bs.exportTables.GridExportMenu, bs.exportTables.ExportMenu);

bs.exportTables.GridExportMenu.prototype.export = function( mode ) {
	this.grid.setLoading( true );
	bs.exportTables.GridExportMenu.super.prototype.export.call( this, mode ).then( function () {
		this.grid.setLoading( false );
	}.bind( this ) );
};

bs.exportTables.GridExportMenu.prototype.provideDataTable = function() {
	if ( typeof this.dataProvider === 'function' ) {
		return this.dataProvider();
	}
	if ( typeof this.grid.provideExportData === 'function' ) {
		return this.grid.provideExportData();
	}
	var $dfd = $.Deferred(),
		$tmp = $( '<div>' ).append( this.grid.$table.clone() );
	$dfd.resolve( $tmp.html() );
	return $dfd.promise();
};
