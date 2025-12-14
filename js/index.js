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
  isFavorate: null,
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
    displayContactsCards();
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

// 10- After preparing the contacts Arraies lists nad save it to local storage and get it from it back now the fun part start and it is to display contacts cards.
// *- Get first Char from each name part
function getFirstLetterFromFullName(fullName) {
  var splitFullName = fullName.toUpperCase().split(" ");
  if (splitFullName.length > 1) {
    return splitFullName[0][0] + splitFullName[1][0];
  } else {
    return splitFullName[0][0];
  }
}
function displayContactsCards() {
  var cartona = "";
  for (var i = 0; i < totalContacts.length; i++) {
    var randomBgClass =
      userBgClasses[Math.floor(Math.random() * userBgClasses.length)];
    var letterToDisplay = getFirstLetterFromFullName(totalContacts[i].fullName);

    var contactCardComponent = `
  
      <div class="col-md-6">
                <div class="inner">
                  <div class="card contact-card">
                    <div class="card-body">
                      <!-- Card row one contains the contact image , name and number -->
                      <div class="card-row-1">
                      <!-- 1- Random user background image -->
                        <div class="image-wrapper ${randomBgClass}">
                      <!--2- Get letters from full name -->
                          <h3 class="text-light">${letterToDisplay}</h3>
                      <!--3- Change favorateClass based contact object -->
                          <div class="contatct-img-badge favorate-img-badge ${
                            totalContacts[i].isFavorate ? "" : "d-none"
                          }">
                            <i class="fas fa-star"></i>
                          </div>
                      <!--4- Change emergencyClass based contact object -->
                          <div class="contatct-img-badge emergency-img-badge ${
                            totalContacts[i].isEmergency ? "" : "d-none"
                          }">
                            <i class="fas fa-heart-pulse"></i>
                          </div>
                        </div>
                        <div class="name-and-number">
                      <!--5- Change full name based of contact object -->
                          <p class="m-0 contact-name" >
                            ${totalContacts[i].fullName}
                          </p>
                          <div class="contact-wrapper number">
                            <div class="icon-wrapper call-icon">
                              <i class="fas fa-phone"></i>
                            </div>
                        <!--6- Change phone number based of contact object -->
                            <span class="contact-num">${
                              totalContacts[i].phoneNum
                            }</span>
                          </div>
                        </div>
                      </div>
                      <!-- Card row two contains the contact email , address and note -->
                      <div class="card-row-2">
                        <!-- Email -->
                        <!--7- Change Email based of contact object -->
                        <div class="contact-wrapper email ${
                          totalContacts[i].email ? "" : "d-none"
                        }">
                          <div class="icon-wrapper email-icon">
                          <i class="fas fa-envelope"></i>
                        </div>
                          <span id="emailAddress">${
                            totalContacts[i].email
                          }</span>
                        </div>
                        <!-- Address -->
                         <!--8- Change Address based of contact object -->
                        <div class="contact-wrapper email ${
                          totalContacts[i].address ? "" : "d-none"
                        }">
                          <div class="icon-wrapper address-icon">
                            <i class="fas fa-location-pin"></i>
                          </div>
                          <span id="contactNum">${
                            totalContacts[i].address
                          }</span>
                        </div>
                        <!-- Note -->
                         <!--9- Change notes based of contact object -->
                        <div class="contact-wrapper email ${
                          totalContacts[i].notes ? "" : "d-none"
                        }">
                          <div class="icon-wrapper note-icon">
                            <i class="fas fa-note-sticky"></i>
                          </div>
                          <span id="contactNum">${totalContacts[i].notes}</span>
                        </div>
                      </div>
                      <!-- Card row three contains all selected badges (5 badges from group option and emergeny badge and favorate badge) in general max badges are 3 only-->
                      <div class="card-row-3">
                        <div class="selected-badges d-flex gap-2 flex-wrap">
                         <!--10- Add or remove emergency badge based of contact object -->
                          <!-- Emergency optional badg -->
                          <div class="icon-wrapper emergency-optional-badge ${
                            totalContacts[i].isEmergency ? "" : "d-none"
                          }">
                            <i class="fas fa-heart-pulse"></i>
                            <span>Emergency</span>
                          </div>
                          <!-- favorate optional badg -->
                      <!--11- Add or remove Favorate badge based of contact object -->
                          <div class="icon-wrapper favorite-optional-badge ${
                            totalContacts[i].isFavorate ? "" : "d-none"
                          }">
                            <i class="fas fa-star"></i>
                            <span>Favorites</span>
                          </div>
                          <!-- Optional badges user will pick only one -->
                    <!--12- Last Contact Group badge -->
                    ${
                      totalContacts[i].contactGroup !== "default"
                        ? contactGroup[totalContacts[i].contactGroup]
                        : ""
                    }
                        </div>
                      </div>
                    </div>

                    <!-- Now last row is the card footer where all actions take place as we can press on call btn to make a call or an email btn to send an email. Also we can add the contact to favorate and emergency contacts box finally we can edit or delete the contact -->
                    <div
                      class="card-footer d-flex justify-content-between flex-wrap"
                    >
                    <!--13- wrap call icon with ancher tage with tel -->
                      <div class="call-email-action d-flex gap-2">
                      <a href="tel:${totalContacts[i].phoneNum}"> 
                      <button
                          class="btn action-btn icon-wrapper action-call-icon"
                        >
                          <i class="fas fa-phone"></i>
                        </button>
                      </a>
                 <!--14- wrap Email icon with ancher tage with mailto -->
                      <a href="mailto:${totalContacts[i].email}" class="${
      totalContacts[i].email ? "" : "d-none"
    }">
                        <button class="btn action-btn icon-wrapper email-icon">
                          <i class="fas fa-envelope"></i>
                        </button>
                      </a>
                      </div>
                      <div class="other-action d-flex gap-2">
                      <!--15- Later we will attched this button with an event listenner that edit contact object to add it to favorate -->
                        <button
                          class="btn action-btn icon-wrapper action-favorite-icon ${
                            totalContacts[i].isFavorate ? "active-action" : ""
                          }"
                        >
                          <i class="fas fa-star"></i>
                        </button>
                       <!--16- Later we will attched this button with an event listenner that edit contact object to add it to emergency -->
                        <button
                          class="btn action-btn icon-wrapper emergency-action-icon ${
                            totalContacts[i].isEmergency ? "active-action" : ""
                          }"
                        >
                          <i class="fas fa-heart-pulse"></i>
                        </button>
                      <!--17- Later we will attched this button with an event listenner that edit contact object inputs  -->
                        <button
                          type="button"
                          data-bs-toggle="modal"
                          data-bs-target="#contactFormModal"
                          class="btn action-btn icon-wrapper edit-action-icon"
                        >
                          <i class="fas fa-pen"></i>
                        </button>
                        <!--18- Later we will attched this button with an event listenner that delete contact object  -->
                        <button
                          type="button"
                          class="btn action-btn icon-wrapper delete-action-icon"
                          data-bs-toggle="modal"
                          data-bs-target="#deletionComfermation"
                        >
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

  `;

    cartona += contactCardComponent;
  }
  document.querySelector("#contactsCardsContainer").innerHTML = cartona;
  addFuctionalityForFavorateBtns();
  addFuctionalityForEmergencyBtns()
}

