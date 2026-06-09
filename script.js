/* ============================================================
   TAMMY VAN — interaction layer
   ============================================================ */
(function () {
  "use strict";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Hero entrance ---------- */
  var hero = document.querySelector(".hero");
  window.addEventListener("load", function () {
    requestAnimationFrame(function () { hero.classList.add("loaded"); });
  });
  // safety: ensure load class even if 'load' already fired
  setTimeout(function () { hero.classList.add("loaded"); }, 400);

  /* ---------- Nav scrolled state ---------- */
  (function nav() {
    var n = document.getElementById("nav");
    if (!n) return;
    function update() { n.classList.toggle("scrolled", window.scrollY > 40); }
    window.addEventListener("scroll", update, { passive: true });
    update();
  })();

  /* ---------- Ticker seamless loop (duplicate items) ---------- */
  (function ticker() {
    var track = document.getElementById("ticker");
    if (!track) return;
    track.innerHTML += track.innerHTML;
  })();

  /* ---------- Custom cursor ---------- */
  (function cursor() {
    if (window.matchMedia("(max-width: 820px)").matches) return;
    var dot = document.querySelector(".cursor-dot");
    var ring = document.querySelector(".cursor-ring");
    if (!dot || !ring) return;
    var mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    document.addEventListener("mousemove", function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = "translate(" + mx + "px," + my + "px) translate(-50%,-50%)";
    });
    (function loop() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = "translate(" + rx + "px," + ry + "px) translate(-50%,-50%)";
      requestAnimationFrame(loop);
    })();
    var hov = "a, .job-head, .chip, .pillar, .contact-cta, .stat";
    document.querySelectorAll(hov).forEach(function (el) {
      el.addEventListener("mouseenter", function () { ring.classList.add("hovering"); });
      el.addEventListener("mouseleave", function () { ring.classList.remove("hovering"); });
    });
  })();

  /* ---------- Scroll reveals ---------- */
  (function reveals() {
    var els = document.querySelectorAll(".reveal");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      els.forEach(function (e) { e.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          if (en.target.querySelector(".cv") || en.target.classList.contains("stat")) countUp(en.target);
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (e) { io.observe(e); });
  })();

  /* ---------- Count-up for stats ---------- */
  function countUp(scope) {
    var nodes = scope.querySelectorAll(".cv[data-count]");
    nodes.forEach(function (n) {
      var target = parseFloat(n.getAttribute("data-count"));
      var fixed = (target % 1 !== 0) ? 1 : 0;
      var dur = 1100, start = null;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        n.textContent = (target * eased).toFixed(fixed);
        if (p < 1) requestAnimationFrame(step);
        else n.textContent = target.toFixed(fixed);
      }
      if (reduceMotion) { n.textContent = target.toFixed(fixed); }
      else requestAnimationFrame(step);
    });
  }

  /* ---------- Timeline accordion ---------- */
  (function timeline() {
    document.querySelectorAll(".job-head[data-toggle]").forEach(function (head) {
      head.addEventListener("click", function () {
        var job = head.closest(".job");
        var wasOpen = job.classList.contains("open");
        document.querySelectorAll(".job").forEach(function (j) { j.classList.remove("open"); });
        if (!wasOpen) job.classList.add("open");
      });
    });
  })();

  /* ---------- Timeline rail progress ---------- */
  (function rail() {
    var tl = document.querySelector(".tl");
    var rail = document.getElementById("tlRail");
    if (!tl || !rail) return;
    function update() {
      var r = tl.getBoundingClientRect();
      var vh = innerHeight;
      var total = r.height;
      var scrolled = Math.min(Math.max(vh * 0.5 - r.top, 0), total);
      var pct = total > 0 ? (scrolled / total) * 100 : 0;
      rail.style.setProperty("--prog", pct + "%");
    }
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  })();

  /* ---------- Parallax ---------- */
  (function parallax() {
    if (reduceMotion) return;
    var items = [].slice.call(document.querySelectorAll("[data-parallax]"));
    if (!items.length) return;
    function update() {
      var vh = innerHeight;
      items.forEach(function (el) {
        var r = el.getBoundingClientRect();
        var center = r.top + r.height / 2;
        var off = (center - vh / 2) / vh;
        var depth = parseFloat(el.getAttribute("data-depth")) || 0.05;
        el.style.transform = "translateY(" + (off * depth * -200) + "px)";
      });
    }
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  })();

  /* ---------- Smooth anchor offset for nav ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length < 2) return;
      var t = document.querySelector(id);
      if (t) {
        e.preventDefault();
        var y = t.getBoundingClientRect().top + window.pageYOffset - 8;
        window.scrollTo({ top: y, behavior: reduceMotion ? "auto" : "smooth" });
      }
    });
  });
})();
