$( () => {
	let panel = null;
	const mode = 'button'; // 'button' or 'contextmenu

	function _removeMenu() { // eslint-disable-line no-underscore-dangle
		if ( panel ) {
			panel.$element.remove();
			panel = null;
		}
	}

	function _prepareTable( $table ) { // eslint-disable-line no-underscore-dangle
		const $clone = $table.clone();
		// remove style attribut 'width' for th and td
		const $cells = $clone.find( 'th, td' );
		for ( let i = 0; i < $cells.length; i++ ) {
			const style = $cells[ i ].style;
			if ( style.width ) {
				style.width = '';

			}
		}
		return $clone;
	}

	function _getMenu( $table ) { // eslint-disable-line no-underscore-dangle
		return new bs.exportTables.ExportMenu( {
			dataProvider: function () {
				const dfd = $.Deferred();
				dfd.resolve( '<table>' + $table.html() + '</table>' );
				return dfd;
			}
		} );
	}

	if ( mode === 'button' ) {
		$( mw.config.get( 'bsgExportTablesMenuTargetSelector' ) ).each( function () {
			const $table = $( this );
			const $clone = _prepareTable( $table );
			const menu = _getMenu( $clone );
			panel = new OO.ui.PanelLayout( { padded: true, expanded: false } );
			panel.$element.append( menu.$element );
			const exportTool = new OO.ui.PopupButtonWidget( {
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
			$table.find( 'tbody' ).last().after( exportTool.$element );
		} );
	} else if ( mode === 'contextmenu' ) {
		$( document ).on( 'contextmenu', mw.config.get( 'bsgExportTablesMenuTargetSelector' ), function ( e ) {
			_removeMenu();
			if ( e.ctrlKey ) {
				return true;
			}
			const $table = $( this );
			const $clone = _prepareTable( $table );
			const menu = _getMenu( $clone );
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
		$( document ).on( 'click', () => {
			_removeMenu();
		} );
		$( window ).on( 'scroll', () => {
			_removeMenu();
		} );

		$( document ).on( 'mouseover', mw.config.get( 'bsgExportTablesMenuTargetSelector' ), function () {
			$( this ).addClass( 'bs-et-highlight' );
		} );
		$( document ).on( 'mouseout', mw.config.get( 'bsgExportTablesMenuTargetSelector' ), function () {
			$( this ).removeClass( 'bs-et-highlight' );
		} );
	}
} );
