// ==UserScript==
// @name         SystemTeam - Hide columns
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Aurélien CAPI
// @match        https://jira.adeo.com/secure/RapidBoard.jspa?rapidView=5689*
// @icon         https://www.google.com/s2/favicons?domain=adeo.com
// @updateURL    https://raw.githubusercontent.com/aurelien-CAPI/tampermonkey/main/%5BJIRA%5D%20System%20team%20collapse%20columns.js
// @downloadURL  https://raw.githubusercontent.com/aurelien-CAPI/tampermonkey/main/%5BJIRA%5D%20System%20team%20collapse%20columns.js
// ==/UserScript==

(() => {
    'use strict';

    unsafeWindow.addHideButton = () => {
        const container = document.querySelector('#ghx-notify');
        container.innerHTML += '<dd id="theMask"><button class="aui-button" data-tooltip="Masquer les premières colonnes" onclick="javascript:void(hideColumns());" aria-label="Masquer les premières colonnes"><span class="aui-icon aui-icon aui-icon-small aui-iconfont-vid-full-screen-off"></span> Masquer les 1ères colonnes</button></dd>';
        container.style.display = 'block';
        container.style.padding = '0px';

        const theMask = document.querySelector('#theMask');
        theMask.style.marginLeft = "20px"
    };

    unsafeWindow.hideColumns = () => {
        // On hide les headers
        const headers = document.querySelector('#ghx-column-headers');
        headers.children.forEach((child, value) => value < 2 ? child.style.display = 'none' : null);

        // On hide la swimlane priority
        const columns = document.querySelectorAll('.ghx-columns');
        columns.forEach(column => {column.children.forEach((child, value) => value < 2 ? child.style.display = 'none' : null)});

        // On vient changer le bouton
        const theMask = document.querySelector('#theMask');
        theMask.innerHTML = '<button class="aui-button" data-tooltip="Montrer les premières colonnes" onclick="javascript:void(showColumns());" aria-label="Montrer les premières colonnes"><span class="aui-icon aui-icon aui-icon-small aui-iconfont-vid-full-screen-on"></span> Montrer les 1ères colonnes</button>';
    }

    unsafeWindow.showColumns = () => {
        // On hide les headers
        const headers = document.querySelector('#ghx-column-headers');
        headers.children.forEach((child, value) => value < 2 ? child.style.display = 'block' : null);

        // On hide la swimlane priority
        const columns = document.querySelectorAll('.ghx-columns');
        columns.forEach(column => {column.children.forEach((child, value) => value < 2 ? child.style.display = 'block' : null)});

        // On vient changer le bouton
        const theMask = document.querySelector('#theMask');
        theMask.innerHTML = '<button class="aui-button" data-tooltip="Masquer les premières colonnes" onclick="javascript:void(hideColumns());" aria-label="Masquer les premières colonnes"><span class="aui-icon aui-icon aui-icon-small aui-iconfont-vid-full-screen-off"></span> Masquer les 1ères colonnes</button>';
    }

    unsafeWindow.addHideButton();

})();
