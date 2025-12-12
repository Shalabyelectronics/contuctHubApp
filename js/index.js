// Select add new contact button
var addNewContactBtn = document.querySelector(".btn-add-contact");
// select the save contact button
var saveContactBtn = document.querySelector("#saveContactBtn");
// Select contact Modal component
var contactFormModal = document.querySelector("#contactFormModal");

// addedSuccessfullyModal id
var addedSuccessfullyModalID = "#contactAddedSuccessfully";
// Error Modal ID
var errorModalID = "#inputErrorModal";

// addedSuccessfullyModal element
var addedSuccessfullyModalEle = document.querySelector(
  addedSuccessfullyModalID
);
var errorModalEle = document.querySelector(errorModalID);

// Total Contacts objects Array
var totalContacts = [];
// Favorate Contacts Objects Array
var favorateContacts = [];
// Emergency Contacts Objects Array
var emergencyContacts = [];

// WE will check if there are a local data available
checkIfLocalDataAvailable();

// I'm going to use this variable when all form is valid
var validationResults = {
  fullName: false,
  phoneNum: false,
  email: false,
  address: false,
  notes: false,
  isdublucated: { status: false, underName: null },
};

var contactObject = {
  fullName: null,
  phoneNum: null,
  email: null,
  address: null,
  notes: null,
  contactGroup: null,
  isFavorate: false,
  isEmergency: false,
};

// Get inputs values when user click on save contact button it will check first if its validate if yes will show contact successfully added otherwise it will show another modal that contain if there is an error on validation or later if the number is dublicated.

// 1- I will create a function that will check if all text inputs are valid by checking the validationResults object if all true it will return and object contain status object if all passed or what is the first false input

function isAllTextInputsValid() {
  if (!validationResults.fullName) {
    return {
      status: "validation faild",
      faildOn: "fullName",
      errorMsgTitle: "Full name Error",
      errorMsgDes: "Please, check your full name!",
    };
  } else if (!validationResults.phoneNum) {
    return {
      status: "validation faild",
      faildOn: "phoneNum",
      errorMsgTitle: "Phone number Error",
      errorMsgDes: "Please, check your phone number!",
    };
  } else if (validationResults.isdublucated.status) {
    return {
      status: "validation faild",
      faildOn: "phoneNum",
      errorMsgTitle: "Phone number dublucated",
      errorMsgDes: `The Phone number is already existed under contact name : ${validationResults.isdublucated.underName}`,
    };
  } else {
    return { status: "validation passed" };
  }
}
// 2- Second I want to get that object from isAllTextInputValid and use it to edit on data-bs-target first I want it basic just when click on the save contact btn I want to show me what value inside the data-bs-target

// attached an event lestinner to save contact button to check is all text input valid
function setModalBasedValidation() {
  var validationStatusObj = isAllTextInputsValid();
  if (validationStatusObj.status === "validation passed") {
    saveContactBtn.setAttribute("data-bs-target", addedSuccessfullyModalID);
  } else if (validationStatusObj.status === "validation faild") {
    saveContactBtn.setAttribute("data-bs-target", errorModalID);
    errorModalEle.querySelector("#errorMsgTitle").textContent =
      validationStatusObj.errorMsgTitle;
    errorModalEle.querySelector("#errorMsgDes").textContent =
      validationStatusObj.errorMsgDes;
  }
  return validationStatusObj;
}
// I didn't use this function yet
function setErrorMsgBasedInput(inputEle) {
  document
    .querySelector(`#${inputEle}`)
    .nextElementSibling.classList.replace("valid", "in-valid");
}

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

  // Select all text inputs withen contact Form
  var allInputs = contactFormModal.querySelectorAll(
    '.custom-input[type="text"]'
  );
  for (var i = 0; i < allInputs.length; i++) {
    allInputs[i].addEventListener("input", function (e) {
      if (regex[e.target.id].test(e.target.value)) {
        e.target.nextElementSibling.classList.replace("in-valid", "valid");
        validationResults[e.target.id] = true;
        contactObject[e.target.id] = e.target.value;
        if (e.target.id === "phoneNum") {
          checkIfPhoneNumberDublucated(e.target.value);
        }
      } else {
        e.target.nextElementSibling.classList.replace("valid", "in-valid");
        validationResults[e.target.id] = false;
      }
      setModalBasedValidation();
    });
  }
}
// I want to get optional Data first

