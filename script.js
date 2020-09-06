import faker from 'faker';

const tbody = document.querySelector('tbody');

let persons = Array.from({ length: 10 }, () => {
	return {
		id: faker.random.uuid(),
		lastName: faker.name.lastName(),
		firstName: faker.name.firstName(),
		jobTitle: faker.name.jobTitle(),
		jobArea: faker.name.jobArea(),
		phone: faker.phone.phoneNumber(),
		picture: faker.image.avatar(100, 100),
	};
});

const displayList = data => {
	tbody.innerHTML = data
		.map(
			(person, index) => `
    <tr data-id="${person.id}" class="${index % 2 ? 'even' : ''}">
        <td><img src="${person.picture}" alt="${person.firstName + ' ' + person.lastName}"/></td>
        <td class="last-name">${person.lastName}</td>
        <td class="first-name">${person.firstName}</td>
        <td class="job-title">${person.jobTitle}</td>
        <td class="job-area">${person.jobArea}</td>
        <td class="phone">${person.phone}</td>
        <td>
            <button class="edit">
                <svg viewBox="0 0 20 20" fill="currentColor" class="pencil w-6 h-6"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>
            </button>
            <button class="delete">
                <svg viewBox="0 0 20 20" fill="currentColor" class="trash w-6 h-6"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
            </button>
            </td>
    </tr>
`
		)
		.join('');
};

// handle the clicks
const handleClicks = (e) => {
	const button = e.target;
	if(button.closest('button.edit')) {
		const parent = button.closest('tr');
		const id = parent.dataset.id;
		editPartnerPopup(id);
	}
	if(button.closest('button.delete')) {
		const parent = button.closest('tr');
		const id = parent.dataset.id;
		console.log('Delete');
		deletePartner(id);
	}

}

// destroy the popup after submit or cancel
async function destroyPopup(popup) {
    popup.classList.remove('open');
    //remove the popup from the DOM
    popup.remove();
    //remove from the javascript memory
    popup = null;
}

// const editPartner = (id) => {
// 	// code edit function here
// 	let personToEdit = persons.find(person => person.id === id);
// 	console.log(personToEdit);
// 	editPartnerPopup(personToEdit, id);
// };

const editPartnerPopup = (id) => {
	let personToEdit = persons.find(person => person.id === id);
	// create edit popup here
	return new Promise(async function(resolve) {
		const formPopup = document.createElement('form');
		formPopup.classList.add('popup');
        formPopup.insertAdjacentHTML("afterbegin", `
		<div>
		<fieldset>
            <label>Last name</label>
            <input type="text" name="lastName" value="${personToEdit.lastName}">
		</fieldset>
		<fieldset>
            <label>First name</label>
            <input type="text" name="firstName" value="${personToEdit.firstName}">
		</fieldset>
		<fieldset>
            <label>Job title</label>
            <input type="text" name="jobTitle" value="${personToEdit.jobTitle}">
		</fieldset>
		<fieldset>
            <label>Job area</label>
            <input type="text" name="jobArea" value="${personToEdit.jobArea}">
		</fieldset>
		<fieldset>
            <label>Phone number</label>
            <input type="tel" name="phoneNumber" value="${personToEdit.phone}">
		</fieldset>
		<fieldset>
			<button type="submit">Save</button>
			<button type="button" class="cancel" name="cancel">Cancel</button>
		</fieldset>
		</div>
		`);

		 //listen for the submit event on the formPopup
		 formPopup.addEventListener('submit', e => {
			e.preventDefault();
			resolve();
			//edit the mama array
			personToEdit.lastName = formPopup.lastName.value;
			personToEdit.firstName = formPopup.firstName.value;
			personToEdit.jobTitle = formPopup.jobTitle.value;
			personToEdit.jobArea = formPopup.jobArea.value;
			personToEdit.phone = formPopup.phoneNumber.value
			displayList(persons)
			console.log(personToEdit);
            destroyPopup(formPopup);
		}, {once: true});
		
		//listen for the cancel button
		if(formPopup.cancel) {
			formPopup.cancel.addEventListener('click', function() {
				resolve(null);
				destroyPopup(formPopup);
			}, 
			{once: true});
		}


		resolve(document.body.appendChild(formPopup));
		formPopup.classList.add('open');
	});

};

const deletePartner = (id) => {
	// code delete function gere
	let personToDelete = persons.find(person => person.id === id);
	deletePartnerPopup(personToDelete);
};

const deletePartnerPopup = (person) => {
	// create confirmation popup here
	return new Promise(async function(resolve) {
		const deletePopup = document.createElement('div');
		deletePopup.classList.add('popup');
        deletePopup.insertAdjacentHTML("afterbegin", `
		
		<div>
			<p>Are you sure to delete <bold>${person.lastName} ${person.firstName}</bold>?</p>
			<button class="yes">Yes</button>
			<button class="cancel">Cancel</button>
		</div>
		`);

		deletePopup.addEventListener('click', (e) => {
			if(e.target.matches('button.yes')) {
				persons = persons.filter(partner => partner.id !== person.id);
				displayList(persons);
				destroyPopup(deletePopup);
				console.log(persons)
			}

			if(e.target.matches('button.cancel')){
				destroyPopup(deletePopup);
			}
		})
		resolve();
		document.body.appendChild(deletePopup)
		deletePopup.classList.add('open');
	});
};

displayList(persons);

// Event listeners
document.addEventListener('click', handleClicks);

