<div class="main">
	<div class="tabs">
		<div class="tab<? if(($form == 'login') || ($action == 'log')){?> active<?}?>">Login</div>
		<div class="tab<? if(($form == 'add') || ($action == 'create' && $task = 'account' ) ){?> active<?}?>">Sign Up</div>
	</div>
	<div>
		<div class="border">
			<div class="tabContent">
				<? if($form == 'login'){ ?><div class="error">Invalid username or password.</div><? } ?>
				<form name="login" id="log_in" action="log.in" method="POST">
					<div class="row"><label>username</label><input class="text" type="text" name="user"></div>
					<div class="row"><label>password</label><input class="text" type="password" name="pass"></div>
					<div class="row"><input type="submit" name="login" value="submit"></div>
				</form>
			</div>
			<div class="tabContent">
				<? if($form == 'add'){ ?><div class="error">Invalid username or password.</div><? } ?>
				<form name="create" id="create_account" action="create.account" method="POST">
					<div class="row"><label>username</label><input class="text" type="text" name="user"><input class="check" type="submit" name="check" value="check"></div>
					<div class="row"><label>email</label><input class="text" type="text" name="email"></div>
					<div class="row"><label>password</label><input class="text" type="password" name="pass"></div>
					<div class="row"><label>password (confirm)</label><input class="text" type="password" name="confirm"></div>
<!--					<div class="row"><label>twitter username</label><input class="text" type="text" name="twitter_u"></div>
					<div class="row"><label>twitter password</label><input class="text" type="password" name="twitter_p"></div>  -->
 					<div class="row"><input type="submit" name="add" value="submit"></div>
				</form>
			</div>
		</div>
	</div>
</div>