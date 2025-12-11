var addNewContactBtn = document.querySelector(".btn-add-contact");


// live contact form validation
var fullNameInput = 

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
