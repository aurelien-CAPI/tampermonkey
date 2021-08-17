// ==UserScript==
// @name         JIRA DEFINITION OF DONE
// @namespace    http://tampermonkey.net/
// @version      1.0
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
        { id : 1, checked: false, critere: "Les développements réalisés répondent au(x) besoin(s) attendu(s)"},
        { id : 2, checked: false, critere: "Le développement respecte les bonnes pratiques de dev définies par l’équipe"},
        { id : 3, checked: false, critere: "La PR a été validée par au moins 1 personne (2 personnes si SP >= 5)"},
        { id : 4, checked: false, critere: "Chaque commit / tags / nom de branche permettent d’identifier le ticket Jira associée"},
        { id : 5, checked: false, critere: "Les réalisations n’introduisent pas de dette technique ou elle est identifiée (JIRA, TODO, ...)"},
        { id : 6, checked: false, critere: "Les critères d’acceptance ont été validés par les devs, les retours sont traités ou identifiés dans un Jira"},
        { id : 7, checked: false, critere: "Les Tests (unitaires / widgets) sont passants et avec une couverture de test maximale"},
        { id : 8, checked: false, critere: "La story a été mergée sans provoquer de régression"},
        { id : 9, checked: false, critere: "La feature a été déployée dans un environnement de test (UAT)"},
        { id : 10, checked: false, critere: "Le JIRA et le Scrumboard sont synchronisés"},
        { id : 11, checked: false, critere: "La communication sur les fix a été faite aux personnes concernées"},
        { id : 12, checked: false, critere: "La story a été validée techniquement par l’équipe ou fonctionnellement par le PO"}
    ];
    const defaultStatus = ['Ready', 'En cours', 'Blocked', 'Code to review', 'To test', 'In test', 'Fermée'];

    const story = document.getElementById('key-val').innerHTML + '-DOD';
    const statusEligible = defaultStatus.indexOf(document.getElementById('status-val').children[0].innerHTML) != -1;
    const target = document.getElementById('viewissuesidebar');
    target.removeChild(target.children[1]);

    var storyDOD;

    var getDOD = async () => {
        console.log('On va chercher la DOD pour la story ' + story);
        console.log(await GM.getValue(story));
        storyDOD = await GM.getValue(story);
        storyDOD ? retrieveInformationsForDOD() : setDOD();
    }

    var setDOD = async () => {
        console.log('DOD non trouvée, on va la setter pour la story ' + story);
        await GM.setValue(story, defaultDOD);
        storyDOD = defaultDOD;
        retrieveInformationsForDOD();
    }

    var updateDOD = async (id = null, checked = null) => {
        id === null && checked === null ? null : storyDOD[id].checked = checked;
        await GM.setValue(story, storyDOD);
        id === null && checked === null ? showDOD() : null;
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
        target.innerHTML = html + target.innerHTML;

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

    const retrieveInformationsForDOD = () => {

        // On va vérifier si la story a été développée
        if (defaultStatus.indexOf(document.getElementById('status-val').children[0].innerHTML) >= 3) storyDOD[0].checked = true;

        // On va vérifier si on est passé en PR
        if (defaultStatus.indexOf(document.getElementById('status-val').children[0].innerHTML) >= 4) storyDOD[1].checked = true;

        // On va vérifier si on est passé en PR
        if (defaultStatus.indexOf(document.getElementById('status-val').children[0].innerHTML) >= 4) storyDOD[2].checked = true;

        // On va vérifier si on est passé en PR
        if (defaultStatus.indexOf(document.getElementById('status-val').children[0].innerHTML) >= 4) storyDOD[5].checked = true;

        // On va vérifier si on est passé en PR
        if (defaultStatus.indexOf(document.getElementById('status-val').children[0].innerHTML) >= 4) storyDOD[7].checked = true;

        // On va vérifier si on est passé en PR
        if (defaultStatus.indexOf(document.getElementById('status-val').children[0].innerHTML) >= 4) storyDOD[9].checked = true;


        updateDOD();
    }

    if (statusEligible === true) getDOD();

})();
