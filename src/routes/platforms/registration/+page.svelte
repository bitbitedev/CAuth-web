<script>
	import Private from '../components/platform/registration/Private.svelte';
	import Organization from '../components/platform/registration/Organization.svelte';

	let value = '';

	function loadForm() {
		if(value == 'organization') {
			let domElement = Document.getElementById('tbody');
			domElement.insertAdjacentHTML('beforeend', '<tr><td> some text test </td></tr>');
		} else if(value == 'private') {
			let domElement = Document.getElementById('tbody');
			domElement.insertAdjacentHTML('beforeend', '<tr><td> some more text test </td></tr>');
		}
	}

	function doSomething() {}
</script>


<div id="getting-started">
	Please fill in the form. <!-- or some other garbage text, if needed -->
	<form on:submit={doSomething}>
		<table>
			<tbody id="tbody">
				<tr>
					<td>
						I am
					</td>
					<td>
						<select on:change={() => loadForm()}>
							<option default value="organization">an organization.</option>
							<option value="private">a private person.</option>
						</select>
					</td>
				</tr>
				{#if value == 'organization'}
					<Organization />
				{:else}
					{#if value == 'private'}
						<Private />
					{:else}
						<tr><td>Error: Something went wrong and we can just guess what happened, sorry.</td></tr>
					{/if}
				{/if}
			</tbody>
		</table>
		<button type="submit">
			Hit me up!
		</button>
	</form>
</div>