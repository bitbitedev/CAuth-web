<script>
	let faultyOrg = false;
	let faultyMail = false;
	let faultyDepartment = false;
	let faultyUrl = false;
	let organization = '';
	let mail = '';
	let department = '';
	let url = '';

	$: {
		if(organization == '') faultyOrg = true; // organization must not be empty
		if(mail != '' && (!mail.contains("@") || !mail.contains("."))) faultyMail = true; // mail must not be empty
		if(department == '' || department == organization.slice(0, -1) || department.slice(0, -1) == organization) {
			department = organization;	// seems to be a single person, neat idea, just makes the department field non-editable
										// at least not with the <howIsTheKeyAboveReturnCalled?>-key. Marking and overwriting it works.
		}
		if(url != '' && !url.contains(".")) faultyUrl = true; // faulty url
	}

</script>


<div id="getting-started">
	Please fill in the form. <!-- or some other garbage text, if needed -->
	<form>
		<table>
			<tbody>
				<tr>
					<td>
						Your (organizations-)name:
					</td>
					<td>
						<input class:faulty={faultyOrg} bind:value={organization} /><!-- maybe set some css to make border red or sth like this for invalid fields,
																also maybe put some kind of indicator to be hovered next to it in case its faulty
																which gives some kind of hint which data to put there as well as a simplified error
																message, so users know whats wrong here. and yes, this is a long comment, fuck you -->
					</td>
				</tr>
				<tr>
					<td>
						E-Mail:
					</td>
					<td>
						<input class:faulty={faultyMail} bind:value={mail} />
					</td>
				</tr>
				<tr>
					<td>
						Responsible person or department (leave blank if same as above)
					</td>
					<td>
						<input calss:faulty={faultyDepartment} bind:value={department} />
					</td>
				</tr>
				<tr>
					<td>
						Url of the platform (optional)
					</td>
					<td>
						<input class:faulty={faultyUrl} bind:value={url} />
					</td>
				</tr>
			</tbody>
		</table>
	</form>
</div>