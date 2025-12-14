//    I want to make this contact card dynamic so we can use it in append contact card function and on display function as well. so I will creat a function that get the values from parameter and return the contact card component
// I want to check which value I want is as a parameters (randomBgClass, letterToDisplayOnImg, contatctObj) after thinking contactObject is enough and we includes the randonBgClass and letterToDisplayOn Image wuthin it just there is one more thing andit is adding event listenners as on my display function I located all my favorite and emergency btns and attached an event listener to it what is I can add event listenner to it each time i create a contact card lets test that
function createContactCardComponent(contatctObj) {
  let randomBgClass =
    userBgClasses[Math.floor(Math.random() * userBgClasses.length)];
  let letterToDisplayOnImg = getFirstLetterFromFullName(contatctObj.fullName);
  return `
      <div class="col-md-6">
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
