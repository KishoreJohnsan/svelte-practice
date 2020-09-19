export function isEqual(a, b) {
  let set1 = new Set(a);
  let set2 = new Set(b);
  return set1.size === set2.size && [...set1].every((value) => set2.has(value));
}

export const getWords = ['application', 'programming', 'interface', 'wizard'];
