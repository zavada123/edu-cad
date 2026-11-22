<script>
  // Шрифти й іконки лежать поруч із тренажером, а не на CDN: шкільна мережа часто блокує сторонні сайти,
  // і браузер учня не звертається до Google Fonts чи cdnjs.
  import '@fortawesome/fontawesome-free/css/all.min.css';
  import '@fontsource/nunito/400.css';
  import '@fontsource/nunito/500.css';
  import '@fontsource/nunito/600.css';
  import '@fontsource/nunito/700.css';
  import '@fontsource/nunito/800.css';
  import '$lib/akse-theme.css';

  let { children } = $props();
</script>

<svelte:head>
  <title>3D-моделювання онлайн: 3D-майстерня для учнів · EduProstir</title>
</svelte:head>

{@render children?.()}
