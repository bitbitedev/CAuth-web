<script>
	import { onMount } from 'svelte';
	import { applyAction, deserialize } from '$app/forms';
	import { startAuthentication } from '@simplewebauthn/browser';
	import { goto } from '$app/navigation';

	export let data;

	let info = '';
	let error = '';
	let showButton = false;
	let authRequestData = {};
	let interval;

	const authenticate = async () => {
		const { options } = data;
		let assertResp;
		try {
			assertResp = await startAuthentication(options);
		} catch (err) {
			if (err.name === 'InvalidStateError') {
				error = 'Error: Worng authenticator';
			} else if (err.name === 'NotAllowedError') {
				error = 'Aborted authentication. Press the button below to try again.';
				showButton = true;
				return;
			} else {
				error = err;
			}
		}
		const formData = new FormData();
		formData.append('assertResponse', JSON.stringify(assertResp));
		const verifyUrl = data.platform ? window.location + '&/verify' : '?/verify';
		const response = await fetch(verifyUrl, {
			method: 'POST',
			body: formData
		});
		const verification = deserialize(await response.text());
		if (verification.type === 'error') {
			error = verification.error.message;
			return;
		}
		applyAction(verification);
	};

	onMount(() => {
		if (!data.external) authenticate();
		else showButton = true;
	});

	onMount(() => {
		if (!data.external) {
			interval = setInterval(async () => {
				authRequestData = await (await fetch(`/api/v1/authRequest/${data.id}`)).json();
				if (authRequestData.external && !data.external) {
					error = '';
					showButton = false;
					info = 'This request is being authenticated by another device.';
				}
				if (authRequestData.status != 'pending') {
					clearInterval(interval);
					if (authRequestData.status == 'failed') {
						error = 'Authentication failed';
						showButton = true;
					}
					if (authRequestData.status == 'verified') {
						goto(authRequestData.redirectUrl);
					}
				}
			}, 1000);
		}
	});
</script>

<div class="flex h-full w-full items-center justify-center">
	<div class="card h-min w-xs max-w-md bg-base-100 p-5 shadow-xl">
		<h2 class="mb-2 text-center text-3xl font-bold tracking-tight text-base-content">
			Confirm Authentication
		</h2>
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
		{#if info.length > 0}
			<div class="alert alert-info mb-5 mt-5 shadow-lg">
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
				<div class="flex flex-col gap-2">
					<span>{info}</span>
					<div class="flex justify-center uppercase font-bold text-4xl">
						{data.code}
					</div>
				</div>
			</div>
		{/if}
		{#if data.external}
			<div role="alert" class="alert alert-warning mb-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="stroke-current shrink-0 h-6 w-6"
					fill="none"
					viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
				</svg>
				<div class="flex flex-col gap-2">
					<span>
						Warning: You are authenticating a different device. Please verify that the following
						code matches:
					</span>
					<div class="flex justify-center uppercase font-bold text-4xl">
						{data.code}
					</div>
				</div>
			</div>
		{/if}
		<div class="mb-2">
			Please authenticate with your authenticator.
			{#if !data.external}
				If your authenticator couldn't be found, registere a new one <a
					class="text-primary"
					href="/new-device">
					here
				</a>
				.
			{/if}
		</div>
		{#if !showButton}
			<div class="flex justify-center">
				<div class="loading loading-lg"></div>
			</div>
		{/if}
		{#if showButton}
			<button class="btn btn-primary" on:click={authenticate}>Authenticate</button>
		{/if}
	</div>
</div>
