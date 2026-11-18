# NOTICE

edu-cad («3D-майстерня») — тренажер 3D-моделювання для уроків на eduprostir.com.

Це форк **Akse** (https://github.com/joachimhs/akse3d), автор Skaperiet (Joachim Haagen Skeie),
© 2026 Skaperiet. Akse поширюється за ліцензією GNU AGPL-3.0-only, і цей форк теж: див. [LICENSE](LICENSE).
Історію змін оригіналу збережено в git.

Назва «Akse», логотип Akse і домени akse3d.no / akse3d.com — торгові марки Skaperiet, вони не входять до AGPL.
Тому форк має власну назву «3D-майстерня» (`src/lib/brand.ts`).

Що змінено у форку:
- українська мова інтерфейсу (`UK_TEXTS` у `src/lib/texts.ts`), вона стоїть за замовчуванням;
- власна назва в шапці редактора;
- тексти, що були вписані в код норвезькою (написи розмірів у 3D-сцені, кнопки групування, попередження перед експортом STL), перенесено в словники мов;
- сторінка EduProstir (`src/routes/+page.svelte`): уроки українською (`src/lib/edu/lessons.ts`), галочки пройдених уроків в акаунті учня (`src/lib/edu/solved.ts`), посилання на код тренажера;
- шрифти й іконки лежать поруч із тренажером (npm `@fontsource/nunito`, `@fortawesome/fontawesome-free`), а не на CDN.

Вихідний код кожної версії, яка працює на eduprostir.com, відкритий у цьому репозиторії (AGPL-3.0, розділ 13).
