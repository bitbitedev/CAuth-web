<script>
	let faultyOrganization = false;
	let faultyDepartment = false;
	let faultyMail = false;
	let organization = '';
	let department = '';
	let mail = '';

	$: {
		if(organization == '') faultyOrganization = true;
		if(department == '') faultyDepartment = true;
		if(mail == '') faultyMail = true; // You might wanna change this a litte to a regex to check if its a valid mail.
	}
</script>


<tr>
	<td>
		Your Organization:
	</td>
	<td>
		<input class:faulty={faultyOrganization} bind:value={organization} />
	</td>
</tr>
<tr>
	<td>
		Accountable Person or Department:
	</td>
	<td>
		<input class:faulty={faultyDepartment} bind:value={department} />
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