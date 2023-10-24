<script>
	export let id;
	export let type = 'text';
	export let label;
	export let value = '';
	export let placeholder = '';
	export let disabled = false;
	export let required = false;

	function addType(node) {
		node.type = type;
	}
</script>

<div class="mb-3">
	<label class="label pb-1 font-medium" for={id}>
		<span class="label-text">{label}</span>
	</label>
	<input
		class="input w-full bg-base-200 outline-0"
		{placeholder}
		use:addType
		{required}
		{disabled}
		{id}
		bind:value
		name={id}
		autocomplete="off" />
</div>

<style lang="postcss">
	::placeholder {
		color: hsl(var(--nc) / var(--tw-bg-opacity));
		opacity: 0.3;
	}
	input:hover,
	input:focus {
		border-color: hsl(var(--p) / var(--tw-bg-opacity));
	}
</style>
