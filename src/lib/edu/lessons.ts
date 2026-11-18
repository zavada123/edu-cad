// SPDX-License-Identifier: AGPL-3.0-only
// Уроки 3D-майстерні на EduProstir. Кожен крок перевіряється автоматично (validator) або кнопкою «Зрозуміло, далі».
// Перші два уроки — переклад демо-уроків Akse; решта з'явиться на етапі 3 плану.
// Id уроку йде в акаунт учня (SolvedExerciseId у mriya-study): латиниця, цифри, «-».

import type { AkseGuide } from '$lib/guide';

export const LESSONS: readonly AkseGuide[] = [
  {
    id: 'brelok',
    name: 'Брелок для ключів',
    description: 'Фігури, точні розміри в міліметрах, отвір і групування.',
    steps: [
      {
        id: 'intro',
        title: 'Робимо брелок!',
        imageUrl: 'guide/steg-ferdig.png',
        bodyMarkdown:
          'Зробимо **брелок для ключів**: круглий плаский диск з маленьким отвором біля краю, ' +
          'крізь який пройде кільце. Дорогою навчишся додавати фігури, задавати точні розміри, ' +
          'робити отвори й групувати.',
        validator: { type: 'info' },
      },
      {
        id: 'skive',
        title: 'Додай циліндр',
        imageUrl: 'guide/steg-sylinder.png',
        bodyMarkdown:
          'Натисни **Циліндр** у списку фігур ліворуч (або клавішу `S`) і клацни посередині ' +
          'робочої площини. З нього вийде сам диск.',
        validator: { type: 'hasShapeKind', kind: 'cylinder' },
      },
      {
        id: 'flat-skive',
        title: 'Зроби його пласким',
        imageUrl: 'guide/steg-flat-skive.png',
        bodyMarkdown:
          'Вибери циліндр і в панелі праворуч у полі **Розмір (мм)** задай\n\n' +
          '- **Ш** = `40`\n- **Г** = `40`\n- **В** = `6`\n\n' +
          'Вийде плаский диск діаметром 4 см, саме для брелока.',
        validator: { type: 'shapeSize', kind: 'cylinder', dim: 'h', max: 8 },
      },
      {
        id: 'liten-sylinder',
        title: 'Додай маленький циліндр',
        imageUrl: 'guide/steg-liten-sylinder.png',
        bodyMarkdown:
          'Додай **ще один циліндр** трохи збоку від диска і задай йому розмір ' +
          '**Ш** = `8` і **Г** = `8`. З нього вийде отвір для кільця.',
        validator: { type: 'shapeSize', kind: 'cylinder', dim: 'b', max: 10 },
      },
      {
        id: 'hull',
        title: 'Перетвори його на отвір',
        imageUrl: 'guide/steg-hull.png',
        bodyMarkdown:
          'Вибери маленький циліндр і натисни `H` (або перемикач **Режим** у панелі). ' +
          'Він стане червоним і прозорим: тепер він вирізає частину інших фігур.',
        validator: { type: 'shapeSize', kind: 'cylinder', mode: 'hole', dim: 'b', max: 10 },
      },
      {
        id: 'plasser-hull',
        title: 'Постав отвір на диск',
        imageUrl: 'guide/steg-plasser-hull.png',
        bodyMarkdown:
          'Перетягни маленький отвір **на диск, ближче до краю**. Він має заходити на диск, ' +
          'але до краю залиш кілька міліметрів, щоб брелок не зламався.',
        validator: { type: 'holeOverlapsSolid' },
      },
      {
        id: 'grupper',
        title: 'Згрупуй, щоб вирізати отвір',
        imageUrl: 'guide/steg-ferdig.png',
        bodyMarkdown:
          'Вибери **обидві** фігури (обведи їх рамкою або клацай із Shift) і натисни ' +
          '`Ctrl+G` або кнопку **Згрупувати**. Отвір вирізано, брелок готовий!',
        validator: { type: 'hasGroup', withHole: true },
      },
      {
        id: 'ferdig',
        title: 'Готово! Зроби його своїм',
        bodyMarkdown:
          'Чудова робота! 🎉 Тепер можна:\n\n' +
          '- додати **Текст** зі своїм ім’ям;\n' +
          '- змінити **колір** у панелі праворуч;\n' +
          '- натиснути **STL** угорі, щоб завантажити файл для 3D-принтера.',
        validator: { type: 'info' },
      },
    ],
  },
  {
    id: 'imenna-tablychka',
    name: 'Іменна табличка',
    description: 'Креслення в 2D, підняття в 3D і об’ємний текст.',
    steps: [
      {
        id: 'intro',
        title: 'Робимо іменну табличку!',
        imageUrl: 'guide/skilt-ferdig.png',
        bodyMarkdown:
          '**Іменна табличка** із заокругленими кутами, отвором для кільця і твоїм ім’ям об’ємними ' +
          'літерами. Цього разу форму накреслимо в **Кресленні**: малюєш у 2D, а потім піднімаєш у 3D.',
        validator: { type: 'info' },
      },
      {
        id: 'avrundet-rektangel',
        title: 'Накресли заокруглений прямокутник',
        imageUrl: 'guide/skilt-skisse.png',
        bodyMarkdown:
          'Натисни **Креслення** у списку ліворуч. Вибери інструмент **Заокр. прямокутник** ' +
          '(клавіша `O`) і протягни прямокутник посередині сітки.',
        validator: { type: 'sketchFigure', figureKind: 'roundedRect' },
      },
      {
        id: 'maal',
        title: 'Задай розміри 100 × 50',
        imageUrl: 'guide/skilt-skisse.png',
        bodyMarkdown:
          'Вибери прямокутник інструментом **Вибір** (`V`) і у властивостях праворуч задай:\n\n' +
          '- **Ш (мм)** = `100`\n- **В (мм)** = `50`',
        validator: {
          type: 'sketchFigure',
          figureKind: 'roundedRect',
          minWidth: 95,
          maxWidth: 105,
          minHeight: 45,
          maxHeight: 55,
        },
      },
      {
        id: 'hoyde',
        title: 'Товщина 2 мм',
        imageUrl: 'guide/skilt-skisse.png',
        bodyMarkdown: 'Задай **Висота в 3D (мм)** у панелі праворуч `2`: табличка буде тонкою й легкою.',
        validator: { type: 'sketchExtrudeHeight', min: 1, max: 3 },
      },
      {
        id: 'hjornehull',
        title: 'Зроби отвір у куті',
        imageUrl: 'guide/skilt-hull.png',
        bodyMarkdown:
          'Вибери **Коло** (`S`) і накресли маленьке коло (радіус близько `3` мм) в одному з кутів, ' +
          'трохи відступивши від краю. Перемкни **Режим** на **Отвір**: коло стане помаранчевим і пунктирним.',
        validator: { type: 'sketchFigure', figureKind: 'circle', mode: 'hole', maxWidth: 12 },
      },
      {
        id: 'lag-3d',
        title: 'Зроби 3D-модель',
        imageUrl: 'guide/skilt-3d.png',
        bodyMarkdown:
          'Подивись на перегляд унизу праворуч і натисни **Зробити 3D-модель**. ' +
          'Табличка з’явиться на робочій площині вже з отвором.',
        validator: { type: 'hasShapeKind', kind: 'sketch' },
      },
      {
        id: 'tekst',
        title: 'Додай своє ім’я',
        imageUrl: 'guide/skilt-tekst.png',
        bodyMarkdown:
          'Натисни **Текст** у списку ліворуч і постав його на робочу площину. ' +
          'Напиши своє ім’я в полі **Текст** у панелі праворуч.',
        validator: { type: 'hasShapeKind', kind: 'text' },
      },
      {
        id: 'plasser-tekst',
        title: 'Постав ім’я на табличку',
        imageUrl: 'guide/skilt-ferdig.png',
        bodyMarkdown:
          'Перетягни текст **на табличку** і трохи збільш: він має лежати зверху на ній. ' +
          'Зміни колір тексту в панелі, щоб ім’я було добре видно.',
        validator: { type: 'shapesOverlap', kindA: 'text', kindB: 'sketch' },
      },
      {
        id: 'ferdig',
        title: 'Табличка готова!',
        bodyMarkdown:
          'Неймовірно! 🎉 Хочеш змінити форму? Вибери табличку й натисни **Змінити креслення**: ' +
          'креслення завжди можна поправити. Коли захочеш надрукувати, натисни **STL** угорі.',
        validator: { type: 'info' },
      },
    ],
  },
];

export function findLesson(id: string | null): AkseGuide | null {
  return LESSONS.find((lesson) => lesson.id === id) ?? null;
}
