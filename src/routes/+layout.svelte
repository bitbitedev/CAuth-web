<script>
	import '../app.postcss';
	import { page } from '$app/stores';
	import Logout from 'svelte-material-icons/ExitToApp.svelte';
	import AccountCircle from 'svelte-material-icons/AccountCircle.svelte';
	import { ucfirst } from '$lib/utils';

	export let data;

	let url = '';
	$: {
		let path = ucfirst($page.url.pathname.split('/')[1]);
		url = path.length > 1 ? path : 'Home';
	}
</script>

<svelte:head>
	<title>CAuth &there4; {url}</title>
</svelte:head>
<div class="drawer h-screen md:drawer-open">
	<input id="side-menu" type="checkbox" class="drawer-toggle" /> 
	<div class="drawer-content">
		<header class="navbar border-b-primary border-b-2 bg-base-100 p-2 fixed z-50 left-0">
			<div class="flex-1">
				{#if data.loggedIn}
					<label for="side-menu" aria-label="open sidebar" class="btn btn-square btn-ghost min-h-8 h-8 w-8 mr-4 md:hidden">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
					</label>
				{/if}
				<a href="/" class="flex items-center gap-3">
					<img src="/images/CAuth-logo.svg" alt="CAuth Logo" class="h-8" />
					<span class="w-max whitespace-nowrap">C-Auth</span>
				</a>
			</div>
			<menu class="flex-none gap-4 mr-5">
				{#if data.loggedIn}
					<a href="/my" class="hover:text-primary" selected={url == 'Dashboard'}>Dashboard</a>
					<a
						href="/logout"
						class="hover:text-primary text-error flex items-center gap-1"
						selected={url == 'Logout'}
						data-sveltekit-preload-data="tap">
						Logout <Logout />
					</a>
				{:else}
					<a href="/about" class="hover:text-primary" selected={url == 'About'}>About</a>
					<a href="/platforms" class="hover:text-primary" selected={url == 'Platforms'}>Platforms</a>
					<a
						href="/login"
						class="hover:text-primary flex items-center gap-1"
						selected={url == 'Signin'}>
						<span>Sign in</span>
						<span class="text-2xl"><AccountCircle /></span>
					</a>
				{/if}
			</menu>
		</header>
		<main class="mt-[64px] min-h-[calc(100%-64px)] h-[calc(100%-64px)]">
			<slot />
		</main>
	</div>
	{#if data.loggedIn}
		<div class="drawer-side">
			<label for="side-menu" aria-label="close sidebar" class="drawer-overlay"></label> 
			<menu class="hidden">
				<a href="/my" class="btn mt-1">Profile</a>
				<a href="/my/sessions" class="btn mt-1">Sessions</a>
				<a href="/my/activities" class="btn mt-1">Activities</a>
				<a href="/my/settings" class="btn mt-1">Settings</a>
				{#if data.settings?.developermode}
					<div class="divider" />
					<a href="/my/platform" class="btn mt-1">My Platforms</a>
				{/if}
			</menu>
		</div>
	{/if}
</div>

<style lang="postcss">
	.drawer-side {
		margin-top: 64px;

		> menu {
			@apply bg-base-200;
			@apply p-4;
			display: flex;
			flex-direction: column;
			height: calc(100vh - 64px);
		}
	}
</style>