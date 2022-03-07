<script>
    export let page;
    import Home from "./pages/Home.svelte";
    import Signin from "./pages/Signin.svelte";
    import Dashboard from "./pages/Dashboard.svelte";
</script>
<main>
{#if page=='Home'}
    <Home/>
{:else if page=='Signin'}
    <Signin/>
{:else if page=='Dashboard'}
    <Dashboard/>
{/if}
</main>
