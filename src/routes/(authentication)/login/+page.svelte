<script>
	import { Input } from '$lib/components';
	import { enhance } from '$app/forms';

	export let data;

	let username = '';
	let error = '';
	let disabled = false;
</script>

<div class="flex h-full w-full items-center justify-center">
	<div class="card h-min w-min min-w-max bg-base-100 p-5 shadow-xl">
		<h2 class="mb-2 text-center text-3xl font-bold tracking-tight text-base-content">Login</h2>
		{#if data.platform}
			<div class="text-center alert text-md flex flex-col border-primary mb-4">
				<p>You are trying to login to a different plattform:</p>
				<span class="text-4xl font-bold">{data.platform.name}</span>
				<p>
					{data.platform.description}
				</p>
			</div>
		{/if}
		{#if error.length > 0}
			<div class="alert alert-error mb-5 mt-5 shadow-lg">
				<div>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6 flex-shrink-0 stroke-current"
						fill="none"
						viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<span>Error: {error}</span>
				</div>
			</div>
		{/if}
		{#if data.loggedIn && data.platform}
			<div role="alert" class="alert alert-info">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					class="stroke-current shrink-0 w-6 h-6">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
					</path>
				</svg>
				<span>
					You are logged in as <b>{data.user.name}</b>
				</span>
			</div>
			<form action="?/createSession" method="POST" class="mt-4" use:enhance>
				<button
					class="btn btn-primary w-full"
					name="platform"
					value={data.platform.id.split(':')[1]}>
					Continue as <b>{data.user.name}</b>
				</button>
			</form>
		{:else}
			<form method="POST" action="?/login">
				<Input type="text" id="username" value={username} label="Username" placeholder="Username" />
				{#if data.platform}
					<input type="hidden" name="platform" value={data.platform.name} />
				{/if}
				<button class="btn-primary btn w-full" {disabled}>Login</button>
			</form>
		{/if}
		<div class="divider" />
		<p class="text-center text-xs">
			<a href="/new-device" class="text-xs text-primary hover:cursor-pointer">
				Trying to login on different device?
			</a>
		</p>
		<p class="mt-3 text-center text-xs">
			No Account yet? <a href="/signup" class="text-xs text-primary hover:cursor-pointer">
				Sign up here
			</a>
		</p>
	</div>
</div>
