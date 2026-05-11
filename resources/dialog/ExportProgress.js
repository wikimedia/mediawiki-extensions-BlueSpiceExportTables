window.bs = window.bs || {};
window.bs.exportTables = window.bs.exportTables || {};

bs.exportTables.ExportProgressDialog = function ( config ) {
	bs.exportTables.ExportProgressDialog.super.call( this, config );
};

OO.inheritClass( bs.exportTables.ExportProgressDialog, OO.ui.Dialog );

bs.exportTables.ExportProgressDialog.static.name = 'exportProgress';

bs.exportTables.ExportProgressDialog.prototype.initialize = function () {
	bs.exportTables.ExportProgressDialog.super.prototype.initialize.call( this );

	this.content = new OO.ui.PanelLayout( {
		expanded: false,
		padded: true,
		classes: [ 'bs-exporttables-progress-dialog-content' ]
	} );
	this.content.$element.append(
		new OO.ui.LabelWidget( {
			label: mw.message( 'bs-exporttables-loading-text' ).text()
		} ).$element,
		new OO.ui.ProgressBarWidget( {
			progress: false
		} ).$element
	);

	this.$element.addClass( 'bs-exporttables-progress-dialog' );
	this.$body.append( this.content.$element );
};

bs.exportTables.ExportProgressDialog.prototype.onError = function () {
	const closeButton = new OO.ui.ButtonWidget( {
		title: mw.message( 'bs-exporttables-close-button' ).text(),
		icon: 'close',
		framed: false
	} );
	closeButton.connect( this, {
		click: 'close'
	} );
	this.$head.append( closeButton.$element );
	this.content.$element.addClass( 'error' );

	this.content.$element.empty();
	this.content.$element.append(
		new OO.ui.MessageWidget( {
			type: 'error',
			label: mw.message( 'bs-exporttables-export-error' ).text()
		} ).$element
	);
	this.updateSize();
};
