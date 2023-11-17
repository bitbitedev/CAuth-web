<script>
	import { onMount } from 'svelte';

    export let data;

    const dateSettings = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
</script>

<div class="card bg-base-100 shadow-2xl">
	<div class="card-body">
		<div class="card-title">Active Sessions</div>
        <p>Here you can find all active sessions. You can manually disable sessions before they expire to revoke access.</p>
        {#if data.sessions.length == 0}
            No active sessions.
        {/if}
        <div class="flex flex-wrap">
            {#each data.sessions as session}
                <div class="card bg-base-200">
                    <div class="card-body">
                        <div class="card-title">{session.platform.name}</div>
                        <span>Logged in: {new Date(session.createdAt).toLocaleDateString(data.lang, dateSettings)}</span>
                        <span>Expires at: {new Date(session.expiresAt).toLocaleDateString(data.lang, dateSettings)}</span>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</div>