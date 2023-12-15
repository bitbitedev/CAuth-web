<div class="card bg-base-100 shadow-2xl">
	<div class="card-body">
		<div class="card-title p-4">Settings</div>
		<div class="grid grid-rows md:grid-cols-[200px_1fr] gap-4">
			<menu class="bg-base-200 flex flex-col rounded-xl p-4 gap-1">
				<a href="/my/settings" class="btn btn-ghost btn-sm">General</a>
				<a href="/my/settings/authenticators" class="btn btn-ghost btn-sm">Authenticators</a>
				<a href="/my/settings/developers" class="btn btn-ghost btn-sm">Developers</a>
			</menu>
			<div class="bg-base-200 rounded-xl p-5">
				<slot />
			</div>
		</div>
	</div>
</div>
