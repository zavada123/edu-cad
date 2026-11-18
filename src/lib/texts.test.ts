import { test } from 'node:test';
import assert from 'node:assert/strict';
import { NB_TEXTS, EN_TEXTS, UK_TEXTS, resolveTexts, interpolate } from './texts.ts';

test('NB og EN har nøyaktig samme nøkkelsett', () => {
    const nb = Object.keys(NB_TEXTS).sort();
    const en = Object.keys(EN_TEXTS).sort();
    assert.deepEqual(nb, en);
});

test('UK має той самий набір ключів, що й EN', () => {
    assert.deepEqual(Object.keys(UK_TEXTS).sort(), Object.keys(EN_TEXTS).sort());
});

test('alle verdier er ikke-tomme strenger', () => {
    for (const dict of [NB_TEXTS, EN_TEXTS, UK_TEXTS]) for (const [k, v] of Object.entries(dict)) {
        if (k === 'topbarLogoTaglineAfter') continue; // може бути порожнім: назва стоїть у кінці фрази
        assert.equal(typeof v, 'string', `${k} skal være string`);
        assert.ok(v.length > 0, `${k} skal ikke være tom`);
    }
});

test('resolveTexts velger riktig språk', () => {
    assert.equal(resolveTexts('no').topbarNewProject, NB_TEXTS.topbarNewProject);
    assert.equal(resolveTexts('en').topbarNewProject, EN_TEXTS.topbarNewProject);
    assert.equal(resolveTexts('uk').topbarNewProject, UK_TEXTS.topbarNewProject);
});

test('resolveTexts fletter host-overstyringer over valgt språk', () => {
    const t = resolveTexts('en', { topbarNewProject: 'Custom' });
    assert.equal(t.topbarNewProject, 'Custom');
    assert.equal(t.topbarSaveProject, EN_TEXTS.topbarSaveProject);
});

test('interpolate erstatter {token} og lar ukjente stå', () => {
    assert.equal(interpolate('Decrease {axis}', { axis: 'X' }), 'Decrease X');
    assert.equal(interpolate('{a}/{b}', { a: '1', b: '2' }), '1/2');
    assert.equal(interpolate('no tokens', { x: 'y' }), 'no tokens');
});
