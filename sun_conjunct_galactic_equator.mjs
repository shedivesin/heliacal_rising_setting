import assert from "node:assert/strict";

// Give the determinant of the matrix:
//   a c
//   b d
function det(a, b, c, d) {
  return a * d - c * b;
}

// Solve the linear system of equations:
//   a x + c y = e
//   b x + d y = f
function solve(a, b, c, d, e, f) {
  const determinant = det(a, b, c, d);
  const x = det(e, f, c, d) / determinant;
  const y = det(a, b, e, f) / determinant;

  return [x, y];
}

// Run an ordinary least squares regression on a + b x = y.
function regression(x, y) {
  const n = x.length;
  assert.equal(y.length, n);

  let Σx  = 0;
  let Σy  = 0;
  let Σxx = 0;
  let Σxy = 0;

  for(let i = 0; i < n; i++) {
    Σx  += x[i];
    Σy  += y[i];
    Σxx += x[i] * x[i];
    Σxy += x[i] * y[i];
  }

  return solve(n, Σx, Σx, Σxx, Σy, Σxy);
}

// This data consists of pairs of [years BC, arcminutes from 0° Sag], generated
// by casting charts on astro.com set to using the sidereal zodiac with an
// ayanamsha such that 0° Sag is the galactic equator and finding the time of
// day where the Sun is conjunct the ascendant on 17 November (Gregorian).
const data = [
  [508, +54],
  [507, +38],
  [506, +22],
  [505, +68],
  [504, +52],
  [503, +37],
  [502, +21],
  [501,  +5],
  [500, -11],
  [499, -26],
  [498, -42],
  [497,  +4],
  [496, -12],
  [495, -28],
  [494, -44],
  [493,  +2],
  [492, -14],
  [491, -30],
  [490, -45],
  [489,   0],
  [488, -15],
  [487, -31],
  [486, -47],
  [485,  -1],
  [484, -17],
  [483, -33],
  [482, -49],
  [481,  -3],
  [480, -19],
  [479, -35],
];

// Finally, run a linear regression on the data to find the point at which the
// arcminute difference is zero. This will give us our best-fit year for when
// the Sun is conjunct the galactic equator.
console.log(
  "%d BC",
  Math.round(regression(data.map(x => x[1]), data.map(x => x[0]))[0]),
);

// 495 BC
