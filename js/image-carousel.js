/* Horizontal image carousel, sitewide. See css/image-carousel.css for markup.

   The track scrolls natively (scroll-snap), so swipe and trackpad work with
   no JS. This only adds arrows, dots and keyboard control on top, and keeps
   them in sync with wherever the user scrolled to. */
(function () {
    'use strict';

    var carousels = document.querySelectorAll('[data-image-carousel]');
    if (!carousels.length) {
        return;
    }

    function setup(carousel) {
        var track = carousel.querySelector('.image-carousel-track');
        if (!track) {
            return;
        }

        var slides = track.querySelectorAll('.image-carousel-slide');
        if (slides.length < 2) {
            return;
        }

        var current = 0;

        function arrow(direction, label, glyph) {
            var button = document.createElement('button');
            button.type = 'button';
            button.className = 'image-carousel-arrow image-carousel-arrow--' + direction;
            button.setAttribute('aria-label', label);
            button.innerHTML = '<i class="fa-solid fa-chevron-' + glyph + '" aria-hidden="true"></i>';
            button.addEventListener('click', function () {
                /* wrap around, so neither end is a dead button */
                go(direction === 'prev'
                    ? (current - 1 + slides.length) % slides.length
                    : (current + 1) % slides.length);
            });
            carousel.appendChild(button);
            return button;
        }

        function go(index) {
            /* offsetLeft is relative to the track's padding box, so the
               difference is exactly the scroll position that centers it */
            track.scrollTo({
                left: slides[index].offsetLeft - track.offsetLeft,
                behavior: 'smooth'
            });
        }

        arrow('prev', 'Föregående bild', 'left');
        arrow('next', 'Nästa bild', 'right');

        var dots = document.createElement('div');
        dots.className = 'image-carousel-dots';

        Array.prototype.forEach.call(slides, function (slide, index) {
            var dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'image-carousel-dot';
            dot.setAttribute('aria-label', 'Gå till bild ' + (index + 1) + ' av ' + slides.length);
            dot.addEventListener('click', function () {
                go(index);
            });
            dots.appendChild(dot);
        });

        carousel.appendChild(dots);

        function markCurrent(index) {
            current = index;
            Array.prototype.forEach.call(dots.children, function (dot, i) {
                dot.setAttribute('aria-current', i === index ? 'true' : 'false');
            });
        }

        markCurrent(0);

        /* Whatever moved the track — arrow, dot, swipe, wheel — the nearest
           slide to the track's left edge is the one now on screen. */
        var settle = null;
        track.addEventListener('scroll', function () {
            clearTimeout(settle);
            settle = setTimeout(function () {
                var position = track.scrollLeft;
                var nearest = 0;
                var shortest = Infinity;

                Array.prototype.forEach.call(slides, function (slide, index) {
                    var distance = Math.abs(slide.offsetLeft - track.offsetLeft - position);
                    if (distance < shortest) {
                        shortest = distance;
                        nearest = index;
                    }
                });

                markCurrent(nearest);
            }, 80);
        });

        /* Keyboard control once the carousel has focus. The track is
           focusable so this is reachable without a mouse. */
        track.setAttribute('tabindex', '0');
        track.setAttribute('role', 'group');
        track.setAttribute('aria-label', 'Bildspel');
        track.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                go((current - 1 + slides.length) % slides.length);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                go((current + 1) % slides.length);
            }
        });
    }

    Array.prototype.forEach.call(carousels, setup);
}());
