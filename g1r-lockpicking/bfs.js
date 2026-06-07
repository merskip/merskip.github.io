const MIN_POS = 1;
const MAX_POS = 7;
const TARGET = [4, 4, 4, 4, 4, 4];

/**
 * @typedef {Object} Step
 * @property {number} insertIndex
 * @property {number} direction
 *
 * @param {number[]} start
 * @param {number[][]} effects
 * @return {null|Step[]}
 */
function bfs(start, effects) {
    const queue = [start];

    const visited = new Set();
    visited.add(stateKey(start));

    const parent = new Map();
    const action = new Map();

    let head = 0;

    while (head < queue.length) {

        const current = queue[head++];
        const currentKey = stateKey(current);

        if (statesEqual(current, TARGET)) {
            return reconstruct(start, parent, action);
        }

        for (let lockId = 0; lockId < current.length; lockId++) {
            for (const direction of [-1, 1]) {
                const next = applyMove(
                    current,
                    lockId,
                    direction,
                    effects
                );
                if (next === null)
                    continue;

                const nextKey = stateKey(next);
                if (visited.has(nextKey))
                    continue;

                visited.add(nextKey);
                parent.set(nextKey, currentKey);
                action.set(nextKey, {
                    insertIndex: lockId + 1,
                    direction: direction
                });
                queue.push(next);
            }
        }
    }

    return null;
}

function reconstruct(start, parent, action) {
    const path = [];

    let current = stateKey(TARGET);

    while (current !== stateKey(start)) {
        path.push(action.get(current));
        current = parent.get(current);
    }

    path.reverse();

    return path;
}

function applyMove(state, lockId, direction, effects) {
    const next = [...state];

    for (const [idx, sign] of effects[lockId]) {
        next[idx] += direction * sign;

        if (next[idx] < MIN_POS || next[idx] > MAX_POS) {
            return null;
        }
    }

    return next;
}

function statesEqual(a, b) {
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }

    return true;
}

function stateKey(state) {
    return state.join(",");
}
