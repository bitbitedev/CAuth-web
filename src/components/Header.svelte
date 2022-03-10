<script>
	import { loggedIn } from "../stores/general"
	import { page } from '$app/stores'

	function ucfirst(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
	let url = '';
	$:{
		let path = ucfirst($page.url.pathname.split("/")[1]);
		url = path.length>1?path:'Home'
	}
</script>
<style lang="scss">
	header {
		background-color: var(--color-background-primary);
		border-bottom: 2px solid var(--color-theme-primary);
		padding: 10px;
		top: 0px;
		width: 100%;
		z-index: 10000;
		> .content {
			display: flex;
			justify-content: space-between;
			align-items: center;
			> a {
				padding: 10px;
				text-decoration: none;
				color: var(--color-foreground-primary);
				&:hover {
					text-decoration: none;
				}
				> * {
					display: inline-block;
					vertical-align: middle;
				}
				> img {
					height: 25px;
				}
				> span {
					margin-left: 10px;
				}
			}
		}
		menu {
			padding-inline-start: 0;
			a {
				color: inherit;
				font-size: 14px;
				padding: 10px 20px;
				text-decoration: none;
				color: var(--color-foreground-secondary);
				&:visited {
					color: var(--color-foreground-secondary);
				}
				&:hover{
					transition: color .2s;
					color: var(--color-theme-primary);
					text-decoration: none;
				}
				&[selected="true"] {
					color: var(--color-theme-primary);
				}
				.material-icons {
					vertical-align: middle;
				}
			}
		}
	}
</style>
<svelte:head>
	<title>CAuth &there4; {url}</title>
</svelte:head>
<header>
    <div class="content">
        <a href="/">
            <img src="/images/CAuth-logo.svg" alt="CAuth Logo">
            <span>C-Auth</span>
        </a>
        <menu>
            <a href="/about" selected="{url=='About'}">About</a>
			{#if $loggedIn}
            <a href="/dashboard" selected="{url=='Dashboard'}">Dashboard</a>
            <a href="/logout" selected="{url=='Logout'}" class="error">Logout <i class="material-icons">exit_to_app</i></a>
			{:else}
            <a href="/signin" selected="{url=='Signin'}">Sign in <i class="material-icons">account_circle</i></a>
			{/if}
        </menu>
    </div>
</header>