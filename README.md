# WorldWindJS
## A community supported and enhanced Web WorldWind library

[![NPM](https://img.shields.io/npm/v/worldwindjs.svg)](https://www.npmjs.com/package/worldwindjs) 

__WorldWindJS__ is a fork of the popular [Web WorldWind](https://github.com/NASAWorldWind/WebWorldWind)
library from NASA and ESA. This fork provides a release channel for builds based on the latest fixes
and features from the WebWorldWind's develop branch plus several enhancements from the WorldWind community.

### Enhancements include:

- A template for creating geo-browser web apps with Bootstrap and Knockout.
- Keyboard navigation controls for the globe
- Improved the resolution of Bing imagery
- Support for a translucent night-image
- Removed dependency vulnerabilities

### Additional Resources

- View the tutorial [How to Build a WorldWindJS Web App](https://emxsys.github.io/worldwindjs/) on the project website
- Download __[worldwindjs](https://www.npmjs.com/package/worldwindjs)__ from npm.
- Add a 3D globe or map to a React app using the __[worldwind-react-globe](https://www.npmjs.com/package/worldwind-react-globe)__ Globe component from npm.
- Add a layer manager and other controls to a React-based globe using the __[worldwind-react-globe-bs4](https://www.npmjs.com/package/worldwind-react-globe-bs4)__ Bootstrap UI controls.
- View the React-based __worldwind-react-app__ [live demo](https://emxsys.github.io/worldwind-react-app/) and [GitHub project](https://github.com/emxsys/worldwind-react-app) to see the __worldwind-react-globe__ and __worldwind-react-globe-bs4__ components in action.

---

## Web WorldWind

3D virtual globe API in JavaScript for the web, developed by NASA. The European Space Agency has provided valuable
contributions to this platform since 2015. Web WorldWind provides a geographic context, complete with terrain, and a
collection for shapes for displaying and interacting with geographic or geo-located information in 3D and 2D in any
modern web browser. High-resolution terrain and imagery is retrieved from remote servers automatically as needed, while
enabling developers to include their own custom terrain and imagery.

- [worldwind.arc.nasa.gov](https://worldwind.arc.nasa.gov) has setup instructions, developers guides, API documentation and more
- [Forum](https://forum.worldwindcentral.com) provides help from the WorldWind community
- [WebStorm](https://www.jetbrains.com/webstorm) is used by the NASA WorldWind development team

## Get Started

The Web WorldWind [Developer's Guide](https://worldwind.arc.nasa.gov/web) has a complete description of Web WorldWind's
functionality. You'll also find there links to many Web WorldWind resources, including a user guide. The latest
Web WorldWind release provides many simple examples showing how to use all of Web WorldWind's functionality.

## Building

[Install NodeJS](https://nodejs.org). The build is known to work with v6.9.2 (LTS).

- `npm install` downloads WorldWind's dependencies

- `npm run build` builds everything

- `npm run doc` generates the WorldWind API documentation

- `npm run test` runs WorldWind's unit tests

- `npm run test:watch` automatically runs WorldWind's unit tests when source code changes

## License

Copyright 2003-2006, 2009, 2017, United States Government, as represented by the Administrator of the
National Aeronautics and Space Administration. All rights reserved.

The NASAWorldWind/WebWorldWind platform is licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
