const bek_url = "https://schooll266-bek.onrender.com/api/v1";
const modal = document.getElementById("achievementModal");
const addBtn = document.getElementById("addAchievementBtn");
const closeBtn = document.getElementById("closeModal");
const cancelBtn = document.getElementById("cancelBtn");
const saveBtn = document.getElementById("saveBtn");
const imageInput = document.getElementById("achievementImage");
const imagePreview = document.getElementById("imagePreview");
const achievementOuter = document.querySelector(".achievements-grid");

document.addEventListener("DOMContentLoaded", () => {
  loader.startLoading("Ma'lumotlar yuklanmoqda...");
  axios
    .get(bek_url + "/achivments")
    .then((res) => {
      const achievements = res.data;
      if (achievements.length === 0) {
        eventsOuter.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-users"></i>
                            <h3>Hech qanday yutuqlar yo'q</h3>
                            <p>Yangi yutuqlarni qo'shish uchun "Yangi Yutuq Qo'shish" tugmasini bosing</p>
                        </div>
                    `;
        loader.completeLoading();
        return;
      }
      let allCards = "";
      achievements.forEach((item) => {
        allCards += `
                <div class="achievement-card">
                    <div class="achievement-img">
                        <img src="${item.img}"
                            alt="Olimpiada g'olibi">
                    </div>
                    <div class="achievement-content">
                        <h3>${item.title}</h3>
                        <p class="date">${item.date}</p>
                        <p class="desc">${item.desc}</p>
                        <div class="achievement-actions">
                            <button data-id="${item.id}" class="btn btn-success" style="padding: 0.35rem 0.75rem;">
                                <i class="fas fa-edit"></i> Tahrirlash
                            </button>
                            <button data-id="${item.id}" class="btn btn-danger" style="padding: 0.35rem 0.75rem;">
                                <i class="fas fa-trash"></i> O'chirish
                            </button>
                        </div>
                    </div>
                </div>
            `;
      });
      achievementOuter.innerHTML = allCards;
      loader.completeLoading();
      loader.showToast("success", "Muvaffaqiyatli", "Ma'lumotlar yuklandi");
      setupEventListeners();
    })
    .catch((err) => {
      achievementOuter.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h3>Xatolik yuz berdi</h3>
                        <p>Yutuqlarni yuklashda xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.</p>
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

imageInput.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
    };
    reader.readAsDataURL(file);
  }
});

addBtn.addEventListener("click", () => {
  modal.classList.add("active");
  document.getElementById("achievementForm").reset();
  imagePreview.innerHTML =
    '<span class="image-preview-text">Rasm tanlanmagan</span>';
});

function closeModal() {
  modal.classList.remove("active");
  document.getElementById("achievementHidden").value = "";
}

closeBtn.addEventListener("click", closeModal);
cancelBtn.addEventListener("click", closeModal);

saveBtn.addEventListener("click", () => {
  const title = document.getElementById("achievementTitle").value;
  const date = document.getElementById("achievementDate").value;
  const desc = document.getElementById("achievementDescription").value;
  const id = document.getElementById("achievementHidden").value;
  const img = document.querySelector("#imagePreview img").src;
  loader.startLoading("Ma'lumotlar yuklanmoqda...");
  const selectedFile = imageInput.files[0];
  const formData = new FormData();
  formData.append("img", selectedFile || img);
  formData.append("title", title);
  formData.append("date", date);
  formData.append("desc", desc);
  if (id == "") {
    if (!selectedFile) {
      console.log("Файл не выбран");
      return;
    }
    axios
      .post(`${bek_url}/achivments/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        loader.completeLoading();
        loader.showToast("success", "Muvaffaqiyatli", "Ma'lumotlar yuklandi");
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
      .patch(`${bek_url}/achivments/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        loader.completeLoading();
        loader.showToast("success", "Muvaffaqiyatli", "Ma'lumotlar yuklandi");
        closeModal();
      })
      .catch((err) => {
        loader.toastContainer(
          "error",
          "Xatolik",
          "So'rov bajarilmadi. Qaytadan urinib ko'ring"
        );
        loader.hideLoader();
      })
      .finally(() => {});
  }
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

function setupEventListeners() {
  document
    .querySelectorAll(".achievement-actions .btn-success")
    .forEach((btn) => {
      btn.addEventListener("click", function () {
        const achievementCard = this.closest(".achievement-card");
        const imgSrc = achievementCard.querySelector(
          ".achievement-img img"
        ).src;
        const title = achievementCard.querySelector(
          ".achievement-content h3"
        ).textContent;
        const date = achievementCard.querySelector(".date").textContent;
        const description = achievementCard.querySelector(".desc").textContent;
        const id = btn.getAttribute("data-id");

        imagePreview.innerHTML = `<img src="${imgSrc}" alt="Preview">`;
        document.getElementById("achievementHidden").value = id;
        document.getElementById("achievementTitle").value = title;
        document.getElementById("achievementDate").value = date;
        document.getElementById("achievementDescription").value = description;

        document.querySelector(
          "#achievementModal .modal-header h3"
        ).textContent = "Yutuqni Tahrirlash";

        modal.classList.add("active");
      });
    });

  document
    .querySelectorAll(".achievement-actions .btn-danger")
    .forEach((btn) => {
      btn.addEventListener("click", function () {
        loader.startLoading("Ma'lumotlar yuklanmoqda...");
        if (confirm("Bu yutuqni o'chirishni istaysizmi?")) {
          const id = this.getAttribute("data-id");
          axios
            .delete(`${bek_url}/achivments/${id}`)
            .then((res) => {
              this.closest(".achievement-card").remove();
              loader.completeLoading();
              loader.showToast(
                "success",
                "Muvaffaqiyatli",
                "Ma'lumotlar o'chirildi"
              );
            })
            .catch((err) => {
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
