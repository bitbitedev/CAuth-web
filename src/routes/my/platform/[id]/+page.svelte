<script>
    import { Input } from '$lib/components';
    import { enhance, applyAction } from '$app/forms';
	import { goto } from '$app/navigation';

    export let data;
    export let form;

    let description = data.platform.description;
    let url = data.platform.url;
    let returnUrl = data.platform.returnUrl;

    let showToast = false;

    const applyFormData = () => {
		return async ({ result }) => {
            console.log(result)
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

<div class="card bg-base-100 shadow-2xl">
    <div class="card-body">
        <div class="card-title">
            {data.platform.name}
        </div>
        <form method="POST" action="?/update" class="flex flex-col" use:enhance={applyFormData}>
            <Input id="description" label="Description" placeholder="description" bind:value={description}/>
            <Input id="url" label="Platform Url" placeholder="url" bind:value={url}/>
            <Input id="returnUrl" label="Return Url" placeholder="return url" bind:value={returnUrl}/>
            <div class="card-actions">
                <button class="btn btn-primary">Update</button>
            </div>
        </form>
    </div>
</div>

<div class="card bg-base-100 shadow-2xl border-error border-2 mt-4">
    <div class="card-body">
        <div class="card-title text-error">
            Danger zone
        </div>
        <p>
            If you want to delete this platform, you can do it here. This action is irreversible.
        </p>
        <form method="POST" action="?/delete" class="flex flex-col" use:enhance={applyFormData}>
            <div class="card-actions">
                <button class="btn btn-error">Delete</button>
            </div>
        </form>
    </div>
</div>

<div class="toast" class:hidden={!showToast}>
    <div class="alert" class:alert-success={form?.success} class:alert-error={!form?.success}>
        <span>{form?.message}</span>
    </div>
</div>