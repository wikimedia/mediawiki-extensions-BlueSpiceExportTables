window.bs = window.bs || {};
window.bs.exportTables = window.bs.exportTables || {};

bs.exportTables.ExportProgressDialog = function( config ) {
	bs.exportTables.ExportProgressDialog.super.call( this, config );
};

OO.inheritClass( bs.exportTables.ExportProgressDialog, OO.ui.Dialog );

bs.exportTables.ExportProgressDialog.static.name = 'bs-exporttables-exportprogressdialog';

bs.exportTables.ExportProgressDialog.prototype.initialize = function() {
	bs.exportTables.ExportProgressDialog.super.prototype.initialize.apply( this, arguments );

	this.content = new OO.ui.PanelLayout( { padded: true, expanded: false } );
	this.content.$element.append( mw.msg( 'bs-exporttables-exportprogressdialog-content' ) );
	this.$body.append( this.content.$element );
};

bs.exportTables.ExportProgressDialog.prototype.getBodyHeight = function() {
	return this.content.$element.outerHeight( true );
};
