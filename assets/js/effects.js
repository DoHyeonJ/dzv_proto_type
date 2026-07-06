document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".card, .hub-card, .stat-card");
  cards.forEach((card, i) => {
    card.style.animationDelay = `${i * 0.05}s`;
    if (!card.classList.contains("stat-card") && !card.classList.contains("hub-card")) {
      card.classList.add("animate-in");
      card.style.animationDelay = `${0.1 + i * 0.06}s`;
    }
  });

  document.querySelectorAll(".btn-primary, .btn-success").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const ripple = document.createElement("span");
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        position:absolute;border-radius:50%;pointer-events:none;
        width:${size}px;height:${size}px;
        left:${e.clientX - rect.left - size / 2}px;
        top:${e.clientY - rect.top - size / 2}px;
        background:rgba(255,255,255,0.35);
        transform:scale(0);animation:ripple 0.5s ease-out;
      `;
      this.style.position = "relative";
      this.style.overflow = "hidden";
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);
    });
  });

  if (!document.getElementById("ripple-style")) {
    const style = document.createElement("style");
    style.id = "ripple-style";
    style.textContent = `@keyframes ripple { to { transform: scale(2.5); opacity: 0; } }`;
    document.head.appendChild(style);
  }
});
