<script>
	import { loggedIn } from "../stores/general"
	export let page
</script>
<svelte:head>
{#if page.length > 1}
	<title>CAuth &there4; {page}</title>
{:else}
	<title>CAuth &there4; Home</title>
{/if}
</svelte:head>
<header>
    <div class="content">
        <a href="/">
            <img src="/assets/CAuth-logo.svg" alt="CAuth Logo">
            <span>C-Auth</span>
        </a>
        <menu>
            <a href="/about" selected="{page=='About'}">About</a>
			{#if $loggedIn}
            <a href="/dashboard" selected="{page=='Dashboard'}">Dashboard</a>
            <a href="/logout" selected="{page=='Logout'}" class="error">Logout <i class="material-icons">exit_to_app</i></a>
			{:else}
            <a href="/signin" selected="{page=='Signin'}">Sign in <i class="material-icons">account_circle</i></a>
			{/if}
        </menu>
    </div>
</header>
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