<script>
	import { onMount, onDestroy } from 'svelte';
	import { ucfirst } from '$lib/utils';

	export let data;

	let pendingAuths = [];
	let pendingAuthsInterval;

	onMount(() => {
		pendingAuthsInterval = setInterval(async () => {
			pendingAuths = await (await fetch('/api/v1/pendingAuths')).json();
		}, 1000);
	});
	onDestroy(() => {
		clearInterval(pendingAuthsInterval);
	});
</script>

<div class="card bg-base-100">
	<div class="card-body">
		<div class="card-title">Profile</div>
		<div class="stats shadow-xl bg-base-300">
			<div class="stat">
				<div class="stat-title">Auth Requests this week</div>
				<div class="stat-value">{data.recentAuths.length}</div>
				<div class="stat-desc">since {data.firstDayOfWeek}</div>
			</div>
		</div>
	</div>
</div>
{#if pendingAuths?.length > 0}
	<div class="card bg-base-100 mt-4">
		<div class="card-body">
			<div class="card-title">Pending Auth Requests</div>
			<div class="flex flex-wrap">
				{#each pendingAuths as authRequest}
					<a href="/auth/{authRequest.id.split(':')[1]}?external" class="card bg-base-200">
						<div class="card-body">
							<div class="card-title">
								{ucfirst(authRequest.type)} at {authRequest.platform?.name ?? 'C-Auth'}
							</div>
							{new Date(authRequest.createdAt).toLocaleDateString(data.lang, {
								month: 'long',
								day: 'numeric',
								hour: 'numeric',
								minute: 'numeric',
							})}
						</div>
					</a>
				{/each}
			</div>
		</div>
	</div>
{/if}