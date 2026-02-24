(function () {
	init();

	function init() {
		if (window.innerWidth <= 1024) return;
		setStickyContainersSize();
		bindEvents();
	}

	function bindEvents() {
		// passive: false ОБЯЗАТЕЛЬНО
		window.addEventListener("wheel", wheelHandler, { passive: false });
	}

	function setStickyContainersSize() {
		document.querySelectorAll('.content').forEach(function (container) {
			const horizontal = container.querySelector('.horizontal') || container.querySelector('.horizontal__pc');
			if (!horizontal) return;
			// Устанавливаем высоту контейнера для "липкости"
			const stikyContainerHeight = horizontal.scrollWidth + window.innerWidth;
			container.setAttribute('style', 'height: ' + stikyContainerHeight + 'px');
		});
	}

	function isElementInViewport(el) {
		const rect = el.getBoundingClientRect();
		return rect.top <= 0 && rect.bottom >= window.innerHeight;
	}

	function wheelHandler(evt) {
		// === 1. ЛОГИКА ВНУТРЕННЕГО СКРОЛЛА МЕНЮ ===
		const target = evt.target;
		const scrollArea = target.closest('.menu-scroll-area');

		if (scrollArea) {
			const hasVerticalScroll = scrollArea.scrollHeight > scrollArea.clientHeight;
			if (hasVerticalScroll) {
				const scrollTop = scrollArea.scrollTop;
				const maxScroll = scrollArea.scrollHeight - scrollArea.clientHeight;
				const delta = evt.deltaY;

				// Крутим ВВЕРХ, и мы НЕ в начале меню? -> Скроллим меню
				if (delta < 0 && scrollTop > 0) {
					evt.stopPropagation();
					return;
				}
				// Крутим ВНИЗ, и мы НЕ в конце меню? -> Скроллим меню
				if (delta > 0 && scrollTop < maxScroll) {
					evt.stopPropagation();
					return;
				}
			}
		}

		// === 2. ЛОГИКА ГОРИЗОНТАЛЬНОГО СКРОЛЛА СТРАНИЦЫ ===

		// Находим активную секцию
		const containerInViewPort = Array.from(document.querySelectorAll('.content')).find(function (container) {
			return isElementInViewport(container);
		});

		if (!containerInViewPort) return;

		const horizontal = containerInViewPort.querySelector('.horizontal') || containerInViewPort.querySelector('.horizontal__pc');
		if (!horizontal) return;

		const currentLeft = horizontal.scrollLeft;
		// Максимальная ширина прокрутки
		const maxLeft = horizontal.scrollWidth - horizontal.clientWidth;
		const delta = evt.deltaY;

		// --- ИСПРАВЛЕНИЕ ЗАСТРЕВАНИЯ ---

		// Сценарий А: Крутим ВВЕРХ (хотим назад)
		if (delta < 0) {
			// Если мы ЕЩЕ НЕ в самом начале (с запасом 1px)
			if (currentLeft > 1) {
				horizontal.scrollLeft += delta;
				evt.preventDefault(); // Блокируем подъем страницы, двигаем ленту
			}
			// Иначе (если мы в начале, currentLeft == 0) -> 
			// Ничего не делаем. preventDefault НЕ вызывается.
			// Браузер сам поднимет страницу к .greeting
		}

		// Сценарий Б: Крутим ВНИЗ (хотим вперед)
		else if (delta > 0) {
			// Если мы ЕЩЕ НЕ в самом конце (с запасом 1px)
			if (currentLeft < maxLeft - 1) {
				horizontal.scrollLeft += delta;
				evt.preventDefault(); // Блокируем спуск страницы, двигаем ленту
			}
			// Иначе (если доехали до конца) -> 
			// Ничего не делаем. Браузер сам опустит страницу ниже.
		}
	}
})();


// --- КОД АНИМАЦИИ ПРОЗРАЧНОСТИ (ОСТАВЛЯЕМ КАК БЫЛО) ---
const container = document.querySelector(".horizontal__pc");
if (container) {
	const boxes = container.querySelectorAll(".box__pc");
	function updateTransforms() {
		const scrollLeft = container.scrollLeft;
		boxes.forEach((box) => {
			const imgs = box.querySelectorAll(".info__content");
			if (!imgs.length) return;
			const progress = (scrollLeft - box.offsetLeft) / box.offsetWidth;
			const clamped = Math.max(0, Math.min(1, progress));
			imgs.forEach((img) => {
				// Если clamped > 0, картинка уходит влево -> прозрачнее
				img.style.opacity = (clamped > 0) ? 1 - clamped : 1;
			});
		});
	}
	container.addEventListener("scroll", updateTransforms);
	window.addEventListener("resize", updateTransforms);
	updateTransforms();
}

// const container = document.querySelector(".horizontal__pc");
// if (container) {
// 	const boxes = container.querySelectorAll(".box__pc");

// 	function updateTransforms() {
// 		const scrollLeft = container.scrollLeft;
// 		boxes.forEach((box) => {
// 			const imgs = box.querySelectorAll(".info__content");
// 			if (!imgs.length) return;
// 			const progress = (scrollLeft - box.offsetLeft) / box.offsetWidth;
// 			const clamped = Math.max(0, Math.min(1, progress));
// 			imgs.forEach((img) => {
// 				if (clamped > 0) {
// 					img.style.opacity = 1 - clamped;
// 				} else {
// 					img.style.opacity = 1;
// 				}
// 			});
// 		});
// 	}
// 	container.addEventListener("scroll", updateTransforms);
// 	window.addEventListener("resize", updateTransforms);
// 	updateTransforms();
// }