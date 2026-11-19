// Filters: kind, grade, search text, earned/to-do, and the spoiler rule.
// A hidden trophy stays masked until it is earned while spoilers are on.
export const KIND_LABELS = {
  story: 'Story',
  missable: 'Missable',
  collectibles: 'Collectibles',
  activities: 'Activities',
  stranger: 'Stranger missions',
  crime: 'Crime',
  money: 'Money',
  exploration: 'Exploration',
  online: 'Online',
};

export function isSpoilerHidden(trophy, earned, spoilerOn) {
  return spoilerOn && trophy.hidden && !earned.has(trophy.name);
}

export function applyFilters(trophies, state) {
  const query = state.search.trim().toLowerCase();
  return trophies.filter((trophy) => {
    if (state.kind === 'online') return false;
    if (state.kind === 'missable' && !trophy.missable) return false;
    if (state.kind !== 'all' && state.kind !== 'missable' && trophy.kind !== state.kind) return false;
    if (state.grade !== 'all' && trophy.grade !== state.grade) return false;
    const isEarned = state.earned.has(trophy.name);
    if (state.status === 'earned' && !isEarned) return false;
    if (state.status === 'todo' && isEarned) return false;
    if (query) {
      const haystack = `${trophy.name} ${trophy.description} ${trophy.guide}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}

export function kindCounts(trophies) {
  const counts = {};
  for (const trophy of trophies) counts[trophy.kind] = (counts[trophy.kind] || 0) + 1;
  counts.missable = trophies.filter((trophy) => trophy.missable).length;
  counts.online = 0;
  return counts;
}
