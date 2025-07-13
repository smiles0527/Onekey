class Slideshow {
    constructor(containerId, images, options = {}) {
        this.container = document.getElementById(containerId);
        this.images = images;
        this.currentSlide = 0;
        this.isTransitioning = false;
        
        // options. currently changes every ~4-5 seconds. 
        this.autoPlay = options.autoPlay !== false;
        this.autoPlayInterval = options.autoPlayInterval || 5000;
        this.transitionDuration = options.transitionDuration || 1500;
        
        this.init();
    }
    
    init() {
        this.createSlides();
        this.createNavigation();
        this.createArrows();
        this.showSlide(0);
        
        if (this.autoPlay) {
            this.startAutoPlay();
        }
        
        // Pause autoplay on hover
        this.container.addEventListener('mouseenter', () => this.pauseAutoPlay());
        this.container.addEventListener('mouseleave', () => this.startAutoPlay());
    }
    
    createSlides() {
        this.images.forEach((image, index) => {
            const slide = document.createElement('div');
            slide.className = 'slide';
            slide.style.backgroundImage = `url(${image})`;
            slide.dataset.index = index;
            this.container.appendChild(slide);
        });
    }
    
    createNavigation() {
        const nav = document.createElement('div');
        nav.className = 'slide-nav';
        
        this.images.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'slide-dot';
            dot.dataset.index = index;
            dot.addEventListener('click', () => this.goToSlide(index));
            nav.appendChild(dot);
        });
        
        this.container.appendChild(nav);
        this.dots = nav.querySelectorAll('.slide-dot');
    }
    
    createArrows() {
        const prevArrow = document.createElement('button');
        prevArrow.className = 'slide-arrow prev';
        prevArrow.innerHTML = '&#10094;';
        prevArrow.addEventListener('click', () => this.prevSlide());
        
        const nextArrow = document.createElement('button');
        nextArrow.className = 'slide-arrow next';
        nextArrow.innerHTML = '&#10095;';
        nextArrow.addEventListener('click', () => this.nextSlide());
        
        this.container.appendChild(prevArrow);
        this.container.appendChild(nextArrow);
    }
    
    showSlide(index) {
        if (this.isTransitioning || index === this.currentSlide) return;
        
        this.isTransitioning = true;
        
        const slides = this.container.querySelectorAll('.slide');
        const currentSlide = slides[this.currentSlide];
        const nextSlide = slides[index];

        currentSlide.classList.remove('active');
        this.dots[this.currentSlide].classList.remove('active');
        

        nextSlide.classList.add('active');
        this.dots[index].classList.add('active');
        
        this.currentSlide = index;

        setTimeout(() => {
            this.isTransitioning = false;
        }, this.transitionDuration);
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.images.length;
        this.showSlide(nextIndex);
    }
    
    prevSlide() {
        const prevIndex = this.currentSlide === 0 ? this.images.length - 1 : this.currentSlide - 1;
        this.showSlide(prevIndex);
    }
    
    goToSlide(index) {
        if (index >= 0 && index < this.images.length) {
            this.showSlide(index);
        }
    }
    
    startAutoPlay() {
        if (this.autoPlayInterval) {
            this.autoPlayTimer = setInterval(() => {
                this.nextSlide();
            }, this.autoPlayInterval);
        }
    }
    
    pauseAutoPlay() {
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
            this.autoPlayTimer = null;
        }
    }
    
    stopAutoPlay() {
        this.pauseAutoPlay();
        this.autoPlay = false;
    }
}

// Initialize slideshow when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const slideshowImages = [
        'pics/Slide_1.JPG',
        'pics/Slide_2.JPG',
        'pics/Slide_3.JPG',
        'pics/Slide_4.JPG'
    ];
    
    // Initialize slideshow if container exists
    const slideshowContainer = document.getElementById('slideshow-container');
    if (slideshowContainer) {
        new Slideshow('slideshow-container', slideshowImages, {
            autoPlay: true,
            autoPlayInterval: 4000,
            transitionDuration: 1500
        });
    }
}); 