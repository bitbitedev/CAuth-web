<script>
	import { Input } from '$lib/components';
	import {
		validatePlatformDescription,
		validatePlatformName,
		validatePlatformUrl
	} from '$lib/utils/index.js';
	import ShieldLock from 'svelte-material-icons/ShieldLock.svelte';

	export let data;

	let disabled = true;
	let name = 'PMS';
	let description = 'Project Management Software';
	let url = 'https://pms.netcode.dev';
	let returnurl = 'https://pms.netcode.dev/login';

	$: {
		disabled =
			!validatePlatformName(name) ||
			!validatePlatformDescription(description) ||
			!validatePlatformUrl(url) ||
			!validatePlatformUrl(returnurl);
	}
</script>

<div class="card bg-base-100 shadow-2xl">
	<div class="card-body">
		<div class="card-title">Platforms</div>
		<p>
			If you are a developer and want to use our authentication service, you can register your
			platform here.
		</p>
		<div class="flex flex-wrap gap-4">
			{#each data.platforms as platform}
				<div class="card bg-base-300 shadow-xl">
					<div class="card-body">
						<div class="card-title">{platform.name}</div>
						<p>{platform.description}</p>
						<div class="card-actions justify-end">
							<a
								href="/my/platform/{platform.id.split(':')[1]}"
								class="btn btn-primary btn-md text-2xl">
								<ShieldLock />
								<span class="text-sm">Settings</span>
							</a>
						</div>
					</div>
				</div>
			{/each}
		</div>
		<div class="card-actions mt-4">
			<button class="btn btn-primary" onclick="modal_platform_register.showModal();">
				Register new Platform
			</button>
		</div>
	</div>
</div>

<dialog id="modal_platform_register" class="modal">
	<div class="modal-box">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
		</form>
		<h3 class="font-bold text-lg">Register new Platform</h3>
		<p class="py-4">Enter required data to register your platform</p>
		<form method="post" action="?/create">
			<Input id="name" bind:value={name} label="Platform Name" placeholder="Platform Name" />
			<Input
				id="description"
				bind:value={description}
				label="Platform Description"
				placeholder="Platform Description" />
			<Input id="url" bind:value={url} label="Platform URL" placeholder="Platform URL" />
			<Input
				id="returnUrl"
				bind:value={returnurl}
				label="Platform Return URL"
				placeholder="Platform return URL" />
			<div class="modal-action">
				<button class="btn btn-primary" {disabled}>Create</button>
				<button class="btn" on:click|preventDefault onclick="modal_platform_register.close();">
					Close
				</button>
			</div>
		</form>
	</div>
</dialog>
