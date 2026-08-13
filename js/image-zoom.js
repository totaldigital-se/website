/* Click-to-enlarge for images, sitewide.

   Opt in per image with the data-zoomable attribute:

       <img src="..." alt="..." data-zoomable>

   No lightbox library on the site to reuse (js/lightbox.min.js is video-only),
   so the overlay is built here: one at a time, closed by click or Escape.
   Styles live in css/image-zoom.css. */
(function () {
    'use strict';

    var images = document.querySelectorAll('img[data-zoomable]');
    if (!images.length) {
        return;
    }

    var overlay = null;

    function close() {
        if (!overlay) {
            return;
        }
        document.body.removeChild(overlay);
        overlay = null;
        document.removeEventListener('keydown', onKeydown);
    }

    function onKeydown(e) {
        if (e.key === 'Escape' || e.keyCode === 27) {
            close();
        }
    }

    function open(image) {
        close();

        var full = document.createElement('img');
        full.src = image.getAttribute('data-zoom-src') || image.currentSrc || image.src;
        full.alt = image.alt;

        overlay = document.createElement('div');
        overlay.className = 'image-zoom-overlay';
        overlay.appendChild(full);
        overlay.addEventListener('click', close);

        document.body.appendChild(overlay);
        document.addEventListener('keydown', onKeydown);
    }

    Array.prototype.forEach.call(images, function (image) {
        image.setAttribute('role', 'button');
        image.setAttribute('tabindex', '0');

        image.addEventListener('click', function () {
            open(image);
        });

        image.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ' || e.keyCode === 13 || e.keyCode === 32) {
                e.preventDefault();
                open(image);
            }
        });
    });
}());
