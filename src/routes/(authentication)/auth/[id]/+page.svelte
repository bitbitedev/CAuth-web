<script>
	import { onMount } from 'svelte';
	import { applyAction, deserialize } from '$app/forms';
	import { startAuthentication } from '@simplewebauthn/browser';

    export let data;
    
    let error = '';
    let showButton = false;

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
    }

    onMount(authenticate);
</script>

<div class="flex h-full w-full items-center justify-center">
	<div class="card h-min w-xs max-w-md bg-base-100 p-5 shadow-xl">
        <h2 class="mb-2 text-center text-3xl font-bold tracking-tight text-base-content">Confirm Authentication</h2>
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
        <div class="mb-2">
            Please authenticate with your authenticator.
            If your authenticator couldn't be found, registere a new one <a class="text-primary" href="/new-device">here</a>.
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