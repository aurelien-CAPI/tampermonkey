// ==UserScript==
// @name        JIRA templates
// @author      Aurélien CAPI
// @namespace   https://jira.adeo.com/*
// @include     https://jira.adeo.com/*
// @description Allows saving JIRA issue descriptions for reuse.
// @icon         https://www.google.com/s2/favicons?domain=adeo.com
// @version     1.0
// @grant       none
// @updateURL    https://raw.githubusercontent.com/aurelien-CAPI/tampermonkey/main/%5BJIRA%5D%20Issue%20templates.js
// @downloadURL  https://raw.githubusercontent.com/aurelien-CAPI/tampermonkey/main/%5BJIRA%5D%20Issue%20templates.js
// ==/UserScript==


var modifyEditor = function(editor) {
    if (document.getElementById('tab-0').classList.contains('templatized')) {return;}

    var templates = [
    {
       titre: 'Story fonctionnelle',
       content: `{panel:title=User Story  (To fill by the PO for functional needs)|borderStyle=dashed|borderColor=#0082c3|titleBGColor=#0082c3|bgColor=#efefef}
*As a :*
*I want to :*
*So as to :*

*Context (Explain the context and why it's important for users!) :*
{panel}

{panel:title=Business Rules|borderStyle=dashed|borderColor=#34c924|titleBGColor=#34c924|bgColor=#efefef}
Fonctionnal & business inputs
{panel}

{panel:title=UI/UX|borderStyle=dashed|borderColor=#1ca7a9|titleBGColor=#1ca7a9|bgColor=#efefef}
UI inputs
{panel}

{panel:title=Acceptance criteria and Test cases|borderStyle=dashed|borderColor=#e96c0f|titleBGColor=#e96c0f|bgColor=#efefef}
+*Acceptance tests:*+
 *Scenario 1 :*

*Scenario 2 :*

*Scenario 3 :*
 ....
{panel}

{panel:title=Technical hypothesys|borderColor=#cccccc|titleBGColor=#aeee00|bgColor=#efefef}
technical inputs
{panel}`
    },
    {
       titre: 'Story technique',
       content: `{panel:title=Technical Story|borderStyle=dashed|borderColor=#0082c3|titleBGColor=#0082c3|bgColor=#efefef}
*As a :*
*I want to :*
*So as to :*

*Context (Explain the context and why it's important for users / product!) :*
{panel}

{panel:title=Technical Rules|borderStyle=dashed|borderColor=#34c924|titleBGColor=#34c924|bgColor=#efefef}
Technical rules
{panel}

{panel:title=Acceptance criteria and Test cases|borderStyle=dashed|borderColor=#e96c0f|titleBGColor=#e96c0f|bgColor=#efefef}
+*Acceptance tests:*+
 *Scenario 1 :*

*Scenario 2 :*

*Scenario 3 :*
 ....
{panel}

{panel:title=Technical hypothesys|borderColor=#cccccc|titleBGColor=#aeee00|bgColor=#efefef}
technical inputs
{panel}`
    },
    {
       titre: 'Tâche',
       content: `🏁 Qu'est-ce qui est à faire ?
♻ Comment on teste ce ticket ?
🕐 Quel est la timebox de cette tâche ?`
    },
];

var select = `
<div class="qf-field qf-field-template qf-required" data-field-id="template">
	<div class="field-group">
		<label for="template-field">Template</label>
		<select class="select aui-ss-select" id="template" name="template" aria-label="Priorité">`;

        for(var i = 0; i < templates.length; i++) {
             select += `
                  <option value="`+ i +`">
                      `+ templates[i].titre +`
                  </option>
             `;
        };

		select += `</select>
        <button id="template-applyer">Appliquer</button>
	</div>
</div>
`;

    var textarea = editor.querySelector('textarea');

    var template = new DOMParser().parseFromString(select, 'text/html');

    console.log('here!', template, template.getElementById('template'));

    template.getElementById('template-applyer').addEventListener('click', (e) => {
        e.preventDefault();
        console.log('here 2!', document.getElementById('template'));
        var value = document.getElementById('template').value;
        var content = templates[value].content;
        textarea.value = content;
    });

    document.getElementsByClassName('issue-setup-fields')[0].append(template.body.firstChild);
    document.getElementById('tab-0').classList.add('templatized');
};

var renderTemplates = function(select, templates) {
    select.innerHTML = '';
    templates.forEach(function(name) {
        var option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        select.appendChild(option);
    });
};

var findEditors = function() {
    var editor;
    if (editor = document.getElementById('description-wiki-edit')) {
       modifyEditor(editor);
    }
};

setInterval(findEditors, 500);
