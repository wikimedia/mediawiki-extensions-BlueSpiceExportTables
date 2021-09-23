( function( mw, $, d ) {
	var dataProvider = function( sender, batchSize ) {
		this.batchSize = batchSize || 200;
		this.sender = sender;
	};

	dataProvider.prototype.getData = function () {
		var dfd = $.Deferred();

		this.dataColumns = [];
		this.queryParams = this.sender.strMain.getProxy().getLastRequest().getParams();
		this.queryParams.start = 0;
		this.queryParams.limit = this.batchSize;

		var columns = this.sender.grdMain.columns;
		for( var i = 0; i < columns.length; i++ ) {
			col = columns[i];
			if( col instanceof Ext.grid.ActionColumn )
				continue;

			if( col.hidden === true )
				continue;

			this.dataColumns.push( col );
		}


		var url = this.sender.strMain.getProxy().getLastRequest().getUrl(), //TODO: Modify _dc flag!
			data = [];
		this.query( data, dfd, url, 0 );

		return dfd.promise();
	};

	dataProvider.prototype.query = function ( data, dfd, url, start ) {
		Ext.Ajax.request( {
			url: url,
			params: $.extend( {}, this.queryParams, { start: start } ),
			success: function( response ) {
				if ( !response.hasOwnProperty( 'responseText' ) ) {
					dfd.reject();
					return;
				}
				response = JSON.parse( response.responseText );
				if ( response.results.length === 0 ) {
					dfd.resolve( data );
					return;
				}

				data = data.concat( response.results );
				this.query( data, dfd, url, start + this.batchSize + 1 );
			}.bind( this ),
			fail: function() {
				dfd.reject();
			}
		} );
	};

	dataProvider.prototype.getHTMLTable = function () {
		this.setLoading( true );
		var dfd = $.Deferred();
		this.getData().done( function( data ) {
			this.generateTable( data ).done( function( table ) {
				this.setLoading( false );
				dfd.resolve( table );
			}.bind( this ) );
		}.bind( this ) ).fail( function() {
			this.setLoading( false );
			dfd.reject();
		}.bind( this ) );

		return dfd.promise();
	};

	dataProvider.prototype.setLoading = function ( loading ) {
		if ( loading ) {
			if ( !this.loadingWin ) {
				this.loadingWin = Ext.create( 'BS.ExportTables.dialog.Loading' );
				this.loadingWin.show();
			}
		} else {
			this.loadingWin.destroy();
		}
	};

	dataProvider.prototype.generateTable = function ( data ) {
		var dfd = $.Deferred(),
			$table = $('<table>'), $row = null, $cell = null,
			record = null, column, i, value;

		$row = $('<tr>');
		$table.append($row);
		for( i = 0; i < this.dataColumns.length; i++ ) {
			column = this.dataColumns[i];
			$cell = $('<td>');
			$row.append( $cell );
			$cell.append( column.header || column.text );
		}

		for( i = 0; i < data.length; i++ ) {
			var row = data[i];
			$row = $('<tr>');
			record = new this.sender.strMain.model( row );
			$table.append($row);
			for( j = 0; j < this.dataColumns.length; j++ ) {
				column = this.dataColumns[j];
				$cell = $('<td>');
				$row.append( $cell );
				if( column.renderer && Ext.isFunction( column.renderer ) ) {
					value = column.renderer(
						row[column.dataIndex],
						{}, //Cell meta... we don't have any
						record,
						i,
						j,
						this.sender.strMain,
						this.sender.grdMain.getView()
					);
				}
				else {
					value = row[column.dataIndex];
				}
				$cell.append( value );
			}
		}

		dfd.resolve( '<table>' + $table.html() + '</table>' );

		return dfd.promise();
	};

$( d ).on('BSCRUDPanelInitComponent', function( e, sender ) {
	if( typeof(BS.CRUDGridPanel) === "undefined" || sender instanceof BS.CRUDGridPanel === false ) {
		return;
	}

	var provider = sender.getHTMLTable
		? sender
		: new dataProvider( sender );
	if( sender.tbar ) {
		sender.tbar.add( '->' );
		sender.tbar.add( {
			text: mw.message('bs-exporttables-menu').plain(),
			menu: Ext.create('BS.ExportTables.menu.TableExport',{
				htmlTableProvider: provider
			})
		} );
		return;
	}
	if( sender.bbMain ) {
		sender.bbMain.add( '->' );
		sender.bbMain.add( {
			text: mw.message('bs-exporttables-menu').plain(),
			menu: Ext.create('BS.ExportTables.menu.TableExport',{
				htmlTableProvider: provider
			})
		} );
	}
});

$( d ).on('BSPanelInitComponent', function( e, sender ) {
	if( typeof sender === 'undefined' || !sender.getHTMLTable ) {
		return;
	}
	var provider = sender.getHTMLTable
		? sender
		: new dataProvider( sender );

	if( sender.tbar ) {
		sender.tbar.add( '->' );
		sender.tbar.add( {
			text: mw.message('bs-exporttables-menu').plain(),
			menu: Ext.create('BS.ExportTables.menu.TableExport',{
				htmlTableProvider: provider
			})
		} );
		return;
	}
	if( sender.bbMain ) {
		sender.bbMain.add( '->' );
		sender.bbMain.add( {
			text: mw.message('bs-exporttables-menu').plain(),
			menu: Ext.create('BS.ExportTables.menu.TableExport',{
				htmlTableProvider: provider
			})
		} );
	}
});

$( d ).on('BSPermissionManagerAfterInitComponent', function( e, sender ) {
	var provider = sender.getHTMLTable
		? sender
		: new dataProvider( sender );

	sender.tbar.push( {
		text: mw.message('bs-exporttables-menu').plain(),
		menu: Ext.create('BS.ExportTables.menu.TableExport',{
			htmlTableProvider: provider
		})
	} );
});

$( d ).on ( 'BSFlaggedRevsConnectorGridInit', function( e, grid ) {
	grid.tbar = [ '->', {
		text: mw.message('bs-exporttables-menu').plain(),
		menu: Ext.create('BS.ExportTables.menu.TableExport', {
			htmlTableProvider: grid
		} )
	} ];
} );

} )( mediaWiki, jQuery, document );
