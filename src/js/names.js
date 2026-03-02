// names.js — универсальная анимация названий для любого бокса

const DELAY = 2500;
const ANIMATE_IN_DURATION = 500;
const ANIMATE_OUT_DURATION = 500;

// ─── МАССИВЫ НАЗВАНИЙ ────────────────────────────────────────────────────────

const cocktailNames = [
	"sidecar",
	"mai-tai",
	"kamikaze",
	"appletini",
	"papa doble",
	"venezian spritz",
	"boulevardier",
	"whiskey sour",
	"grasshopper",
	"penicillin",
	"spicy fifty",
	"manhattan",
	"cardinale",
	"bramble",
	"vesper",
];

const aperitifNames = [
	"suze",
	"campari",
	"HIRSCHRUDEL",
	"Jägermeister",
	"D.O.M. PÉRIGNON",
	"martini vermouth",
	"WOLFBERGER CRÉMANT D’ALSACE BRUT ROSÉ",
	"VEUVE CLICQUOT PONSARDIN",
	"MOЁT & CHANDON IMPÉRIAL",
	"MARTINI. ASTI",
	"ROSSBACHER",
];

// ─── УНИВЕРСАЛЬНАЯ ФУНКЦИЯ АНИМАЦИИ ──────────────────────────────────────────

/**
 * Запускает цикличную анимацию смены названий для одного элемента.
 * @param {HTMLElement} el     - элемент, в котором меняется текст
 * @param {string[]}    names  - массив названий
 */
function startNameAnimation(el, names) {
	if (!el || !names.length) return;

	function replaceText(i) {
		setTimeout(() => {
			el.innerText = names[i];
		}, DELAY * i);
	}

	function animateIn(i) {
		setTimeout(() => {
			el.className = "js-animate-in";
		}, DELAY * i);

		if (i !== 0) {
			setTimeout(() => {
				el.className = "";
			}, DELAY * i - (DELAY - ANIMATE_IN_DURATION));
		}
	}

	function animateOut(i) {
		setTimeout(() => {
			el.className = "js-animate-out";
		}, DELAY * i + (DELAY - ANIMATE_OUT_DURATION));
	}

	function animate() {
		for (let i = 0; i < names.length; i++) {
			replaceText(i);
			animateIn(i);
			animateOut(i);
		}
	}

	animate();
	setInterval(animate, DELAY * names.length);
}

// ─── ЗАПУСК ДЛЯ КАЖДОГО БОКСА ────────────────────────────────────────────────

startNameAnimation(
	document.querySelector("#callsign"),
	cocktailNames
);

startNameAnimation(
	document.querySelector("#callsign-aperitif"),
	aperitifNames
);