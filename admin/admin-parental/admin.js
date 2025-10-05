const bek_url = "https://schooll266-bek.onrender.com/api/v1";
const modal = document.getElementById("parentModal");
const addBtn = document.getElementById("addParentBtn");
const closeBtn = document.getElementById("closeModal");
const cancelBtn = document.getElementById("cancelBtn");
const saveBtn = document.getElementById("saveBtn");
const parentsOuter = document.getElementById("parentsContainer");
const modalTitle = document.getElementById("modalTitle");

addBtn.addEventListener("click", () => {
  modal.classList.add("active");
  document.getElementById("parentForm").reset();
  modalTitle.textContent = "Yangi Ota-ona Qo'shish";
  document.getElementById("parentsHidden").value = "";
});

document.addEventListener("DOMContentLoaded", () => {
  loadParents();
});

function loadParents() {
  loader.startLoading("Ma'lumotlar yuklanmoqda...");
  axios
    .get(`${bek_url}/parents`)
    .then((res) => {
      const parents = res.data;
      parentsOuter.innerHTML = "";

      if (parents.length === 0) {
        parentsOuter.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-users"></i>
                            <h3>Hech qanday ota-ona yo'q</h3>
                            <p>Yangi ota-ona qo'shish uchun "Yangi Ota-ona Qo'shish" tugmasini bosing</p>
                        </div>
                    `;
        loader.completeLoading();
        return;
      }

      parents.forEach((item) => {
        parentsOuter.innerHTML += `                
                        <div class="parent-card fade-in">
                            <div class="parent-icon">${item.icon}</div>
                            <h3>${item.name}</h3>
                            <p><i class="fas fa-phone"></i> ${item.phone}</p>
                            <p><i class="fas fa-child"></i> ${item.childName}</p>
                            <p><i class="fas fa-graduation-cap"></i> ${item.childClass}</p>
                            <div class="parent-actions">
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
      console.error("Error loading parents:", err);
      parentsOuter.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h3>Xatolik yuz berdi</h3>
                        <p>Ota-onalarni yuklashda xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.</p>
                    </div>
                `;
      loader.hideLoader();
      loader.showToast(
        "error",
        "Xatolik",
        "So'rov bajarilmadi. Qaytadan urinib ko'ring"
      );
    });
}

function closeModal() {
  modal.classList.remove("active");
  document.getElementById("parentsHidden").value = "";
}

closeBtn.addEventListener("click", closeModal);
cancelBtn.addEventListener("click", closeModal);

saveBtn.addEventListener("click", () => {
  const name = document.getElementById("parentName").value;
  const phone = document.getElementById("parentPhone").value;
  const childName = document.getElementById("parentChild").value;
  const childClass = document.getElementById("parentClass").value;
  const icon = document.getElementById("parentIcon").value;
  const id = document.getElementById("parentsHidden").value;

  if (!name || !phone || !childName || !childClass || !icon) {
    loader.showToast(
      "error",
      "Xatolik",
      "Iltimos, barcha maydonlarni to'ldiring!"
    );
    return;
  }

  loader.startLoading("Ma'lumotlar yuklanmoqda...");

  if (id === "") {
    axios
      .post(`${bek_url}/parents/create`, {
        icon,
        name,
        phone,
        childName,
        childClass,
      })
      .then((res) => {
        console.log(res);
        loader.completeLoading();
        loader.showToast(
          "success",
          "Muvaffaqiyatli",
          "Ota-ona muvaffaqiyatli qo'shildi!"
        );
        loadParents();
        closeModal();
      })
      .catch((err) => {
        console.log(err);
        loader.hideLoader();
        loader.showToast(
          "error",
          "Xatolik",
          "Ota-ona qo'shishda xatolik yuz berdi!"
        );
      });
  } else {
    // Update existing parent
    axios
      .put(`${bek_url}/parents/${id}`, {
        icon,
        name,
        phone,
        childName,
        childClass,
      })
      .then((res) => {
        console.log(res);
        loader.completeLoading();
        loader.showToast(
          "success",
          "Muvaffaqiyatli",
          "Ota-ona muvaffaqiyatli yangilandi!"
        );
        loadParents();
        closeModal();
      })
      .catch((err) => {
        console.log(err);
        loader.hideLoader();
        loader.showToast(
          "error",
          "Xatolik",
          "Ota-onani yangilashda xatolik yuz berdi!"
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
  document.querySelectorAll(".parent-actions .btn-success").forEach((btn) => {
    btn.addEventListener("click", function () {
      const parentCard = this.closest(".parent-card");
      const id = this.getAttribute("data-id");
      const icon = parentCard.querySelector(".parent-icon").textContent;
      const name = parentCard.querySelector("h3").textContent;
      const phone = parentCard
        .querySelectorAll("p")[0]
        .textContent.replace("📞 ", "");
      const childName = parentCard
        .querySelectorAll("p")[1]
        .textContent.replace("👶 ", "");
      const childClass = parentCard
        .querySelectorAll("p")[2]
        .textContent.replace("🎓 ", "");

      document.getElementById("parentsHidden").value = id;
      document.getElementById("parentIcon").value = icon;
      document.getElementById("parentName").value = name;
      document.getElementById("parentPhone").value = phone;
      document.getElementById("parentChild").value = childName;
      document.getElementById("parentClass").value = childClass;
      modalTitle.textContent = "Ota-onani Tahrirlash";
      modal.classList.add("active");
    });
  });

  document.querySelectorAll(".parent-actions .btn-danger").forEach((btn) => {
    btn.addEventListener("click", function () {
      if (confirm("Bu ota-onani o'chirishni istaysizmi?")) {
        loader.startLoading("Ma'lumotlar yuklanmoqda...");
        const id = this.getAttribute("data-id");
        axios
          .delete(`${bek_url}/parents/${id}`)
          .then((res) => {
            console.log(res);
            this.closest(".parent-card").remove();
            loader.completeLoading();
            loader.showToast(
              "success",
              "Muvaffaqiyatli",
              "Ota-ona muvaffaqiyatli o'chirildi!"
            );

            // Reload parents if all are deleted
            if (document.querySelectorAll(".parent-card").length === 0) {
              loadParents();
            }
          })
          .catch((err) => {
            console.log(err);
            loader.hideLoader();
            loader.showToast(
              "error",
              "Xatolik",
              "Ota-onani o'chirishda xatolik yuz berdi!"
            );
          });
      }
    });
  });
}
