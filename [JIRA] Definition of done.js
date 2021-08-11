// ==UserScript==
// @name         JIRA DEFINITION OF DONE
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add definition of done to Jira
// @author       Aurélien CAPI
// @match        https://jira.adeo.com/browse/ISO-*
// @icon         https://www.google.com/s2/favicons?domain=adeo.com
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM.listValues
// @updateURL    https://raw.githubusercontent.com/aurelien-CAPI/tampermonkey/main/%5BJIRA%5D%20Definition%20of%20done.js
// @downloadURL  https://raw.githubusercontent.com/aurelien-CAPI/tampermonkey/main/%5BJIRA%5D%20Definition%20of%20done.js
// ==/UserScript==

(function() {
    'use strict';

    const defaultDOD = [
        {id: 1, checked: false, critere: "Le besoin a été présenté aux parties prenantes métier identifiées et validé"},
        {id: 2, checked: false, critere: "Sa position dans la backlog produit peut évoluer dans le temps"},
        {id: 3, checked: false, critere: "La story est correctement formulée (« En tant que… je souhaite… afin de… ») et comprise par tous (MOE / MOA)"},
        {id: 4, checked: false, critere: "Les règles métier / Épique ont été identifiées"},
        {id: 5, checked: false, critere: "Elle possède une valeur métier (business ou technical value)"},
        {id: 6, checked: false, critere: "La story a été abordée par l’équipe lors de la séance de refinement"},
        {id: 7, checked: false, critere: "Des critères d’acceptance testables et clairs sont définis"},
        {id: 8, checked: false, critere: "Une maquette / storyboard a été fournie si nécessaire"},
        {id: 9, checked: false, critere: "Les hypothèses techniques / conditions de réalisation ont été identifiées"},
        {id: 10, checked: false, critere: "Des tâches d’analyse ont été identifiées et créées si nécessaire"},
        {id: 11, checked: false, critere: "La story a été affinée par l’équipe (Poker Planning)"},
        {id: 12, checked: false, critere: "Les liens vers des US, TS ou tâches sont renseignés dans la story et ne bloquent pas la réalisation de celle-ci"},
        {id: 13, checked: false, critere: "La story est assez petite pour être réalisée dans un sprint et peut-être testée unitairement"}
    ];
    const defaultStatus = ['In progress', 'Code to review', 'To test', 'Resolved', 'Closed'];

    const story = document.getElementById('key-val').innerHTML + '-DOD';
    const isUS = document.getElementById('type-val').innerHTML.includes("Récit");
    const statusEligible = defaultStatus.indexOf(document.getElementById('status-val').children[0].innerHTML) != -1;
    const target = document.getElementById('ppm-task-skill-widget-panel-bigpicture');

    var storyDOD;

    var getDOD = async () => {
        console.log('On va chercher la DOD pour la story ' + story);
        console.log(await GM.getValue(story));
        storyDOD = await GM.getValue(story);
        storyDOD ? showDOD() : setDOD();
    }

    var setDOD = async () => {
        console.log('DOD non trouvée, on va la setter pour la story ' + story);
        await GM.setValue(story, defaultDOD);
        storyDOD = defaultDOD;
        showDOD();
    }

    var updateDOD = async (id, checked) => {
        console.log(checked);
        storyDOD[id].checked = checked;
        await GM.setValue(story, storyDOD);
        console.log(await GM.getValue(story));
        showDOD();
    }

    var showDOD = function() {
        var html = `
            <div id="peoplemodule" class="module toggle-wrap">
  <div id="peoplemodule_heading" class="mod-header">
    <ul class="ops"></ul>
	<button class="aui-button toggle-title" aria-label="Definition of ready" aria-controls="peoplemodule" aria-expanded="true" resolved="">
	<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"><g fill="none" fill-rule="evenodd">
	<path d="M3.29175 4.793c-.389.392-.389 1.027 0 1.419l2.939 2.965c.218.215.5.322.779.322s.556-.107.769-.322l2.93-2.955c.388-.392.388-1.027 0-1.419-.389-.392-1.018-.392-1.406 0l-2.298 2.317-2.307-2.327c-.194-.195-.449-.293-.703-.293-.255 0-.51.098-.703.293z" fill="#344563"></path></g></svg>
	</button>
	<h4 class="toggle-title">Definition of done <aui-badge class="aui-badge" id="DOD-badge">`+storyDOD.filter(critere => critere.checked === true).length+` / `+storyDOD.length+`</aui-badge></h4>
  </div>
  <div class="mod-content">
    <div class="item-details people-details" id="peopledetails">
    `;

        for(var i = 0; i < storyDOD.length; i++) {
            storyDOD[i].checked ?
                html += '<dl><dt><input type="checkbox" id="'+i+'" name="updateDOD" value="'+storyDOD[i].checked+'" checked> '+storyDOD[i].critere+'</dt></dl>' :
            html += '<dl><dt><input type="checkbox" id="'+i+'" name="updateDOD" value="'+storyDOD[i].checked+'"> '+storyDOD[i].critere+'</dt></dl>';
        }

        html += `
   </div>
 </div>
</div>
        `
        target.innerHTML = html;

        const checkboxes = document.querySelectorAll(`input[name="updateDOD"]`);
        let values = [];
        checkboxes.forEach((checkbox) => {
            checkbox.addEventListener('click', (event) => {
                updateDOD(event.target.id, event.target.checked);
            });
        });


        const ratio = (document.getElementById('DOD-badge').innerHTML.split('/')[0] / document.getElementById('DOD-badge').innerHTML.split('/')[1]) * 100;

        if (ratio === 100) document.getElementById('DOD-badge').style.background = '#80dd77';
        if (ratio < 100 && ratio >= 30) document.getElementById('DOD-badge').style.background = '#ffa447';
        if (ratio < 30) document.getElementById('DOD-badge').style.background = '#ff4c3e';
    }

    isUS === true && statusEligible === true ? getDOD() : target.style.display = 'none';

})();
