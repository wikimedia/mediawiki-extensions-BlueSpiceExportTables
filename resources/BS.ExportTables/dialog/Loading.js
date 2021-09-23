Ext.define( 'BS.ExportTables.dialog.Loading', {
	extend: 'BS.SimpleDialog',
	idPrefix: 'export-table-loading',
	titleMsg: 'bs-exporttables-loading-title',

	afterInitComponent: function () {
		this.cntMain.add( {
			html: mw.message( 'bs-exporttables-loading-text' ).text(),
			border: false,
			margin: '5px'
		} );
	},
});