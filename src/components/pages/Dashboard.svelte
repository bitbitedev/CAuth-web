<script>
    import SideMenuButton from "../dashboard/SideMenuButton.svelte"
    let menuCollapsed = false;
</script>
<style lang="scss">
#dashboard {
    display: flex;
    > * {
        display: inline-block;
        vertical-align: top;
    }
    > menu {
        @media (min-width: 680px){
            min-height: calc(100vh - 80px);
        }
        background-color: var(--color-theme-primary-light);
        color: #FFF;
        margin: 0;
        padding: 10px;
        width: 250px;
        transition: width .2s;
        &.collapsed {
            width: 70px;
            color: var(--color-theme-primary-light);
        }

        button#dashboard-menu-collapse {
            background-color: transparent;
            border: unset;
            border-radius: 5px;
            color: #FFF;
            cursor: pointer;
            float: right;
            font-size: 30px;
            padding: 10px;
            &:hover {
                background-color: var(--color-theme-primary);
            }
        }
    }
    > content {
        display: block;
        padding: 20px;
        width: calc(100% - 250px);
    }
}
</style>
<div id="dashboard">
    <menu class:collapsed={menuCollapsed}>
        <button class="material-icons" id="dashboard-menu-collapse" on:click={()=>menuCollapsed=!menuCollapsed}>menu</button>
        <div class="clear"></div>
        <SideMenuButton href="/dashboard/profile" title="Profile" icon="account_circle"/>
        <SideMenuButton href="/dashboard/admin" title="Admin" icon="local_police"/>
        <SideMenuButton href="/dashboard/access-history" title="Data access history" icon="bar_chart"/>
        <SideMenuButton href="/dashboard/settings" title="Settings" icon="settings"/>
    </menu>
    <content>

    </content>
</div>
