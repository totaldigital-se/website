document.addEventListener("DOMContentLoaded", () => {
    const track = document.getElementById("logoTrack");
    const slider = document.getElementById("logoSlider");

    // Clone the track for seamless looping
    const clone = track.cloneNode(true);
    slider.appendChild(clone);

    let speed = 1;
    let scrollX = 0;
    let isPaused = false;

    function animate() {
        if (!isPaused) {
            scrollX += speed;

            // The track's offsetWidth is now accurately calculated by Flexbox
            if (scrollX >= track.offsetWidth) {
                scrollX = 0;
            }

            slider.scrollLeft = scrollX;
        }
        requestAnimationFrame(animate);
    }

    animate();

    // slider.addEventListener("mouseenter", () => isPaused = true);
    // slider.addEventListener("mouseleave", () => isPaused = false);
});