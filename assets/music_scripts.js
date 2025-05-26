'use strict';

//Opening or closing side bar

const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

sidebarBtn.addEventListener("click", function() {elementToggleFunc(sidebar); })

//Activating Modal-testimonial

const testimonialsItem = document.querySelectorAll('[data-testimonials-item]');
const modalContainer = document.querySelector('[data-modal-container]');
const modalCloseBtn = document.querySelector('[data-modal-close-btn]');
const overlay = document.querySelector('[data-overlay]');

const modalImg = document.querySelector('[data-modal-img]');
const modalTitle = document.querySelector('[data-modal-title]');
const modalText = document.querySelector('[data-modal-text]');

const testimonialsModalFunc = function () {
    modalContainer.classList.toggle('active');
    overlay.classList.toggle('active');
}

for (let i = 0; i < testimonialsItem.length; i++) {
    testimonialsItem[i].addEventListener('click', function () {
        modalImg.src = this.querySelector('[data-testimonials-avatar]').src;
        modalImg.alt = this.querySelector('[data-testimonials-avatar]').alt;
        modalTitle.innerHTML = this.querySelector('[data-testimonials-title]').innerHTML;
        modalText.innerHTML = this.querySelector('[data-testimonials-text]').innerHTML;

        testimonialsModalFunc();
    })
}

//Activating close button in modal-testimonial

modalCloseBtn.addEventListener('click', testimonialsModalFunc);
overlay.addEventListener('click', testimonialsModalFunc);

//Activating Filter Select and filtering options

const select = document.querySelector('[data-select]');
const selectItems = document.querySelectorAll('[data-select-item]');
const selectValue = document.querySelector('[data-select-value]');
const filterBtn = document.querySelectorAll('[data-filter-btn]');

select.addEventListener('click', function () {elementToggleFunc(this); });

for(let i = 0; i < selectItems.length; i++) {
    selectItems[i].addEventListener('click', function() {

        let selectedValue = this.innerText.toLowerCase();
        selectValue.innerText = this.innerText;
        elementToggleFunc(select);
        filterFunc(selectedValue);

    });
}

const filterItems = document.querySelectorAll('[data-filter-item]');

const filterFunc = function (selectedValue) {
    for(let i = 0; i < filterItems.length; i++) {
        if(selectedValue == "all") {
            filterItems[i].classList.add('active');
        } else if (selectedValue == filterItems[i].dataset.category) {
            filterItems[i].classList.add('active');
        } else {
            filterItems[i].classList.remove('active');
        }
    }
}

//Enabling filter button for larger screens 

let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {
    
    filterBtn[i].addEventListener('click', function() {

        let selectedValue = this.innerText.toLowerCase();
        selectValue.innerText = this.innerText;
        filterFunc(selectedValue);

        lastClickedBtn.classList.remove('active');
        this.classList.add('active');
        lastClickedBtn = this;

    })
}

// Enabling Contact Form

const form = document.querySelector('[data-form]');
const formInputs = document.querySelectorAll('[data-form-input]');
const formBtn = document.querySelector('[data-form-btn]');

for(let i = 0; i < formInputs.length; i++) {
    formInputs[i].addEventListener('input', function () {
        if(form.checkValidity()) {
            formBtn.removeAttribute('disabled');
        } else { 
            formBtn.setAttribute('disabled', '');
        }
    })
}

// Enabling Page Navigation 

const navigationLinks = document.querySelectorAll('[data-nav-link]');
const pages = document.querySelectorAll('[data-page]');

navigationLinks.forEach(link => {
  link.addEventListener('click', function () {
    // Tenta pegar do atributo data-nav-link, senão usa o texto (fallback)
    const targetPage =
      this.dataset.navLink?.toLowerCase() || this.textContent.trim().toLowerCase();

    pages.forEach((page, i) => {
      const isActive = page.dataset.page === targetPage;

      page.classList.toggle('active', isActive);
      navigationLinks[i].classList.toggle('active', isActive);
    });

    window.scrollTo(0, 0);
  });
});


// Script de rolagem de musicas
let scrollSpeed = 0.3; // Velocidade da rolagem
let lyricsContainers = document.querySelectorAll(".lyrics"); // Seleciona todos os blocos de letras

lyricsContainers.forEach((lyrics) => {
    let position = 0; // Começa no topo
    let scrolling = true; // Controle da rolagem

    function scrollLyrics() {
        if (!scrolling) return; // Para se estiver pausado
        
        position -= scrollSpeed;
        lyrics.style.transform = `translateY(${position}px)`;

        // Reinicia quando chega ao final
        if (Math.abs(position) >= lyrics.clientHeight) {
            position = 0; // Volta ao topo
        }

        requestAnimationFrame(scrollLyrics);
    }

    // Funções para controle manual
    function pauseScroll() {
        scrolling = false;
    }

    function resumeScroll() {
        scrolling = true;
        scrollLyrics();
    }

    function restartScroll() {
        position = 0;
        lyrics.style.transform = "translateY(0px)";
        scrolling = true;
        scrollLyrics();
    }

    // Eventos para parar e retomar ao passar o mouse
    lyrics.addEventListener("mouseenter", pauseScroll);
    lyrics.addEventListener("mouseleave", resumeScroll);

    // Inicia a rolagem para cada bloco individualmente
    scrollLyrics();
});

document.addEventListener("DOMContentLoaded", () => {
  // Transformar conteúdo de <span class="ipa"> em letras minúsculas
  document.querySelectorAll('span.ipa').forEach(span => {
    span.textContent = span.textContent.toLowerCase();
  });

  // Remover todas as tags <br>
  document.querySelectorAll('br').forEach(br => br.remove());

  // Substituir <b> por <p>
  document.querySelectorAll('b').forEach(b => {
    const p = document.createElement('p');
    p.innerHTML = b.innerHTML;
    b.replaceWith(p);
  });
});