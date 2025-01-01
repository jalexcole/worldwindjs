import * as WorldWind from "../src/WorldWind.js";

const { createCanvas } = require("canvas");
const canvas = createCanvas(200, 200);
const ctx = canvas.getContext("2d");

// Write "Awesome!"
ctx.font = "30px Impact";
ctx.rotate(0.1);
ctx.fillText("Awesome!", 50, 100);

// Draw line under text
var text = ctx.measureText("Awesome!");
ctx.strokeStyle = "rgba(0,0,0,0.5)";
ctx.beginPath();
ctx.lineTo(50, 102);
ctx.lineTo(50 + text.width, 102);
ctx.stroke();

console.log("WorldWind", WorldWind);

var wwd = new WorldWind.WorldWindow(ctx);

// Add some image layers to the WorldWindow's globe.
wwd.addLayer(new WorldWind.BMNGOneImageLayer());
wwd.addLayer(new WorldWind.BMNGLandsatLayer());

// Add a compass, a coordinates display and some view controls to the WorldWindow.
wwd.addLayer(new WorldWind.CompassLayer());
wwd.addLayer(new WorldWind.CoordinatesDisplayLayer(wwd));
wwd.addLayer(new WorldWind.ViewControlsLayer(wwd));
