
<div class="section">
	<h3>Add</h3>
	<form action="create.todo" id="create_todo" method="POST">
		<textarea name="message"></textarea>
		<input type="submit" name="submit" value="submit" >
	</form>
</div>


<div class="section">
	<h3>Categories</h3>
	<ul class="categories">
		<?php
			foreach($categories as $cat){
				echo "<li id='cat_{$cat['id']}'>{$cat['name']}</li>";
			}
		?>
	</ul>
</div>

<div class="section">
	<h3>View</h3>
	<ul>
		<li>All</li>
		<li>Completed</li>
		<li>Incomplete</li>
		<li>Over Due</li>
		<li>Near Due</li>
	</ul>
</div>

<div class="section">
	<h3>Search</h3>
	<input type="text" name="search"> <input type="submit" name="submit" value="submit">
</div>
