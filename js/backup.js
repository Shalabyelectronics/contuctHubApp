//    Add event listener for all favorites buttons

{
  allFavoritesBtnsList[i].addEventListener("click", function (e) {
    let contactCardEle = e.target.closest(".contact-card");
    let phoneNumber = contactCardEle.querySelector(".contact-num").innerHTML;
    let favoriteImgBadge = contactCardEle.querySelector(".favorite-img-badge");
    let favoriteOptBadge = contactCardEle.querySelector(
      ".favorite-optional-badge"
    );
    let activeFavIcon = contactCardEle.querySelector(".action-favorite-icon");

    // Search if the phone number is in favorite list

    let searchResultInFavorite = searchForContactObjectByNum(
      favoriteContacts,
      phoneNumber
    );
    // Also Search of it on total contacts list
    let searchResultInTotal = searchForContactObjectByNum(
      totalContacts,
      phoneNumber
    );
    let contactObj = totalContacts[searchResultInTotal.objectIndex];
    // So if it is in favorite list do these step first edit its value to false then update the display.
    // We will locate the exact object from the searchResult object because it's contains (Object index) then instead of update the whole display after editing its value I will just update the exact card only by 1- changing the icon class for favorite-img-badge by adding d-none to it 2- Also by adding d-none for favorite-optional-badge 3- Finally to remove active-action to action-favorite-icon
    if (searchResultInFavorite) {
      // Edit the isFavorite value from true to false from the favorite list

      contactObj.isFavorite = false;

      // Now as I said instead of update the whole bage just opdate the nessary classes but first I want to remove the object from its list and dont for got OHH actully I want only to edit the value in the total contacts only and remove it from favorite list.

      // Add d-none for favoriteImgBadge
      favoriteImgBadge.classList.add("d-none");
      favoriteOptBadge.classList.add("d-none");
      activeFavIcon.classList.remove("active-action");

      // After editing its value in Total contacts list lets remove it from favorite list.
      favoriteContacts.splice(searchResultInFavorite.objectIndex, 1);
      // After we did serious changing lets save it to localStorage
      saveContactsToLocalStorage();
      updateCounterDomEle();
    } else {
      // Now we want to revearse all what we did when the contact object is in favorite list exactly

      // 1- Make the value of contact Obj for isFavorite to true
      contactObj.isFavorite = true;
      // 2- Edit the Icons and badges classes
      favoriteImgBadge.classList.remove("d-none");
      favoriteOptBadge.classList.remove("d-none");
      activeFavIcon.classList.add("active-action");
      // 3- Add the contact to favorite list from total contacts
      favoriteContacts.push(contactObj);
      // 4- Save to localStorage
      saveContactsToLocalStorage();
      // 5 - update the counters elements in dom
      updateCounterDomEle();
    }
  });
}

// add event listener for  all emergency buttons

