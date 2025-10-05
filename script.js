function burger() {
  document.querySelector("#humburger-menu").classList.toggle("active");
}

document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("registrationModal");
  const joinButtons = document.querySelectorAll(".join-btn");
  const closeButton = document.querySelector(".close-btn");
  const clubNameField = document.getElementById("clubName");
  const registrationForm = document.getElementById("registrationForm");
  const achievementOuter = document.querySelector(".achievements-grid");
  const parentalOuter = document.querySelector(".parents-grid");
  const eventsContainer = document.querySelector(".events-grid");
  const clubsContainer = document.querySelector(".clubs-container");
  const galleryGrid = document.querySelector(".gallery-grid");

  axios
    .get("https://schooll266-bek.onrender.com/api/v1/achivments")
    .then((res) => {
      const achievements = res.data;

      achievements.forEach((item) => {
        console.log(item);

        achievementOuter.innerHTML += `
            <article class="achievement-card">
                <div class="achievement-img">
                    <img src="${item.img}" alt="Sport musobaqasi">
                </div>
                <div class="achievement-content">
                    <h3>${item.title}</h3>
                    <p class="date">${item.desc}</p>
                    <p>${item.desc}</p>
                </div>
            </article>
            `;
      });
    })
    .catch((err) => {
      console.log(err);
    });
  axios
    .get("https://schooll266-bek.onrender.com/api/v1/parents")
    .then((res) => {
      const parentals = res.data;

      parentals.forEach((item) => {
        parentalOuter.innerHTML += `
                  <div class="parents-card">
                    <div class="icon">${item.icon}</div>
                    <h3>${item.name}</h3>
                    <p>${item.phone}</p>
                    <p>${item.childName}</p>
                    <p>${item.childClass}</p>
                </div>
            `;
      });
    })
    .catch((err) => {
      console.log(err);
    });
  axios
    .get("https://schooll266-bek.onrender.com/api/v1/events")
    .then((res) => {
      const events = res.data; // если сервер возвращает массив событий

      events.forEach((item, index) => {
        eventsContainer.innerHTML += `
        <div class="event-card ${index >= 3 ? "hidden" : ""}">
          <div class="event-date">
            <span class="day">${item.day}</span>
            <span class="month">${item.month}</span>
          </div>
          <div class="event-info">
            <h3>${item.title}</h3>
            <p>${item.desc}</p>
            <span class="event-time">⏰ ${item.startTime} - ${
          item.endTime
        }</span>
          </div>
        </div>
      `;
      });
    })
    .catch((err) => {
      console.log("Xatolik yuz berdi:", err);
    });
  axios
    .get("https://schooll266-bek.onrender.com/api/v1/clubs")
    .then((res) => {
      const clubs = res.data;

      clubs.forEach((item) => {
        clubsContainer.innerHTML += `
        <div class="club-card">
          <div class="club-icon">${item.icon || "🎯"}</div>
          <h3>${item.title || "Nomlanmagan klub"}</h3>
          <p>${item.week || ""}</p>
          <p>${item.time || ""}</p>
          <a href="#" class="btn-outline join-btn" data-club="${
            item.title
          }">Qo'shilish</a>
        </div>
      `;
      });
    })
    .catch((err) => {
      console.log("Xatolik yuz berdi:", err);
    });
  axios
    .get("https://schooll266-bek.onrender.com/api/v1/gallery")
    .then((res) => {
      const gallery = res.data; // если приходит массив изображений

      gallery.forEach((item, index) => {
        galleryGrid.innerHTML += `
        <div class="gallery-item ${index >= 4 ? "hidden" : ""}">
          <img src="${item.img}" alt="${item.title || "Foto"}">
          <div class="overlay">${item.title || ""}</div>
        </div>
      `;
      });
    })
    .catch((err) => {
      console.log("Xatolik yuz berdi:", err);
    });
  joinButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const clubName = this.getAttribute("data-club");
      clubNameField.value = clubName;
      document.querySelector(
        ".modal-title"
      ).textContent = `${clubName} to'garakka a'zo bo'lish`;
      modal.style.display = "flex";
    });
  });

  closeButton.addEventListener("click", function () {
    modal.style.display = "none";
  });

  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  registrationForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = {
      club: document.getElementById("clubName").value,
      fullName: document.getElementById("fullName").value,
      phone: document.getElementById("phone").value,
      email: document.getElementById("email").value,
      age: document.getElementById("age").value,
      class: document.getElementById("class").value,
    };

    console.log("Form submitted:", formData);

    alert(
      `Arizangiz qabul qilindi! ${formData.club} to'garagi uchun ro'yxatdan o'tdingiz. Tez orada siz bilan bog'lanamiz.`
    );

    registrationForm.reset();
    modal.style.display = "none";
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const showAllBtn = document.getElementById("showAllBtn");
  const eventsContainer = document.querySelector(".events-container");

  showAllBtn.addEventListener("click", function (e) {
    e.preventDefault();

    eventsContainer.classList.add("show-all");

    setTimeout(() => {
      showAllBtn.classList.add("hidden");
    }, 300);
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const showAllBtn = document.getElementById("showAllPhotos");
  const galleryContainer = document.querySelector(".gallery-container");

  showAllBtn.addEventListener("click", function (e) {
    e.preventDefault();

    galleryContainer.classList.add("show-all");

    setTimeout(() => {
      showAllBtn.classList.add("hidden");
    }, 300);
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const showAllBtn = document.getElementById("showAllTeachersBtn");
  const teachersContainer = document.querySelector(".teachers-container");

  showAllBtn.addEventListener("click", function (e) {
    e.preventDefault();

    teachersContainer.classList.add("show-all");

    setTimeout(() => {
      showAllBtn.classList.add("hidden");
    }, 300);
  });
});
