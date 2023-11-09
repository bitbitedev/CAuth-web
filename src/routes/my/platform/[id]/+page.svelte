<script>
	import { Input } from '$lib/components';
	import { enhance, applyAction } from '$app/forms';
	import { goto } from '$app/navigation';
	import Delete from 'svelte-material-icons/Delete.svelte';
	import ModalSecretDelete from './ModalSecretDelete.svelte';

	export let data;
	export let form;

	let description = data.platform.description;
	let url = data.platform.url;
	let returnUrl = data.platform.returnUrl;

	let showToast = false;

	$: onUpdate(form);

	const onUpdate = (form) => {
		if (form && form.success && form.secret && modal_secret_show) {
			modal_secret_show.showModal();
		} else if (form) {
			showToast = true;
			setTimeout(() => {
				showToast = false;
			}, 5000);
		}
	};

	const applyFormData = () => {
		return async ({ result }) => {
			description = result.data.formData.description;
			url = result.data.formData.url;
			returnUrl = result.data.formData.returnUrl;
			showToast = true;
			setTimeout(() => {
				showToast = false;
			}, 5000);
			if (result.type === 'redirect') {
				goto(result.location);
			} else {
				await applyAction(result);
			}
		};
	};
</script>

<div class="flex flex-wrap justify-stretch gap-4">
	<div class="card bg-base-100 shadow-2xl">
		<div class="card-body">
			<div class="card-title">
				{data.platform.name}
			</div>
			<form method="POST" action="?/update" class="flex flex-col" use:enhance={applyFormData}>
				<Input
					id="description"
					label="Description"
					placeholder="description"
					bind:value={description} />
				<Input id="url" label="Platform Url" placeholder="url" bind:value={url} />
				<Input id="returnUrl" label="Return Url" placeholder="return url" bind:value={returnUrl} />
				<div class="card-actions">
					<button class="btn btn-primary">Update</button>
				</div>
			</form>
		</div>
	</div>
	<div class="card bg-base-100 shadow-2xl">
		<div class="card-body">
			<div class="card-title">
				Secrets
			</div>
			<p>
				Here you can manage secrets for this platform. Secrets are used to authenticate the platform when using the AP.
			</p>
			<table>
				<thead>
					<tr>
						<td>name</td>
						<td width="120">creation date</td>
						<td width="80">actions</td>
					</tr>
				</thead>
				<tbody>
					{#each data.secrets as secret}
						<tr>
							<td>{secret.name}</td>
							<td class="text-center">{new Date(secret.createdAt).toLocaleDateString('de-DE')}</td>
							<td>
								<button class="btn btn-error btn-circle text-white btn-sm text-xl" onclick="modal_secret_delete_{secret.id.split(':')[1]}.showModal();">
									<Delete/>
								</button>
								<ModalSecretDelete secret={secret} platform={data.platform}/>
							</td>
						</tr>
					{/each}
					{#if data.secrets.length === 0}
						<tr>
							<td colspan="2" class="text-center">No secrets found</td>
						</tr>
					{/if}
				</tbody>
			</table>
			<div class="card-actions">
				<a href="?/createSecret" class="btn btn-primary" onclick="modal_secret_create.showModal();">Generate new secret</a>
			</div>
		</div>
	</div>
</div>

<div class="card bg-base-100 shadow-2xl border-error border-2 mt-4">
	<div class="card-body">
		<div class="card-title text-error">Danger zone</div>
		<p>If you want to delete this platform, you can do it here. This action is irreversible.</p>
		<form method="POST" action="?/delete" class="flex flex-col" use:enhance={applyFormData}>
			<div class="card-actions">
				<button class="btn btn-error">Delete</button>
			</div>
		</form>
	</div>
</div>

<dialog id="modal_secret_create" class="modal">
	<div class="modal-box">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
		</form>
		<h3 class="font-bold text-lg">Create a new secret for {data.platform.name}</h3>
		<p class="py-4">Enter a name for the secret, so you can easily recognize it.</p>
		<form method="post" action="?/createSecret" use:enhance>
			<Input id="name" label="Secret name" placeholder="Secret name" />
			<div class="modal-action">
				<button class="btn btn-primary" onclick="modal_secret_create.close();">Create</button>
				<button class="btn" on:click|preventDefault onclick="modal_secret_create.close();">
					Close
				</button>
			</div>
		</form>
	</div>
</dialog>

<dialog id="modal_secret_show" class="modal">
	<div class="modal-box border-2 border-warning">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
		</form>
		<h3 class="font-bold text-lg">Created secret for {data.platform.name}</h3>
		<p class="py-4">
			A new secret has been created. Copy and save it from the textbox below.
			<span class="text-warning">Once you close this modal it can not be retreived again and if you lose
			it you need to create a new one.</span>
		</p>
		<textarea readonly class="textarea w-full bg-base-300 text-white">{form?.secret}</textarea>
		<form method="dialog">
			<div class="modal-action">
				<button class="btn" on:click|preventDefault onclick="modal_secret_show.close();">
					Close
				</button>
			</div>
		</form>
	</div>
</dialog>

<div class="toast" class:hidden={!showToast}>
	<div class="alert" class:alert-success={form?.success} class:alert-error={!form?.success}>
		<span>{form?.message}</span>
	</div>
</div>
