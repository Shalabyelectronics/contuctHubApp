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
