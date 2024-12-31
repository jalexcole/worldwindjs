import * as WorldWind from "../src/WorldWind.js";
console.log("WorldWind", WorldWind)


var wwd = new WorldWind.WorldWindow("canvasOne");

// Add some image layers to the WorldWindow's globe.
wwd.addLayer(new WorldWind.BMNGOneImageLayer());
wwd.addLayer(new WorldWind.BMNGLandsatLayer());

// Add a compass, a coordinates display and some view controls to the WorldWindow.
wwd.addLayer(new WorldWind.CompassLayer());
wwd.addLayer(new WorldWind.CoordinatesDisplayLayer(wwd));
wwd.addLayer(new WorldWind.ViewControlsLayer(wwd));