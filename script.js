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


const iconBoxes = document.querySelectorAll(".icon-box");
const iconBoxContainers = document.querySelectorAll(".icon-container");
const closeBtns = document.querySelectorAll(".close-btn");
const maximizeBtns = document.querySelectorAll(".maximize-btn");
const body = document.querySelector("body");

iconBoxes.forEach((btn) => {
    btn.addEventListener("click", () => {
        let modal = btn.getAttribute("data-modal");
        document.getElementById(modal).style.display = "block";
        body.classList.add("prevent-background-scroll");
    });
});

closeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        let modal = btn.closest(".popup");
        modal.style.display = "none";
        body.classList.remove("prevent-background-scroll");
        iconBoxContainers.forEach((container) => {
            container.style.display = "flex";
        });
    });
});

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("popup")) {
        e.target.style.display = "none";
        body.classList.remove("prevent-background-scroll");
    }
});

maximizeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        let modal = btn.closest(".popup");
        let container = modal.querySelector(".popup-container");
        let body = modal.querySelector(".popup-body");

        if (modal.classList.contains("maximized")) {
            container.style.width = "min(900px, 90%)";
            container.style.top = "45%";
            body.style.height = "70vh";
        } else {
            container.style.width = "100%";
            container.style.top = "50%";
            body.style.height = "90vh";
        }

        modal.classList.toggle("maximized");
        body.classList.toggle("prevent-scroll");
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    const slides = document.querySelectorAll('.swiper-slide');
    let currentIndex = 0;

    function updateSlide(index) {
        slides.forEach((slide, idx) => {
            if (idx === index) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
    }

    updateSlide(currentIndex);

    prevButton.addEventListener('click', function () {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlide(currentIndex);
        }
    });

    nextButton.addEventListener('click', function () {
        if (currentIndex < slides.length - 1) {
            currentIndex++;
            updateSlide(currentIndex);
        }
    });
});
