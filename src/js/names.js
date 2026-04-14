// names.js — оптимизированная анимация названий

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
	"WOLFBERGER CRÉMANT D'ALSACE BRUT ROSÉ",
	"VEUVE CLICQUOT PONSARDIN",
	"MOЁT & CHANDON IMPÉRIAL",
	"MARTINI. ASTI",
	"ROSSBACHER",
];

const wineNames = [
	"SPY VALLEY",
	"CHÂTEAU LA GORCE",
	"CUSUMANO. INSOLIA",
	"CHABLIS LA PIERRELEE",
	"CHÂTEAU BRANE-CANTENAC",
	"SASSICAIA. TENUTA SAN GUIDO",
	"BARONE RICASOLI. ASTUTO",
	"MERUM PRIORATI. INICI",
	"TRAPICHE. OAK CASK",
	"RIESLING TERRASSEN",
	"SAN PEDRO. 1865",
];

const spiritsNames = [
	"NIKKA",
	"PATRÓN",
	"HENNESSY",
	"UKIYO YUZU",
	"GLENFIDDICH",
	"CONTRALUZ CRISTALINO",
	"CHIVAS REGAL 25 Y.O.",
	"ZACAPA CENTENARIO",
	"DON JULIO 1942",
	"THE MACALLAN",
	"GREY GOOSE"
];

const softNames = [
	"GARDENIST",
	"LEMONADES",
	"TEA BASED DRINKS",
	"FRESHLY SQUEEZED JUICE",
	"RED BULL",
	"LIGHT UP",
	"SMOOTHIE"
];

const coffeeNames = [
	"RAF",
	"MATCHA",
	"DOPPIO",
	"FLAT WHITE",
	"LACTOSE FREE MILK",
	"LATTE-MACHIATO",
	"CAPPUCCINO",
	"LUNGO",
];

// ─── ОПТИМИЗИРОВАННАЯ ФУНКЦИЯ АНИМАЦИИ ───────────────────────────────────────

/**
 * Запускает цикличную анимацию смены названий для одного элемента.
 * Использует один интервал вместо множества setTimeout.
 * @param {HTMLElement} el     - элемент, в котором меняется текст
 * @param {string[]}    names  - массив названий
 */
function startNameAnimation(el, names) {
	if (!el || !names.length) return;

	let currentIndex = 0;
	let animationPhase = 'in';
	let phaseStartTime = Date.now();
	let textUpdated = false;

	function updateAnimation() {
		const elapsed = Date.now() - phaseStartTime;

		switch (animationPhase) {
			case 'in':
				if (!textUpdated) {
					el.textContent = names[currentIndex];
					el.className = 'js-animate-in';
					textUpdated = true;
				}
				if (elapsed >= ANIMATE_IN_DURATION) {
					animationPhase = 'show';
					phaseStartTime = Date.now();
					el.className = '';
				}
				break;

			case 'show':
				if (elapsed >= DELAY - ANIMATE_IN_DURATION - ANIMATE_OUT_DURATION) {
					animationPhase = 'out';
					phaseStartTime = Date.now();
				}
				break;

			case 'out':
				if (elapsed === 0) {
					el.className = 'js-animate-out';
				}
				if (elapsed >= ANIMATE_OUT_DURATION) {
					currentIndex = (currentIndex + 1) % names.length;
					animationPhase = 'in';
					phaseStartTime = Date.now();
					textUpdated = false;
				}
				break;
		}
	}

	setInterval(updateAnimation, 16);
}

// ─── ЗАПУСК ДЛЯ КАЖДОГО БОКСА ────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
	startNameAnimation(
		document.querySelector("#callsign"),
		cocktailNames
	);

	startNameAnimation(
		document.querySelector("#callsign-aperitif"),
		aperitifNames
	);

	startNameAnimation(
		document.querySelector("#callsign-wine"),
		wineNames
	);

	startNameAnimation(
		document.querySelector("#callsign-spirits"),
		spiritsNames
	);

	startNameAnimation(
		document.querySelector("#callsign-soft"),
		softNames
	);

	startNameAnimation(
		document.querySelector("#callsign-coffee"),
		coffeeNames
	);
});
