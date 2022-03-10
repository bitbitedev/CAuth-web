<script>
    import Header from "../components/Header.svelte"
    import Content from "../components/Content.svelte"
    import Footer from "../components/Footer.svelte"
    import "../style/global.scss"
</script>
<Header />
<Content><slot></slot></Content>
<Footer />