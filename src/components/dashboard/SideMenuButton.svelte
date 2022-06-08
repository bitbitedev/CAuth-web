<script>
	export let href, title, icon;
</script>

<a {href} {title}><i class="material-icons">{icon}</i> {title}</a>

<style lang="scss">
	a {
		border-radius: 5px;
		color: inherit;
		display: block;
		margin-top: 10px;
		padding: 10px;
		overflow: hidden;
		white-space: nowrap;
		transition: background-color 0.2s;

		&:hover {
			background-color: var(--color-theme-primary);
			text-decoration: none;
		}
		.material-icons {
			color: #fff;
			font-size: 30px;
			margin-right: 10px;
			vertical-align: -10px;
		}
	}
</style>
