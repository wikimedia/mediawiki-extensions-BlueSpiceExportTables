<?php

namespace BlueSpice\ExportTables\HookHandlers\BeforePageDisplay;

use MediaWiki\Config\Config;
use MediaWiki\Config\ConfigFactory;
use MediaWiki\Output\Hook\BeforePageDisplayHook;

class AddResources implements BeforePageDisplayHook {

	/** @var Config */
	private Config $config;

	public function __construct( ConfigFactory $configFactory ) {
		$this->config = $configFactory->makeConfig( 'bsg' );
	}

	/**
	 * @inheritDoc
	 */
	public function onBeforePageDisplay( $out, $skin ): void {
		$out->addModuleStyles( [ 'ext.bluespice.exportTables.contentTables.styles' ] );
		$out->addModules( [ 'ext.bluespice.exportTables.main' ] );
		$out->addJsConfigVars(
			'bsgExportTablesMenuTargetSelector',
			$this->config->get( 'ExportTablesMenuTargetSelector' )
		);
	}

}
