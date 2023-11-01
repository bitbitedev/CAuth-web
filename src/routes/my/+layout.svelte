<div id="content">
    <menu>
        <a href="/my/profile">Profile</a>
        <a href="/my/activities">Activities</a>
        <a href="/my/history">Access history</a>
        <a href="/my/settings">Settings</a>
        <div class="divider"></div>
        <a href="/my/platform">My Platforms</a>
    </menu>
    <main>
        <slot/>
    </main>
</div>


<style lang="postcss">
    #content {
        display: grid;
        grid-template: 1fr / 200px 1fr;
        height: 100%;
        
        menu {
            @apply bg-base-200;
            @apply p-4;
            display: flex;
            flex-direction: column;
            a {
                @apply btn;
                @apply mt-1;
            }
        }
        main {
            @apply p-4;
        }
    }
</style>