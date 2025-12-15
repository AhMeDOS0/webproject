// دالة فتح وقفل الأسئلة
function toggleAnswer(btn) {
    // نصل للعنصر الذي يلي الزر (وهو الإجابة)
    const answer = btn.nextElementSibling;
    const icon = btn.querySelector('i');
    
    // إضافة أو إزالة كلاس show
    answer.classList.toggle('show');

    // لف السهم
    if (answer.classList.contains('show')) {
        icon.style.transform = 'rotate(180deg)';
    } else {
        icon.style.transform = 'rotate(0deg)';
    }
}

// دالة إرسال الرسالة (شكل فقط)
function sendMessage(e) {
    e.preventDefault(); // منع تحديث الصفحة
    const btn = document.querySelector('.btn-submit');
    const originalText = btn.innerHTML;

    btn.innerHTML = "جاري الإرسال...";
    btn.style.backgroundColor = "#93c5fd"; // لون باهت

    setTimeout(() => {
        btn.innerHTML = 'تم الإرسال بنجاح <i class="fa-solid fa-check"></i>';
        btn.style.backgroundColor = "#16a34a"; // لون أخضر

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.backgroundColor = "#2563eb"; // رجوع للون الأصلي
            e.target.reset(); // تفريغ الخانات
        }, 2000);
    }, 1500);
}
