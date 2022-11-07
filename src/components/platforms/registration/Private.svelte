<script>
	let faultyName = false;
	let faultyMail = false;
	let name = '';
	let mail = '';

	$: {
		if(name == '') faultyName = true;
		if(mail == '') faultyMail = true; // You might wanna change this a litte to a regex to check if its a valid mail.
	}
</script>


<tr>
	<td>
		Your Name:
	</td>
	<td>
		<input class:faulty={faultyName} bind:value={name} />
	</td>
</tr>
<tr>
	<td>
		Your E-Mail:
	</td>
	<td>
		<input class:faulty={faultyMail} bind:value={mail} />
	</td>
</tr>