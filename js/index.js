// Select add new contact button
var addNewContactBtn = document.querySelector(".btn-add-contact");
// Select contact Modal component
var contactFormModal = document.querySelector("#contactFormModal");
// I'm going to use this variable when all form is valid
var validationResults = {
  fullName: null,
  phoneNum: null,
  email: null,
  address: null,
  notes: null,
};

var contactObject = {
  fullName: null,
  phoneNum: null,
  email: null,
  address: null,
  notes: null,
};

// validat contact form input function description inside
function validateContactFormInput() {
  /*
This function will work one time only when the page load and it will select all inputs within the contact form modal then assign an event listenner to it to check if input is valid based Regex
*/

  var regex = {
    fullName: /^[a-zA-Z]{3,20}\s?[a-zA-Z]{0,20}$/,
    phoneNum: /^(02|\+2)?01\d{9}$/,
    email:
      /^[\w\-]{2,}(\.[\w\-]{1,})*@[\w]{2,}((\.|\-)[a-z]{1,})*\.[a-z]{2,5}$/i,
    address: /^\w{1,}(\s?[\.,\-\/]?\s?\w{1,})*$/i,
    notes: /^[\w\s.,!@?()-]+$/im,
  };

  // Select all inputs withen contact Form
  var allInputs = contactFormModal.querySelectorAll(
    '.custom-input[type="text"]'
  );
  for (var i = 0; i < allInputs.length; i++) {
    allInputs[i].addEventListener("input", function (e) {
      if (regex[e.target.id].test(e.target.value)) {
        e.target.nextElementSibling.classList.replace("in-valid", "valid");
        validationResults[e.target.id] = true;
      } else {
        e.target.nextElementSibling.classList.replace("valid", "in-valid");
        validationResults[e.target.id] = false;
      }
    });
  }
}

// Edit Contact Form Modal Title Function
function editContactFormModalTitle(btnElement, title) {
  btnElement.addEventListener("click", function () {
    // When user click the add button or edit button first we need to select the contact form modal to change its title to Add New Contact.
    var contactFormModal = document.querySelector("#contactFormModal");
    // within the contact form modal select the modal title and change it as well
    var modalTitle = contactFormModal.querySelector("#contactFormModalLabel");

    modalTitle.textContent = title;
  });
}

editContactFormModalTitle(addNewContactBtn, "Add New Contact");

// Assign event listener for contact form Text inputs (fullName,phoneNum,email,address,notes);
validateContactFormInput();
