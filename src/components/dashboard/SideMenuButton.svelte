<script>
    export let href,title,icon;
</script>
<style lang="scss">
a {
    border-radius: 5px;
    color: inherit;
    display: block;
    margin-top: 10px;
    padding: 10px;
    overflow: hidden;
    white-space: nowrap;
    transition: background-color .2s;

    &:hover {
        background-color: var(--color-theme-primary);
        text-decoration: none;
    }
    .material-icons {
        color: #FFF;
        font-size: 30px;
        margin-right: 10px;
        vertical-align: -10px;
    }
}
</style>
<a {href} {title}><i class="material-icons">{icon}</i> {title}</a>