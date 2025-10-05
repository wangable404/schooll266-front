const bek_url = "https://schooll266-bek.onrender.com/api/v1";
const modal = document.getElementById("clubModal");
const addBtn = document.getElementById("addClubBtn");
const closeBtn = document.getElementById("closeModal");
const cancelBtn = document.getElementById("cancelBtn");
const saveBtn = document.getElementById("saveBtn");
const clubsOuter = document.querySelector(".clubs-container");

addBtn.addEventListener("click", () => {
  modal.classList.add("active");
  document.getElementById("clubForm").reset();
});

document.addEventListener("DOMContentLoaded", () => {
  loader.startLoading("Ma'lumotlar yuklanmoqda...");
  axios
    .get(`${bek_url}/clubs`)
    .then((res) => {
      const clubs = res.data;
      if (clubs.length === 0) {
        clubsOuter.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-users"></i>
                            <h3>Hech qanday to'garaklar yo'q</h3>
                            <p>Yangi to'garakni qo'shish uchun "Yangi To'garak Qo'shish" tugmasini bosing</p>
                        </div>
                    `;
        loader.completeLoading();
        return;
      }
      let allCards = "";
      clubs.forEach((item) => {
        clubsOuter.innerHTML += `                
                <div class="club-card">
                    <div class="club-icon">${item.icon}</div>
                    <h3>${item.title}</h3>
                    <p>${item.week}</p>
                    <p>${item.time}</p>
                    <div class="club-actions">
                        <button data-id="${item.id}" class="btn btn-success" style="padding: 0.35rem 0.75rem;">
                            <i class="fas fa-edit"></i> Tahrirlash
                        </button>
                        <button data-id="${item.id}" class="btn btn-danger" style="padding: 0.35rem 0.75rem;">
                            <i class="fas fa-trash"></i> O'chirish
                        </button>
                    </div>
                </div>`;
      });
      setupEventListeners();
      loader.completeLoading();
      loader.showToast("success", "Muvaffaqiyatli", "Ma'lumotlar yuklandi");
    })
    .catch((err) => {
      clubsOuter.innerHTML = `
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

function closeModal() {
  modal.classList.remove("active");
  document.getElementById("clubsHidden").value = "";
}

closeBtn.addEventListener("click", closeModal);
cancelBtn.addEventListener("click", closeModal);

saveBtn.addEventListener("click", () => {
  const title = document.getElementById("clubName").value;
  const week = document.getElementById("clubDays").value;
  const time = document.getElementById("clubTime").value;
  const icon = document.getElementById("clubIcon").value;
  const id = document.getElementById("clubsHidden").value;

  loader.startLoading("Ma'lumotlar yuklanmoqda...");

  if (id == "") {
    axios
      .post(`${bek_url}/clubs/create`, {
        icon,
        title,
        week,
        time,
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
      .put(`${bek_url}/clubs/${id}`, {
        icon,
        title,
        week,
        time,
      })
      .then((res) => {
        console.log(res);
        loader.completeLoading();
        loader.showToast("success", "Muvaffaqiyatli", "Ma'lumotlar yangilandi");
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
  document.querySelectorAll(".club-actions .btn-success").forEach((btn) => {
    btn.addEventListener("click", function () {
      const clubCard = this.closest(".club-card");
      const id = this.getAttribute("data-id");
      const icon = clubCard.querySelector(".club-icon").textContent;
      const name = clubCard.querySelector("h3").textContent;
      const days = clubCard.querySelectorAll("p")[0].textContent;
      const time = clubCard.querySelectorAll("p")[1].textContent;

      document.getElementById("clubsHidden").value = id;
      document.getElementById("clubIcon").value = icon;
      document.getElementById("clubName").value = name;
      document.getElementById("clubDays").value = days;
      document.getElementById("clubTime").value = time;
      document.querySelector("#clubModal .modal-header h3").textContent =
        "To'garakni Tahrirlash";
      modal.classList.add("active");
    });
  });

  document.querySelectorAll(".club-actions .btn-danger").forEach((btn) => {
    btn.addEventListener("click", function () {
      if (confirm("Bu to'garakni o'chirishni istaysizmi?")) {
        loader.startLoading("Ma'lumotlar yuklanmoqda...");
        const id = this.getAttribute("data-id");
        console.log(id);
        axios
          .delete(`${bek_url}/clubs/${id}`)
          .then((res) => {
            console.log(res);
            this.closest(".club-card").remove();
            loader.completeLoading();
            loader.showToast(
              "success",
              "Muvaffaqiyatli",
              "To'garak muvaffaqiyatli o'chirildi!"
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
