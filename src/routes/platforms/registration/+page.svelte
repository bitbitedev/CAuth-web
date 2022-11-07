<script>
	import Private from '$components/platforms/registration/Private.svelte';
	import Organization from '$components/platforms/registration/Organization.svelte';

	let value = 'organization';

	function doSomething() {}
</script>


<div class="content">
	<form on:submit={doSomething}>
		<table>
			<tbody>
				<tr>
					<td>
						I am
					</td>
					<td>
						<select bind:value={value}>
							<option value="organization">an organization.</option>
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