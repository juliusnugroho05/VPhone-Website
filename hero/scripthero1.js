// Mobile Menu Toggle
const toggle = document.getElementById("menuToggle");
const nav = document.getElementById("navMenu");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    nav.classList.toggle("active");
    toggle.classList.toggle("open");
  });

  document.querySelectorAll("#navMenu a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("active");
      toggle.classList.remove("open");
    });
  });
}

// Modern Scroll Animation using Intersection Observer
const revealElements = document.querySelectorAll(".reveal");

const revealOptions = {
  threshold: 0.15,
  rootMargin: "0px 0px -50px 0px",
};

const revealOnScroll = new IntersectionObserver(function (entries, observer) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    } else {
      entry.target.classList.add("active");
      // Stop observing once revealed to improve performance
      observer.unobserve(entry.target);
    }
  });
}, revealOptions);

revealElements.forEach((el) => {
  revealOnScroll.observe(el);
});

// MODAL LOGIC UNTUK BENTO BOX (MULTI-MODAL)
const bentoModals = [
  { btnId: "btn-camera", modalId: "modal-camera", closeId: "close-camera" },
  { btnId: "btn-chip", modalId: "modal-chip", closeId: "close-chip" },
  { btnId: "btn-os", modalId: "modal-os", closeId: "close-os" },
  { btnId: "btn-battery", modalId: "modal-battery", closeId: "close-battery" },
];

bentoModals.forEach((item) => {
  const btn = document.getElementById(item.btnId);
  const modal = document.getElementById(item.modalId);
  const closeBtn = document.getElementById(item.closeId);

  if (btn && modal && closeBtn) {
    // Buka Modal
    btn.addEventListener("click", () => {
      modal.classList.add("active");
      document.body.style.overflow = "hidden"; // Matikan scroll layar utama
    });

    // Tutup Modal lewat tombol X
    closeBtn.addEventListener("click", () => {
      modal.classList.remove("active");
      document.body.style.overflow = "auto"; // Nyalakan scroll layar utama
    });

    // Tutup Modal kalau klik area gelap di luar kotak putih
    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("active");
        document.body.style.overflow = "auto";
      }
    });
  }
});
// Logic Klik Warna di Halaman Produk
document.querySelectorAll(".color-dot").forEach((dot) => {
  dot.addEventListener("click", function () {
    // Cari semua dot di dalam container yang sama dengan yang diklik
    const parent = this.parentElement;
    parent
      .querySelectorAll(".color-dot")
      .forEach((d) => d.classList.remove("active"));

    // Tambahkan class active ke yang diklik
    this.classList.add("active");
  });
});

// FAKE BACKEND LOGIC (LocalStorage)

// 1. LOGIC PENDAFTARAN (REGISTER)
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const firstName = document.getElementById("firstName").value;

    if (!email.toLowerCase().endsWith(".com")) {
      showError("Email harus menggunakan domain .com");
      return;
    }
    if (password !== confirmPassword) {
      showError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    // SIMPAN KE LOCALSTORAGE
    const userData = {
      firstName: firstName,
      email: email,
      password: password,
    };

    localStorage.setItem("vphone_user", JSON.stringify(userData));

    alert("VPhone ID Berhasil Dibuat! Silakan login.");
    window.location.href = "../login/login.html";
  });
}

// 2. LOGIC MASUK (LOGIN)
const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("login-error");

if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const emailInput = document.getElementById("email").value;
    const passwordInput = document.getElementById("password").value;

    // Ambil data dari LocalStorage
    const savedData = JSON.parse(localStorage.getItem("vphone_user"));

    if (
      savedData &&
      emailInput === savedData.email &&
      passwordInput === savedData.password
    ) {
      // Jika Berhasil: Simpan status "sedang login"
      localStorage.setItem("isLoggedIn", "true");
      alert("Halo " + savedData.firstName + ", selamat datang kembali!");
      window.location.href = "../products/indexproducts.html";
    } else {
      // Jika Gagal
      loginError.innerText = "Email atau kata sandi salah.";
      loginError.style.display = "block";
    }
  });
}

// 3. LOGIC NAVBAR (Ganti tombol "Register" jadi "Nama User")
// 3. LOGIC NAVBAR (Menampilkan Sapaan & Tombol Logout)
function updateNavbar() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const savedData = JSON.parse(localStorage.getItem("vphone_user"));

  const navMenu = document.getElementById("navMenu");
  const userGreeting = document.getElementById("userGreeting");

  if (isLoggedIn === "true" && savedData) {
    // 1. Munculkan sapaan di sebelah Logo VPhone
    if (userGreeting) {
      userGreeting.innerHTML = `Hi, <span style="color: var(--accent); font-weight: 600;">${savedData.firstName}</span>`;
      userGreeting.style.display = "block";
    }

    // 2. Ubah link Login/Register di sebelah kanan menjadi Logout
    if (navMenu) {
      const authLink = Array.from(navMenu.querySelectorAll("a")).find(
        (a) =>
          a.textContent.includes("Register") || a.textContent.includes("Login"),
      );

      if (authLink) {
        authLink.innerText = "Logout";
        authLink.href = "#";
        authLink.style.color = "#ff453a";
        authLink.style.borderColor = "#ff453a";

        // Fungsi saat ditekan: Hapus sesi dan muat ulang halaman
        authLink.onclick = (e) => {
          e.preventDefault();
          localStorage.removeItem("isLoggedIn");
          window.location.reload();
        };
      }
    }
  }
}
// Jalankan cek navbar setiap halaman dimuat
updateNavbar();

// Fungsi pembantu untuk error di halaman register
function showError(text) {
  const err = document.getElementById("error-message");
  if (err) {
    err.innerText = text;
    err.style.display = "block";
  }
}
