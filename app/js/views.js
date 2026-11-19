// Views: the checklist rows, the detail panel, the roadmap and the missables page.
import { isSpoilerHidden, KIND_LABELS } from './filters.js';

export const STAGES = [
  {
    stage: 1,
    title: 'Stage 1 — Play the story, save every chapter',
    text: 'Chapters 1–2. Story trophies pop as you play; the one thing that cannot wait is Lucia’s balcony meditation for Positive Mental Attitude in Chapter 1. Keep a manual save at the start of each chapter.',
  },
  {
    stage: 2,
    title: 'Stage 2 — Open up Leonida',
    text: 'Chapters 3–4. Partner play, robbery tools and stranger strands open up. Sample every activity for Master of None, start the stranger strands, and race Yago the moment his Chapter 3 race appears.',
  },
  {
    stage: 3,
    title: 'Stage 3 — Clean-up: crime, collectibles, grinds',
    text: 'After the final mission, free roam. Bank vaults, illegal operations, stunts, shooting ranges, drone races, cards, WAiNK spots, vehicles and money — the whole clean-up list, in any order.',
  },
  {
    stage: 4,
    title: 'Stage 4 — Platinum',
    text: 'Finish the 100% checklist for A Long Road, then Vice Got a Price! pops. Check Progress, Stats, 100% Completion and mop up whatever is left.',
  },
];

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function gradeChip(trophy) {
  return el('span', `chip grade-${trophy.grade}`, trophy.grade);
}

export function renderProgress(earned, total) {
  document.getElementById('earnedCount').textContent = String(earned.size);
  const pct = total ? Math.round((earned.size / total) * 100) : 0;
  document.getElementById('progressFill').style.width = `${pct}%`;
  document.getElementById('progressPct').textContent = `${pct}% to platinum — ${total - earned.size} to go`;
}

export function renderChecklist(trophies, state, onSelect, onToggle) {
  const list = document.getElementById('rows');
  list.replaceChildren();
  document.getElementById('onlineNote').hidden = state.kind !== 'online';
  document.getElementById('noMatch').hidden = state.kind === 'online' || trophies.length > 0;
  document.getElementById('listMeta').textContent =
    state.kind === 'online'
      ? 'Online — 0 trophies'
      : `Showing ${trophies.length} of 55 trophies · ${state.earned.size} earned`;
  for (const trophy of trophies) {
    const hidden = isSpoilerHidden(trophy, state.earned, state.spoilerOn);
    const isEarned = state.earned.has(trophy.name);
    const item = el('li');
    item.dataset.name = trophy.name;
    if (isEarned) item.classList.add('earned');
    if (state.selected === trophy.name) item.classList.add('selected');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = isEarned;
    box.setAttribute('aria-label', hidden ? 'Mark hidden trophy earned' : `Mark ${trophy.name} earned`);
    box.addEventListener('change', () => onToggle(trophy));
    box.addEventListener('click', (event) => event.stopPropagation());
    item.append(box);
    item.append(el('span', `medal ${trophy.grade}`));
    const body = el('div');
    const name = el('div', 'tName', hidden ? 'Hidden trophy' : trophy.name);
    if (hidden) name.append(el('span', 'spoilerTag', 'Hidden · spoiler'));
    body.append(name);
    body.append(el('div', 'tDesc', hidden ? 'Hidden until earned — tick it off to reveal its name and description.' : trophy.description));
    const tags = el('div', 'tTags');
    tags.append(gradeChip(trophy));
    tags.append(el('span', 'chip', KIND_LABELS[trophy.kind] || trophy.kind));
    if (trophy.missable) tags.append(el('span', 'chip miss', 'Missable'));
    if (trophy.target) tags.append(el('span', 'chip target', trophy.target));
    body.append(tags);
    item.append(body);
    item.append(el('div', 'tCheck', isEarned ? '✓ Earned' : 'To do'));
    item.addEventListener('click', () => onSelect(trophy));
    list.append(item);
  }
}

