<?php

namespace BlueSpice\ExportTables\HookHandlers\BeforePageDisplay;

use MediaWiki\MediaWikiServices;
use MediaWiki\Output\Hook\BeforePageDisplayHook;

class AddResources implements BeforePageDisplayHook {

	/**
	 * @inheritDoc
	 */
	public function onBeforePageDisplay( $out, $skin ): void {
		$title = $out->getTitle();
		if (
			!$title ||
			!$title->exists() ||
			!$title->isContentPage()
		) {
			return;
		}

		$out->addModuleStyles( [ 'ext.bluespice.exportTables.contentTables.styles' ] );
		$out->addModules( [ 'ext.bluespice.exportTables.main' ] );

		$config = MediaWikiServices::getInstance()->getConfigFactory()->makeConfig( 'bsg' );
		$out->addJsConfigVars(
			'bsgExportTablesMenuTargetSelector',
			$config->get( 'ExportTablesMenuTargetSelector' )
		);
	}

}
