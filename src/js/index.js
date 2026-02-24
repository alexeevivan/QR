// app.js — Теперь использует GSAP ScrollTrigger для локализованного прогресса и точной анимации текста.
import gsap from "./_vendors/gsap.min.js";
import MotionPathPlugin from "./_vendors/MotionPathPlugin.min.js";
import ScrollTrigger from "./_vendors/ScrollTrigger.min.js";
import ScrollSmoother from "./_vendors/ScrollSmoother.min.js";
import * as $ from "jquery";

import '../styles/main.scss';
import '../styles/_null.scss';
import '../styles/_fonts.scss';
import '../styles/_header.scss';
import '../styles/responsive/main-responsive.scss';
import { initLanguage } from './translation.js';
import './sticky.js';
import './names.js';

document.addEventListener("DOMContentLoaded", () => {
	// 1. Активируем необходимые плагины GSAP
	gsap.registerPlugin(MotionPathPlugin, ScrollTrigger, ScrollSmoother);

	// Логика заставки (#splash)
	const splash = document.getElementById("splash");
	if (splash) {
		setTimeout(() => {
			splash.classList.add("hidden");
			const removeAfterTransition = () => {
				if (splash.parentNode) splash.parentNode.removeChild(splash);
			};
			splash.addEventListener("transitionend", removeAfterTransition, { once: true });
			setTimeout(removeAfterTransition, 700);
		}, 200);
	}

	initScrollAnimation();
	initLanguage();
});


/**
 * Инициализирует ScrollTrigger для анимации текста
 * с разделением логики для PC и Mobile
 */
function initScrollAnimation() {
	gsap.registerPlugin(ScrollTrigger);

	const greetingContainer = document.querySelector('.container.greeting');
	const textA = document.querySelector('.text--a .text-inner');
	const textB = document.querySelector('.text--b .text-inner');
	const contentContainer = document.querySelector('.container.content');

	if (!greetingContainer || !textA || !textB || !contentContainer) return;

	// Создаем менеджер медиа-запросов
	let mm = gsap.matchMedia();

	// Длина скролла (можно настроить по-разному для мобилки и пк)
	const animDurationPC = '+=1500vh';
	const animDurationMobile = '+=1000vh'; // На мобилке можно сделать покороче

	// === 1. ДЕСКТОП ( > 600px ) ===
	mm.add("(min-width: 601px)", () => {
		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: greetingContainer,
				start: 'top top',
				end: animDurationPC,
				scrub: true,
				pin: true,
				pinSpacing: true
			}
		});

		// Твоя старая анимация (горизонтальное движение)
		tl.fromTo(textA, { x: '0%' }, { x: '100%', ease: 'none' }, 0)
			.fromTo(textB, { x: '-100%' }, { x: '0%', ease: 'none' }, 0);

		// Синхронное затухание greeting на десктопе
		tl.to(greetingContainer, { opacity: 0, ease: 'none' }, 0);

		// Появление контента
		gsap.fromTo(contentContainer,
			{ opacity: 0 },
			{
				opacity: 1, scrollTrigger: {
					trigger: greetingContainer,
					start: 'top top',
					end: animDurationPC,
					scrub: true
				}
			}
		);
	});

	// === 2. МОБИЛЬНЫЕ ( <= 600px ) ===
	mm.add("(max-width: 600px)", () => {
		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: greetingContainer,
				start: 'top top',
				end: animDurationMobile,
				scrub: true,
				pin: true,
				pinSpacing: true
			}
		});

		// ЭТАП 1: Text A уходит вниз и исчезает
		// Занимает первую половину скролла
		tl.to(textA, {
			y: '30vh', // Опускаем до середины экрана (или чуть ниже линий)
			opacity: 0,
			ease: 'power1.in', // Ускоряется перед исчезновением
			duration: 1 // Условная длительность (вес в таймлайне)
		});

		// ЭТАП 2: Text B выходит
		// Занимает вторую половину скролла
		// Значок ">" означает "Запустить СРАЗУ ПОСЛЕ завершения предыдущей анимации"
		tl.fromTo(textB,
			{ y: '-50vh', opacity: 0 }, // Стартуем выше (как бы из-под линий)
			{
				y: '0%',
				opacity: 1,
				ease: 'power1.out', // Замедляется при появлении
				duration: 1
			},
			">" // <--- ВОТ ЭТО ГАРАНТИРУЕТ ОЧЕРЕДНОСТЬ
		);

		// ЭТАП 3: Появление контента (когда тексты отыграли)
		// Можно запустить чуть раньше конца появления textB (например, "-=0.5")
		tl.fromTo(contentContainer,
			{ opacity: 0 },
			{ opacity: 1, duration: 0.5 },
			"-=0.5" // Чуть-чуть нахлестнем, чтобы не было пустоты
		);

		// Затухание контейнера greeting в самом конце
		tl.to(greetingContainer, { opacity: 0, duration: 0.5 }, "<");
	});
}

// Card Flip

document.addEventListener("DOMContentLoaded", () => {
	// Находим все карточки
	const flipContainers = document.querySelectorAll('.js-flip-container');

	flipContainers.forEach(container => {
		const openBtn = container.querySelector('.js-open-flip');
		const closeBtn = container.querySelector('.js-close-flip');

		// Открыть (клик по лицевой стороне)
		if (openBtn) {
			openBtn.addEventListener('click', () => {
				container.classList.add('is-flipped');
			});
		}

		// Закрыть (клик по крестику)
		if (closeBtn) {
			closeBtn.addEventListener('click', (e) => {
				e.stopPropagation(); // Чтобы не триггерило другие события
				container.classList.remove('is-flipped');
			});
		}
	});
});

const items = document.querySelectorAll(".accordion button");

function toggleAccordion() {
	const itemToggle = this.getAttribute('aria-expanded');

	for (i = 0; i < items.length; i++) {
		items[i].setAttribute('aria-expanded', 'false');
	}

	if (itemToggle == 'false') {
		this.setAttribute('aria-expanded', 'true');
	}
}

items.forEach(item => item.addEventListener('click', toggleAccordion));