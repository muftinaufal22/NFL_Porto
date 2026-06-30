import "./style.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initThreeScene, toggleLight } from "./3d-scene.js";
import { PROJECTS } from "./projects-data.js";

gsap.registerPlugin(ScrollTrigger);

const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
if (document.getElementById("bg-3d")) initThreeScene();

// ==========================================
// SLIDER GESER LAYANAN (Bisa Klik Panah & Drag)
// ==========================================
function initServiceSlider() {
  const carousel = document.getElementById("services-carousel");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");

  if (!carousel) return;

  const getScrollAmount = () => {
    const firstCard = carousel.querySelector(".service-card");
    if (!firstCard) return 320;
    return firstCard.offsetWidth + 24;
  };

  const scrollLeft = () => {
    const amount = getScrollAmount();
    carousel.scrollBy({ left: -amount, behavior: "smooth" });
  };

  const scrollRight = () => {
    const amount = getScrollAmount();
    carousel.scrollBy({ left: amount, behavior: "smooth" });
  };

  if (prevBtn) prevBtn.addEventListener("click", scrollLeft);
  if (nextBtn) nextBtn.addEventListener("click", scrollRight);
}

// ==========================================
// EFEK INTERAKSI KARTU (3D TILT & KLIK SHOCKWAVE)
// ==========================================
function initCardInteractions() {
  const projectLinks = document.querySelectorAll(".project-card-link");
  const serviceCards = document.querySelectorAll(".service-card");
  const allCards = document.querySelectorAll(".project-card, .service-card");

  const spkChart = document.querySelector(".chart-simulasi");
  if (spkChart) {
    for (let i = 0; i < 5; i++) {
      const bar = document.createElement("div");
      bar.className = "bar";
      bar.style.setProperty("--h", (0.3 + Math.random() * 0.6));
      bar.style.animationDelay = i * 0.3 + "s";
      spkChart.appendChild(bar);
    }
  }

  if (!isTouchDevice) {
    allCards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = ((y / rect.height) - 0.5) * -12;
        const rotateY = ((x / rect.width) - 0.5) * 12;
        gsap.to(card, {
          rotateX, rotateY, transformPerspective: 1200, duration: 0.3, ease: "power2.out",
          boxShadow: `0 20px 50px rgba(0, 240, 255, ${0.15 + (Math.abs(rotateX) + Math.abs(rotateY)) / 30})`,
        });
      });
      card.addEventListener("mouseleave", () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, boxShadow: "0 10px 30px rgba(0,0,0,0.2)", duration: 0.6, ease: "elastic.out(1, 0.4)" });
      });
    });
  }

  const triggerClickEffect = (element, callback = null) => {
    gsap.fromTo(element, { scale: 1 }, {
      scale: 0.92, duration: 0.1, ease: "power2.in", onComplete: () => {
        gsap.to(element, {
          scale: 1.05, duration: 0.15, ease: "power2.out", onComplete: () => {
            gsap.to(element, { scale: 1, duration: 0.2, ease: "elastic.out(1, 0.3)", onComplete: () => { if (callback) callback(); } });
          },
        });
      },
    });
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const shockwave = document.createElement("div");
    shockwave.style.cssText = `position:fixed; left:${centerX}px; top:${centerY}px; width:10px; height:10px; border-radius:50%; background:rgba(0,240,255,0.8); box-shadow:0 0 40px #00f0ff; z-index:9999; pointer-events:none; transform:translate(-50%, -50%) scale(0);`;
    document.body.appendChild(shockwave);
    gsap.to(shockwave, { scale: 20, opacity: 0, duration: 0.8, ease: "power4.out", onComplete: () => shockwave.remove() });
  };

  projectLinks.forEach((link) => {
    const card = link.querySelector(".project-card");
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const href = link.getAttribute("href");
      triggerClickEffect(card, () => { window.location.href = href; });
    });
  });

  serviceCards.forEach((card) => {
    card.addEventListener("click", () => { triggerClickEffect(card); });
  });
}

// ==========================================
// ANIMASI ENTRANCE & SCROLL
// ==========================================
function animateEntranceHome() {
  gsap.timeline({ defaults: { ease: "power3.out" } })
    .from(".navbar", { y: -100, opacity: 0, duration: 1.2, ease: "expo.out" })
    .from(".hero-content .subtitle", { y: 30, opacity: 0, duration: 0.8 }, "-=0.6")
    .from(".title .text-gradient", { y: 120, opacity: 0, duration: 1, ease: "power4.out" }, "-=0.4")
    .from(".description", { y: 30, opacity: 0, duration: 0.8 }, "-=0.5")
    .from(".cta-buttons button", { y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: "back.out(1.4)" }, "-=0.4");
  setTimeout(initServiceSlider, 500);
  setTimeout(initCardInteractions, 1000);
}

