
const textArray = [
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

const callsign = document.querySelector("#callsign");
var delay = 2500;
var animateInDuration = 500;
var animateOutDuration = 500;

function replaceText(i) {
	setTimeout(function () {
		callsign.innerText = textArray[i];
		console.log(textArray[i]);
	}, delay * i)
};

function animateIn(i) {
	setTimeout(function () {
		callsign.className = "js-animate-in";
	}, delay * i);
	if (i != 0) {
		setTimeout(function () {
			callsign.className = "";
		}, delay * i - (delay - animateInDuration));
	}
};

function animateOut(i) {
	setTimeout(function () {
		callsign.className = "js-animate-out";
	}, delay * i + (delay - animateOutDuration))
};


function animate() {
	for (i = 0; i < textArray.length; i++) {
		replaceText(i);
		animateIn(i);
		animateOut(i);
	}
}

animate();
setInterval(animate, delay * textArray.length);