// 11- now we want to add or remove contacts from favorite contacts list when user press on favorate icon color so first it will edit the current contact object by its number as we are going to treated as an ID.

// We will dublucate same this function to add it to emergency button as there is too much details I will think to make it clean later 
function addFuctionalityForFavorateBtns() {
  var allFavoratesBtnsList = document.querySelectorAll(".action-favorite-icon");
  for (var i = 0; i < allFavoratesBtnsList.length; i++) {
    allFavoratesBtnsList[i].addEventListener("click", function (e) {
      let contactCardEle = e.target.closest(".contact-card");
      let phoneNumber = contactCardEle.querySelector(".contact-num").innerHTML;
      let favorateImgBadge = contactCardEle.querySelector(
        ".favorate-img-badge"
      );
      let favorateOptBadge = contactCardEle.querySelector(
        ".favorite-optional-badge"
      );
      let activeFavIcon = contactCardEle.querySelector(".action-favorite-icon");

      // Search if the phone number is in favorate list

      let searchResultInFavorate = searchForContactObjectByNum(
        favorateContacts,
        phoneNumber
      );
      // Also Search of it on total contacts list
      let searchResultInTotal = searchForContactObjectByNum(
        totalContacts,
        phoneNumber
      );
      let contactObj = totalContacts[searchResultInTotal.objectIndex];
      // So if it is in favorate list do these step first edit its value to false then update the display.
      // We will locate the exact object from the searchResult object because it's contains (Object index) then instead of update the whole display after editing its value I will just update the exact card only by 1- changing the icon class for favorate-img-badge by adding d-none to it 2- Also by adding d-none for favorite-optional-badge 3- Finally to remove active-action to action-favorite-icon
      if (searchResultInFavorate) {
        // Edit the isFavorate value from true to false from the favorate list

        contactObj.isFavorate = false;

        // Now as I said instead of update the whole bage just opdate the nessary classes but first I want to remove the object from its list and dont for got OHH actully I want only to edit the value in the total contacts only and remove it from favorate list.

        // Add d-none for favorateImgBadge
        favorateImgBadge.classList.add("d-none");
        favorateOptBadge.classList.add("d-none");
        activeFavIcon.classList.remove("active-action");

        // After editing its value in Total contacts list lets remove it from favorate list.
        favorateContacts.splice(searchResultInFavorate.objectIndex, 1);
        // After we did serious changing lets save it to localStorage
        saveContactsToLocalStorage();
        updateCounterDomEle();
      } else {
        // Now we want to revearse all what we did when the contact object is in favorate list exactly

        // 1- Make the value of contact Obj for isFavorate to true
        contactObj.isFavorate = true;
        // 2- Edit the Icons and badges classes
        favorateImgBadge.classList.remove("d-none");
        favorateOptBadge.classList.remove("d-none");
        activeFavIcon.classList.add("active-action");
        // 3- Add the contact to favorate list from total contacts
        favorateContacts.push(contactObj);
        // 4- Save to localStorage
        saveContactsToLocalStorage();
        // 5 - update the counters elements in dom
        updateCounterDomEle();
      }
    });
  }
}
// Now As the logic of Favorate Btn we will do the emergency btn exactly
function addFuctionalityForEmergencyBtns() {
  // This comments to locate what I just need to change for clean code later
  // 1- First Change is Selecting the Emergency btn by class
  var allEmergencyBtnsList = document.querySelectorAll(".emergency-action-icon");
  // 2- loop throw the allEmergencyBtnsList
  for (var i = 0; i < allEmergencyBtnsList.length; i++) {
  // 3- Add event listenner for all emergency btns
    allEmergencyBtnsList[i].addEventListener("click", function (e) {
      let contactCardEle = e.target.closest(".contact-card");
      let phoneNumber = contactCardEle.querySelector(".contact-num").innerHTML;
      // 4- Select the emergncy image badge
      let emergencyImgBadge = contactCardEle.querySelector(
        ".emergency-img-badge"
      );
      // 5- Select the emergency optional badge
      let emergencyOptBadge = contactCardEle.querySelector(
        ".emergency-optional-badge"
      );
      // 6- Select the action favorate icon to apply active class to it.
      let activeEmrIcon = contactCardEle.querySelector(".emergency-action-icon");

      //7- Search if the phone number is in emergency list

      let searchResultInEmergency = searchForContactObjectByNum(
        emergencyContacts,
        phoneNumber
      );
      //8- Also Search of it on total contacts list
      let searchResultInTotal = searchForContactObjectByNum(
        totalContacts,
        phoneNumber
      );
      let contactObj = totalContacts[searchResultInTotal.objectIndex];
      // 9- Condition if searchResultInEmergency holding truthy or falsy value
      if (searchResultInEmergency) {
        //10- Edit the isEmergency value from true to false from the favorate list

        contactObj.isEmergency = false;


        //11- Add d-none for emergency related elements
        emergencyImgBadge.classList.add("d-none");
        emergencyOptBadge.classList.add("d-none");
        activeEmrIcon.classList.remove("active-action");

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
        emergencyImgBadge.classList.remove("d-none");
        emergencyOptBadge.classList.remove("d-none");
        activeEmrIcon.classList.add("active-action");
        // 3- Add the contact to Emergency list from total contacts
        emergencyContacts.push(contactObj);
        // 4- Save to localStorage
        saveContactsToLocalStorage();
        // 5 - update the counters elements in dom
        updateCounterDomEle();
      }
    });
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

// *- now I want when click on favorate button if the number is already in favorate list remove it if not add it from main contacts list and while doing that you need to update the contactobject data by isFavorate key where if add it to favorate list make it value true ad if not false then save new changes to local storage.

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
    // console.log(totalContacts)
    // console.log(favorateContacts)
    // console.log(mainContactObj.objectData)
    updateCounterDomEle();
    // saveContactsToLocalStorage();
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
