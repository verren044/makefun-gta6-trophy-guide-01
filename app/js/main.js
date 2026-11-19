// Leonida Platinum boot: load the trophy list, wire filters, tabs and saving.
import { loadEarned, saveEarned, exportProgress, parseImportedProgress } from './store.js';
import { applyFilters } from './filters.js';
import { renderProgress, renderChecklist, renderDetail, renderRoadmap, renderMissables } from './views.js';

const state = {
  trophies: [],
  earned: loadEarned(),
  search: '',
  kind: 'all',
  grade: 'all',
  status: 'all',
  spoilerOn: true,
  selected: 'The Shootist',
  view: 'checklist',
};

function currentRoute() {
  const hash = location.hash.replace(/^#\/?/, '');
  if (hash === 'roadmap') return 'roadmap';
  if (hash === 'missables') return 'missables';
  return 'checklist';
}

function showView(view) {
  state.view = view;
  document.getElementById('view-checklist').hidden = view !== 'checklist';
  document.getElementById('view-roadmap').hidden = view !== 'roadmap';
  document.getElementById('view-missables').hidden = view !== 'missables';
  document.getElementById('tab-checklist').classList.toggle('active', view === 'checklist');
  document.getElementById('tab-roadmap').classList.toggle('active', view === 'roadmap');
  document.getElementById('tab-missables').classList.toggle('active', view === 'missables');
}

function selectedTrophy() {
  return state.trophies.find((trophy) => trophy.name === state.selected) || null;
}

function renderAll() {
  renderProgress(state.earned, state.trophies.length);
  if (state.view === 'checklist') {
    const shown = applyFilters(state.trophies, state);
    renderChecklist(shown, state, selectTrophy, toggleEarned);
    renderDetail(selectedTrophy(), state, toggleEarned);
  } else if (state.view === 'roadmap') {
    renderRoadmap(state.trophies, state.earned);
  } else {
    renderMissables(state.trophies, state);
  }
}

function selectTrophy(trophy) {
  state.selected = trophy.name;
  renderAll();
}

function toggleEarned(trophy) {
  if (state.earned.has(trophy.name)) state.earned.delete(trophy.name);
  else state.earned.add(trophy.name);
  saveEarned(state.earned);
  renderAll();
}

function bindControls() {
  document.getElementById('search').addEventListener('input', (event) => {
    state.search = event.target.value;
    renderAll();
  });
  document.getElementById('kind').addEventListener('change', (event) => {
    state.kind = event.target.value;
    renderAll();
  });
  document.getElementById('grade').addEventListener('change', (event) => {
    state.grade = event.target.value;
    renderAll();
  });
  document.getElementById('status').addEventListener('change', (event) => {
    state.status = event.target.value;
    renderAll();
  });
  document.getElementById('spoiler').addEventListener('change', (event) => {
    state.spoilerOn = event.target.checked;
    renderAll();
  });
  document.getElementById('exportBtn').addEventListener('click', () => exportProgress(state.earned));
  document.getElementById('importFile').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const imported = parseImportedProgress(await file.text());
      state.earned = new Set([...imported].filter((name) => state.trophies.some((trophy) => trophy.name === name)));
      saveEarned(state.earned);
    } catch {
      alert('That file is not a Leonida Platinum progress export.');
    }
    event.target.value = '';
    renderAll();
  });
  window.addEventListener('hashchange', () => {
    showView(currentRoute());
    renderAll();
  });
}

async function bootLeonidaPlatinum() {
  const response = await fetch('data/trophies.json');
  const doc = await response.json();
  state.trophies = doc.trophies || doc;
  state.earned = new Set([...state.earned].filter((name) => state.trophies.some((trophy) => trophy.name === name)));
  bindControls();
  showView(currentRoute());
  renderAll();
}

bootLeonidaPlatinum();
