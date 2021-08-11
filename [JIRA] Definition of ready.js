// ==UserScript==
// @name         JIRA DEFINITION OF READY
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add definition of ready to Jira
// @author       Aurélien CAPI
// @match        https://jira.adeo.com/browse/ISO-*
// @icon         https://www.google.com/s2/favicons?domain=adeo.com
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM.listValues
// @updateURL    https://raw.githubusercontent.com/aurelien-CAPI/tampermonkey/main/%5BJIRA%5D%20Definition%20of%20ready.js?token=AROGCAXXBYKZ7QBACBYMEW3BCPT7U
// @downloadURL  https://raw.githubusercontent.com/aurelien-CAPI/tampermonkey/main/%5BJIRA%5D%20Definition%20of%20ready.js?token=AROGCAXXBYKZ7QBACBYMEW3BCPT7U
// ==/UserScript==

(function() {
    'use strict';

    const defaultDOR = [
        {id: 1, checked: true, critere: "Le besoin a été présenté aux parties prenantes métier identifiées et validé"},
        {id: 2, checked: true, critere: "Sa position dans la backlog produit peut évoluer dans le temps"},
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
    const defaultStatus = ['New', 'To estimate', 'Ready'];

    const story = document.getElementById('key-val').innerHTML;
    const isUS = document.getElementById('type-val').innerHTML.includes("Récit");
    const statusEligible = defaultStatus.indexOf(document.getElementById('status-val').children[0].innerHTML) != -1;
    const target = document.getElementById('ppm-task-skill-widget-panel-bigpicture');

    var storyDOR;

    var getDOR = async () => {
        console.log(await GM.getValue(story));
        storyDOR = await GM.getValue(story);
        storyDOR ? retrieveInformationsForDOR() : setDOR();
    }

    var setDOR = async () => {
        await GM.setValue(story, defaultDOR);
        storyDOR = defaultDOR;
        retrieveInformationsForDOR();
    }

    var updateDOR = async (id = null, checked = null) => {
        id === null && checked === null ? null : storyDOR[id].checked = checked;
        await GM.setValue(story, storyDOR);
        showDOR();
    }

    var showDOR = () => {
        var html = `
            <div id="peoplemodule" class="module toggle-wrap">
  <div id="peoplemodule_heading" class="mod-header">
    <ul class="ops"></ul>
	<button class="aui-button toggle-title" aria-label="Definition of ready" aria-controls="peoplemodule" aria-expanded="true" resolved="">
	<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"><g fill="none" fill-rule="evenodd">
	<path d="M3.29175 4.793c-.389.392-.389 1.027 0 1.419l2.939 2.965c.218.215.5.322.779.322s.556-.107.769-.322l2.93-2.955c.388-.392.388-1.027 0-1.419-.389-.392-1.018-.392-1.406 0l-2.298 2.317-2.307-2.327c-.194-.195-.449-.293-.703-.293-.255 0-.51.098-.703.293z" fill="#344563"></path></g></svg>
	</button>
	<h4 class="toggle-title">Definition of ready <aui-badge class="aui-badge" id="DOR-badge">`+storyDOR.filter(critere => critere.checked === true).length+` / `+storyDOR.length+`</aui-badge></h4>
  </div>
  <div class="mod-content">
    <div class="item-details people-details" id="peopledetails">
    `;

        for(var i = 0; i < storyDOR.length; i++) {
            storyDOR[i].checked ?
                html += '<dl><dt><input type="checkbox" id="'+i+'" name="updateDOR" value="'+storyDOR[i].checked+'" checked> '+storyDOR[i].critere+'</dt></dl>' :
            html += '<dl><dt><input type="checkbox" id="'+i+'" name="updateDOR" value="'+storyDOR[i].checked+'"> '+storyDOR[i].critere+'</dt></dl>';
        }

        html += `
   </div>
 </div>
</div>
        `
        target.innerHTML = html;

        const checkboxes = document.querySelectorAll(`input[name="updateDOR"]`);
        let values = [];
        checkboxes.forEach((checkbox) => {
            checkbox.addEventListener('click', (event) => {
                updateDOR(event.target.id, event.target.checked);
            });
        });


        const ratio = (document.getElementById('DOR-badge').innerHTML.split('/')[0] / document.getElementById('DOR-badge').innerHTML.split('/')[1]) * 100;

        if (ratio === 100) document.getElementById('DOR-badge').style.background = '#80dd77';
        if (ratio < 100 && ratio >= 30) document.getElementById('DOR-badge').style.background = '#ffa447';
        if (ratio < 30) document.getElementById('DOR-badge').style.background = '#ff4c3e';
    }

    const retrieveInformationsForDOR = () => {

        // On va chercher la business value
        const bv = document.getElementById('customfield_10300-val');
        bv ? storyDOR[4].checked = true : storyDOR[4].checked = false;

        // On va chercher la description
        const description = document.getElementById('description-val');

        // On vérifie si on a un personna
        description.innerHTML.match(/(so that|so as to|afin de).*.{15,}/gi) ? storyDOR[2].checked = true : storyDOR[2].checked = false;

        // On vérifie si on a des critères d'acceptance
        description.innerHTML.match(/(Use case|test case|scenario).*.{5,}/gi) ? storyDOR[6].checked = true : storyDOR[6].checked = false;

        // On vérifie si on a des hypotheses techniques
        description.innerHTML.match(/(technical|technique).*.{15,}/gi) ? storyDOR[8].checked = true : storyDOR[9].checked = false;

        // On vérifie si on a des business rules et une epic
        // On va chercher l'épique
        const epic = document.getElementById('customfield_10008-val');
        description.innerHTML.match(/(business rule|Règle métier).*.{15,}/gi) ? storyDOR[3].checked = true : null;
        if (!epic) storyDOR[3].checked = false;

        // On va vérifier les pièces jointes
        const documents = document.getElementsByClassName('attachment-thumb').length;
        documents > 1 ? storyDOR[7].checked = true : null;

        // On va chercher les story point
        const sp = document.getElementById('customfield_10040-val');
        sp ? storyDOR[10].checked = true : storyDOR[10].checked = false;
        sp ? storyDOR[5].checked = true : storyDOR[5].checked = false;
        sp ? storyDOR[10].checked = true : storyDOR[10].checked = false;
        sp && parseInt(sp.innerHTML) < 13 ? storyDOR[12].checked = true : storyDOR[12].checked = false;


        updateDOR();
    }

    if (isUS === true && statusEligible === true) {
        target.style.display = 'block';
        getDOR();
    } else {
        target.style.display = 'none';
    }

})();
