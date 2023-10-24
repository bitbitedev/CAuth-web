<script>
	import '../app.postcss';
	import { page } from '$app/stores';
	import Logout from 'svelte-material-icons/ExitToApp.svelte';
	import AccountCircle from 'svelte-material-icons/AccountCircle.svelte';

	export let data;

	function ucfirst(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
	let url = '';
	$: {
		let path = ucfirst($page.url.pathname.split('/')[1]);
		url = path.length > 1 ? path : 'Home';
	}
</script>

<svelte:head>
	<title>CAuth &there4; {url}</title>
</svelte:head>
<header class="navbar border-b-primary border-b-2 bg-base-100 p-4">
	<div class="flex-1">
		<a href="/" class="flex items-center gap-3">
			<img src="/images/CAuth-logo.svg" alt="CAuth Logo" class="h-8" />
			<span class="w-max whitespace-nowrap">C-Auth</span>
		</a>
	</div>
	<menu class="flex-none gap-5 mr-5">
		<a href="/about" class="hover:text-primary" selected={url == 'About'}>About</a>
		<a href="/platforms" class="hover:text-primary" selected={url == 'Platforms'}>Platforms</a>
		{#if data.loggedIn}
			<a href="/dashboard" class="hover:text-primary" selected={url == 'Dashboard'}>Dashboard</a>
			<a
				href="/logout"
				class="hover:text-primary error"
				selected={url == 'Logout'}
				data-sveltekit-preload-data="tap">
				Logout <Logout />
			</a>
		{:else}
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
<main class="min-h-[calc(100%-66px)] h-[calc(100%-66px)]">
	<slot />
</main>
