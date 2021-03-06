import { Dimensions } from "react-native";

// convert rgb to hex
export function rgbToHex(r, g, b) {
	return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// This function is used to darken or lighten a color based on some value
// It is a helper to pSBC below
// source https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
// Version 4.0
export const pSBCr = (d) => {
	let i = parseInt,
		m = Math.round;
	let n = d.length,
		x = {};
	if (n > 9) {
		([r, g, b, a] = d = d.split(",")), (n = d.length);
		if (n < 3 || n > 4) return null;
		(x.r = i(r[3] == "a" ? r.slice(5) : r.slice(4))), (x.g = i(g)), (x.b = i(b)), (x.a = a ? parseFloat(a) : -1);
	} else {
		if (n == 8 || n == 6 || n < 4) return null;
		if (n < 6) d = "#" + d[1] + d[1] + d[2] + d[2] + d[3] + d[3] + (n > 4 ? d[4] + d[4] : "");
		d = i(d.slice(1), 16);
		if (n == 9 || n == 5)
			(x.r = (d >> 24) & 255),
				(x.g = (d >> 16) & 255),
				(x.b = (d >> 8) & 255),
				(x.a = m((d & 255) / 0.255) / 1000);
		else (x.r = d >> 16), (x.g = (d >> 8) & 255), (x.b = d & 255), (x.a = -1);
	}
	return x;
};

// This function is used to darken or lighten a color based on some value
// source https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
export const pSBC = (p, c0, c1, l) => {
	let r,
		g,
		b,
		P,
		f,
		t,
		h,
		i = parseInt,
		m = Math.round,
		a = typeof c1 == "string";
	if (
		typeof p != "number" ||
		p < -1 ||
		p > 1 ||
		typeof c0 != "string" ||
		(c0[0] != "r" && c0[0] != "#") ||
		(c1 && !a)
	)
		return null;
	(h = c0.length > 9),
		(h = a ? (c1.length > 9 ? true : c1 == "c" ? !h : false) : h),
		(f = pSBCr(c0)),
		(P = p < 0),
		(t = c1 && c1 != "c" ? pSBCr(c1) : P ? { r: 0, g: 0, b: 0, a: -1 } : { r: 255, g: 255, b: 255, a: -1 }),
		(p = P ? p * -1 : p),
		(P = 1 - p);
	if (!f || !t) return null;
	if (l) (r = m(P * f.r + p * t.r)), (g = m(P * f.g + p * t.g)), (b = m(P * f.b + p * t.b));
	else
		(r = m((P * f.r ** 2 + p * t.r ** 2) ** 0.5)),
			(g = m((P * f.g ** 2 + p * t.g ** 2) ** 0.5)),
			(b = m((P * f.b ** 2 + p * t.b ** 2) ** 0.5));
	(a = f.a), (t = t.a), (f = a >= 0 || t >= 0), (a = f ? (a < 0 ? t : t < 0 ? a : a * P + t * p) : 0);
	if (h) return "rgb" + (f ? "a(" : "(") + r + "," + g + "," + b + (f ? "," + m(a * 1000) / 1000 : "") + ")";
	else
		return (
			"#" +
			(4294967296 + r * 16777216 + g * 65536 + b * 256 + (f ? m(a * 255) : 0))
				.toString(16)
				.slice(1, f ? undefined : -2)
		);
};

// convert hex to rgb
// source https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
export function hexToRgb(hex) {
	// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
	var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	hex = hex.replace(shorthandRegex, function (m, r, g, b) {
		return r + r + g + g + b + b;
	});

	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result
		? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16),
		  }
		: null;
}

// Generates a random hex color
// if the color is too close to white or black, it will generate a new color depending on
// the the current theme
export function generateColor(darkModeOn) {
	// generate a random color
	const r = Math.floor(Math.random() * 256);
	const g = Math.floor(Math.random() * 256);
	const b = Math.floor(Math.random() * 256);
	if (!darkModeOn) {
		if (r + g + b > 600) {
			return generateColor(darkModeOn);
		}
	} else {
		if (r + g + b < 200) {
			return generateColor(darkModeOn);
		}
	}
	return rgbToHex(r, g, b);
}

// Generates a hex color thats slightly different from the given color based on the level
export function generateDiffColor(ogColor, level) {
	// if ogColor is light negate level
	var rgbOgColor = hexToRgb(ogColor);
	var r = rgbOgColor.r;
	var g = rgbOgColor.g;
	var b = rgbOgColor.b;
	// two out of three colors > 128

	if (r + g + b > 382) {
		return pSBC(-level / 100, ogColor);
	} else {
		return pSBC((level * 0.25) / 100, ogColor);
	}
}

// Determines height and width of the grid of squares based on the screen dimensions
export function determineHeightWidth() {
	return Dimensions.get("window").width > Dimensions.get("window").height
		? Dimensions.get("window").height * 0.6
		: Dimensions.get("window").width * 0.9;
}
