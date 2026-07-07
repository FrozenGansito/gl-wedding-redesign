// One-time "nudge" scroll to hint the nav bar can slide horizontally
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.navigation ul');
  if (!nav) return;
  if (nav.scrollWidth <= nav.clientWidth) return; // nothing to scroll

  setTimeout(() => {
    nav.scrollTo({ left: 40, behavior: 'smooth' });
    setTimeout(() => {
      nav.scrollTo({ left: 0, behavior: 'smooth' });
    }, 450);
  }, 1400);
});
