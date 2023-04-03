// Contact Class: Represents a Contact
class Contact {
  constructor(name, about, contactNumber) {
    this.name = name;
    this.about = about;
    this.contactNumber = contactNumber;
  }
}

// UI Class: Handle UI Tasks
class UI {
  static displayContacts() {
    const Contacts = Store.getContacts();

    Contacts.forEach((Contact) => UI.addContactToList(Contact));
  }

  static addContactToList(Contact) {
    const list = document.querySelector('#Contact-list');

    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${Contact.name}</td>
        <td>${Contact.about}</td>
        <td>${Contact.contactNumber}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
      `;

    list.appendChild(row);
  }

  static deleteContact(el) {
    if (el.classList.contains('delete')) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#Contact-form');
    container.insertBefore(div, form);

    // Vanish in 3 seconds
    setTimeout(() => document.querySelector('.alert').remove(), 3000);
  }

  static clearFields() {
    document.querySelector('#name').value = '';
    document.querySelector('#about').value = '';
    document.querySelector('#contactNumber').value = '';
  }
}

// Store Class: Handles Storage
class Store {
  static getContacts() {
    let Contacts;
    if (localStorage.getItem('Contacts') === null) {
      Contacts = [];
    } else {
      Contacts = JSON.parse(localStorage.getItem('Contacts'));
    }

    return Contacts;
  }

  static addContact(Contact) {
    const Contacts = Store.getContacts();
    Contacts.push(Contact);
    localStorage.setItem('Contacts', JSON.stringify(Contacts));
  }

  static removeContact(contactNumber) {
    const Contacts = Store.getContacts();

    Contacts.forEach((Contact, index) => {
      if (Contact.contactNumber === contactNumber) {
        Contacts.splice(index, 1);
      }
    });

    localStorage.setItem('Contacts', JSON.stringify(Contacts));
  }
}

// Event: Display Contacts
document.addEventListener('DOMContentLoaded', UI.displayContacts);

// Event: Add a Contact
document.querySelector('#Contact-form').addEventListener('submit', (e) => {
  // Prevent actual submit
  e.preventDefault();

  // Get form values
  const name = document.querySelector('#name').value;
  const about = document.querySelector('#about').value;
  const contactNumber = document.querySelector('#contactNumber').value;

  // Validate
  if (name === '' || about === '' || contactNumber === '') {
    UI.showAlert('Please fill in all fields', 'danger');
  } else {
    // Instatiate Contact
    const contact = new Contact(name, about, contactNumber);

    // Add Contact to UI
    UI.addContactToList(contact);

    // Add Contact to store
    Store.addContact(contact);

    // Show success message
    UI.showAlert('Contact Added', 'success');

    // Clear fields
    UI.clearFields();
  }
});

// Event: Remove a Contact
document.querySelector('#Contact-list').addEventListener('click', (e) => {
  // Remove Contact from UI
  UI.deleteContact(e.target);

  // Remove Contact from store
  Store.removeContact(e.target.parentElement.previousElementSibling.textContent);

  // Show success message
  UI.showAlert('Contact Removed', 'success');
});