{
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
    // 6- Select the action favorite icon to apply active class to it.
    let activeEmrIcon = contactCardEle.querySelector(".action-emergency-icon");

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
      //10- Edit the isEmergency value from true to false from the favorite list

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

// contact card copnent
function createContactCardComponent(contatctObj) {
  let randomBgClass =
    userBgClasses[Math.floor(Math.random() * userBgClasses.length)];
  let letterToDisplayOnImg = getFirstLetterFromFullName(contatctObj.fullName);
  return `
      <div class="col-md-6 contact-card-component">
                <div class="inner">
                  <div class="card contact-card">
                    <div class="card-body">
                      <!-- Card row one contains the contact image , name and number -->
                      <div class="card-row-1">
                      <!-- 1- Random user background image -->
                        <div class="image-wrapper ${randomBgClass}">
                      <!--2- Get letters from full name -->
                          <h3 class="text-light">${letterToDisplayOnImg}</h3>
                      <!--3- Change favoriteClass based contact object -->
                          <div class="contatct-img-badge favorite-img-badge ${
                            contatctObj.isFavorite ? "" : "d-none"
                          }">
                            <i class="fas fa-star"></i>
                          </div>
                      <!--4- Change emergencyClass based contact object -->
                          <div class="contatct-img-badge emergency-img-badge ${
                            contatctObj.isEmergency ? "" : "d-none"
                          }">
                            <i class="fas fa-heart-pulse"></i>
                          </div>
                        </div>
                        <div class="name-and-number">
                      <!--5- Change full name based of contact object -->
                          <p class="m-0 contact-name" >
                            ${contatctObj.fullName}
                          </p>
                          <div class="contact-wrapper number">
                            <div class="icon-wrapper call-icon">
                              <i class="fas fa-phone"></i>
                            </div>
                        <!--6- Change phone number based of contact object -->
                            <span class="contact-num">${
                              contatctObj.phoneNum
                            }</span>
                          </div>
                        </div>
                      </div>
                      <!-- Card row two contains the contact email , address and note -->
                      <div class="card-row-2">
                        <!-- Email -->
                        <!--7- Change Email based of contact object -->
                        <div class="contact-wrapper email ${
                          contatctObj.email ? "" : "d-none"
                        }">
                          <div class="icon-wrapper email-icon">
                          <i class="fas fa-envelope"></i>
                        </div>
                          <span id="emailAddress">${contatctObj.email}</span>
                        </div>
                        <!-- Address -->
                         <!--8- Change Address based of contact object -->
                        <div class="contact-wrapper email ${
                          contatctObj.address ? "" : "d-none"
                        }">
                          <div class="icon-wrapper address-icon">
                            <i class="fas fa-location-pin"></i>
                          </div>
                          <span id="contactNum">${contatctObj.address}</span>
                        </div>
                        <!-- Note -->
                         <!--9- Change notes based of contact object -->
                        <div class="contact-wrapper email ${
                          contatctObj.notes ? "" : "d-none"
                        }">
                          <div class="icon-wrapper note-icon">
                            <i class="fas fa-note-sticky"></i>
                          </div>
                          <span id="contactNum">${contatctObj.notes}</span>
                        </div>
                      </div>
                      <!-- Card row three contains all selected badges (5 badges from group option and emergeny badge and favorite badge) in general max badges are 3 only-->
                      <div class="card-row-3">
                        <div class="selected-badges d-flex gap-2 flex-wrap">
                         <!--10- Add or remove emergency badge based of contact object -->
                          <!-- Emergency optional badg -->
                          <div class="icon-wrapper emergency-optional-badge ${
                            contatctObj.isEmergency ? "" : "d-none"
                          }">
                            <i class="fas fa-heart-pulse"></i>
                            <span>Emergency</span>
                          </div>
                          <!-- favorite optional badg -->
                      <!--11- Add or remove favorite badge based of contact object -->
                          <div class="icon-wrapper favorite-optional-badge ${
                            contatctObj.isFavorite ? "" : "d-none"
                          }">
                            <i class="fas fa-star"></i>
                            <span>Favorites</span>
                          </div>
                          <!-- Optional badges user will pick only one -->
                    <!--12- Last Contact Group badge -->
                    ${
                      contatctObj.contactGroup !== "default"
                        ? contactGroup[contatctObj.contactGroup]
                        : ""
                    }
                        </div>
                      </div>
                    </div>

                    <!-- Now last row is the card footer where all actions take place as we can press on call btn to make a call or an email btn to send an email. Also we can add the contact to favorite and emergency contacts box finally we can edit or delete the contact -->
                    <div
                      class="card-footer d-flex justify-content-between flex-wrap"
                    >
                    <!--13- wrap call icon with ancher tage with tel -->
                      <div class="call-email-action d-flex gap-2">
                      <a href="tel:${contatctObj.phoneNum}"> 
                      <button
                          class="btn action-btn icon-wrapper action-call-icon"
                        >
                          <i class="fas fa-phone"></i>
                        </button>
                      </a>
                 <!--14- wrap Email icon with ancher tage with mailto -->
                      <a href="mailto:${contatctObj.email}" class="${
    contatctObj.email ? "" : "d-none"
  }">
                        <button class="btn action-btn icon-wrapper email-icon">
                          <i class="fas fa-envelope"></i>
                        </button>
                      </a>
                      </div>
                      <div class="other-action d-flex gap-2">
                      <!--15- Later we will attched this button with an event listenner that edit contact object to add it to favorite -->
                        <button
                          class="btn action-btn icon-wrapper action-favorite-icon ${
                            contatctObj.isFavorite ? "active-action" : ""
                          }"
                        >
                          <i class="fas fa-star"></i>
                        </button>
                       <!--16- Later we will attched this button with an event listenner that edit contact object to add it to emergency -->
                        <button
                          class="btn action-btn icon-wrapper action-emergency-icon ${
                            contatctObj.isEmergency ? "active-action" : ""
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
}