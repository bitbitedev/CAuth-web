<script>
	export let id;
	export let title;
</script>

<dialog {id} class="modal">
	<div class="modal-box">
		<form method="dialog">
			<button
				class="btn btn-sm btn-circle btn-ghost hover:btn-error hover:text-white absolute right-2 top-2">
				✕
			</button>
		</form>
		<h2>{title}</h2>
		<div class="divider mt-0"></div>
		<slot />
	</div>
</dialog>
