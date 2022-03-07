<script>
    import Header from "./components/Header.svelte"
    import Content from "./components/Content.svelte"
    import Footer from "./components/Footer.svelte"
    import "./style/global.scss"

    import { onMount } from 'svelte';

	let url = ``;

	onMount(() => {
        url = ucfirst(window.location.href.substring(window.location.href.indexOf('/',9)+1))
        if(url=='') url = 'Home';
    });
	function ucfirst(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
</script>

<Header page={url}/>
<Content page={url}/>
<Footer />