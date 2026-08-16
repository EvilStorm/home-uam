(function () {
  "use strict";

  /* ---------- 헤더 스크롤 상태 ---------- */
  var header = document.getElementById("siteHeader");
  function onHeaderScroll() {
    header.classList.toggle("scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", onHeaderScroll, { passive: true });
  onHeaderScroll();

  /* ---------- 모바일 메뉴 ---------- */
  var menuBtn = document.getElementById("menuBtn");
  var gnb = document.getElementById("gnb");
  menuBtn.addEventListener("click", function () {
    header.classList.toggle("menu-open");
  });
  gnb.addEventListener("click", function (e) {
    if (e.target.tagName === "A") header.classList.remove("menu-open");
  });

  /* ---------- Reveal 애니메이션 ----------
     빠른 점프 스크롤(앵커 이동 등)에도 누락되지 않도록
     스크롤 기반으로 판정한다. */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  var revealTick = false;
  function checkReveal() {
    revealTick = false;
    var vh = window.innerHeight;
    revealEls = revealEls.filter(function (el) {
      var rect = el.getBoundingClientRect();
      // 화면의 88% 지점에 들어왔거나, 이미 위로 지나쳐 버린 요소는 표시
      if (rect.top < vh * 0.88 || rect.bottom < 0) {
        el.classList.add("visible");
        return false;
      }
      return true;
    });
  }
  window.addEventListener("scroll", function () {
    if (!revealTick && revealEls.length) {
      revealTick = true;
      window.requestAnimationFrame(checkReveal);
    }
  }, { passive: true });
  checkReveal();

  /* ---------- 고정 배경 스크롤 섹션 (Business) ---------- */
  var pinSection = document.getElementById("business");
  var panels = pinSection.querySelectorAll(".panel");
  var dots = pinSection.querySelectorAll(".pp-dot");
  var panelCount = panels.length;
  var current = -1;
  var mq = window.matchMedia("(max-width: 960px)");

  function setSectionHeight() {
    if (mq.matches) {
      pinSection.style.height = "";
      return;
    }
    // 패널 수 + 여유 1 화면 만큼의 스크롤 길이 확보
    pinSection.style.height = (panelCount + 1) * 100 + "vh";
  }

  function setActive(idx) {
    if (idx === current) return;
    current = idx;
    panels.forEach(function (p, i) { p.classList.toggle("active", i === idx); });
    dots.forEach(function (d, i) { d.classList.toggle("active", i === idx); });
  }

  function onPinScroll() {
    if (mq.matches) return;
    var rect = pinSection.getBoundingClientRect();
    var vh = window.innerHeight;
    var total = pinSection.offsetHeight - vh; // 실제 스크롤 가능 길이
    if (total <= 0) return;

    var progress = Math.min(Math.max(-rect.top / total, 0), 0.9999);
    setActive(Math.floor(progress * panelCount));
  }

  window.addEventListener("scroll", onPinScroll, { passive: true });
  window.addEventListener("resize", function () {
    setSectionHeight();
    onPinScroll();
  });

  setSectionHeight();
  if (!mq.matches) setActive(0);
  onPinScroll();
})();
