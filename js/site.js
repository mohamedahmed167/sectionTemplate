document.addEventListener("DOMContentLoaded", () => {
  rotateHeroTagline();
  setupScrollToPremium();
  updateYear();
  setupScrollProgress();
  setupPremiumFilter();
  setupCounters();
  setupDetailModal();
  setupTestDriveToasts();
  setupContactDrawer();
  setupRevealOnScroll();
});

function rotateHeroTagline() {
  const heroTagline = document.querySelector("[data-hero-tagline]");
  const taglines = [
    "premium cars & bikes",
    "exclusive offers this week",
    "find your next ride today",
    "free test drives on demand",
  ];
  if (!heroTagline) return;
  let index = 0;
  setInterval(() => {
    index = (index + 1) % taglines.length;
    heroTagline.textContent = taglines[index];
  }, 4000);
}

function setupScrollToPremium() {
  const scrollTrigger = document.querySelector("[data-scroll='premium']");
  const premiumSection = document.querySelector(".premium");
  if (!scrollTrigger || !premiumSection) return;
  scrollTrigger.style.cursor = "pointer";
  scrollTrigger.addEventListener("click", () => {
    premiumSection.scrollIntoView({ behavior: "smooth" });
  });
}

function updateYear() {
  const yearHolder = document.querySelector("[data-current-year]");
  if (!yearHolder) return;
  yearHolder.textContent = new Date().getFullYear();
}

function setupScrollProgress() {
  const progressBar = document.querySelector("[data-progress]");
  if (!progressBar) return;
  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const progress = docHeight ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${Math.min(Math.max(progress, 0), 100)}%`;
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();
}

function setupPremiumFilter() {
  const filterButtons = document.querySelectorAll("[data-filter]");
  const cards = document.querySelectorAll(".premium-card");
  if (!filterButtons.length || !cards.length) return;
  filterButtons.forEach((button) =>
    button.addEventListener("click", () => {
      const value = button.dataset.filter;
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      cards.forEach((card) => {
        const match = value === "all" || card.dataset.brand === value;
        if (match) {
          card.removeAttribute("hidden");
        } else {
          card.setAttribute("hidden", "true");
        }
      });
    })
  );
}

function setupCounters() {
  const counters = document.querySelectorAll("[data-count-target]");
  if (!counters.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        if (el.dataset.countStarted) return;
        el.dataset.countStarted = "true";
        animateCount(el);
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((counter) => observer.observe(counter));
}

function animateCount(container) {
  const target = Number(container.dataset.countTarget) || 0;
  const suffix = container.dataset.countSuffix || "";
  const valueHolder = container.querySelector("[data-count-value]");
  if (!valueHolder) return;
  const duration = 1500;
  const startTime = performance.now();
  const step = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const current = Math.floor(progress * target);
    valueHolder.textContent = `${current}${suffix}`;
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      valueHolder.textContent = `${target}${suffix}`;
    }
  };
  requestAnimationFrame(step);
}

function setupDetailModal() {
  const modal = document.querySelector("[data-details-modal]");
  const triggers = document.querySelectorAll("[data-details-trigger]");
  if (!modal || !triggers.length) return;

  const titleEl = modal.querySelector("[data-details-title]");
  const descEl = modal.querySelector("[data-details-description]");
  const yearEl = modal.querySelector("[data-details-year]");
  const engineEl = modal.querySelector("[data-details-engine]");
  const fuelEl = modal.querySelector("[data-details-fuel]");
  const priceEl = modal.querySelector("[data-details-price]");
  const imageEl = modal.querySelector("[data-details-image]");
  const closeButtons = modal.querySelectorAll("[data-details-close]");
  const testDriveBtn = modal.querySelector("[data-details-testdrive]");

  let currentModel = "";

  const openModal = () => {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  triggers.forEach((trigger) =>
    trigger.addEventListener("click", () => {
      const card = trigger.closest("[data-name]");
      if (!card) return;
      currentModel = card.dataset.name || "Selected vehicle";
      titleEl.textContent = currentModel;
      descEl.textContent =
        card.dataset.description || "Discover more about this premium vehicle.";
      yearEl.textContent = card.dataset.year || "—";
      engineEl.textContent = card.dataset.engine || "—";
      fuelEl.textContent = card.dataset.fuel || "—";
      priceEl.textContent = card.dataset.price || "—";
      if (imageEl && card.dataset.img) {
        imageEl.src = card.dataset.img;
        imageEl.alt = currentModel;
      }
      openModal();
    })
  );

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  closeButtons.forEach((button) =>
    button.addEventListener("click", closeModal)
  );

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });

  testDriveBtn?.addEventListener("click", () => {
    showToast(`تم حجز تجربة قيادة لـ ${currentModel || "المركبة المختارة"}`);
    closeModal();
  });
}

function setupTestDriveToasts() {
  const triggers = document.querySelectorAll("[data-testdrive-trigger]");
  if (!triggers.length) return;
  triggers.forEach((trigger) =>
    trigger.addEventListener("click", () => {
      const card = trigger.closest("[data-name]");
      const model = card?.dataset.name || "المركبة المختارة";
      showToast(`تم حجز تجربة قيادة لـ ${model}`);
    })
  );
}

function setupContactDrawer() {
  const drawer = document.querySelector("[data-contact-drawer]");
  const toggle = document.querySelector("[data-contact-toggle]");
  const closeBtn = document.querySelector("[data-contact-close]");
  const form = drawer?.querySelector("[data-contact-form]");
  const feedback = drawer?.querySelector("[data-contact-feedback]");
  if (!drawer || !toggle) return;

  const openDrawer = () => drawer.classList.add("is-open");
  const closeDrawer = () => drawer.classList.remove("is-open");

  toggle.addEventListener("click", openDrawer);
  closeBtn?.addEventListener("click", closeDrawer);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeDrawer();
    }
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get("name");
    const model = formData.get("model");
    if (feedback) {
      feedback.textContent = `شكراً ${name}! سنعاود الاتصال بك بخصوص ${model}.`;
    }
    form.reset();
    setTimeout(() => closeDrawer(), 1200);
  });
}

function setupRevealOnScroll() {
  const revealElements = document.querySelectorAll("[data-reveal]");
  if (!revealElements.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  revealElements.forEach((el) => observer.observe(el));
}

function showToast(message) {
  const stack = document.querySelector("[data-toast-stack]");
  if (!stack) return;
  const toast = document.createElement("div");
  toast.className = "toast-message";
  toast.setAttribute("role", "status");
  toast.textContent = message;
  stack.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("is-visible"));
  setTimeout(() => {
    toast.classList.remove("is-visible");
    toast.addEventListener(
      "transitionend",
      () => toast.remove(),
      { once: true }
    );
  }, 4000);
}

