# Better Inventory | Shell Shockers
```js
// ==UserScript==
// @name         Better Inventory | Shell Shockers
// @version      4.0
// @author       Infinite Smasher
// @description  Inventory Upgrades - item search bar, new item themes, item randomizer, misc UI tweaks, and MOAR!
// @icon         https://raw.githubusercontent.com/InfiniteSmasher/Better-Inventory/main/ico_egg.png
// @require      https://raw.githubusercontent.com/InfiniteSmasher/Better-Inventory/main/htmlEdits.js
// @match        https://shellshock.io
// ==/UserScript==

(function() {
    let script = document.createElement('script');
    script.src = 'https://github.com/InfiniteSmasher/Better-Inventory/blob/main/inventory.js?raw=true';
    document.head.appendChild(script);

    let style = document.createElement('link');
    Object.assign(style, {
        rel: 'stylesheet',
        href: 'https://github.com/InfiniteSmasher/Better-Inventory/blob/main/inventory.css?raw=true'
    });
    document.head.appendChild(style);
})();
```
