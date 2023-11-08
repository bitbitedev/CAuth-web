<script>
	export let data;
</script>

<div id="content">
	<menu>
		<a href="/my" class="btn mt-1">Profile</a>
		<a href="/my/activities" class="btn mt-1">Activities</a>
		<!-- <a href="/my/history">Access history</a> -->
		<a href="/my/settings" class="btn mt-1">Settings</a>
		{#if data.settings?.developermode}
			<div class="divider" />
			<a href="/my/platform" class="btn mt-1">My Platforms</a>
		{/if}
	</menu>
	<main>
		<slot />
	</main>
</div>

<style lang="postcss">
	#content {
		display: grid;
		grid-template: 1fr / 200px 1fr;
		height: 100%;

		menu {
			@apply bg-base-200;
			@apply p-4;
			display: flex;
			flex-direction: column;
		}
		main {
			@apply p-4;
		}
	}
</style>
