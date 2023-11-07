<script>
    import { enhance } from '$app/forms';

    export let secret;
    export let platform;
</script>
<dialog id="modal_secret_delete_{secret.id.split(':')[1]}" class="modal">
    <div class="modal-box border-2 border-error">
        <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <h3 class="font-bold text-lg">Delete secret "{secret.name}" for {platform.name}</h3>
        <p class="py-4">If you delete this token, no platform using that token will be able to access C-Auth</p>
        <form method="post" action="?/deleteSecret" use:enhance>
            <div class="modal-action">
                <button class="btn btn-error" name="secretId" onclick="modal_secret_delete_{secret.id.split(':')[1]}.close();" value={secret.id}>Delete</button>
                <button class="btn" on:click|preventDefault onclick="modal_secret_delete_{secret.id.split(':')[1]}.close();">
                    Close
                </button>
            </div>
        </form>
    </div>
</dialog>