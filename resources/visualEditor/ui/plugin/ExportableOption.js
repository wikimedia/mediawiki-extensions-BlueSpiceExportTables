bs.util.registerNamespace( 'visualEditor.ui.plugin' );

// extend document model
ve.dm.MWTableNode.static.classAttributes['bs-exportable'] = { exportable: true };

visualEditor.ui.plugin.ExportableOption = function BsExptblUiExportableOption( config ) {
	visualEditor.ui.plugin.ExportableOption.super.call( this, config );
};

OO.inheritClass( visualEditor.ui.plugin.ExportableOption, bs.vec.ui.plugin.MWTableDialog );

visualEditor.ui.plugin.ExportableOption.prototype.initialize = function() {
	var exportableField;

	this.component.exportableToggle = new OO.ui.ToggleSwitchWidget();
	exportableField = new OO.ui.FieldLayout( this.component.exportableToggle, {
		align: 'left',
		label: ve.msg( 'bs-exporttables-ve-exportable-option' )
	} );

	this.component.exportableToggle.connect( this.component, { change: 'updateActions' } );
	this.component.panel.$element.append( exportableField.$element );
};

visualEditor.ui.plugin.ExportableOption.prototype.getValues = function( values ) {
	return ve.extendObject( values, {
		exportable: this.component.exportableToggle.getValue()
	} );
};

visualEditor.ui.plugin.ExportableOption.prototype.getSetupProcess = function( parentProcess, data ) {
	parentProcess.next( function(){
		var tableNode = this.component.getFragment().getSelection().getTableNode( this.component.getFragment().document ),
			exportable = !!tableNode.getAttribute( 'exportable' );

		this.component.exportableToggle.setValue( exportable );

		ve.extendObject( this.component.initialValues, {
			exportable: exportable
		} );
	}, this );
	return parentProcess;
};

visualEditor.ui.plugin.ExportableOption.prototype.getActionProcess = function( parentProcess, action ) {
	parentProcess.next( function(){
		var surfaceModel, fragment;
		if ( action === 'done' ) {
			surfaceModel = this.component.getFragment().getSurface();
			fragment = surfaceModel.getLinearFragment(
				this.component.getFragment().getSelection().tableRange, true
			);
			fragment.changeAttributes( {
				exportable: this.component.exportableToggle.getValue()
			} );
		}
	}, this );
	return parentProcess;
};

bs.vec.registerComponentPlugin(
	bs.vec.components.TABLE_DIALOG,
	function( component ) {
		return new visualEditor.ui.plugin.ExportableOption( component );
	}
);
