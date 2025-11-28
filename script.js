// script.js - small interactions + product modal
document.addEventListener("DOMContentLoaded", function () {
  // mark active nav link
  const links = document.querySelectorAll(".nav-link");
  links.forEach((a) => {
    try {
      if (
        location.pathname.endsWith(a.getAttribute("href")) ||
        (location.pathname.endsWith("/") &&
          a.getAttribute("href") === "index.html")
      ) {
        a.classList.add("active");
      }
    } catch (e) {}
  });
  // simple scroll to top on logo click (improves UX when served under subpath)
  const logo = document.querySelector(".logo");
  if (logo)
    logo.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" })
    );

  // ----------------------------
  // Modal: open when Checkout clicked
  // ----------------------------
  const modal = document.getElementById("product-modal");
  const modalImg = document.getElementById("modal-product-img");
  const modalName = document.getElementById("modal-product-name");
  const modalPrice = document.getElementById("modal-price");
  const sizeButtons = document.querySelectorAll(".size-btn");
  const qtyInput = document.getElementById("qty-input");
  const qtyInc = document.getElementById("qty-increase");
  const qtyDec = document.getElementById("qty-decrease");
  const waLink = document.getElementById("wa-order-link");

  let currentProduct = null;
  let currentSize = "50";
  let priceMap = {}; // holds prices for current product

  // open modal handler
  function openModalFromCard(card) {
    const name =
      card.getAttribute("data-name") ||
      card.querySelector("h3")?.innerText ||
      "Produk";
    const img =
      card.getAttribute("data-img") || card.querySelector("img")?.src || "";
    // read prices from data attributes (strings)
    priceMap = {
      50: parseInt(card.getAttribute("data-price-50") || "0", 10),
      100: parseInt(card.getAttribute("data-price-100") || "0", 10),
      200: parseInt(card.getAttribute("data-price-200") || "0", 10),
    };

    currentProduct = name;
    currentSize = "50";
    qtyInput.value = 1;

    modalImg.src = img;
    modalImg.alt = name;
    modalName.textContent = name;
    updatePriceDisplay();

    // set initial active size
    sizeButtons.forEach((b) => {
      b.classList.toggle("active", b.dataset.size === currentSize);
    });

    // show modal
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  // update displayed price (format Rp)
  function formatRp(n) {
    if (!n || isNaN(n)) return "Rp0";
    // simple formatting with thousand separator
    return "Rp" + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  function updatePriceDisplay() {
    const basePrice = priceMap[currentSize] || 0;
    const qty = Math.max(1, parseInt(qtyInput.value || "1", 10));
    const total = basePrice * qty;
    modalPrice.textContent = formatRp(total);
    // update wa link
    const msg = encodeURIComponent(
      `Halo, saya mau pesan:\nProduk: ${currentProduct}\nUkuran: ${currentSize}g\nJumlah: ${qty}\nTotal: ${formatRp(
        total
      )}`
    );
    // redirect wa
    const phone = "6285779025769";
    waLink.href = `https://wa.me/${phone}?text=${msg}`;
  }

  // attach click listeners to Checkout buttons
  document.querySelectorAll(".btn-checkout").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const card = e.currentTarget.closest(".product-card");
      if (card) openModalFromCard(card);
    });
  });

  // size buttons
  sizeButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      currentSize = btn.dataset.size;
      sizeButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      updatePriceDisplay();
    });
  });

  // qty controls
  qtyInc &&
    qtyInc.addEventListener("click", () => {
      qtyInput.value = Math.max(1, parseInt(qtyInput.value || "1", 10) + 1);
      updatePriceDisplay();
    });
  qtyDec &&
    qtyDec.addEventListener("click", () => {
      qtyInput.value = Math.max(1, parseInt(qtyInput.value || "1", 10) - 1);
      updatePriceDisplay();
    });
  qtyInput &&
    qtyInput.addEventListener("input", () => {
      if (!qtyInput.value || parseInt(qtyInput.value, 10) < 1)
        qtyInput.value = 1;
      updatePriceDisplay();
    });

  // close modal (buttons / overlay)
  modal.querySelectorAll("[data-close]").forEach((el) => {
    el.addEventListener("click", closeModal);
  });
  function closeModal() {
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  // close on ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") {
      closeModal();
    }
  });
});
