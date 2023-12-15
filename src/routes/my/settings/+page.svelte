<script>
	export let data;

	let lang = data.lang;

	const changeSetting = (e) => {
		const option = e.target.name;
		const value = e.target.value;
		const formData = new FormData();
		formData.append(option, value);
		fetch('/my/settings/change', {
			method: 'POST',
			body: formData
		});
	};
</script>

<h1>Settings</h1>
<div class="divider m-0"></div>
<div class="p-4">
	Here you can find all settings related to your account.
	<div class="grid grid-cols-2 gap-4 p-4">
		<div>Language</div>
		<select name="lang" id="lang" class="select" on:change={changeSetting} bind:value={lang}>
			<option value="en-uk">English (UK)</option>
			<option value="en-us">English (US)</option>
			<option value="de">German</option>
		</select>
	</div>
</div>
