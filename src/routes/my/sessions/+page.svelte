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

<div class="card card-compact md:card-normal max-w-full bg-base-100 shadow-2xl">
	<div class="card-body">
		<div class="card-title text-3xl">Sessions</div>
        <p>
            These are your most recent logins to an other platform. 
        </p>
        
        {#if data.activeSessions?.length == 0}
            No active sessions.
        {/if}
        <div class="flex flex-wrap gap-2 mt-2">
            {#each data.sessions as session}
                <div class="card card-compact bg-base-200 border-[1px]" class:border-error={!session.valid} class:border-success={session.valid}>
                    <div class="card-body">
                        <div class="card-title">
                            {session.platform.name}
                            <span class="badge badge-outline" class:badge-error={!session.valid} class:badge-success={session.valid}>
                                {#if session.valid}
                                    active
                                {:else if session.invalidated}
                                    invalidated
                                {:else}
                                    expired
                                {/if}
                            </span>
                        </div>
                        <span>Logged in: {new Date(session.createdAt).toLocaleDateString(data.lang, dateSettings)}</span>
                        <span>
                            Expire{new Date(session.expiresAt) > new Date() ? 's' : 'd'} at: 
                            {new Date(session.expiresAt).toLocaleDateString(data.lang, dateSettings)}
                        </span>
                        {#if session.valid}
                            <div class="card-actions justify-end mt-2">
                                <form action="?/end" method="POST">
                                    <button class="btn btn-primary" name="session" value={session.id.split(':')[1]}>End Session</button>
                                </form>
                            </div>
                        {/if}
                    </div>
                </div>
            {/each}
        </div>
        <div class="card card-compact bg-base-300 mt-4 w-max">
            <div class="card-body">
                <div class="card-title">Legend</div>
                <div class="grid auto-cols-fr lg:grid-cols-2 gap-2">
                    <span class="badge badge-outline badge-success">active</span>
                    <ul class="list-disc">
                        <li>This session is active</li>
                        <li>The platform can access your data</li>
                    </ul>
                    <span class="badge badge-outline badge-error">invalidated</span>
                    <ul class="list-disc">
                        <li>This session is inactive</li>
                        <li>The platform can <b>not</b> access your data</li>
                        <li>This session is been manually closed</li>
                    </ul>
                    <span class="badge badge-outline badge-error">expired</span>
                    <ul class="list-disc">
                        <li>This session is inactive</li>
                        <li>The platform can <b>not</b> access your data</li>
                        <li>This session expired automatically</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>