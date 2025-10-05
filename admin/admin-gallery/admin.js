const bek_url = "http://localhost:4000/api/v1";
const modal = document.getElementById("photoModal");
const addBtn = document.getElementById("addPhotoBtn");
const closeBtn = document.getElementById("closeModal");
const cancelBtn = document.getElementById("cancelBtn");
const saveBtn = document.getElementById("saveBtn");
const imageInput = document.getElementById("photoImage");
const imagePreview = document.getElementById("imagePreview");
const galleryOuter = document.querySelector(".gallery-grid");

document.addEventListener("DOMContentLoaded", () => {
  loader.startLoading("Ma'lumotlar yuklanmoqda...");
  axios
    .get(`${bek_url}/gallery`)
    .then((res) => {
      const gallery = res.data;
      if (gallery.length === 0) {
        galleryOuter.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-users"></i>
                            <h3>Hech qanday fotolar yo'q</h3>
                            <p>Yangi fotoni qo'shish uchun "Yangi Foto Qo'shish" tugmasini bosing</p>
                        </div>
                    `;
        loader.completeLoading();
        return;
      }
      let allCards = "";
      gallery.forEach((item) => {
        galleryOuter.innerHTML += `
                <div class="gallery-item">
                    <img src="${item.img}" alt="${item.title}">
                    <div class="overlay">${item.title}</div>
                    <p style="display:none">${item.desc}</p>
                    <div class="gallery-actions">
                        <button data-id="${item.id}" class="btn btn-success" title="Tahrirlash">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button data-id="${item.id}" class="btn btn-danger" title="O'chirish">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
      });
      loader.completeLoading();
      setupEventListeners();
      loader.showToast("success", "Muvaffaqiyatli", "Ma'lumotlar yuklandi");
    })
    .catch((err) => {
      galleryOuter.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h3>Xatolik yuz berdi</h3>
                        <p>Fotolarni yuklashda xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.</p>
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
  document.getElementById("photoForm").reset();
  imagePreview.innerHTML =
    '<span class="image-preview-text">Rasm tanlanmagan</span>';
});

function closeModal() {
  modal.classList.remove("active");
  document.getElementById("galleryHidden").value = "";
}

closeBtn.addEventListener("click", closeModal);
cancelBtn.addEventListener("click", closeModal);

saveBtn.addEventListener("click", () => {
  const img = document.querySelector("#imagePreview img").src;
  const title = document.getElementById("photoTitle").value;
  const description = document.getElementById("photoDescription").value;
  const id = document.getElementById("galleryHidden").value;

  const selectedFile = imageInput.files[0];

  // Проверка обязательных полей
  if (!selectedFile && id == "") {
    loader.showToast("error", "Xatolik", "Iltimos, rasm tanlang");
    return;
  }

  loader.startLoading("Ma'lumotlar yuklanmoqda...");

  const formData = new FormData();
  formData.append("img", selectedFile || img);
  formData.append("title", title);
  formData.append("desc", description);

  if (id == "") {
    axios
      .post(`${bek_url}/gallery/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
        loader.completeLoading();
        loader.showToast(
          "success",
          "Muvaffaqiyatli",
          "Rasm muvaffaqiyatli qo'shildi!"
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
      .put(`${bek_url}/gallery/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
        loader.completeLoading();
        loader.showToast(
          "success",
          "Muvaffaqiyatli",
          "Rasm muvaffaqiyatli yangilandi!"
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
  document.querySelectorAll(".gallery-actions .btn-success").forEach((btn) => {
    btn.addEventListener("click", function () {
      const galleryItem = this.closest(".gallery-item");
      const imgSrc = galleryItem.querySelector("img").src;
      const title = galleryItem.querySelector(".overlay").textContent;
      const desc = galleryItem.querySelector("p").textContent;
      const id = this.getAttribute("data-id");

      imagePreview.innerHTML = `<img src="${imgSrc}" alt="Preview">`;
      document.getElementById("photoTitle").value = title;
      document.getElementById("photoDescription").value = desc;
      document.getElementById("galleryHidden").value = id;
      document.querySelector("#photoModal .modal-header h3").textContent =
        "Fotoni Tahrirlash";
      modal.classList.add("active");
    });
  });

  document.querySelectorAll(".gallery-actions .btn-danger").forEach((btn) => {
    btn.addEventListener("click", function () {
      if (confirm("Bu rasmni o'chirishni istaysizmi?")) {
        loader.startLoading("Ma'lumotlar yuklanmoqda...");
        const id = this.getAttribute("data-id");
        axios
          .delete(`${bek_url}/gallery/${id}`)
          .then((res) => {
            console.log(res);
            this.closest(".gallery-item").remove();
            loader.completeLoading();
            loader.showToast(
              "success",
              "Muvaffaqiyatli",
              "Rasm muvaffaqiyatli o'chirildi!"
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
