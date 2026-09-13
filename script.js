
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body {
                  background-color: white; /* Ensure the iframe has a white background */
                }

                
              </style>
                        </head>
                        <body>
                            <script src="script.js"></script>


              <script>
                              /* ============================================
   CardioP — script.js
   Predict. Prevent. Protect.
   ============================================ */

(function () {
  'use strict';

  // ============================================
  // 1. CONFIGURATION & CONSTANTS
  // ============================================
  const CONFIG = {
    SCROLL_THRESHOLD: 100,
    TOAST_DURATION: 4000,
    CHAT_RESPONSE_DELAY: 1500,
    ANIMATION_THRESHOLD: 0.1,
    ANIMATION_ROOT_MARGIN: '0px 0px -50px 0px',
  };

  const CHAT_RESPONSES = {
    'What does high blood pressure mean?':
      'High blood pressure (hypertension) means the force of blood against your artery walls is consistently too high. Over time, this can damage your heart and blood vessels, increasing your risk of heart disease and stroke. Regular monitoring and lifestyle changes can help manage it effectively.',
    'Why is medication adherence important?':
      'Medication adherence — taking your prescribed medications as directed — is crucial for managing cardiovascular conditions. Missing doses can lead to uncontrolled blood pressure and increased risk of complications. Consistent medication use helps maintain stable health outcomes.',
    'What can increase my cardiovascular risk?':
      'Several factors can increase cardiovascular risk, including: high blood pressure, high cholesterol, diabetes, smoking, obesity, physical inactivity, unhealthy diet, excessive alcohol consumption, family history of heart disease, and chronic stress.',
    'How can I improve my heart health?':
      'You can improve your heart health through: maintaining a balanced diet rich in fruits, vegetables, and whole grains; engaging in regular physical activity (at least 150 minutes of moderate exercise per week); managing stress; avoiding smoking; maintaining a healthy weight; and getting regular health check-ups.',
  };

  const DEFAULT_RESPONSE =
    'Thank you for your question. CardioP AI provides educational health information. For personalized medical advice, please consult a qualified healthcare professional.';

  // ============================================
  // 2. UTILITY FUNCTIONS
  // ============================================
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  const debounce = (fn, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // ============================================
  // 3. NAVIGATION
  // ============================================
  function navigateTo(page) {
    const pages = $$('.page');
    if (!pages.length) return;

    pages.forEach((p) => p.classList.remove('active'));
    const target = $(`#page-${page}`);
    if (target) target.classList.add('active');

    $$('.nav-link').forEach((link) => {
      link.classList.remove('active');
      if (link.dataset.page === page) link.classList.add('active');
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(observeAnimations, 100);
  }

  function toggleMobileMenu() {
    const menu = $('#mobileMenu');
    const menuIcon = $('#menuIcon');
    const closeIcon = $('#closeIcon');

    if (!menu) return;

    menu.classList.toggle('open');
    if (menuIcon) menuIcon.classList.toggle('hidden');
    if (closeIcon) closeIcon.classList.toggle('hidden');

    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
  }

  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ============================================
  // 4. TABS
  // ============================================
  function switchTab(tabName, btn) {
    $$('.tab-btn').forEach((b) => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    $$('.tab-content').forEach((c) => c.classList.add('hidden'));
    const target = $(`#tab-${tabName}`);
    if (target) target.classList.remove('hidden');
  }

  // ============================================
  // 5. CHATBOT
  // ============================================
  function addChatBubble(text, type) {
    const chatMessages = $('#chatMessages');
    if (!chatMessages) return;

    const bubble = document.createElement('div');
    bubble.className = `chat-bubble chat-bubble-${type}`;
    bubble.textContent = text;
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTypingIndicator() {
    const chatMessages = $('#chatMessages');
    if (!chatMessages) return;

    const indicator = document.createElement('div');
    indicator.id = 'typingIndicator';
    indicator.className = 'chat-bubble chat-bubble-bot flex gap-1 items-center';
    indicator.innerHTML = `
      <div class="typing-dot w-2 h-2 rounded-full bg-gray-400"></div>
      <div class="typing-dot w-2 h-2 rounded-full bg-gray-400"></div>
      <div class="typing-dot w-2 h-2 rounded-full bg-gray-400"></div>
    `;
    chatMessages.appendChild(indicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function removeTypingIndicator() {
    const indicator = $('#typingIndicator');
    if (indicator) indicator.remove();
  }

  function askQuestion(question) {
    addChatBubble(question, 'user');
    showTypingIndicator();

    setTimeout(() => {
      removeTypingIndicator();
      const response = CHAT_RESPONSES[question] || DEFAULT_RESPONSE;
      addChatBubble(response, 'bot');
    }, CONFIG.CHAT_RESPONSE_DELAY);
  }

  function sendChatMessage() {
    const input = $('#chatInput');
    if (!input) return;

    const msg = input.value.trim();
    if (msg) {
      askQuestion(msg);
      input.value = '';
    }
  }

  // ============================================
  // 6. CONTACT FORM
  // ============================================
  function handleFormSubmit(event) {
    event.preventDefault();

    $$('.form-input').forEach((input) => input.classList.remove('error'));
    $$('.error-message').forEach((error) => error.classList.remove('show'));

    let isValid = true;

    const fullName = $('#fullName');
    if (fullName && !fullName.value.trim()) {
      fullName.classList.add('error');
      const err = $('#fullNameError');
      if (err) err.classList.add('show');
      isValid = false;
    }

    const email = $('#email');
    if (email && (!email.value.trim() || !isValidEmail(email.value))) {
      email.classList.add('error');
      const err = $('#emailError');
      if (err) err.classList.add('show');
      isValid = false;
    }

    const subject = $('#subject');
    if (subject && !subject.value) {
      subject.classList.add('error');
      const err = $('#subjectError');
      if (err) err.classList.add('show');
      isValid = false;
    }

    const message = $('#message');
    if (message && !message.value.trim()) {
      message.classList.add('error');
      const err = $('#messageError');
      if (err) err.classList.add('show');
      isValid = false;
    }

    if (isValid) {
      showToast("Message sent successfully! We'll get back to you soon.", 'success');
      const form = $('#contactForm');
      if (form) form.reset();
    } else {
      showToast('Please fill in all required fields.', 'error');
    }
  }

  // ============================================
  // 7. TOAST NOTIFICATIONS
  // ============================================
  function showToast(message, type) {
    const toast = $('#toast');
    if (!toast) return;

    toast.textContent = message;
    toast.className = `toast toast-${type} show`;

    setTimeout(() => {
      toast.classList.remove('show');
    }, CONFIG.TOAST_DURATION);
  }

  // ============================================
  // 8. FAQ ACCORDION
  // ============================================
  function toggleFaq(button) {
    const faqItem = button.parentElement;
    const content = faqItem.querySelector('.faq-content');
    const icon = button.querySelector('.faq-icon');
    if (!content || !icon) return;

    const isOpen = !content.classList.contains('hidden');

    $$('.faq-item').forEach((item) => {
      const c = item.querySelector('.faq-content');
      const i = item.querySelector('.faq-icon');
      if (c) c.classList.add('hidden');
      if (i) i.style.transform = 'rotate(0deg)';
    });

    if (!isOpen) {
      content.classList.remove('hidden');
      icon.style.transform = 'rotate(180deg)';
    }
  }

  // ============================================
  // 9. SCROLL ANIMATIONS
  // ============================================
  let animationObserver = null;

  function observeAnimations() {
    if (animationObserver) animationObserver.disconnect();

    animationObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            animationObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: CONFIG.ANIMATION_THRESHOLD,
        rootMargin: CONFIG.ANIMATION_ROOT_MARGIN,
      }
    );

    $$('.fade-in-up, .slide-in-left, .slide-in-right').forEach((el) => {
      animationObserver.observe(el);
    });
  }

  // ============================================
  // 10. NAVBAR SCROLL EFFECT
  // ============================================
  function handleNavbarScroll() {
    const navbar = $('#navbar');
    if (!navbar) return;

    if (window.pageYOffset > CONFIG.SCROLL_THRESHOLD) {
      navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  }

  // ============================================
  // 11. KEYBOARD NAVIGATION
  // ============================================
  function handleKeyboardNav(e) {
    // Close mobile menu on Escape
    if (e.key === 'Escape') {
      const menu = $('#mobileMenu');
      if (menu && menu.classList.contains('open')) {
        toggleMobileMenu();
      }
    }
  }

  // ============================================
  // 12. SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
  function initSmoothScroll() {
    $$('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ============================================
  // 13. COUNTER ANIMATION (for future metrics)
  // ============================================
  function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const isDecimal = target % 1 !== 0;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      element.textContent = isDecimal ? start.toFixed(1) : Math.floor(start);
    }, 16);
  }

  // ============================================
  // 14. INITIALIZATION
  // ============================================
  function init() {
    // Expose functions to global scope for inline onclick handlers
    window.navigateTo = navigateTo;
    window.toggleMobileMenu = toggleMobileMenu;
    window.scrollToSection = scrollToSection;
    window.switchTab = switchTab;
    window.askQuestion = askQuestion;
    window.sendChatMessage = sendChatMessage;
    window.handleFormSubmit = handleFormSubmit;
    window.toggleFaq = toggleFaq;

    // Event Listeners
    window.addEventListener('scroll', debounce(handleNavbarScroll, 100));
    window.addEventListener('keydown', handleKeyboardNav);

    // Enter key for chat input
    const chatInput = $('#chatInput');
    if (chatInput) {
      chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendChatMessage();
      });
    }

    // Contact form submit
    const contactForm = $('#contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', handleFormSubmit);
    }

    // Initialize features
    observeAnimations();
    initSmoothScroll();
    handleNavbarScroll();

    // Set initial active nav state for SPA
    const homeNav = $('[data-page="home"]');
    if (homeNav && $$('.page').length > 0) {
      homeNav.classList.add('active');
    }

    console.log(
      '%c❤️ CardioP — Predict. Prevent. Protect.',
      'color: #880808; font-size: 16px; font-weight: bold;'
    );
    console.log(
      '%cBuilding accessible digital tools for cardiovascular wellness across Africa.',
      'color: #0E7C7B; font-size: 12px;'
    );
  }

  // Boot when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();


              </script>
                        </body>
                        </html>
                    
