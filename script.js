const sections = [...document.querySelectorAll(".policy-content section")];
const links = [...document.querySelectorAll(".contents a[href^='#']")];
const progressBar = document.querySelector("#reading-progress-bar");
const backToTop = document.querySelector(".back-to-top");

document.documentElement.classList.add("js");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  sections.forEach((section) => revealObserver.observe(section));

  const activeSectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        links.forEach((link) => {
          if (link.hash === `#${entry.target.id}`) {
            link.setAttribute("aria-current", "location");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      });
    },
    { rootMargin: "-15% 0px -70% 0px" },
  );

  sections.forEach((section) => activeSectionObserver.observe(section));
} else {
  sections.forEach((section) => section.classList.add("is-visible"));
}

let scrollUpdatePending = false;

function updateScrollUI() {
  const scrollableHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  const progress =
    scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;

  progressBar.style.transform = `scaleX(${Math.min(progress, 1)})`;
  backToTop.hidden = window.scrollY < 400;
  scrollUpdatePending = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (scrollUpdatePending) return;
    scrollUpdatePending = true;
    window.requestAnimationFrame(updateScrollUI);
  },
  { passive: true },
);

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

updateScrollUI();
