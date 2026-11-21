function updatePrintSelection() {
    const selected = [...document.querySelectorAll('.a4-sheet:not(.hidden-sheet)')];
    const btn = document.getElementById('btn-print');
    btn.disabled = selected.length === 0;
    btn.title = btn.disabled ? 'Спочатку виберіть хоча б один аркуш' : '';
    document.querySelectorAll('.a4-sheet').forEach(sheet => sheet.classList.remove('last-print-sheet'));
    if (selected.length) selected[selected.length - 1].classList.add('last-print-sheet');
}

function togglePage(pageNum, isVisible) {
    const sheet = document.querySelector(`.a4-sheet[data-page="${pageNum}"]`);
    if (sheet) {
        sheet.classList.toggle('hidden-sheet', !isVisible);
    }
    updatePresetHighlight();
}

function applyPreset(mode) {
    for (let p = 1; p <= 6; p++) {
        const show = (mode === 'all') ? true : (p >= 2 && p <= 5);
        const chk = document.getElementById('chk-' + p);
        if (chk) chk.checked = show;
        const sheet = document.querySelector(`.a4-sheet[data-page="${p}"]`);
        if (sheet) sheet.classList.toggle('hidden-sheet', !show);
    }
    document.getElementById('preset-all').classList.toggle('active', mode === 'all');
    document.getElementById('preset-cards').classList.toggle('active', mode === 'cards');
    updatePrintSelection();
}

function updatePresetHighlight() {
    const states = [1,2,3,4,5,6].map(p => document.getElementById('chk-' + p).checked);
    const isAll = states.every(Boolean);
    const isCards = !states[0] && states[1] && states[2] && states[3] && states[4] && !states[5];
    document.getElementById('preset-all').classList.toggle('active', isAll);
    document.getElementById('preset-cards').classList.toggle('active', isCards);
    updatePrintSelection();
}
updatePrintSelection();
