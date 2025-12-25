document.addEventListener("DOMContentLoaded", function () {
    var burger = document.querySelector(".burger");
    var mobileMenu = document.querySelector(".mobile-menu");
    var navLinks = document.querySelectorAll(".nav a, .mobile-menu__nav a");
    var typeBlocks = document.querySelectorAll(".type");
    var slides = document.querySelectorAll(".hero-slide");
    var dots = document.querySelectorAll(".hero-slider__dot");
    var prevArrow = document.querySelector(".hero-slider__arrow--prev");
    var nextArrow = document.querySelector(".hero-slider__arrow--next");
    var currentSlide = 0;
    var slideInterval;
    var animationDuration = 12000;

    function closeMobileMenu() {
        if (!burger || !mobileMenu) return;
        burger.classList.remove("burger--active");
        mobileMenu.classList.remove("mobile-menu--open");
    }

    if (burger && mobileMenu) {
        burger.addEventListener("click", function () {
            var active = burger.classList.toggle("burger--active");
            if (active) {
                mobileMenu.classList.add("mobile-menu--open");
            } else {
                mobileMenu.classList.remove("mobile-menu--open");
            }
        });
    }

    navLinks.forEach(function (link) {
        link.addEventListener("click", function (e) {
            var href = link.getAttribute("href");
            if (!href || !href.startsWith("#")) return;
            var target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            closeMobileMenu();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });

    typeBlocks.forEach(function (block) {
        var previewImg = block.querySelector(".type__preview img");
        var thumbs = block.querySelectorAll(".type-thumb");
        if (!previewImg || !thumbs.length) return;

        var currentIndex = 0;

        function setActive(index) {
            if (index < 0 || index >= thumbs.length) return;
            currentIndex = index;
            thumbs.forEach(function (thumb, i) {
                if (i === index) {
                    thumb.classList.add("is-active");
                } else {
                    thumb.classList.remove("is-active");
                }
            });
            var img = thumbs[index].querySelector("img");
            if (img && img.src) {
                previewImg.src = img.src;
                var alt = img.getAttribute("alt");
                if (alt) {
                    previewImg.alt = alt;
                }
            }
        }

        thumbs.forEach(function (thumb, index) {
            thumb.addEventListener("click", function () {
                setActive(index);
            });
        });

        setActive(0);
    });

    function showSlide(index) {
        if (!slides.length) return;
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        slides.forEach(function (slide, i) {
            slide.classList.toggle("is-active", i === index);
        });
        dots.forEach(function (dot, i) {
            dot.classList.toggle("is-active", i === index);
        });
        currentSlide = index;
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlideFn() {
        showSlide(currentSlide - 1);
    }

    function startAutoSlide() {
        stopAutoSlide();
        slideInterval = setInterval(nextSlide, 8000);
    }

    function stopAutoSlide() {
        if (slideInterval) {
            clearInterval(slideInterval);
            slideInterval = null;
        }
    }

    dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
            var index = parseInt(dot.getAttribute("data-slide"), 10);
            if (isNaN(index)) return;
            showSlide(index);
            startAutoSlide();
        });
    });

    if (nextArrow) {
        nextArrow.addEventListener("click", function () {
            nextSlide();
            startAutoSlide();
        });
    }

    if (prevArrow) {
        prevArrow.addEventListener("click", function () {
            prevSlideFn();
            startAutoSlide();
        });
    }

    showSlide(0);
    startAutoSlide();

    (function () {
        var timeline = document.querySelector(".process__timeline");
        var line = document.querySelector(".process-timeline__progress-line");
        var steps = document.querySelectorAll(".process-step");
        if (!timeline || !line || !steps.length) return;

        function animateProcess(timestamp) {
            if (window.innerWidth <= 900) {
                line.style.width = "0%";
                steps.forEach(function (s) {
                    s.classList.add("is-active");
                });
                return;
            }

            var progress = (timestamp % animationDuration) / animationDuration;
            var currentLineWidth = timeline.offsetWidth * progress;
            line.style.width = progress * 100 + "%";

            steps.forEach(function (step) {
                var stepLeft = step.offsetLeft;
                var stepWidth = step.offsetWidth;
                var triggerPoint = stepLeft + stepWidth / 3;
                if (currentLineWidth >= triggerPoint) {
                    step.classList.add("is-active");
                } else {
                    step.classList.remove("is-active");
                }
            });

            requestAnimationFrame(animateProcess);
        }

        requestAnimationFrame(animateProcess);
    })();
});
