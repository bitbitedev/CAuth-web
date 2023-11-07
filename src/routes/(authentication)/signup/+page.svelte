<script>
	import { Input } from '$lib/components';
	import { applyAction, deserialize } from '$app/forms';
	import { startRegistration } from '@simplewebauthn/browser';

	let error = '';
	let name = '';
	let email = '';
	let disabled = true;

	$: disabled = name.length < 2 || email.length < 6;

	async function submit() {
		disabled = true;
		let formData = new FormData();
		formData.append('username', name);
		formData.append('email', email);
		const response = await fetch('?/signup', {
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
			let attestResp;
			try {
				attestResp = await startRegistration(options);
			} catch (err) {
				if (err.name === 'InvalidStateError') {
					error = 'Authenticator was probably already registered by user';
				} else {
					error = err;
				}
			}
			let formData = new FormData();
			formData.append('id', authReq);
			formData.append('attest', JSON.stringify(attestResp));
			const response = await fetch('?/verify', {
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
		<h2 class="mb-2 text-center text-3xl font-bold tracking-tight text-base-content">Sign up</h2>
		{#if error.length > 0}
			<div class="alert alert-error mb-5 mt-5 shadow-lg">
				<div class="flex gap-1">
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
					<span>{error}</span>
				</div>
			</div>
		{/if}
		<Input type="text" id="name" bind:value={name} label="Username" placeholder="Username" />
		<Input
			type="email"
			id="email"
			bind:value={email}
			label="Email"
			placeholder="someone@example.tld" />
		<button class="btn-primary btn w-full" {disabled}>Sign up</button>
		<p class="mt-3 text-center text-xs">
			Already signed up? <a href="/login" class="text-xs text-primary hover:cursor-pointer">
				Login here
			</a>
		</p>
	</form>
</div>
