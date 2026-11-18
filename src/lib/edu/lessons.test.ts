import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LESSONS, findLesson } from './lessons.ts';

// Той самий шаблон, що SolvedExerciseId у mriya-study: інакше акаунт учня не прийме галочку.
const ID = /^[a-z0-9][a-z0-9_-]{0,79}$/;

test('id уроків підходять для акаунта учня й не повторюються', () => {
  const ids = LESSONS.map((lesson) => lesson.id);
  for (const id of ids) assert.match(id, ID);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(!ids.includes('free'), 'free — це вільний режим, не урок');
});

test('у кожному уроці є кроки з унікальними id і картинки без початкового «/»', () => {
  for (const lesson of LESSONS) {
    assert.ok(lesson.steps.length > 0, lesson.id);
    assert.equal(new Set(lesson.steps.map((s) => s.id)).size, lesson.steps.length, lesson.id);
    for (const step of lesson.steps) assert.ok(!step.imageUrl?.startsWith('/'), `${lesson.id}/${step.id}`);
  }
});

test('findLesson знаходить урок за id і повертає null для невідомого', () => {
  assert.equal(findLesson('brelok')?.id, 'brelok');
  assert.equal(findLesson('free'), null);
  assert.equal(findLesson(null), null);
});
