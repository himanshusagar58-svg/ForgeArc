/* ForgeArc GA4 analytics — Measurement ID: G-CS525ZZSH6 */
(function () {
  'use strict';

  const MEASUREMENT_ID = 'G-CS525ZZSH6';
  const loaded = document.createElement('script');
  loaded.async = true;
  loaded.src = 'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID;
  document.head.appendChild(loaded);

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', MEASUREMENT_ID, { send_page_view: true });

  function cleanText(value) {
    return String(value || '').replace(/\s+/g, ' ').trim().slice(0, 100);
  }

  function track(eventName, params) {
    if (typeof window.gtag === 'function') window.gtag('event', eventName, params || {});
  }

  function classifyLink(link) {
    const href = link.getAttribute('href') || '';
    const label = cleanText(link.textContent || link.getAttribute('aria-label'));
    const location = link.closest('header') ? 'header' : link.closest('footer') ? 'footer' : link.closest('#contact') ? 'contact' : 'page';

    if (href.startsWith('tel:')) return track('call_click', { link_text: label, link_location: location });
    if (href.includes('wa.me') || href.includes('whatsapp')) return track('whatsapp_enquiry_started', { link_text: label, link_location: location });
    if (href.includes('instagram.com')) return track('social_click', { platform: 'instagram', link_location: location });
    if (href.includes('maps.app') || href.includes('google.com/maps')) return track('map_click', { link_text: label, link_location: location });
    if (href.includes('projects.html')) return track('projects_click', { link_text: label, link_location: location });
    if (href.includes('reviews.html')) return track('reviews_click', { link_text: label, link_location: location });
    if (href === '#contact') return track('contact_cta_click', { link_text: label, link_location: location });
    if (href === '#services') return track('services_nav_click', { link_text: label, link_location: location });
    if (href.startsWith('#')) track('section_navigation_click', { target_section: href.slice(1), link_text: label, link_location: location });
  }

  document.addEventListener('click', function (event) {
    const link = event.target.closest('a');
    if (link) classifyLink(link);
    const serviceCard = event.target.closest('.solution-card, .solution-feature, .extension-card');
    if (serviceCard && !link) {
      const heading = serviceCard.querySelector('h3');
      track('service_interest', { service_name: cleanText(heading && heading.textContent) });
    }
  }, { capture: true });

  const mobileTrigger = document.getElementById('mobileTrigger');
  if (mobileTrigger) mobileTrigger.addEventListener('click', function () {
    track('mobile_menu_toggle', { state: mobileTrigger.getAttribute('aria-expanded') === 'true' ? 'close' : 'open' });
  });

  const contactForm = document.getElementById('contactForm');
  if (contactForm) contactForm.addEventListener('submit', function () {
    const name = document.getElementById('name');
    const phone = document.getElementById('phone');
    const service = document.getElementById('service');
    const message = document.getElementById('message');
    const digits = phone ? phone.value.replace(/\D/g, '').replace(/^91/, '') : '';
    const valid = name && name.value.trim().length >= 4 && /^[6-9]\d{9}$/.test(digits) && service && service.value && message && message.value.trim().length >= 10;
    if (!valid) return track('lead_form_validation_failed', { selected_service: cleanText(service && service.value) });
    track('lead_submit', { lead_type: 'whatsapp_enquiry', selected_service: cleanText(service.value), message_length_bucket: message.value.trim().length < 50 ? 'short' : message.value.trim().length < 150 ? 'medium' : 'detailed' });
    track('whatsapp_enquiry_started', { source: 'contact_form', selected_service: cleanText(service.value) });
  }, { capture: true });

  const seenSections = new Set();
  const sections = document.querySelectorAll('main section[id], .hero, .services, .extensions, .crm-section, .process, .cta');
  if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const section = entry.target.id || Array.from(entry.target.classList).find(Boolean) || 'unknown';
        if (seenSections.has(section)) return;
        seenSections.add(section);
        track('section_view', { section_name: section });
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.45 });
    sections.forEach(function (section) { observer.observe(section); });
  }
})();
