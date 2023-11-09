<script>
    import Edit from 'svelte-material-icons/Pencil.svelte';
    import { Modal, Input } from '$lib/components';
    import { enhance } from '$app/forms';

    export let data;
</script>

<h1>Authenticators</h1>
<div class="divider m-0"></div>
<div class="flex gap-4 p-4">
	{#each data.authenticators as authenticator}
        <div class="card card-compact bg-base-100 shadow-2xl">
            <div class="card-body">
                <div class="card-title p-2">
                    {authenticator.name ?? 'Unknown'}
                    <button class="btn btn-primary btn-circle btn-xs" onclick="modal_edit_{authenticator.id.split(':')[1]}.showModal();">
                        <Edit/>
                    </button>
                </div>
                <div class="bg-base-200 rounded-xl p-5">
                    <div class="flex flex-col gap-4">
                        <div class="flex flex-row gap-4">
                            <div class="flex flex-col gap-1">
                                <div class="text-sm">ID</div>
                                <div class="text-sm">Created</div>
                            </div>
                            <div class="flex flex-col gap-1">
                                <div class="text-sm">{authenticator.id.split(':')[1]}</div>
                                <div class="text-sm">{new Date(authenticator.createdAt).toLocaleDateString("de-DE")}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal id="modal_edit_{authenticator.id.split(':')[1]}" title="Edit name of authenticator">
                    <p class="mb-1">Name this authenticator so you can easily recognize it</p>
                    <form action="?/edit" method="POST" use:enhance>
                        <Input id="name" label="Authenticator name" placeholder="Authenticator name" value="{authenticator.name ?? ''}"/>
                        <div class="modal-action">
                            <button class="btn btn-error text-white" on:click|preventDefault onclick="modal_edit_{authenticator.id.split(':')[1]}.close();">Close</button>
                            <button class="btn btn-primary" name="id" value={authenticator.id.split(':')[1]} onclick="modal_edit_{authenticator.id.split(':')[1]}.close();">Confirm</button>
                        </div>
                    </form>
                </Modal>
            </div>
        </div>
    {/each}
</div>