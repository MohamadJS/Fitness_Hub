const faqItem = document.querySelectorAll(".faq-item");

for (let i = 0; i < faqItem.length; i++) {
    faqItem[i].addEventListener("click", function() {
        this.classList.toggle("show");
    })
}