<script>
    import { Pagination } from '$lib/components';

    export let data;
</script>

<div class="card bg-base-100">
    <div class="card-body">
        <div class="card-title">
            Authentication Requests
        </div>
        <Pagination
            pageCount={data.pageCount}
            currentIndex={data.pageIndex}
            url="/my/activities"/>
        <table>
            <thead>
                <tr>
                    <td>platform</td>
                    <td width="100">type</td>
                    <td width="100">status</td>
                    <td width="200">date</td>
                </tr>
            </thead>
            <tbody>
                {#each data.authReqs as authReq}
                    <tr>
                        <td>{authReq.platform?.name ?? 'C-Auth'}</td>
                        <td>{authReq.type}</td>
                        <td class:text-error={authReq.status=='failed'} class:text-success={authReq.status=='verified'}>{authReq.status ?? '-'}</td>
                        <td>{new Date(authReq.createdAt).toLocaleTimeString('de-DE', {
                            year: 'numeric',
                            month: 'numeric',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                        })}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>