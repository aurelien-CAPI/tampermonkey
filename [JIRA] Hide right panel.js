// ==UserScript==
// @name         JIRA CONFIG RIGHT PANEL 2
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Hide or show right panel in jira
// @author       Aurélien CAPI
// @match        https://jira.adeo.com/browse/ISO-*
// @icon         https://www.google.com/s2/favicons?domain=adeo.com
// @updateURL    https://raw.githubusercontent.com/aurelien-CAPI/tampermonkey/main/%5BJIRA%5D%20Hide%20right%20panel.js
// @downloadURL  https://raw.githubusercontent.com/aurelien-CAPI/tampermonkey/main/%5BJIRA%5D%20Hide%20right%20panel.js
// ==/UserScript==

(() => {
    'use strict';

    unsafeWindow.hideRightPanel = () => {
        document.getElementById('viewissuesidebar').style.display = 'none';
        const html = '<a class="aui-button toolbar-trigger issueaction-comment-issue inline-comment" href="javascript:void(showRightPanel());" resolved=""><span class="icon aui-icon aui-icon-small aui-iconfont-watch-filled"></span> <span class="trigger-label">Show right panel</span></a>'
        document.getElementById('opsbar-opsbar-admin').innerHTML = html;
    }

    unsafeWindow.showRightPanel = () => {
        document.getElementById('viewissuesidebar').style.display = 'table-cell';
        const html = '<a class="aui-button toolbar-trigger issueaction-comment-issue inline-comment" href="javascript:void(hideRightPanel());" resolved=""><span class="icon aui-icon aui-icon-small aui-iconfont-watch-filled"></span> <span class="trigger-label">Hide right panel</span></a>'
        document.getElementById('opsbar-opsbar-admin').innerHTML = html;
    }


    unsafeWindow.showRightPanel();

})();

