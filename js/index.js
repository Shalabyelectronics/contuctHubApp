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
    updateContactsCountersList();
    updateCounterDomEle();
    clearInputs();
    saveContactsToLocalStorage();
    // displayContactsCards();

    let contactCardComEle = contactCardComponent(
      "div",
      ["col-md-6", "contact-card-component"],
      createContactCardComponent,
      contactObject
    );

    const favoriteBtnEle = contactCardComEle.querySelector(
      ".action-favorite-icon"
    );
    const emergencyBtnEle = contactCardComEle.querySelector(
      ".action-emergency-icon"
    );
    addEventListennerForFavOrEmr("favorite", favoriteBtnEle);
    addEventListennerForFavOrEmr("emergency", emergencyBtnEle);
    document.querySelector("#contactsCardsContainer").append(contactCardComEle);
    resetContactObj();
  }
});

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
    console.log(mySpan);
    testContainer.append(textEle);
    alert("I am the parent");
    mySpan.addEventListener("click", function (e) {
      e.stopPropagation();
      alert("I am the chile");
    });
  });
}

appendOneContactCard();

// 4- now after we complated contact object data when click on save contact btn and when it successfully passed the validation. So now we can update the counters by pushing contacts to totalContacts Array and if the contact is under favrate category will save it in seprate array and same for Emergency.
function updateContactsCountersList() {
  totalContacts.push(contactObject);

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
  document.querySelector("#emergencyContacts").textContent =
    emergencyContacts.length;
  document.querySelector("#favoriteContacts").textContent =
    favoriteContacts.length;
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

    console.log("There is Data in local storage");
  } else {
    console.log("No Data in local storage");
    document.querySelector("#noContactsCom").classList.remove("d-none");
  }
}

// 9- After we solved saving contacts to local object and get it back when reload I want to create a new function that check if phone number is dublucated or not and it will show a modal with the error msg.

function checkIfPhoneNumberDublucated(phoneNumber) {
  for (var i = 0; i < totalContacts.length; i++) {
    if (totalContacts[i].phoneNum === phoneNumber) {
      validationResults.isdublucated.status = true;
      validationResults.isdublucated.underName = totalContacts[i].fullName;
      return true;
    } else {
      validationResults.isdublucated.status = false;
      return false;
    }
  }
}

// 10- After preparing the contacts Arraies lists nad save it to local storage and get it from it back now the fun part start and it is to display contacts cards.
// *- Get first Char from each name part

function displayContactsCards() {
  for (var i = 0; i < totalContacts.length; i++) {
    let contactCardComEle = contactCardComponent(
      "div",
      ["col-md-6", "contact-card-component"],
      createContactCardComponent,
      totalContacts[i]
    );

    const favoriteBtnEle = contactCardComEle.querySelector(
      ".action-favorite-icon"
    );
    const emergencyBtnEle = contactCardComEle.querySelector(
      ".action-emergency-icon"
    );
    addEventListennerForFavOrEmr("favorite", favoriteBtnEle);
    addEventListennerForFavOrEmr("emergency", emergencyBtnEle);
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
validateContactFormInput();

addNewContactBtn.addEventListener("click", function () {
  setModalBasedValidation();
});

// This function designed to add event listenner for favorite or emergency button
function addEventListennerForFavOrEmr(btnName, btnElement) {
  btnElement.addEventListener("click", function (e) {
    let contactCardEle = e.target.closest(".contact-card");
    let phoneNumber = contactCardEle.querySelector(".contact-num").innerHTML;
    let btnImgBadge = contactCardEle.querySelector(`.${btnName}-img-badge`);

    let btnOptBadge = contactCardEle.querySelector(
      `.${btnName}-optional-badge`
    );

    let activeBtnIcon = contactCardEle.querySelector(`.action-${btnName}-icon`);

    let searchResultInTotal = searchForContactObjectByNum(
      totalContacts,
      phoneNumber
    );
    let contactObj = totalContacts[searchResultInTotal.objectIndex];

    if (btnName === "favorite") {
      let searchResultInFavorite = searchForContactObjectByNum(
        favoriteContacts,
        phoneNumber
      );
      if (searchResultInFavorite) {
        // Edit the isFavorite value from true to false from the favorite list

        contactObj.isFavorite = false;

        // Now as I said instead of update the whole bage just opdate the nessary classes but first I want to remove the object from its list and dont for got OHH actully I want only to edit the value in the total contacts only and remove it from favorite list.

        // Add d-none for favoriteImgBadge
        btnImgBadge.classList.add("d-none");
        btnOptBadge.classList.add("d-none");
        activeBtnIcon.classList.remove("active-action");

        // After editing its value in Total contacts list lets remove it from favorite list.
        favoriteContacts.splice(searchResultInFavorite.objectIndex, 1);
        // After we did serious changing lets save it to localStorage
        saveContactsToLocalStorage();
        updateCounterDomEle();
      } else {
        // Now we want to revearse all what we did when the contact object is not in favorite list exactly

        // 1- Make the value of contact Obj for isFavorite to true
        contactObj.isFavorite = true;
        // 2- Edit the Icons and badges classes
        btnImgBadge.classList.remove("d-none");
        btnOptBadge.classList.remove("d-none");
        activeBtnIcon.classList.add("active-action");
        // 3- Add the contact to favorite list from total contacts
        favoriteContacts.push(contactObj);
        // 4- Save to localStorage
        saveContactsToLocalStorage();
        // 5 - update the counters elements in dom
        updateCounterDomEle();
      }
    } else if (btnName === "emergency") {
      let searchResultInEmergency = searchForContactObjectByNum(
        emergencyContacts,
        phoneNumber
      );

      if (searchResultInEmergency) {
        //10- Edit the isEmergency value from true to false from the favorite list

        contactObj.isEmergency = false;

        //11- Add d-none for emergency related elements
        btnImgBadge.classList.add("d-none");
        btnOptBadge.classList.add("d-none");
        activeBtnIcon.classList.remove("active-action");

        //12- After editing its value in Total contacts list lets remove it from emergency list.
        emergencyContacts.splice(searchResultInEmergency.objectIndex, 1);
        //13- After we did serious changing lets save it to localStorage
        saveContactsToLocalStorage();
        // 14- Then lets update it in our counter elements in Dom
        updateCounterDomEle();
      } else {
        // Now we want to revearse all what we did when the contact object is not in emergency list

        // 1- Make the value of contact Obj for isEmergency to true
        contactObj.isEmergency = true;
        // 2- Edit the Icons and badges classes
        btnImgBadge.classList.remove("d-none");
        btnOptBadge.classList.remove("d-none");
        activeBtnIcon.classList.add("active-action");
        // 3- Add the contact to Emergency list from total contacts
        emergencyContacts.push(contactObj);
        // 4- Save to localStorage
        saveContactsToLocalStorage();
        // 5 - update the counters elements in dom
        updateCounterDomEle();
      }
    }
  });
}

const testObj = {
  fullName: "Sameer",
  phoneNum: "0545060429",
  email: "sfdsa@gmail.com",
  address: null,
  notes: "I love programming",
  contactGroup: "work",
  isFavorite: true,
  isEmergency: false,
};

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

let test = contactCardComponent(
  "div",
  ["col-md-6", "contact-card-component"],
  createContactCardComponent,
  testObj
);
