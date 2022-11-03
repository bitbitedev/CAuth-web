<div id="signup">
	<div class="card">
		<h1 class="center">Start using CAuth today!</h1>
		<hr />
		<div class="card-content center">
			Since your data is stored on your own device instead of in the cloud, you need to download an
			app.
		</div>
		<!-- move wherever you want to have it, as well as format it to your needs / wishes -->
		<span>Not a private user? Check out our platform <a href="/registration">registration</a>!</span>
	</div>
</div>

<style lang="scss">
	#signup {
		display: flex;
		height: calc(100vh - 136px);
		justify-content: center;
		align-items: center;
		background: linear-gradient(180deg, rgba(121, 121, 208, 1) 0%, rgba(55, 55, 116, 1) 100%);

		> .card {
			padding: 20px;
			max-width: 500px;
			hr {
				border: none;
				border-top: 1px solid var(--color-theme-primary);
			}
			> .card-content {
				font-family: 'Open Sans';
				font-weight: 100;
				font-size: 16px;
				margin-top: 20px;
			}
		}
	}
</style>
