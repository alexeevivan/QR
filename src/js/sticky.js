// sticky.js — оптимизированная версия

(function () {
	// Кэшируем DOM-элементы один раз, а не при каждом событии колеса
	let contentContainers = [];
	let horizontalEl = null;

	function init() {
		if (window.innerWidth <= 1024) return;

		contentContainers = Array.from(document.querySelectorAll('.content'));
		setStickyContainersSize();
		bindEvents();
	}

	function bindEvents() {
		window.addEventListener("wheel", wheelHandler, { passive: false });

		// Пересчитываем высоту при ресайзе (debounce — не спамим layout)
		window.addEventListener("resize", debounce(() => {
			contentContainers = Array.from(document.querySelectorAll('.content'));
			setStickyContainersSize();
		}, 200));
	}

	function setStickyContainersSize() {
		contentContainers.forEach(function (container) {
			// .horizontal__pc включает .horizontal, поэтому ищем один раз
			const horizontal = container.querySelector('.horizontal__pc, .horizontal');
			if (!horizontal) return;
			// Высота = ширина горизонтальной ленты + viewport, чтобы было куда скроллить
			container.style.height = (horizontal.scrollWidth + window.innerWidth) + 'px';
		});
	}

	function isElementInViewport(el) {
		const rect = el.getBoundingClientRect();
		return rect.top <= 0 && rect.bottom >= window.innerHeight;
	}

	function wheelHandler(evt) {
		const delta = evt.deltaY;
		if (delta === 0) return; // Игнорируем горизонтальный trackpad-скролл

		// === 1. ВНУТРЕННИЙ СКРОЛЛ МЕНЮ ===
		// Если колесо крутится над .menu-scroll-area — отдаём управление ей
		const scrollArea = evt.target.closest('.menu-scroll-area');
		if (scrollArea && scrollArea.scrollHeight > scrollArea.clientHeight) {
			const { scrollTop, scrollHeight, clientHeight } = scrollArea;
			const atTop = scrollTop <= 0;
			const atBottom = scrollTop >= scrollHeight - clientHeight - 1;

			// Не дошли до края меню — скроллим меню, страницу не трогаем
			if ((delta < 0 && !atTop) || (delta > 0 && !atBottom)) {
				evt.stopPropagation();
				return;
			}
		}

		// === 2. ГОРИЗОНТАЛЬНЫЙ СКРОЛЛ СТРАНИЦЫ ===
		const activeContainer = contentContainers.find(isElementInViewport);
		if (!activeContainer) return;

		const horizontal = activeContainer.querySelector('.horizontal__pc, .horizontal');
		if (!horizontal) return;

		const { scrollLeft, scrollWidth, clientWidth } = horizontal;
		const maxLeft = scrollWidth - clientWidth;

		if (delta < 0 && scrollLeft > 1) {
			// Едем влево — есть куда
			horizontal.scrollLeft += delta;
			evt.preventDefault();
		} else if (delta > 0 && scrollLeft < maxLeft - 1) {
			// Едем вправо — есть куда
			horizontal.scrollLeft += delta;
			evt.preventDefault();
		}
		// Если достигли края — браузер сам скроллит страницу вверх/вниз
	}

	// Утилита: защита от лишних вызовов при ресайзе
	function debounce(fn, delay) {
		let timer;
		return function (...args) {
			clearTimeout(timer);
			timer = setTimeout(() => fn.apply(this, args), delay);
		};
	}

	init();
})();


// --- АНИМАЦИЯ ПРОЗРАЧНОСТИ .info__content при горизонтальном скролле ---
(function () {
	const container = document.querySelector(".horizontal__pc");
	if (!container) return;

	const boxes = Array.from(container.querySelectorAll(".box__pc"));

	// requestAnimationFrame — обновляем стили только в нужный момент рендера,
	// а не при каждом тике события scroll
	let rafScheduled = false;

	function updateOpacity() {
		rafScheduled = false;
		const scrollLeft = container.scrollLeft;

		boxes.forEach((box) => {
			const contents = box.querySelectorAll(".info__content");
			if (!contents.length) return;

			const progress = (scrollLeft - box.offsetLeft) / box.offsetWidth;
			const opacity = 1 - Math.max(0, Math.min(1, progress));

			contents.forEach((el) => {
				el.style.opacity = opacity;
			});
		});
	}

	function scheduleUpdate() {
		if (!rafScheduled) {
			rafScheduled = true;
			requestAnimationFrame(updateOpacity);
		}
	}

	container.addEventListener("scroll", scheduleUpdate, { passive: true });
	window.addEventListener("resize", scheduleUpdate, { passive: true });
	updateOpacity(); // Первоначальный вызов
})();