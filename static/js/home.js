document.addEventListener('DOMContentLoaded', () => {
    const carouselInner = document.querySelector('.carousel-inner');
    const dots = document.querySelectorAll('.dot');
    const totalSlides = dots.length;
    let currentIndex = 0;
    const slideWidth = carouselInner.offsetWidth / (totalSlides + 1); // +1 for the cloned slide

    function updateCarousel() {
        carouselInner.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
        });
    });

    // Seamless loop logic for thoes 3 banners madede the duip
    setInterval(() => {
        currentIndex++;
        carouselInner.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        carouselInner.style.transition = 'transform 0.5s ease-in-out';

        	// Check if we're on the cloned slide
        if (currentIndex === totalSlides) {
            currentIndex = 0;
            // Instantly jump back to the first slide after the animation finishes
            setTimeout(() => {
                carouselInner.style.transition = 'none';
                carouselInner.style.transform = `translateX(0)`;
            }, 500); // Wait for the transition duration
        }
        
        	// Update dots
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }, 5000); // 5 seconds

    updateCarousel(); // Initial call
});
