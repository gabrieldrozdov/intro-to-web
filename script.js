// Table of contents/projects
function toggleProjects() {
	const toc = document.querySelector('.toc');
	if (parseInt(toc.dataset.active) == 1) {
		toc.dataset.active = 0;
	} else {
		toc.dataset.active = 1;
	}
}
function openProjects() {
	const toc = document.querySelector('.toc');
	toc.dataset.active = 1;
}
function closeProjects() {
	const toc = document.querySelector('.toc');
	toc.dataset.active = 0;
}
for (let tocLink of document.querySelectorAll('.toc-link')) {
	tocLink.addEventListener('click', closeProjects);
}

// Gradient scroll for project descriptions
function updateGradientVisibility(scrollableDiv) {
	if (scrollableDiv.scrollHeight - scrollableDiv.scrollTop - 50 <= scrollableDiv.clientHeight) {
		scrollableDiv.dataset.overlay = 0;
	} else {
		scrollableDiv.dataset.overlay = 1;
	}
}
for (let projectDesc of document.querySelectorAll('.project-desc')) {
	updateGradientVisibility(projectDesc);
	projectDesc.addEventListener('scroll', () => {updateGradientVisibility(projectDesc)});
}
function checkGradientVisibilities() {
	for (let projectDesc of document.querySelectorAll('.project-desc')) {
		updateGradientVisibility(projectDesc);
	}
}
window.addEventListener('resize', checkGradientVisibilities);

// Toggle editor
let alertShown = false;
function openEditor(src) {
	if (src != undefined) {
		fetchDemo(src);
		if (!alertShown) {
			alertShown = true;
			setTimeout(() => {
				showAlert();
			}, 500)
		}
	}

	const editor = document.querySelector('.editor');
	editor.dataset.active = 1;
}
function closeEditor() {
	const editor = document.querySelector('.editor');
	editor.dataset.active = 0;
}

// Show instructions for how to reopen demo
function showAlert() {
	const alert = document.querySelector('.alert');
	alert.dataset.active = 1;
	const btnEditor = document.querySelector('#btn-editor');
	btnEditor.dataset.highlight = 1;
}
function hideAlert() {
	const alert = document.querySelector('.alert');
	alert.dataset.active = 0;
	const btnEditor = document.querySelector('#btn-editor');
	btnEditor.dataset.highlight = 0;
}

// Generate editor
let cm;
let activeDemo = 'test.html';
function generateEditor() {
	const editor = document.querySelector('.editor-cm');
	cm = CodeMirror(editor, {
		mode: "htmlmixed",
		value: '<h1>Hello World!</h1>',
		autoCloseTags: true,
		autoCloseBrackets: true,
		matchBrackets: true,
		smartIndent: true,
		lineNumbers: true,
		tabSize: 2,
		showHint: true,
		extraKeys: {"Ctrl-Space": "autocomplete"},
		lineWrapping: false,
		theme: "gdwithgd",
	});
	cm.on("change", updatePreview);
	updatePreview();
	fetchDemo('test.html');
}
generateEditor();

function fetchDemo(src) {
	activeDemo = src;
	const editorTitle = document.querySelector('.editor-navbar-title');
	editorTitle.innerText = src;
	fetch("projects/"+src)
		.then((response) => response.text())
		.then(code => {
			cm.setValue(code);
		})
}

function updatePreview() {
	const preview = document.querySelector('.editor-iframe');
	preview.srcdoc = cm.getValue();
}

// Editor controls
let lineWrap = false;
function editorToggleWrapping() {
	lineWrap = !lineWrap;
	cm.setOption('lineWrapping', lineWrap);
}
let editorFontsize = 16;
function editorFontsizeDown() {
	const editorCM = document.querySelector('.editor-cm');
	editorFontsize -= 2;
	if (editorFontsize <= 8) {
		editorFontsize = 8;
	}
	editorCM.style.setProperty('--font-size', editorFontsize + 'px');
}
function editorFontsizeUp() {
	const editorCM = document.querySelector('.editor-cm');
	editorFontsize += 2;
	if (editorFontsize >= 24) {
		editorFontsize = 24;
	}
	editorCM.style.setProperty('--font-size', editorFontsize + 'px');
}
function editorReset() {
	fetchDemo(activeDemo);
}
function editorDownload() {
	let codeBlob = new Blob([ cm.getValue()], { type: 'text/html' })
	blobURL = URL.createObjectURL(codeBlob);
	let tempLink = document.createElement("a");
	tempLink.href = blobURL;
	tempLink.download = activeDemo;
	tempLink.click();
}
function editorShortcuts() {
	const shortcuts = document.querySelector('.editor-shortcuts');
	if (parseInt(shortcuts.dataset.active) == 1) {
		shortcuts.dataset.active = 0;
	} else {
		shortcuts.dataset.active = 1;
	}
}

// Highlight resource
let activeResource = '';
function highlightResource(id) {
	let resource = document.querySelector("#"+id);
	resource.scrollIntoView();
	resource.dataset.highlight = 1;

	setTimeout(() => {
		document.addEventListener('click', resetResource)
		function resetResource(e) {
			if (!resource.contains(e.target)) {
				resource.dataset.highlight = 0;
				document.removeEventListener('click', resetResource);
			}
		}
	}, 100)
}