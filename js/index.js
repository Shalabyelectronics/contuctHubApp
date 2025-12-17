// All Random users background
var userBgClasses = [
  "user-bg-1",
  "user-bg-2",
  "user-bg-3",
  "user-bg-4",
  "user-bg-5",
  "user-bg-6",
  "user-bg-7",
  "user-bg-8",
  "user-bg-9",
  "user-bg-10",
  "user-bg-11",
  "user-bg-12",
  "user-bg-13",
  "user-bg-14",
  "user-bg-15",
  "user-bg-16",
  "user-bg-17",
  "user-bg-18",
  "user-bg-19",
  "user-bg-20",
];

// All contact Group classes

var contactGroup = {
  family: `   <div class="icon-wrapper family-badge">
                <i class="fas fa-heart"></i>
                <span>Family</span>
              </div>`,
  friends: `  <div class="icon-wrapper friends-badge">
                  <i class="fas fa-user-group"></i>
                  <span>Friends</span>
              </div>`,
  work: `<div class="icon-wrapper work-badge">
          <i class="fas fa-briefcase"></i>
          <span>Work</span>
        </div>`,
  school: `<div class="icon-wrapper school-badge">
              <i class="fas fa-graduation-cap"></i>
              <span>School</span>
          </div>`,
  other: `  <div class="icon-wrapper other-badge">
              <i class="fas fa-layer-group"></i>
              <span>Other</span>
            </div>`,
};

// Temp contact card element to delete if user comfirm

var deleteContactCardEle = null;

// contact number temperory

let tempNumber = null;

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
var searchInputEle = document.querySelector("#searchInput");
// Delete confirmation Model
const deleteComfermationModal = document.querySelector("#deletionComfermation");
// addedSuccessfullyModal element
var addedSuccessfullyModalEle = document.querySelector(
  addedSuccessfullyModalID
);
var errorModalEle = document.querySelector(errorModalID);
// No Contact found component

const noContactsFoundEle = document.querySelector("#noContactsCom");

// Favorate container list

const favoritesContainerList = document.querySelector(
  "#favoriteContactsContainer"
);
const emergencyContainerList = document.querySelector(
  "#emergencyContactsContainer"
);

// Total Contacts objects Array
var totalContacts = [];
// Favorite Contacts Objects Array
var favoriteContacts = [];
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
  isFavorite: null,
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

