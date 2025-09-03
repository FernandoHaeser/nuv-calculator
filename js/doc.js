document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.guia-section');

    const observerOptions = {
        root: null, // Observa a viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% da seção visível para disparar
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible'); // Adiciona a classe que ativa a animação
                observer.unobserve(entry.target); // Para de observar depois que a animação é aplicada
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
});