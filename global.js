class RequestLoader {
  constructor() {
    this.loaderContainer = document.getElementById("loaderContainer");
    this.progressBar = document.getElementById("progressBar");
    this.percentage = document.getElementById("percentage");
    this.status = document.getElementById("status");
    this.toastContainer = document.getElementById("toastContainer");
    this.progress = 0;
    this.interval = null;
  }

  startLoading(loadingMessage) {
    this.reset();
    this.loaderContainer.classList.remove("hidden");
    this.status.textContent = loadingMessage;

    this.interval = setInterval(() => {
      this.progress += Math.random() * 12 + 3;
      if (this.progress >= 80) {
        this.progress = 84;
      }
      this.updateProgress();
    }, 300);
  }

  updateProgress() {
    this.progressBar.style.width = `${this.progress}%`;
    this.percentage.textContent = `${Math.round(this.progress)}%`;
  }

  completeLoading() {
    clearInterval(this.interval);
    this.progress = 100;
    this.updateProgress();
    this.status.textContent = "Yakunlandi";

    setTimeout(() => {
      this.hideLoader();
    }, 600);
  }

  hideLoader() {
    this.loaderContainer.classList.add("hidden");
  }

  reset() {
    clearInterval(this.interval);
    this.progress = 0;
    this.progressBar.style.width = "0%";
    this.percentage.textContent = "0%";
    this.status.textContent = "Ishga tayyor";
  }

  showToast(type, title, message, duration = 4000) {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    const icon = type === "success" ? "✓" : "✕";

    toast.innerHTML = `
                    <span class="toast-icon">${icon}</span>
                    <div class="toast-content">
                        <div class="toast-title">${title}</div>
                        <div class="toast-message">${message}</div>
                    </div>
                `;

    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("fade-out");
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 400);
    }, duration);
  }
}

// Create global instance
const loader = new RequestLoader();