// I need to write a function that check all input value in edit and update the validation object before the user edit anything
function checkValidationInputs(contactObj) {
  var regex = {
    fullName: /^[a-zA-Z]{3,20}\s?[a-zA-Z]{0,20}$/,
    phoneNum: /^(02|\+2)?01\d{9}$/,
    email:
      /^[\w\-]{2,}(\.[\w\-]{1,})*@[\w]{2,}((\.|\-)[a-z]{1,})*\.[a-z]{2,5}$/i,
    address: /^\w{1,}(\s?[\.,\-\/]?\s?\w{1,})*$/i,
    notes: /^[\w\s.,!@?()-]+$/im,
  };
  // Select all text inputs withen contact Form

  if (regex.fullName.test(contactObj.fullName)) {
    validationResults.fullName = true;
  }
  if (regex.phoneNum.test(contactObj.phoneNum)) {
    validationResults.phoneNum = true;
  }
  setModalBasedValidation();
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
function validateContactFormInput(contactFormModal) {
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

// 3- now I want to get actual data from inputs when my form inputs are valid, we need to cllects all optional data (Group) and checkbox (Favorite and Emergency).

saveContactBtn.addEventListener("click", function () {
  var validationStatusObj = isAllTextInputsValid();
  if (validationStatusObj.status === "validation passed") {
    var contactGroup = document.querySelector("#contactGroup");
    contactObject.contactGroup = contactGroup.value;
    var emergencyContact = document.querySelector("#emergencyContact");
    var favoriteContact = document.querySelector("#favoriteContact");
    contactObject.isEmergency = emergencyContact.checked;
    contactObject.isFavorite = favoriteContact.checked;

    clearInputs();

    tempNumber = null;
    controllSaveBtnBehaviur(contactFormModal);
    resetContactObj();
    document.querySelector("#noContactsCom").classList.add("d-none");
  }
});

// # Now we are going to build edit function that will do the following first we will add a spicail event listner for each edit button that print the number of the contact card first on console.

function addEventListennerForEditBtn(editBtnElement) {
  editBtnElement.addEventListener("click", function (e) {
    const contactCardEle = e.target.closest(".contact-card");
    let phoneNumberEle = contactCardEle.querySelector(".contact-num");
    let phoneNumber = phoneNumberEle.innerHTML.trim();
    let searchResult = searchForContactObjectByNum(totalContacts, phoneNumber);
    if (searchResult) {
      contactObject = JSON.parse(JSON.stringify(searchResult.objectData));
    }

    tempNumber = contactObject.phoneNum;
    const contactFormModal = document.querySelector("#contactFormModal");
    clearInputSpanError(contactFormModal);
    var modalTitle = contactFormModal.querySelector("#contactFormModalLabel");

    contactFormModal.querySelector("#fullName").value = contactObject.fullName;
    contactFormModal.querySelector("#phoneNum").value = contactObject.phoneNum;

    contactFormModal.querySelector("#email").value = contactObject.email;
    contactFormModal.querySelector("#address").value = contactObject.address;
    contactFormModal.querySelector("#contactGroup").value =
      contactObject.contactGroup;
    contactFormModal.querySelector("#notes").value = contactObject.notes;
    contactFormModal.querySelector("#favoriteContact").checked =
      contactObject.isFavorite;
    contactFormModal.querySelector("#emergencyContact").checked =
      contactObject.isEmergency;
    modalTitle.textContent = `Edit Contact Info for ${contactObject.fullName}`;

    checkValidationInputs(contactObject);
  });
}

// * clear classes is there is any error span shown
function clearInputSpanError(contactFormModal) {
  const allInputs = contactFormModal.querySelectorAll(
    '.custom-input[type="text"]'
  );

  for (const inputElement of allInputs) {
    inputElement.nextElementSibling.classList.replace("in-valid", "valid");
  }
}

// Now there is a problem and it is about that the save btn already create a new contact card and I want only when add new contact will create a new contact card and if we edit just edit the spacific contact card So I will creat a function that for add new contact card and another one is updatinig existing contact cart

function addNewContactCard() {
  let contactCardComEle = contactCardComponent(
    "div",
    ["col-md-6", "contact-card-component"],
    createContactCardComponent,
    contactObject
  );
  deletbuttonEle = contactCardComEle;
  const favoriteBtnEle = contactCardComEle.querySelector(
    ".action-favorite-icon"
  );
  const emergencyBtnEle = contactCardComEle.querySelector(
    ".action-emergency-icon"
  );
  const editContactCardBtn =
    contactCardComEle.querySelector(".edit-action-icon");
  const deleteBtnEle = contactCardComEle.querySelector(".delete-action-icon");
  addEventListennerForFavOrEmr("favorite", favoriteBtnEle);
  addEventListennerForFavOrEmr("emergency", emergencyBtnEle);
  addEventListennerForEditBtn(editContactCardBtn);
  addEventTodeleteContactCardElement(deleteBtnEle);

  document.querySelector("#contactsCardsContainer").append(contactCardComEle);
}

function updateExistingContactCard() {
  const existingContactObject = searchForContactObjectByNum(
    totalContacts,
    tempNumber
  );

  if (existingContactObject) {
    totalContacts.splice(existingContactObject.objectIndex, 1, contactObject);
  }

  const existedContactCardEle = returnContactCardElementByphoneNum(
    "#contactsCardsContainer",
    tempNumber
  );

  if (!existedContactCardEle) {
    console.error("Could not find the card to replace in the DOM.");
    return;
  }

  let updatedContactCardEle = contactCardComponent(
    "div",
    ["col-md-6", "contact-card-component"],
    createContactCardComponent,
    contactObject
  );

  const favoriteBtnEle = updatedContactCardEle.querySelector(
    ".action-favorite-icon"
  );
  const emergencyBtnEle = updatedContactCardEle.querySelector(
    ".action-emergency-icon"
  );
  const editContactCardBtn =
    updatedContactCardEle.querySelector(".edit-action-icon");
  const deleteBtnEle = updatedContactCardEle.querySelector(
    ".delete-action-icon"
  );
  addEventListennerForFavOrEmr("favorite", favoriteBtnEle);
  addEventListennerForFavOrEmr("emergency", emergencyBtnEle);
  addEventTodeleteContactCardElement(deleteBtnEle);
  addEventListennerForEditBtn(editContactCardBtn);
  document
    .querySelector("#contactsCardsContainer")
    .replaceChild(updatedContactCardEle, existedContactCardEle);

  document
    .querySelector("#contactsCardsContainer")
    .replaceChild(updatedContactCardEle, existedContactCardEle);
}

// # We will create a function that return the existed element that we want to replace

function returnContactCardElementByphoneNum(parentID, phoneNum) {
  // #contactsCardsContainer
  const container = document.querySelector(parentID);
  if (!container) return null;
  const contactsCardsEle = container.children;
  for (const contactCard of contactsCardsEle) {
    if (contactCard.classList.contains("contact-card-component")) {
      const contactPhoneNumber = contactCard
        .querySelector(".contact-num")
        .innerHTML.trim();
      if (contactPhoneNumber === phoneNum.trim()) {
        return contactCard;
      }
    }
  }
  return null;
}

// We will add a controll flow for save button that will check the status before call add new contact card or update the existing contact card

function controllSaveBtnBehaviur(contactModelFormEle) {
  const modalTitle = contactModelFormEle.querySelector(
    "#contactFormModalLabel"
  );

  let modalStatus = modalTitle.textContent;

  if (modalStatus.split(" ")[0] === "Add") {
    updateContactsCountersList();
    addNewContactCard();
    updateCounterDomEle();
    saveContactsToLocalStorage();
  } else if (modalStatus.split(" ")[0] === "Edit") {
    updateExistingContactCard();
    favoriteContacts = [];
    emergencyContacts = [];
    for (const contactObj of totalContacts) {
      if (contactObj.isFavorite) {
        favoriteContacts.push(contactObj);
      }
      if (contactObj.isEmergency) {
        emergencyContacts.push(contactObj);
      }
    }
    updateCounterDomEle();
    saveContactsToLocalStorage();
    checkIfElementFavEmeChange(totalContacts);
  }
}

// We want to study how to edit exact contact card by clicking on edit on the contact card ?
// Lets think loudly first I'm thinking about something and it is instead of re-display all contact each time I add only one contact is not good thing right so what I'm thinking is why we keep display function for creating all contacts cards just once we reload the page but when we add new contact we just add this one by using append Dom method so to test this soluation I'm going to work on it by my self under function name appendOneContactCard. Wow I did it after using insertAdjacentHTML it will append the html element to dom. so we done from first point second point is we need to add an event listeners to action buttons (favorite , emergency , edit and delete) so in this case I need to add just the event listeners for each not for all again.

function appendOneContactCard() {
  // first we want to test it when I press on test btn I will add an h1 contain hello word.
  const testBtn = document.querySelector("#testBtn");

  const testContainer = document.querySelector(".test-container");

  testBtn.addEventListener("click", function () {
    const textEle = document.createElement("h1");
    textEle.classList.add("text-danger", "bg-warning");
    textEle.setAttribute("id", "testMe");
    const insedeTextEle =
      "<span class='shalaby text-warning fs-18-24 fw-500'>I am a span </span>";
    textEle.innerHTML = insedeTextEle;

    let mySpan = textEle.querySelector(".shalaby");

    testContainer.append(textEle);
    alert("I am the parent");
    mySpan.addEventListener("click", function (e) {
      e.stopPropagation();
      alert("I am the chile");
    });
  });
}

// 4- now after we complated contact object data when click on save contact btn and when it successfully passed the validation. So now we can update the counters by pushing contacts to totalContacts Array and if the contact is under favrate category will save it in seprate array and same for Emergency.
function updateContactsCountersList() {
  if (contactObject.phoneNum) {
    totalContacts.push(contactObject);
  }
  if (contactObject.isEmergency) {
    emergencyContacts.push(contactObject);
  }
  if (contactObject.isFavorite) {
    favoriteContacts.push(contactObject);
  }
}

// 5- We need to siperate updating the counter in DOM from list and make it after updating the list
function updateCounterDomEle() {
  document.querySelector("#totalContacts").textContent = totalContacts.length;
  document.querySelector("#totalContactsSerachSection").textContent =
    totalContacts.length;
  document.querySelector("#emergencyContacts").textContent =
    emergencyContacts.length;
  document.querySelector("#favoriteContacts").textContent =
    favoriteContacts.length;
  // Will update the counter in  search section
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
    isFavorite: false,
    isEmergency: false,
  };
}

// 7- now we need to save new copy for my three contacts Arraies inside an object that we will use it as our localStorage data
function saveContactsToLocalStorage() {
  var contactsArrObj = {
    totalContacts: totalContacts,
    favoriteContacts: favoriteContacts,
    emergencyContacts: emergencyContacts,
  };

  localStorage.setItem("contactsArrObj", JSON.stringify(contactsArrObj));
}

// 8- After we saved the contactsArrObj to localStorage we need to create another function that check if there is a data in localstorage then update the counter with it.
function checkIfLocalDataAvailable() {
  var contactsArrObj = JSON.parse(localStorage.getItem("contactsArrObj"));

  if (contactsArrObj !== null) {
    totalContacts = contactsArrObj.totalContacts;
    favoriteContacts = contactsArrObj.favoriteContacts;
    emergencyContacts = contactsArrObj.emergencyContacts;
    updateCounterDomEle();
    document.querySelector("#noContactsCom").classList.add("d-none");
    displayContactsCards();
    checkIfElementFavEmeChange(totalContacts);
  } else {
    document.querySelector("#noContactsCom").classList.remove("d-none");
  }

  if (!totalContacts.length) {
    noContactsFoundEle.classList.remove("d-none");
  }
}

// 9- After we solved saving contacts to local object and get it back when reload I want to create a new function that check if phone number is dublucated or not and it will show a modal with the error msg.

function checkIfPhoneNumberDublucated(phoneNumber) {
  if (tempNumber !== phoneNumber) {
    for (var i = 0; i < totalContacts.length; i++) {
      if (totalContacts[i].phoneNum === phoneNumber) {
        validationResults.isdublucated.status = true;
        validationResults.isdublucated.underName = totalContacts[i].fullName;

        return true;
      }
    }
  }

  validationResults.isdublucated.status = false;
  return false;
}

// 10- After preparing the contacts Arraies lists nad save it to local storage and get it from it back now the fun part start and it is to display contacts cards.
// *- Get first Char from each name part

function displayContactsCards() {
  for (var i = 0; i < totalContacts.length; i++) {
    let contactCardComEle = contactCardComponent(
      "div",
      ["col-md-6", "contact-card-component", "h-100"],
      createContactCardComponent,
      totalContacts[i]
    );

    const favoriteBtnEle = contactCardComEle.querySelector(
      ".action-favorite-icon"
    );
    const emergencyBtnEle = contactCardComEle.querySelector(
      ".action-emergency-icon"
    );
    const editContactCardBtn =
      contactCardComEle.querySelector(".edit-action-icon");
    const deleteContactBtn = contactCardComEle.querySelector(
      ".delete-action-icon"
    );
    deletbuttonEle = contactCardComEle;
    addEventTodeleteContactCardElement(deletbuttonEle);
    addEventListennerForFavOrEmr("favorite", favoriteBtnEle);
    addEventListennerForFavOrEmr("emergency", emergencyBtnEle);
    addEventListennerForEditBtn(editContactCardBtn);

    document.querySelector("#contactsCardsContainer").append(contactCardComEle);
  }
}

// 11- now we want to add or remove contacts from favorite contacts list when user press on favorite icon color so first it will edit the current contact object by its number as we are going to treated as an ID.

// We will dublucate same this function to add it to emergency button as there is too much details I will think to make it clean later
function addFuctionalityForFavoriteBtns() {
  var allFavoritesBtnsList = document.querySelectorAll(".action-favorite-icon");
  for (var i = 0; i < allFavoritesBtnsList.length; i++) {
    // We want to make the below dynamic function nodeObj also we want the class for optional badge (favorite or emergency) the rest are same we need to change the activeFavIcon to be activeIcon so next want to check if favorite search for the phone number in favorite list or on emergency list and based of that we will do the reset

    addEventListennerForFavOrEmr("favorite", allFavoritesBtnsList[i]);
  }
}
// Now As the logic of Favorite Btn we will do the emergency btn exactly
function addFuctionalityForEmergencyBtns() {
  // This comments to locate what I just need to change for clean code later
  // 1- First Change is Selecting the Emergency btn by class
  var allEmergencyBtnsList = document.querySelectorAll(
    ".action-emergency-icon"
  );
  // 2- loop throw the allEmergencyBtnsList
  for (var i = 0; i < allEmergencyBtnsList.length; i++) {
    addEventListennerForFavOrEmr("emergency", allEmergencyBtnsList[i]);
  }
}

// * I will build a function that can search for a spacific number givin on selected list and return it's index

function searchForContactObjectByNum(listToSearchIn, phoneNumber) {
  var result = null;
  for (var i = 0; i < listToSearchIn.length; i++) {
    if (listToSearchIn[i].phoneNum === phoneNumber) {
      result = { objectIndex: i, objectData: listToSearchIn[i] };
    }
  }
  return result;
}

// *- now I want when click on favorite button if the number is already in favorite list remove it if not add it from main contacts list and while doing that you need to update the contactobject data by isFavorite key where if add it to favorite list make it value true ad if not false then save new changes to local storage.

function addRemoveContactFromList(
  contactObjectFromSearch,
  mainContactsList,
  targetContactList,
  targetKeyToChangeItValue
) {
  if (contactObjectFromSearch) {
    // if the contact object come from search function not null that mean that the contact is already existed on the target contact list and we need to remove it as well
    // But before we remove it from the list we need to edit it's value in the main contacts list so when we use updateContactsCountersList will see the new update.
    var mainContactObj = searchForContactObjectIndex(
      mainContactsList,
      contactObjectFromSearch.objectData.phoneNum
    );
    totalContacts[mainContactObj.objectIndex][targetKeyToChangeItValue] = false;
    targetContactList.splice(contactObjectFromSearch.objectIndex, 1);

    updateCounterDomEle();
  }
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
  var favoriteContact = document.querySelector("#favoriteContact");
  emergencyContact.checked = false;
  favoriteContact.checked = false;
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
validateContactFormInput(contactFormModal);

addNewContactBtn.addEventListener("click", function () {
  clearInputs();
  setModalBasedValidation();
  contactFormModal.querySelector("#phoneNum").disabled = false;
});

// This function designed to add event listenner for favorite or emergency button

function addEventListennerForFavOrEmr(btnName, btnElement) {
  btnElement.addEventListener("click", function (e) {
    let contactCardEle = e.target.closest(".contact-card");
    let phoneNumber = contactCardEle
      .querySelector(".contact-num")
      .innerHTML.trim();
    let btnImgBadge = contactCardEle.querySelector(`.${btnName}-img-badge`);
    let btnOptBadge = contactCardEle.querySelector(
      `.${btnName}-optional-badge`
    );
    let activeBtnIcon = contactCardEle.querySelector(`.action-${btnName}-icon`);

    let searchResultInTotal = searchForContactObjectByNum(
      totalContacts,
      phoneNumber
    );
    contactObject = totalContacts[searchResultInTotal.objectIndex];
    if (btnName === "favorite") {
      if (contactObject.isFavorite) {
        contactObject.isFavorite = false;
        const favoriteContactObj = searchForContactObjectByNum(
          favoriteContacts,
          contactObject.phoneNum
        );
        btnImgBadge.classList.add("d-none");
        btnOptBadge.classList.add("d-none");
        activeBtnIcon.classList.remove("active-action");
        favoriteContacts.splice(favoriteContactObj.objectIndex, 1);
        checkIfElementFavEmeChange(totalContacts);
        saveContactsToLocalStorage();
        updateCounterDomEle();
      } else {
        contactObject.isFavorite = true;
        checkIfElementFavEmeChange(totalContacts);
        btnImgBadge.classList.remove("d-none");
        btnOptBadge.classList.remove("d-none");
        activeBtnIcon.classList.add("active-action");
        favoriteContacts.push(contactObject);
        saveContactsToLocalStorage();
        updateCounterDomEle();
      }
    }
    if (btnName === "emergency") {
      if (contactObject.isEmergency) {
        contactObject.isEmergency = false;
        let emergencyContactObj = searchForContactObjectByNum(
          emergencyContacts,
          contactObject.phoneNum
        );

        btnImgBadge.classList.add("d-none");
        btnOptBadge.classList.add("d-none");
        activeBtnIcon.classList.remove("active-action");
        emergencyContacts.splice(emergencyContactObj.objectIndex, 1);
        checkIfElementFavEmeChange(totalContacts);
        saveContactsToLocalStorage();
        updateCounterDomEle();
      } else {
        contactObject.isEmergency = true;
        checkIfElementFavEmeChange(totalContacts);
        btnImgBadge.classList.remove("d-none");
        btnOptBadge.classList.remove("d-none");
        activeBtnIcon.classList.add("active-action");
        emergencyContacts.push(contactObject);
        saveContactsToLocalStorage();
        updateCounterDomEle();
      }
    }
  });
}

function contactCardComponent(
  parentTag,
  parentClassList,
  eleHTMLToInsert,
  eleObject
) {
  const parentComponent = document.createElement(parentTag);
  for (classRule of parentClassList) {
    parentComponent.classList.add(classRule);
  }
  const childHTML = eleHTMLToInsert(eleObject);
  parentComponent.innerHTML = childHTML;

  return parentComponent;
}

// Now I'm going to create a function that will add an event listenner on delete so I can delete to contact from the total contact list then check if it is in favorate or emergency also delet it as well then delete it from the dom.

function addEventTodeleteContactCardElement(deletbuttonEle) {
  deletbuttonEle.addEventListener("click", function (e) {
    deleteContactCardEle = e.target.closest(".contact-card");

    const contactName =
      deleteContactCardEle.querySelector(".contact-name").innerHTML;
    deleteComfermationModal.querySelector("#deletContactName").innerHTML =
      contactName;
  });
}

function comfirmationDeletionBtn() {
  const confirmationBtn = deleteComfermationModal.querySelector(
    "#deletionComfermation"
  );
  confirmationBtn.addEventListener("click", function () {
    if (deleteContactCardEle) {
      const phoneNumber =
        deleteContactCardEle.querySelector(".contact-num").innerHTML;

      if (phoneNumber) {
        // Get phone number object
        const contactObj = searchForContactObjectByNum(
          totalContacts,
          phoneNumber
        );
        if (contactObj) {
          // remove it from total contacts
          totalContacts.splice(contactObj.objectIndex, 1);
          // check if contact number in favorite list

          if (contactObj.objectData.isFavorite) {
            const favoritContact = searchForContactObjectByNum(
              favoriteContacts,
              phoneNumber
            );

            favoriteContacts.splice(favoritContact.objectIndex, 1);
          }

          // Check if number in emergency list
          if (contactObj.objectData.isEmergency) {
            const EmergencyContact = searchForContactObjectByNum(
              emergencyContacts,
              phoneNumber
            );
            emergencyContacts.splice(EmergencyContact.objectIndex, 1);
          }
        }
        favoritesContainerList.innerHTML = "";
        emergencyContainerList.innerHTML = "";
        checkIfElementFavEmeChange(totalContacts);
        updateCounterDomEle();
        saveContactsToLocalStorage();
      }

      if (!totalContacts.length) {
        noContactsFoundEle.classList.remove("d-none");
      }

      deleteContactCardEle.parentElement.parentElement.remove();

      deleteContactCardEle = null;
    }
  });
}

comfirmationDeletionBtn();

// Now we will work on search component where the user can search for number by name, phone and email

function searchForContacts() {
  searchInputEle.addEventListener("input", function (e) {
    let hasMatch = false;
    const searchValue = e.target.value.toLowerCase();
    const contactsCardsElem = document.querySelector(
      "#contactsCardsContainer"
    ).children;

    // document.querySelector("#contactsCardsContainer").innerHTML = "";

    // First loop and check only the contact-card-component
    for (const contactCardEle of contactsCardsElem) {
      if (contactCardEle.classList.contains("contact-card-component")) {
        const contactName = contactCardEle
          .querySelector(".contact-name")
          .innerHTML.toLowerCase();
        const contactNumber = contactCardEle
          .querySelector(".contact-num")
          .innerHTML.toLowerCase();
        const contactEmail = contactCardEle
          .querySelector("#emailAddress")
          .innerHTML.toLowerCase();
        if (
          contactName.includes(searchValue) ||
          contactNumber.includes(searchValue) ||
          contactEmail.includes(searchValue)
        ) {
          contactCardEle.classList.remove("d-none");
          hasMatch = true;
        } else {
          contactCardEle.classList.add("d-none");
        }
      }
    }
    if (hasMatch) {
      noContactsFoundEle.classList.add("d-none");
    } else {
      noContactsFoundEle.classList.remove("d-none");
    }
  });
}

searchForContacts();
