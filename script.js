// script.js — FINAL (accessible, clean, no aria-hidden warning)
document.addEventListener("DOMContentLoaded", function () {
  /* =========================================================
     ACTIVE NAV LINK
  ========================================================= */
  const links = document.querySelectorAll(".nav-link");
  links.forEach((a) => a.classList.remove("active"));

  links.forEach((a) => {
    const href = a.getAttribute("href");
    if (
      location.pathname.endsWith(href) ||
      (location.pathname.endsWith("/") && href === "index.html")
    ) {
      a.classList.add("active");
    }
  });

  /* =========================================================
     MOBILE NAV TOGGLE (Accessible)
  ========================================================= */
  (function setupMobileNavToggle() {
    const navToggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".nav");
    if (!navToggle || !nav) return;

    navToggle.setAttribute("aria-expanded", "false");
    navToggle.textContent = "☰";

    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      navToggle.textContent = isOpen ? "✕" : "☰";
    });

    nav.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        if (nav.classList.contains("open")) {
          nav.classList.remove("open");
          navToggle.setAttribute("aria-expanded", "false");
          navToggle.textContent = "☰";
        }
      });
    });
  })();

  /* =========================================================
     HEADER SHRINK + AUTO HIDE ON SCROLL
  ========================================================= */
  (function setupHeaderScroll() {
    const header = document.querySelector(".site-header");
    if (!header) return;

    let lastScroll = window.scrollY;
    let ticking = false;
    const hideThreshold = 12;
    const shrinkAt = 20;

    function onScroll() {
      const current = window.scrollY;
      const delta = current - lastScroll;

      header.classList.toggle("shrink", current > shrinkAt);

      if (Math.abs(delta) > hideThreshold) {
        header.classList.toggle("hidden", delta > 0);
      } else if (current <= shrinkAt) {
        header.classList.remove("hidden");
      }

      lastScroll = current;
      ticking = false;
    }

    function requestTick() {
      if (!ticking) {
        requestAnimationFrame(onScroll);
        ticking = true;
      }
    }

    window.addEventListener("scroll", requestTick, { passive: true });
  })();

  /* =========================================================
     SCROLL TO TOP ON LOGO CLICK
  ========================================================= */
  const logo = document.querySelector(".logo");
  if (logo) {
    logo.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* =========================================================
     PRODUCT MODAL (produk.html only)
     — NO aria-hidden warning
     — focus is restored correctly
  ========================================================= */
  const modal = document.getElementById("product-modal");
  if (!modal) return;

  const modalImg = document.getElementById("modal-product-img");
  const modalName = document.getElementById("modal-product-name");
  const modalPrice = document.getElementById("modal-price");
  const sizeButtons = document.querySelectorAll(".size-btn");
  const qtyInput = document.getElementById("qty-input");
  const qtyInc = document.getElementById("qty-increase");
  const qtyDec = document.getElementById("qty-decrease");
  const waLink = document.getElementById("wa-order-link");

  let currentProduct = "";
  let currentSize = "50";
  let priceMap = {};
  let lastFocusedElement = null;

  function formatRp(n) {
    return "Rp" + Number(n || 0).toLocaleString("id-ID");
  }

  function updatePrice() {
    const qty = Math.max(1, parseInt(qtyInput.value || 1, 10));
    const total = (priceMap[currentSize] || 0) * qty;
    modalPrice.textContent = formatRp(total);

    const msg = encodeURIComponent(
      `Halo, saya mau pesan:\nProduk: ${currentProduct}\nUkuran: ${currentSize}g\nJumlah: ${qty}\nTotal: ${formatRp(
        total
      )}`
    );
    waLink.href = `https://wa.me/6285779025769?text=${msg}`;
  }

  function openModal(card) {
    lastFocusedElement = document.activeElement;

    currentProduct = card.dataset.name || "Produk";
    priceMap = {
      50: parseInt(card.getAttribute("data-price-50") || "0", 10),
      100: parseInt(card.getAttribute("data-price-100") || "0", 10),
      200: parseInt(card.getAttribute("data-price-200") || "0", 10),
    };

    currentSize = "50";
    qtyInput.value = 1;

    modalImg.src = card.dataset.img || "";
    modalImg.alt = currentProduct;
    modalName.textContent = currentProduct;

    sizeButtons.forEach((b) =>
      b.classList.toggle("active", b.dataset.size === currentSize)
    );

    updatePrice();

    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    modal.querySelector(".modal-close")?.focus();
  }

  function closeModal() {
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    if (lastFocusedElement) {
      lastFocusedElement.focus();
      lastFocusedElement = null;
    }
  }

  document.querySelectorAll(".btn-checkout").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".product-card");
      if (card) openModal(card);
    });
  });

  sizeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      currentSize = btn.dataset.size;
      sizeButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      updatePrice();
    });
  });

  qtyInc.addEventListener("click", () => {
    qtyInput.value = +qtyInput.value + 1;
    updatePrice();
  });

  qtyDec.addEventListener("click", () => {
    qtyInput.value = Math.max(1, +qtyInput.value - 1);
    updatePrice();
  });

  qtyInput.addEventListener("input", () => {
    qtyInput.value = Math.max(1, +qtyInput.value || 1);
    updatePrice();
  });

  modal.querySelectorAll("[data-close]").forEach((el) => {
    el.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") {
      closeModal();
    }
  });
});
