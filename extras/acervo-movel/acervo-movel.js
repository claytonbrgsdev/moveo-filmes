gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

let smoother = ScrollSmoother.create({
  smooth: 2, 
  effects: true
});

gsap.from('.draw', {
  drawSVG: "0%",
  ease: "expo.out",
  scrollTrigger: {
    trigger: '.heading',
    start: "clamp(top center)",
    scrub: true,
    pin: '.pin',
    pinSpacing: false,

  }
})

















// little setup - ignore
gsap.set(".logo svg", {opacity: 1})


// 💚 This just adds the GSAP link to this pen, don't copy this bit
import { GSAPInfoBar } from "https://codepen.io/GreenSock/pen/vYqpyLg.js"
new GSAPInfoBar({ link: "https://gsap.com/docs/v3/Plugins/ScrollSmoother/"});
// 💚 Happy tweening!

gsap.registerPlugin(ScrollTrigger);

// 1. Prepara os caminhos do SVG (Calcula comprimento e esconde)
function prepareDragonflyPaths() {
    const paths = document.querySelectorAll('.dragonfly-path.draw');

    paths.forEach(path => {
        // ESSENCIAL: Calcula o comprimento exato do path
        const length = path.getTotalLength();
        
        // Esconde o path no estado inicial (stroke-dashoffset = comprimento total).
        gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length
        });
    });
    
    // Mostra o SVG após o setup inicial para evitar "flash"
    gsap.set('.animation-container svg', { opacity: 1 });
}

// 2. Cria o Timeline de Desenho
function createDragonflyTimeline() {
    
    prepareDragonflyPaths(); 

    // Cria o timeline que será controlado pelo scroll
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".animation-container", 
            start: "top top", 
            // Garante 2000px de rolagem para completar a animação
            end: "+=2000", 
            scrub: 1, // Atrela o scroll à animação
            pin: true, // Fixa o container na tela
        }
    });

    // === Sequência de Animação ===
    // Duração total do timeline é aproximadamente 4.0 segundos (0.8 + 1.2 + 1.5 + 0.5)
    
    // Desenha a Cabeça e Tórax 
    tl.to(["#head", "#thorax"], {
        strokeDashoffset: 0,
        duration: 0.8, 
        ease: "power2.inOut"
    }, 0) 

    // Desenha o Abdômen 
    .to("#abdomen", {
        strokeDashoffset: 0,
        duration: 1.2, 
        ease: "power2.inOut"
    }, "<0.2") // Inicia antes do anterior terminar

    // Desenha As Asas
    .to(".wing", {
        strokeDashoffset: 0,
        duration: 1.5,
        stagger: 0.05, 
        ease: "power2.out"
    }, "-=0.5") // Inicia antes do abdômen terminar

    // Efeito Visual Final (Aumenta espessura)
    .to(".dragonfly-path", {
        strokeWidth: 3.5, 
        ease: "power1.inOut",
        duration: 0.5
    });
}

// Inicia a animação após o carregamento completo
document.addEventListener("DOMContentLoaded", createDragonflyTimeline);