function setupScrollAnimations() {
  gsap.from(".profile-3d-container", { scrollTrigger: { trigger: ".about-section", start: "top 75%" }, x: -80, duration: 1.2, ease: "power3.out" });
  gsap.from(".about-text", { scrollTrigger: { trigger: ".about-section", start: "top 75%" }, x: 80, opacity: 0, duration: 1.2, delay: 0.2, ease: "power3.out" });

  gsap.set(".service-card", { opacity: 0, y: 40 });
  gsap.to(".service-card", { scrollTrigger: { trigger: ".services-section", start: "top 85%" }, y: 0, opacity: 1, duration: 0.6, stagger: { amount: 0.25 }, ease: "power2.out" });

  gsap.from(".project-card", { scrollTrigger: { trigger: ".projects-section", start: "top 75%" }, y: 100, opacity: 0, duration: 1, stagger: { amount: 0.6, from: "random" } });
  gsap.from(".contact-container, .contact-info", { scrollTrigger: { trigger: ".contact-section", start: "top 80%" }, y: 60, scale: 0.95, opacity: 0, duration: 1 });
}

// ==========================================
// HALAMAN DETAIL PROYEK
// ==========================================
if (window.location.pathname.includes("project-detail.html")) {
  const params = new URLSearchParams(window.location.search);
  const projectId = params.get("id");
  const project = PROJECTS.find((p) => p.id === projectId);

  if (project) {
    // Isi semua konten dulu
    document.title = `${project.title} — MHN.`;
    document.getElementById("d-role").textContent = project.role;
    document.getElementById("d-role2").textContent = project.role;
    document.getElementById("d-title").textContent = project.title;
    document.getElementById("d-desc").textContent = project.shortDesc;
    document.getElementById("d-year").textContent = project.year;
    document.getElementById("d-long").innerHTML = project.longDesc;

    const imgEl = document.getElementById("d-img");
    if (imgEl && project.image) {
      imgEl.src = project.image;
      imgEl.alt = project.title;
    }

    const btnGithub = document.getElementById("d-github");
    if (btnGithub && project.github) btnGithub.href = project.github;
    const btnDemo = document.getElementById("d-demo");
    if (btnDemo && project.demo) btnDemo.href = project.demo;

    document.getElementById("d-features").innerHTML = project.features.map((f) => `<li>${f}</li>`).join("");
    document.getElementById("d-tech").innerHTML = project.tech.map((t) => `<span class="tech-badge">${t}</span>`).join("");

    const othersWrap = document.getElementById("d-others");
    othersWrap.innerHTML = "";
    PROJECTS.filter((p) => p.id !== projectId).forEach((p) => {
      othersWrap.innerHTML += `<a href="project-detail.html?id=${p.id}" class="other-project-link"><span class="other-project-title">${p.title}</span><span class="other-project-role">${p.role}</span></a>`;
    });

    // Tunggu DOM selesai render baru jalankan animasi
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const els = ".back-btn, .detail-role, .detail-title, .detail-desc, .detail-meta, .detail-actions, .detail-image-wrap, .detail-content, .detail-sidebar";
        gsap.set(els, { opacity: 0, y: 20 });
        gsap.timeline({ defaults: { duration: 0.8, ease: "power3.out" } })
          .to(".back-btn", { opacity: 1, y: 0, duration: 0.5 })
          .to(".detail-role, .detail-title, .detail-desc", { opacity: 1, y: 0, stagger: 0.1 }, "-=0.3")
          .to(".detail-meta", { opacity: 1, y: 0 }, "-=0.2")
          .to(".detail-actions", { opacity: 1, y: 0 }, "-=0.2")
          .to(".detail-image-wrap", { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power4.out" }, "-=0.3")
          .to(".detail-content, .detail-sidebar", { opacity: 1, y: 0 }, "-=0.3");
      });
    });

  } else {
    document.getElementById("d-title").textContent = "Proyek tidak ditemukan.";
  }

} else {
  // ==========================================
  // HALAMAN UTAMA (index.html)
  // ==========================================
  const loader = document.getElementById("loading-screen");
  if (loader) {
    gsap.to(loader, {
      opacity: 0, duration: 1, delay: 1, onComplete: () => {
        loader.style.display = "none";
        animateEntranceHome();
        setupScrollAnimations();
      },
    });
  } else {
    animateEntranceHome();
    setupScrollAnimations();
  }
}

// ==========================================
// TOMBOL TOGGLE LIGHT
// ==========================================
const floatBtn = document.getElementById("floating-light-btn");
if (floatBtn) {
  gsap.to(floatBtn, { y: -8, duration: 2, repeat: -1, yoyo: true, ease: "sine.inOut" });
  floatBtn.addEventListener("click", () => {
    const isLightOn = toggleLight();
    gsap.fromTo(floatBtn, { scale: 0.8 }, { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.3)" });
    if (isLightOn) {
      floatBtn.style.color = "#fbbf24";
      floatBtn.style.filter = "drop-shadow(0 0 10px #fbbf24)";
      document.body.classList.add("light-mode");
    } else {
      floatBtn.style.color = "white";
      floatBtn.style.filter = "none";
      document.body.classList.remove("light-mode");
    }
  });
}