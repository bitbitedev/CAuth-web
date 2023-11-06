<script>
    export let data;
</script>

<div class="card bg-base-100">
    <div class="card-body">
        <div class="card-title">
            Profile
        </div>
        <div class="stats shadow">
            <div class="stat">
                <div class="stat-title">Auth Requests this week</div>
                <div class="stat-value">{data.recentAuths.length}</div>
                <div class="stat-desc">since {data.firstDayOfWeek}</div>
            </div>
        </div>
    </div>
</div>