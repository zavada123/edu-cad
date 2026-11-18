<!--
  Сторінка 3D-майстерні на EduProstir (/cad/).
  - `?lesson=<id>`: урок з перевіркою кроків (src/lib/edu/lessons.ts);
  - `?lesson=free`: вільний режим без уроку;
  - без параметра: список уроків.
  Пройдений урок отримує галочку в браузері, а в учня, що увійшов, і в акаунті (src/lib/edu/solved.ts).
-->
<script lang="ts">
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { Akse } from '$lib/index';
  import type { AkseGuide, AkseLocale, AkseSession } from '$lib/index';
  import { LESSONS, findLesson } from '$lib/edu/lessons';
  import { loadDone, markDone, syncInTime } from '$lib/edu/solved';

  const FREE_ID = 'free';
  const SOURCE_URL = 'https://github.com/zavada123/edu-cad';
  const session: AkseSession = { user: null, authenticated: false };

  const params = new URLSearchParams(location.search);
  const initialLocale: AkseLocale = (['no', 'en'] as const).find((l) => l === params.get('lang')) ?? 'uk';
  const requested = params.get('lesson');

  let lesson = $state<AkseGuide | null>(findLesson(requested));
  let pickerOpen = $state(requested === null || (requested !== FREE_ID && findLesson(requested) === null));
  let done = $state<string[]>(loadDone());

  onMount(() => {
    syncInTime().then(() => (done = loadDone()));
  });

  // Картинки уроків лежать у static/guide; base — це /cad на сайті і порожньо в розробці.
  function withBase(guide: AkseGuide): AkseGuide {
    return {
      ...guide,
      steps: guide.steps.map((step) => ({ ...step, imageUrl: step.imageUrl ? `${base}/${step.imageUrl}` : step.imageUrl })),
    };
  }

  function open(id: string): void {
    lesson = findLesson(id);
    pickerOpen = false;
    const url = new URL(location.href);
    url.searchParams.set('lesson', lesson ? lesson.id : FREE_ID);
    history.replaceState(history.state, '', url);
  }

  function complete(id: string): void {
    markDone(id);
    done = loadDone();
  }
</script>

<Akse
  {session}
  locale={initialLocale}
  fontUrl={`${base}/fonts/inter-regular.ttf`}
  guide={lesson ? withBase(lesson) : null}
  onGuideClose={() => (lesson = null)}
  onGuideComplete={complete}
  onOpenGuides={() => (pickerOpen = true)}
/>

<nav class="edu-links" aria-label="EduProstir">
  <a href="/">← EduProstir</a>
  <button type="button" onclick={() => (pickerOpen = true)}>Уроки</button>
  <a href={SOURCE_URL} target="_blank" rel="noopener" title="Вихідний код цього тренажера, ліцензія AGPL-3.0">Код тренажера</a>
</nav>

{#if pickerOpen}
  <div class="edu-backdrop" role="presentation" onclick={() => (pickerOpen = false)}></div>
  <div class="edu-picker" role="dialog" aria-modal="true" aria-labelledby="edu-picker-title">
    <h2 id="edu-picker-title">3D-майстерня</h2>
    <p>Створюй 3D-моделі з фігур і отворів і завантажуй файл STL для 3D-принтера. Обери урок:</p>
    <ol>
      {#each LESSONS as item, i (item.id)}
        <li>
          <button type="button" onclick={() => open(item.id)}>
            <span class="num">{done.includes(item.id) ? '✓' : i + 1}</span>
            <span class="text">
              <strong>{item.name}</strong>
              <small>{item.description}</small>
            </span>
          </button>
        </li>
      {/each}
      <li>
        <button type="button" onclick={() => open(FREE_ID)}>
          <span class="num">∞</span>
          <span class="text">
            <strong>Вільний режим</strong>
            <small>Без уроку: моделюй що хочеш.</small>
          </span>
        </button>
      </li>
    </ol>
  </div>
{/if}

<style>
  .edu-links {
    position: fixed;
    left: 12px;
    bottom: 12px;
    z-index: 40;
    display: flex;
    gap: 6px;
    font-family: var(--akse-font, sans-serif);
    font-size: 13px;
  }
  .edu-links a,
  .edu-links button {
    padding: 6px 10px;
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.92);
    color: #1f2937;
    text-decoration: none;
    font: inherit;
    cursor: pointer;
  }
  .edu-links a:hover,
  .edu-links button:hover {
    background: #fff;
    border-color: #2563eb;
  }
  .edu-backdrop {
    position: fixed;
    inset: 0;
    z-index: 50;
    background: rgba(15, 23, 42, 0.45);
  }
  .edu-picker {
    position: fixed;
    z-index: 51;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: min(480px, calc(100vw - 32px));
    max-height: calc(100vh - 32px);
    overflow: auto;
    padding: 24px;
    border-radius: 16px;
    background: #fff;
    color: #1f2937;
    font-family: var(--akse-font, sans-serif);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
  }
  .edu-picker h2 {
    margin: 0 0 6px;
    font-size: 22px;
  }
  .edu-picker p {
    margin: 0 0 16px;
    color: #4b5563;
  }
  .edu-picker ol {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 8px;
  }
  .edu-picker li button {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    background: #f9fafb;
    text-align: left;
    font: inherit;
    color: inherit;
    cursor: pointer;
  }
  .edu-picker li button:hover {
    border-color: #2563eb;
    background: #eff6ff;
  }
  .num {
    flex: none;
    width: 32px;
    height: 32px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: #2563eb;
    color: #fff;
    font-weight: 700;
  }
  .text {
    display: grid;
  }
  .text small {
    color: #6b7280;
  }
</style>
