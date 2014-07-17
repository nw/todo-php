	<div id="container">
	<div id="titlebar">
		<h1>TODO List</h1>
		<div id="nav">
			<? 
				if($authenticated) include(TEMPLATE_DIR.'nav/logged_in.tpl');
				else include(TEMPLATE_DIR.'nav/default.tpl'); 
			?>
		</div>
	</div>
	<? if($settings){ ?><div id="settings"><?= $settings; ?></div><? } ?>
		<div id="content">
			<?= $content; ?>
			<? if($sidebar){ ?><div id="sidebar"><?= $sidebar; ?></div><? } ?>
			<div id="footer"></div>
		</div>
	</div>