export function renderDetail(trophy, state, onToggle) {
  const panel = document.getElementById('detail');
  panel.replaceChildren();
  if (!trophy) {
    panel.append(el('h2', undefined, 'Pick a trophy'));
    panel.append(el('p', undefined, 'Click any row in the checklist to see its guide and sources here.'));
    return;
  }
  const hidden = isSpoilerHidden(trophy, state.earned, state.spoilerOn);
  const isEarned = state.earned.has(trophy.name);
  if (hidden) {
    panel.append(el('h2', undefined, 'Hidden trophy'));
    panel.append(el('p', 'gradeLine', `${trophy.grade} · ${KIND_LABELS[trophy.kind] || trophy.kind} · Stage ${trophy.stage}`));
    panel.append(el('p', undefined, 'This story trophy stays hidden until you earn it. Tick it off in the list to reveal its name, official description and guide.'));
    const actions = el('div', 'actions');
    const mark = el('button', undefined, 'Mark earned — reveal it');
    mark.type = 'button';
    mark.addEventListener('click', () => onToggle(trophy));
    actions.append(mark);
    panel.append(actions);
    return;
  }
  panel.append(el('h2', undefined, trophy.name));
  panel.append(el('p', 'gradeLine', `${trophy.grade} · ${KIND_LABELS[trophy.kind] || trophy.kind} · Roadmap stage ${trophy.stage}${trophy.missable ? ' · Missable' : ''}${trophy.target ? ` · Target: ${trophy.target}` : ''}`));
  panel.append(el('h3', undefined, 'Official description'));
  panel.append(el('p', 'official', trophy.description));
  panel.append(el('h3', undefined, 'Guide — our own words'));
  panel.append(el('p', undefined, trophy.guide));
  if (trophy.missable && trophy.missableNote) {
    panel.append(el('h3', undefined, 'Why it can be missed'));
    panel.append(el('p', 'note', trophy.missableNote));
  }
  panel.append(el('h3', undefined, 'Sources'));
  const sources = el('ul', 'sources');
  for (const source of trophy.sources || []) {
    const item = el('li');
    const link = document.createElement('a');
    link.href = source.url;
    link.textContent = source.name;
    link.target = '_blank';
    link.rel = 'noopener';
    item.append(link);
    sources.append(item);
  }
  panel.append(sources);
  const actions = el('div', 'actions');
  const mark = el('button', undefined, isEarned ? 'Mark as not earned' : 'Mark earned');
  mark.type = 'button';
  mark.addEventListener('click', () => onToggle(trophy));
  actions.append(mark);
  panel.append(actions);
}

export function renderRoadmap(trophies, earned) {
  const wrap = document.getElementById('stages');
  wrap.replaceChildren();
  for (const stage of STAGES) {
    const members = trophies.filter((trophy) => trophy.stage === stage.stage);
    const done = members.filter((trophy) => earned.has(trophy.name)).length;
    const card = el('section', 'stage');
    const heading = el('h2', undefined, stage.title);
    heading.append(el('span', 'stageCount', `${done}/${members.length} earned`));
    card.append(heading);
    card.append(el('p', undefined, stage.text));
    const list = el('ul');
    for (const trophy of members) {
      const isEarned = earned.has(trophy.name);
      const row = el('li');
      row.append(el('span', isEarned ? 'done' : undefined, isEarned ? '✓ ' : '○ '));
      row.append(document.createTextNode(trophy.name));
      row.append(el('span', 'tGrade', trophy.grade));
      if (trophy.missable) row.append(el('span', 'tGrade', ' · missable'));
      list.append(row);
    }
    card.append(list);
    wrap.append(card);
  }
}

export function renderMissables(trophies, state) {
  const wrap = document.getElementById('missGrid');
  wrap.replaceChildren();
  const missable = trophies.filter((trophy) => trophy.missable);
  for (const trophy of missable) {
    const hidden = isSpoilerHidden(trophy, state.earned, state.spoilerOn);
    const card = el('article', 'missCard');
    card.append(el('h2', undefined, hidden ? 'Hidden trophy' : trophy.name));
    card.append(el('p', 'gradeLine', `${trophy.grade} · ${KIND_LABELS[trophy.kind] || trophy.kind} · Stage ${trophy.stage}`));
    if (hidden) {
      card.append(el('p', undefined, 'Hidden until earned — turn spoilers off to see this trophy.'));
    } else {
      card.append(el('p', undefined, trophy.missableNote || trophy.guide));
    }
    wrap.append(card);
  }
}
