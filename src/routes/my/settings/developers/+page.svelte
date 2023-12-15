<script>
	export let data;

	let developermode = data.settings?.developermode ?? false;

	function changeToggleSetting(e) {
		const target = e.target;
		const option = target.name;
		const value = target.checked;
		const formData = new FormData();
		formData.append(option, value);
		fetch('/my/settings/change', {
			method: 'POST',
			body: formData
		});
	}
</script>

<h1>Developer Settings</h1>
<div class="divider m-0"></div>
<div class="grid grid-cols-2 gap-4 p-4">
	<div>Enable Developer Mode</div>
	<input
		type="checkbox"
		name="developermode"
		class="toggle toggle-primary"
		on:change={changeToggleSetting}
		bind:checked={developermode} />
</div>
