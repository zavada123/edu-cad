// SPDX-License-Identifier: AGPL-3.0-only
// Пройдені уроки з галочкою, як у Blender-уроках EduProstir (edu-blender/web/boot.js).
// Гість пам'ятає їх лише в цьому браузері. Учень, що увійшов на сайт, має свій список у браузері й той самий список
// в акаунті (/api/student/trainer-solved): так уроки бачить учитель класу. Список гостя в акаунт не йде:
// за шкільним комп'ютером це не робота учня, який увійшов.

const API = '/api/student/';
const TRAINER = 'cad';
const DONE_KEY = 'edu-cad-done';
const ACCOUNT_WAIT_MS = 3000;
const ID_PATTERN = /^[a-z0-9][a-z0-9_-]{0,79}$/;
const STUDENT_ID_PATTERN = /^[0-9a-f-]{36}$/;

let studentId: string | null = null;

const isValidId = (value: unknown): value is string => typeof value === 'string' && ID_PATTERN.test(value);

function doneKey(): string {
  return studentId ? `${DONE_KEY}:${studentId}` : DONE_KEY;
}

export function loadDone(): string[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(doneKey()) ?? '[]');
    return Array.isArray(value) ? value.filter(isValidId) : [];
  } catch {
    return [];
  }
}

function saveDone(done: readonly string[]): void {
  try {
    localStorage.setItem(doneKey(), JSON.stringify(done));
  } catch {
    // Приватне вікно чи заборонене сховище: урок пройдено, лише галочки в списку не буде.
  }
}

function sendDone(ids: readonly string[]): void {
  if (!studentId || ids.length === 0) return;
  fetch(`${API}trainer-solved`, {
    method: 'PUT',
    credentials: 'same-origin',
    keepalive: true,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ trainer: TRAINER, solved: ids }),
  }).catch(() => {
    // Без мережі: урок лишається в цьому браузері й піде в акаунт під час наступного відкриття сторінки.
  });
}

export function markDone(id: string): void {
  if (!isValidId(id)) return;
  const done = loadDone();
  if (!done.includes(id)) saveDone([...done, id]);
  sendDone([id]);
}

async function getJson(path: string): Promise<unknown> {
  try {
    const response = await fetch(API + path, { credentials: 'same-origin' });
    return response.ok ? await response.json() : null;
  } catch {
    return null;
  }
}

function field(value: unknown, key: string): unknown {
  return typeof value === 'object' && value !== null ? (value as Record<string, unknown>)[key] : undefined;
}

// Учень, що увійшов: його список у браузері поєднуємо з акаунтом. Гість, дорослий чи без мережі: нічого не робимо.
async function syncWithAccount(): Promise<void> {
  const id = field(await getJson('profile'), 'id');
  if (typeof id !== 'string' || !STUDENT_ID_PATTERN.test(id)) return;
  studentId = id;
  const all = await getJson('trainer-solved');
  if (!Array.isArray(all)) return;
  const mine = all.find((item) => field(item, 'trainer') === TRAINER);
  const solved = field(mine, 'solved');
  const server = Array.isArray(solved) ? solved.filter(isValidId) : [];
  const local = loadDone();
  const onlyLocal = local.filter((lessonId) => !server.includes(lessonId));
  saveDone([...server, ...onlyLocal]);
  sendDone(onlyLocal);
}

/** Повільний сервер не затримує сторінку довше за кілька секунд. */
export function syncInTime(): Promise<void> {
  return Promise.race([syncWithAccount(), new Promise<void>((resolve) => setTimeout(resolve, ACCOUNT_WAIT_MS))]);
}
