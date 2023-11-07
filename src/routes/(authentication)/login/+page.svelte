<script>
	import { Input } from '$lib/components';
	import { applyAction, deserialize } from '$app/forms';
	import { startAuthentication } from '@simplewebauthn/browser';

	export let data;

	let username = '';
	let error = '';
	let disabled = false;

	async function submit() {
		disabled = true;
		let formData = new FormData();
		formData.append('username', username);
		const loginUrl = data.platform ? window.location + '&/login' : '?/login';
		const response = await fetch(loginUrl, {
			method: 'POST',
			body: formData
		});
		const responseJSON = deserialize(await response.text());
		if (responseJSON.type === 'error') {
			error = responseJSON.error.message;
			disabled = false;
			return;
		}
		if (responseJSON.type === 'success') {
			const { options, authReq } = responseJSON.data;
			let assertResp;
			try {
				assertResp = await startAuthentication(options);
			} catch (err) {
				if (err.name === 'InvalidStateError') {
					error = 'Error: Worng authenticator';
				} else {
					error = err;
				}
			}
			formData = new FormData();
			formData.append('assertResponse', JSON.stringify(assertResp));
			formData.append('authReq', authReq);
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
		}
		disabled = false;
	}
</script>

<div class="flex h-full w-full items-center justify-center">
	<form
		method="POST"
		id="signup"
		class="card h-min w-min min-w-max bg-base-100 p-5 shadow-xl"
		on:submit|preventDefault={submit}>
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
		<Input
			type="text"
			id="username"
			bind:value={username}
			label="Username"
			placeholder="Username" />
		<button class="btn-primary btn w-full" {disabled}>Login</button>
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
	</form>
</div>
