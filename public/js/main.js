function ensureOneCheck(checkBoxName, messageId, submitId) {
	const checkBoxes = document.getElementsByName(checkBoxName);
	let checkCount = 0;
	for (let i = 0; i < checkBoxes.length; i++) {
		if (checkBoxes[i].checked)
			checkCount++;
	}
	if (checkCount === 0) {
		document.getElementById(messageId).style.display = 'block';
		document.getElementById(submitId).disabled = true;
		return false;
	} else {
		document.getElementById(messageId).style.display = 'none';
		document.getElementById(submitId).disabled = false;
		return true;
	}
}

function getOMdbMovie() {
	const title = document.getElementById('title').value;
	const poster = document.getElementById('poster');
	const omdbErr = document.getElementById('OMdbErr');
	const posterURL = document.getElementById('posterURL');
	const starring = document.getElementById('starring');
	const story = document.getElementById('story');
	const datepicker = document.getElementById('datepicker');
	fetch('https://www.omdbapi.com/?t=' + title + '&apikey=c9764c96')
		.then((res) => {
			return res.json();
		}).then((data) => {
			if (data.Response === 'False') {
				poster.src = '/img/no-image.jpg';
				omdbErr.style.display = 'inline';
			} else {
				omdbErr.style.display = 'none';
				poster.src = data.Poster;
				starring.value = data.Actors;
				posterURL.value = data.Poster; // hidden input field to submit
				console.log(story);
				story.value = data.Plot;
				datepicker.value = moment(new
					Date(data.Released)).format('DD/MM/YYYY');
			}
		}).catch(error => { omdbErr.innerHTML = error; })
}

$('#posterUpload').on('change', function () {
	let image = $("#posterUpload")[0].files[0];
	let formdata = new FormData();
	formdata.append('posterUpload', image);
	$.ajax({
		url: '/product/upload',
		type: 'POST',
		data: formdata,
		contentType: false,
		processData: false,
		'success': (data) => {
			$('#poster').attr('src', data.file);
			$('#posterURL').attr('value', data.file);// sets posterURL hidden field
			if (data.err) {
				$('#posterErr').show();
				$('#posterErr').text(data.err.message);
			} else {
				$('#posterErr').hide();
			}
		}
	});
});
