// Importe as dependências corretamente
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Swiper from "swiper/bundle";
import "swiper/css/bundle";

// Seu código
console.log("Vite está funcionando!");

// Inicialize o Swiper
new Swiper(".mySwiper", {
  pagination: {
    el: ".swiper-pagination",
  },
});

