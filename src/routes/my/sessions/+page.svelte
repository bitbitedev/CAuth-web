<script>
    export let data;

    const dateSettings = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
</script>

<div class="card bg-base-100 shadow-2xl">
	<div class="card-body">
		<div class="card-title">Active Sessions</div>
        <p>Here you can find all active sessions. You can manually disable sessions before they expire to revoke access.</p>
        {#if data.activeSessions?.length == 0}
            No active sessions.
        {/if}
        <div class="flex flex-wrap gap-2">
            {#each data.activeSessions as session}
                <div class="card bg-base-200">
                    <div class="card-body">
                        <div class="card-title">{session.platform.name}</div>
                        <span>Logged in: {new Date(session.createdAt).toLocaleDateString(data.lang, dateSettings)}</span>
                        <span>Expires at: {new Date(session.expiresAt).toLocaleDateString(data.lang, dateSettings)}</span>
                        <div class="card-actions justify-end mt-2">
                            <form action="?/end" method="POST">
                                <button class="btn btn-primary" name="session" value={session.id.split(':')[1]}>End Session</button>
                            </form>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</div>

{#if data.inactiveSessions?.length != 0}
    <div class="card bg-base-100 shadow-2xl mt-4">
        <div class="card-body">
            <div class="card-title">Past Sessions</div>
            <p>Here you can find all expired sessions.</p>
            <div class="flex flex-wrap gap-2">
                {#each data.inactiveSessions as session}
                    <div class="card card-compact bg-base-200">
                        <div class="card-body">
                            <div class="card-title">{session.platform.name}</div>
                            <span>Logged in: {new Date(session.createdAt).toLocaleDateString(data.lang, dateSettings)}</span>
                            <span>Expired at: {new Date(session.expiresAt).toLocaleDateString(data.lang, dateSettings)}</span>
                            {#if session.invalidated}
                                <span class="error">Invalidated</span>
                            {:else}
                                <span class="error">Expired</span>
                            {/if}
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>
{/if}