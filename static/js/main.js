document.addEventListener('DOMContentLoaded', () => {
    // New: Intersection Observer for animated elements
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the visible class when the element is in view
                entry.target.classList.add('visible');
            } else {
                	// Remove the visible class with a delay to allow the animation to finish
                entry.target.classList.remove('visible');
            }
        });
    }, { threshold: 0.5 }); // Trigger when 50% of the element is visible

    const animatedElements = document.querySelectorAll('.animated');
    animatedElements.forEach(el => observer.observe(el));

    // Handle contact form submission
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('form-message');
    const toEmail = "yazishkhan7@gmail.com";

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
       // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const body = document.getElementById('body').value;

                 // Construct the email body with all form fields
            const emailBody = `Name: ${name}\nEmail: ${email}\n\n${body}`;

        // Create the mailto link with pre-filled fields
            const mailtoLink = `mailto:${toEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
            
          // Open the user's default email client
            window.location.href = mailtoLink;
        });
    }

    		// Hamburger menu toggle
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

    if (hamburgerMenu && navLinks) {
        hamburgerMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
});
