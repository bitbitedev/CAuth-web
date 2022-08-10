<script>
	import { loggedIn } from '../../stores/general';
	let username;
	let id = Date.now();
	let qrCodeData, qrCode;
	$: {
		let sessid = Math.random()*1000000000 | id;
		let message = btoa("Login to c-auth.com");
		qrCodeData = `cauth://cauth/${sessid}/${message}`;
		qrCode =
			'https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=' +
			encodeURIComponent(qrCodeData) +
			'&choe=UTF-8';
	}

	async function sendAuthRequest() {
		const formData = new URLSearchParams();
		formData.append('id', '0');
		formData.append('purpose', 'request');
		formData.append(
			'data',
			JSON.stringify({
				password: username
			})
		);
		const res = await fetch('http://localhost/unlock', {
			method: 'POST',
			body: formData
		});
		const json = await res.json();
		loggedIn.set(json.data.success);
	}
	setInterval(() => {
		id = Date.now();
	}, 10000);
</script>

<div id="login">
	<section class="center-v center-h">
		<img src={qrCode} alt="Sign in with QR-Code" />
		<span> Scan this code using your CAuth app to authenticate yourself </span>
	</section>
	<section class="center-v center-h">
		<div>
			<i class="image material-icons">groups</i>
			<p>
				Please enter your username. You will receive an authentication request in your CAuth app.
			</p>
			<input type="text" placeholder="Type your username here" bind:value={username} />
			<input type="submit" value="Send authentication request" on:click={sendAuthRequest} />
			<span>Not using CAuth yet? Start using <a href="/signup">now &raquo;</a></span>
		</div>
	</section>
</div>

<style lang="scss">
	#login {
		display: flex;
		align-items: center;
		@media (max-width: 679px) {
			flex-direction: column;
		}

		> section {
			@media (min-width: 680px) {
				min-height: calc(100vh - 136px);
			}
			min-width: 340px;
			padding: 20px;
			width: 100%;

			&:first-child {
				background: rgb(121, 121, 208);
				background: linear-gradient(180deg, rgba(121, 121, 208, 1) 0%, rgba(55, 55, 116, 1) 100%);
				flex-direction: column;

				> img {
					border-radius: 25px;
				}
				> span {
					color: #fff;
					font-size: 16px;
					margin-top: 20px;
					text-align: center;
					width: 300px;
				}
			}

			&:last-child {
				background-color: var(--color-background-alternative);
			}

			div {
				width: 250px;
				> input {
					display: block;
					width: 100%;
					background-color: var(--color-background-secondary);
					border: 1px solid var(--color-input-border);
					border-radius: 5px;
					padding: 10px;
					transition: border-color 0.2s;
					&:hover,
					&:focus {
						border-color: var(--color-theme-primary);
					}
					&[type='submit'] {
						border-color: var(--color-theme-primary);
						background-color: var(--color-theme-primary-light);
						color: white;
						transition: background-color 0.2s;
						&:hover,
						&:active,
						&:focus {
							background-color: var(--color-theme-primary);
						}
					}
				}
				> p {
					margin-top: 0px;
					font-size: 16px;
					text-align: justify;
				}
				> .image {
					display: block;
					text-align: center;
					font-size: 150px;
				}
				> span {
					font-size: 13px;
				}
			}
		}
	}
</style>