// 3- now I want to get actual data from inputs when my form inputs are valid, we need to cllects all optional data (Group) and checkbox (Favorate and Emergency).

saveContactBtn.addEventListener("click", function () {
  var validationStatusObj = isAllTextInputsValid();
  if (validationStatusObj.status === "validation passed") {
    var contactGroup = document.querySelector("#contactGroup");
    contactObject.contactGroup = contactGroup.value;
    var emergencyContact = document.querySelector("#emergencyContact");
    var favorateContact = document.querySelector("#favorateContact");
    contactObject.isEmergency = emergencyContact.checked;
    contactObject.isFavorate = favorateContact.checked;
    updateContactsCountersList();
    updateCounterDomEle();
    clearInputs();
    saveContactsToLocalStorage();
  }
});

// 4- now after we complated contact object data when click on save contact btn and when it successfully passed the validation. So now we can update the counters by pushing contacts to totalContacts Array and if the contact is under favrate category will save it in seprate array and same for Emergency.
function updateContactsCountersList() {
  totalContacts.push(contactObject);

  if (contactObject.isEmergency) {
    emergencyContacts.push(contactObject);
  }
  if (contactObject.isFavorate) {
    favorateContacts.push(contactObject);
  }
  resetContactObj();
}

// 5- We need to siperate updating the counter in DOM from list and make it after updating the list
function updateCounterDomEle() {
  document.querySelector("#totalContacts").textContent = totalContacts.length;
  document.querySelector("#emergencyContacts").textContent =
    emergencyContacts.length;
  document.querySelector("#favorateContacts").textContent =
    favorateContacts.length;
}
// 6- now we want to reset the contactObject so it return to its default.
function resetContactObj() {
  contactObject = {
    fullName: null,
    phoneNum: null,
    email: null,
    address: null,
    notes: null,
    contactGroup: null,
    isFavorate: false,
    isEmergency: false,
  };
}

// 7- now we need to save new copy for my three contacts Arraies inside an object that we will use it as our localStorage data
function saveContactsToLocalStorage() {
  var contactsArrObj = {
    totalContacts: totalContacts,
    favorateContacts: favorateContacts,
    emergencyContacts: emergencyContacts,
  };

  localStorage.setItem("contactsArrObj", JSON.stringify(contactsArrObj));
}

// 8- After we saved the contactsArrObj to localStorage we need to create another function that check if there is a data in localstorage then update the counter with it.
function checkIfLocalDataAvailable() {
  var contactsArrObj = JSON.parse(localStorage.getItem("contactsArrObj"));
  console.log(contactsArrObj);
  if (contactsArrObj !== null) {
    totalContacts = contactsArrObj.totalContacts;
    favorateContacts = contactsArrObj.favorateContacts;
    emergencyContacts = contactsArrObj.emergencyContacts;
    updateCounterDomEle();

    console.log("There is Data in local storage");
  } else {
    console.log("No Data in local storage");
  }
}

// 9- After we solved saving contacts to local object and get it back when reload I want to create a new function that check if phone number is dublucated or not and it will show a modal with the error msg.

function checkIfPhoneNumberDublucated(phoneNumber) {
  var isdublucated = false;
  for (var i = 0; i < totalContacts.length; i++) {
    if (totalContacts[i].phoneNum === phoneNumber) {
      validationResults.isdublucated.status = true;
      validationResults.isdublucated.underName = totalContacts[i].fullName;
      isdublucated = true;
    }
  }
  return isdublucated;
}

// This function will clear inputs
function clearInputs() {
  // Select all text inputs withen contact Form
  var allInputs = contactFormModal.querySelectorAll(
    '.custom-input[type="text"]'
  );
  for (var i = 0; i < allInputs.length; i++) {
    allInputs[i].value = "";
  }
  var contactGroup = document.querySelector("#contactGroup");
  contactGroup.value = "default";
  var emergencyContact = document.querySelector("#emergencyContact");
  var favorateContact = document.querySelector("#favorateContact");
  emergencyContact.checked = false;
  favorateContact.checked = false;
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

addNewContactBtn.addEventListener("click", function () {
  var validationStatusObj = setModalBasedValidation();
});
