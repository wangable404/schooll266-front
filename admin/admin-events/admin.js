const bek_url = "http://localhost:4000/api/v1";
const modal = document.getElementById("eventModal");
const addBtn = document.getElementById("addEventBtn");
const closeBtn = document.getElementById("closeModal");
const cancelBtn = document.getElementById("cancelBtn");
const saveBtn = document.getElementById("saveBtn");
const eventsOuter = document.querySelector(".events-grid");

document.addEventListener("DOMContentLoaded", () => {
  loader.startLoading("Ma'lumotlar yuklanmoqda...");
  axios
    .get(`${bek_url}/events`)
    .then((res) => {
      const events = res.data;
      if (events.length === 0) {
        eventsOuter.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-users"></i>
                            <h3>Hech qanday tadbirlar yo'q</h3>
                            <p>Yangi Tadbirlarni qo'shish uchun "Yangi Tadbir Qo'shish" tugmasini bosing</p>
                        </div>
                    `;
        loader.completeLoading();
        return;
      }
      for (const event of events) {
        eventsOuter.innerHTML += `
                    <div class="event-card">
                        <div class="event-date">
                            <span class="day">${event.day}</span>
                            <span class="month">${event.month}</span>
                        </div>
                        <div class="event-info">
                            <h3>${event.title}</h3>
                            <p>${event.desc}</p>
                            <span class="event-time">⏰ ${event.startTime} - ${event.endTime}</span>
                            <div class="event-actions">
                                <button data-id="${event.id}" class="btn btn-success" style="padding: 0.35rem 0.75rem;">
                                    <i class="fas fa-edit"></i> Tahrirlash
                                </button>
                                <button data-id="${event.id}" class="btn btn-danger" style="padding: 0.35rem 0.75rem;">
                                    <i class="fas fa-trash"></i> O'chirish
                                </button>
                            </div>
                        </div>
                    </div>
            `;
      }
      setupEventListeners();
      loader.completeLoading();
      loader.showToast("success", "Muvaffaqiyatli", "Ma'lumotlar yuklandi");
    })
    .catch((err) => {
      eventsOuter.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h3>Xatolik yuz berdi</h3>
                        <p>Tadbirlarni yuklashda xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.</p>
                    </div>
                `;
      loader.hideLoader();
      loader.showToast(
        "error",
        "Xatolik",
        "So'rov bajarilmadi. Qaytadan urinib ko'ring"
      );
    });
});

addBtn.addEventListener("click", () => {
  modal.classList.add("active");
  document.getElementById("eventForm").reset();
});

function closeModal() {
  modal.classList.remove("active");
  document.getElementById("eventsHidden").value = "";
}

closeBtn.addEventListener("click", closeModal);
cancelBtn.addEventListener("click", closeModal);

saveBtn.addEventListener("click", () => {
  const title = document.getElementById("eventTitle").value;
  const description = document.getElementById("eventDescription").value;
  const day = document.getElementById("eventDay").value;
  const start = document.getElementById("eventStartTime").value;
  const end = document.getElementById("eventEndTime").value;
  const month = document.getElementById("eventMonth").value;
  const id = document.getElementById("eventsHidden").value;

  loader.startLoading("Ma'lumotlar yuklanmoqda...");

  if (id == "") {
    axios
      .post(`${bek_url}/events/create`, {
        title,
        month,
        day,
        startTime: start,
        endTime: end,
        desc: description,
      })
      .then((res) => {
        console.log(res);
        loader.completeLoading();
        loader.showToast(
          "success",
          "Muvaffaqiyatli",
          "Tadbir muvaffaqiyatli qo'shildi!"
        );
        closeModal();
      })
      .catch((err) => {
        console.log(err);
        loader.hideLoader();
        loader.showToast(
          "error",
          "Xatolik",
          "So'rov bajarilmadi. Qaytadan urinib ko'ring"
        );
      });
  } else {
    axios
      .put(`${bek_url}/events/${id}`, {
        title,
        month,
        day,
        startTime: start,
        endTime: end,
        desc: description,
      })
      .then((res) => {
        console.log(res);
        loader.completeLoading();
        loader.showToast(
          "success",
          "Muvaffaqiyatli",
          "Tadbir muvaffaqiyatli yangilandi!"
        );
        closeModal();
      })
      .catch((err) => {
        console.log(err);
        loader.hideLoader();
        loader.showToast(
          "error",
          "Xatolik",
          "So'rov bajarilmadi. Qaytadan urinib ko'ring"
        );
      });
  }
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

function setupEventListeners() {
  document.querySelectorAll(".event-actions .btn-success").forEach((btn) => {
    btn.addEventListener("click", function () {
      const eventCard = this.closest(".event-card");
      const id = btn.getAttribute("data-id");
      const day = eventCard.querySelector(".day").textContent;
      const month = eventCard.querySelector(".month").textContent;
      const title = eventCard.querySelector(".event-info h3").textContent;
      const description = eventCard.querySelector(".event-info p").textContent;
      const timeText = eventCard.querySelector(".event-time").textContent;
      const times = timeText.match(/\d{1,2}:\d{2}/g);
      document.getElementById("eventsHidden").value = id;
      document.getElementById("eventTitle").value = title;
      document.getElementById("eventDescription").value = description;
      document.getElementById("eventDay").value = day;
      document.getElementById("eventMonth").value = month;
      if (times && times.length >= 2) {
        document.getElementById("eventStartTime").value = times[0];
        document.getElementById("eventEndTime").value = times[1];
      }
      document.querySelector("#eventModal .modal-header h3").textContent =
        "Tadbirni Tahrirlash";
      modal.classList.add("active");
    });
  });

  document.querySelectorAll(".event-actions .btn-danger").forEach((btn) => {
    btn.addEventListener("click", function () {
      if (confirm("Bu tadbirni o'chirishni istaysizmi?")) {
        loader.startLoading("Ma'lumotlar yuklanmoqda...");
        const id = this.getAttribute("data-id");
        axios
          .delete(`${bek_url}/events/${id}`)
          .then((res) => {
            console.log(res);
            this.closest(".event-card").remove();
            loader.completeLoading();
            loader.showToast(
              "success",
              "Muvaffaqiyatli",
              "Tadbir muvaffaqiyatli o'chirildi!"
            );
          })
          .catch((err) => {
            console.log(err);
            loader.hideLoader();
            loader.showToast(
              "error",
              "Xatolik",
              "So'rov bajarilmadi. Qaytadan urinib ko'ring"
            );
          });
      }
    });
  });
}

// const showAllBtn = document.getElementById('showAllBtn');
// const hiddenEvents = document.querySelectorAll('.event-card.hidden');
// showAllBtn.addEventListener('click', function () {
//     hiddenEvents.forEach(event => {
//         event.classList.remove('hidden');
//     });
//     this.style.display = 'none';
// });
