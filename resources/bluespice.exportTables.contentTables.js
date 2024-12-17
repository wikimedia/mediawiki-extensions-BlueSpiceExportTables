$( function() {
	var panel = null,
		mode = 'button'; // 'button' or 'contextmenu

	function _removeMenu() {
		if ( panel ) {
			panel.$element.remove();
			panel = null;
		}
	}

	function _prepareTable( $table ) {
		var $clone = $table.clone();
		// remove style attribut 'width' for th and td
		var cells = $clone.find( 'th, td' );
		for ( var i = 0; i < cells.length; i++ ) {
			var style = cells[ i ].style;
			if ( style.width ) {
				style.width = '';

			}
		}
		return $clone;
	}

	function _getMenu( $table ) {
		return new bs.exportTables.ExportMenu( {
			dataProvider: function() {
				var dfd = $.Deferred();
				dfd.resolve( '<table>' + $table.html() + '</table>' );
				return dfd;
			}
		} );
	}

	if ( mode === 'button' ) {
		$( mw.config.get( 'bsgExportTablesMenuTargetSelector' ) ).each( function() {
			var $table = $( this );
			var $clone = _prepareTable( $table );
			var menu = _getMenu( $clone );
			panel = new OO.ui.PanelLayout( { padded: true, expanded: false } );
			panel.$element.append( menu.$element );
			var exportTool = new OO.ui.PopupButtonWidget( {
				icon: 'download',
				framed: false,
				label: mw.message( 'bs-exporttables-menu' ).text(),
				tabIndex: 0,
				$overlay: true,
				popup: {
					$overlay: true,
					$content: panel.$element,
					padded: false,
					autoFlip: true,
					verticalPosition: 'top'
				}
			} );
			$table.addClass( 'bsg-export-table' );
			$table.find( 'tbody' ).after( exportTool.$element );
		} );
	} else if ( mode === 'contextmenu' ) {
		$( document ).on( 'contextmenu', mw.config.get( 'bsgExportTablesMenuTargetSelector' ), function( e ) {
			_removeMenu();
			if( e.ctrlKey ) {
				return true;
			}
			var $table = $( this );
			var $clone = _prepareTable( $table );
			var menu = _getMenu( $clone );
			panel = new OO.ui.PanelLayout( { padded: true, expanded: false } );
			panel.$element.append( menu.$element );
			panel.$element.css( 'background-color', 'white' );

			// Show menu at e.pageX, e.pageY
			$( 'body' ).append( panel.$element );
			panel.$element.css( {
				position: 'absolute',
				top: e.pageY,
				left: e.pageX
			} );

			e.preventDefault();

			return false;
		} );
		$( document ).on( 'click', function( e ) { _removeMenu(); } );
		$( window ).scroll( function() { _removeMenu(); } );

		$( document ).on( 'mouseover', mw.config.get( 'bsgExportTablesMenuTargetSelector' ), function( e ) {
			$(this).addClass( 'bs-et-highlight' );
		});
		$( document ).on( 'mouseout', mw.config.get( 'bsgExportTablesMenuTargetSelector' ), function( e ) {
			$(this).removeClass( 'bs-et-highlight' );
		});
	}
} );