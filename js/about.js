// 1. Scroll-triggered animations باستخدام Intersection Observer
const observerOptions = {
    threshold: 0.1, // تشغيل عند دخول 10% من العنصر
    rootMargin: '0px 0px -50px 0px' // تشغيل قبل الدخول قليلاً
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running'; // تشغيل الرسم
        }
    });
}, observerOptions);

// تطبيق على عناصر محددة (مثل العنوان والقوائم)
const animatedElements = document.querySelectorAll('.about h1, .about p, .about li');
animatedElements.forEach(el => {
    el.style.animationPlayState = 'paused'; // إيقاف في البداية
    observer.observe(el);
});

// 2. تأثير ripple للروابط عند النقر
document.querySelectorAll('.links a').forEach(link => {
    link.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.6)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s linear';
        ripple.style.left = (e.offsetX - 10) + 'px';
        ripple.style.top = (e.offsetY - 10) + 'px';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// تعريف الرسم للـ ripple
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to { transform: scale(4); opacity: 0; }
    }
`;
document.head.appendChild(style);

// 3. زر العودة إلى الأعلى
const backToTopBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.style.display = 'block';
    } else {
        backToTopBtn.style.display = 'none';
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
