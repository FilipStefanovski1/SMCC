// Navigation: shrink on scroll + back to top + scroll reveal + mobile nav
// + Cookie consent (Google Analytics only after accept)

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const backToTop = document.querySelector(".back-to-top");
  const navToggle = document.querySelector(".nav-toggle");
  const mainNav = document.querySelector(".main-nav");

  // Sticky header style + back-to-top visibility
  const handleScroll = () => {
    const scrolled = window.scrollY > 40;
    if (header) header.classList.toggle("site-header--scrolled", scrolled);

    if (backToTop) {
      if (window.scrollY > 280) backToTop.classList.add("back-to-top--visible");
      else backToTop.classList.remove("back-to-top--visible");
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  // Back to top
  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Mobile nav toggle
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      const open = mainNav.classList.toggle("main-nav--open");
      navToggle.classList.toggle("nav-toggle--open", open);
    });

    // close on nav click
    mainNav.addEventListener("click", (e) => {
      if (e.target.closest("a")) {
        mainNav.classList.remove("main-nav--open");
        navToggle.classList.remove("nav-toggle--open");
      }
    });
  }

  // Scroll reveal
  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length > 0 && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    reveals.forEach((el) => observer.observe(el));
  } else {
    // Fallback: show all
    reveals.forEach((el) => el.classList.add("reveal-visible"));
  }

  // ----------------------------
  // Cookie consent + Google Analytics (GA4)
  // ----------------------------

  // Expected HTML IDs:
  // <div id="cookieBanner"> ... </div>
  // <button id="cookieAccept">Accept</button>
  // <button id="cookieReject">Reject</button>
  const banner = document.getElementById("cookieBanner");
  const btnAccept = document.getElementById("cookieAccept");
  const btnReject = document.getElementById("cookieReject");

  const CONSENT_COOKIE = "smcc_cookie_consent"; // accepted | rejected
  const CONSENT_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

  function setCookie(name, value, maxAgeSeconds) {
    document.cookie =
      `${encodeURIComponent(name)}=${encodeURIComponent(value)}` +
      `; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
  }

  function getCookie(name) {
    const target = encodeURIComponent(name) + "=";
    const parts = document.cookie.split("; ");
    for (const part of parts) {
      if (part.indexOf(target) === 0) {
        return decodeURIComponent(part.substring(target.length));
      }
    }
    return null;
  }

  // Your GA4 Measurement ID:
  const GA_MEASUREMENT_ID = "G-HCYVQK39P3";

  function loadGoogleAnalytics() {
    // Prevent double loading
    if (window.__gaLoaded) return;
    window.__gaLoaded = true;

    if (!GA_MEASUREMENT_ID) {
      console.warn("Google Analytics measurement ID not set.");
      return;
    }

    // Load gtag script
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(s);

    // Setup gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = window.gtag || gtag;

    gtag("js", new Date());

    // anonymize_ip: true is Universal Analytics-era, but GA4 supports it as config param in some setups.
    // Keeping it here as a "do no harm" option.
    gtag("config", GA_MEASUREMENT_ID, { anonymize_ip: true });
  }

  const consent = getCookie(CONSENT_COOKIE);

  if (consent === "accepted") {
    loadGoogleAnalytics();
  } else if (!consent) {
    // no choice yet -> show banner
    if (banner) banner.classList.add("is-visible");
  }

  if (btnAccept) {
    btnAccept.addEventListener("click", () => {
      setCookie(CONSENT_COOKIE, "accepted", CONSENT_MAX_AGE);
      if (banner) banner.classList.remove("is-visible");
      loadGoogleAnalytics();
    });
  }

  if (btnReject) {
    btnReject.addEventListener("click", () => {
      setCookie(CONSENT_COOKIE, "rejected", CONSENT_MAX_AGE);
      if (banner) banner.classList.remove("is-visible");
      // do NOT load GA
    });
  }
});
