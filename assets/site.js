'use strict';
(() => {
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-nav');
  function closeMenu() { nav?.classList.remove('open'); menu?.setAttribute('aria-expanded', 'false'); }
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open)); nav?.classList.toggle('open', open);
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') { closeMenu(); if (document.activeElement && nav?.contains(document.activeElement)) menu?.focus(); } });
  nav?.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 1040) closeMenu(); });

  const form = document.querySelector('#brief-form');
  if (!form) return;
  const panel = document.querySelector('#brief-output');
  const output = document.querySelector('#brief-text');
  const status = document.querySelector('#brief-status');
  const field = name => form.elements.namedItem(name);
  let catalogue = { solutions: [], services: [] };

  const catalogueReady = Promise.resolve({"solutions": [{"id": "mestorozhdenie", "label": "Обосновать освоение месторождения"}, {"id": "obogashchenie", "label": "Повысить извлечение и качество концентрата"}, {"id": "produkty", "label": "Получить товарную продукцию из минерального сырья"}, {"id": "tehnogennoe-syre", "label": "Разработать технологию переработки техногенного сырья"}, {"id": "bezopasnost-i-ekologiya", "label": "Обеспечить безопасность и снизить воздействие на окружающую среду"}, {"id": "masshtabirovanie", "label": "Провести испытания и подготовить технологию к внедрению"}], "services": [{"id": "geologicheskaya-otsenka", "name": "Геологическая оценка и проекты геологоразведочных работ"}, {"id": "modelirovanie-mestorozhdeniy", "name": "Геологическое и ресурсное моделирование"}, {"id": "geometallurgicheskoe-kartirovanie", "name": "Геолого-технологическое картирование месторождений"}, {"id": "gornye-tehnologii", "name": "Обоснование горной технологии и оценка освоения месторождений"}, {"id": "etalonnye-kollektsii", "name": "Эталонные коллекции и документация керна"}, {"id": "tehnologicheskaya-mineralogiya", "name": "Технологическая минералогия и анализ потерь при обогащении"}, {"id": "rudopodgotovka", "name": "Исследование дробимости и измельчаемости руд"}, {"id": "shemy-obogashcheniya", "name": "Исследование обогатимости и разработка схем обогащения"}, {"id": "reagentnye-rezhimy", "name": "Разработка реагентных режимов флотации"}, {"id": "gidrometallurgiya", "name": "Разработка технологий химического обогащения и гидрометаллургии"}, {"id": "termogidrohimicheskaya-pererabotka", "name": "Сульфатизирующий обжиг и выщелачивание техногенного сырья"}, {"id": "biovyshchelachivanie", "name": "Разработка технологий биовыщелачивания"}, {"id": "vydelenie-metallov", "name": "Очистка продуктивных растворов и выделение металлов"}, {"id": "materialy-i-soedineniya", "name": "Разработка технологий получения материалов и химических продуктов"}, {"id": "otsenka-tehnogennyh-obektov", "name": "Технико-технологическое обоснование переработки техногенного сырья"}, {"id": "geomehanika", "name": "Геомеханическое обоснование горных работ"}, {"id": "bezopasnost-hvostohranilishch", "name": "Исследование и мониторинг безопасности хвостохранилищ"}, {"id": "ochistka-vod", "name": "Разработка технологий очистки промышленных и дренажных вод"}, {"id": "fitotehnologii", "name": "Фитоплато и биологическая доочистка вод"}, {"id": "fitoekstraktsiya", "name": "Фитоэкстракция металлов из загрязнённых сред"}, {"id": "ekologicheskaya-reabilitatsiya", "name": "Разработка природоохранных решений для техногенных объектов"}, {"id": "pilotnye-ispytaniya", "name": "Пилотные испытания технологических схем обогащения"}, {"id": "tehnologicheskiy-reglament", "name": "Технологические регламенты и исходные данные для проектирования"}, {"id": "soprovozhdenie-opi", "name": "Научно-технологическое сопровождение опытно-промышленных испытаний"}, {"id": "analiticheskiy-kontrol", "name": "Аналитическое сопровождение технологических работ"}, {"id": "geohimicheskie-barery", "name": "Геохимические и сорбционно-фильтрационные барьеры"}, {"id": "opytno-promyshlennye-ispytaniya", "name": "Опытно-промышленные испытания схем обогащения"}]}).then(data => {
    catalogue = data;
    const params = new URLSearchParams(window.location.search);
    const solution = data.solutions.find(item => item.id === params.get('reshenie'));
    const service = data.services.find(item => item.id === params.get('usluga'));
    if (solution) field('direction').value = solution.id;
    if (service) field('service').value = service.name;
  }).catch(() => { /* The complete native form remains usable without the optional preselection. */ });

  function createText() {
    const direction = field('direction').selectedOptions[0].textContent;
    const data = Object.fromEntries(new FormData(form).entries());
    const lines = [
      'В Инжиниринговый центр ФИЦ КНЦ РАН', '',
      'Тема: обсуждение научно-технологической задачи', '',
      data.company.trim() ? 'Предприятие: ' + data.company.trim() : '',
      'Задача: ' + direction,
      data.service.trim() ? 'Услуга: ' + data.service.trim() : '',
      'Стадия проекта: ' + data.stage, '',
      'Объект и проблема:', data.task.trim(), '',
      data.result.trim() ? 'Ожидаемый результат:\n' + data.result.trim() + '\n' : '',
      'Просим рассмотреть возможность выполнения работ и определить необходимые исходные данные для подготовки предложения.', '',
      data.name.trim() ? 'Контактное лицо: ' + data.name.trim() : '',
      data.email.trim() ? 'Электронная почта: ' + data.email.trim() : ''
    ];
    return lines.filter((line, index) => line || (index && lines[index - 1])).join('\n').trim();
  }
  function prepareBrief(scroll = true) {
    const task = field('task');
    task.setCustomValidity(task.value.trim().length < 10 ? 'Опишите задачу подробнее: не менее 10 символов.' : '');
    if (!form.reportValidity()) return null;
    output.value = createText();
    panel.hidden = false;
    status.textContent = 'Запрос подготовлен. Данные в Центр не отправлены.';
    if (scroll) panel.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
    return { status: 'prepared_locally', sent: false, text: output.value };
  }
  field('task').addEventListener('input', () => field('task').setCustomValidity(''));
  form.addEventListener('submit', event => { event.preventDefault(); prepareBrief(); });
  document.querySelector('#copy-brief').addEventListener('click', async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(output.value);
      status.textContent = 'Текст скопирован. Запрос в Центр не отправлен.';
    } catch {
      output.focus(); output.select();
      status.textContent = 'Текст выделен. Скопируйте его сочетанием Ctrl+C или через меню устройства.';
    }
  });
  document.querySelector('#download-brief').addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob(['\uFEFF' + output.value], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'Zapros_v_Inzhiniringovyy_tsentr_KNC.txt';
    document.body.appendChild(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    status.textContent = 'Подготовлен файл запроса. Данные в Центр не отправлены.';
  });

  const context = document.modelContext;
  if (context?.registerTool) {
    const lifecycle = new AbortController();
    try { Promise.resolve(context.registerTool({
      name: 'prepare_local_project_brief',
      title: 'Подготовить текст запроса в Инжиниринговый центр',
      description: 'Fill the visible inquiry form and prepare a local draft. Does not send, upload, save remotely, or contact anyone.',
      inputSchema: { type: 'object', properties: {
        task: { type: 'string', minLength: 10, maxLength: 4000 },
        result: { type: 'string', maxLength: 2500 },
        company: { type: 'string', maxLength: 150 },
        service: { type: 'string', maxLength: 250 }
      }, required: ['task'], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: true },
      async execute(input) {
        const limits = { task: 4000, result: 2500, company: 150, service: 250 };
        if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Expected an object.');
        if (Object.keys(input).some(key => !(key in limits))) throw new Error('Unexpected field.');
        for (const [key, value] of Object.entries(input)) if (typeof value !== 'string' || value.length > limits[key]) throw new Error('Invalid ' + key + '.');
        if (typeof input.task !== 'string' || input.task.trim().length < 10) throw new Error('Task must contain at least 10 non-padding characters.');
        await catalogueReady;
        for (const key of Object.keys(limits)) field(key).value = input[key] || '';
        const prepared = prepareBrief();
        if (!prepared) throw new Error('Please correct the highlighted form fields.');
        return prepared;
      }
    }, { signal: lifecycle.signal })).catch(() => { /* Browser integration is optional. */ });
    } catch { /* A failed optional browser integration does not affect the form. */ }
    window.addEventListener('pagehide', () => lifecycle.abort(), { once: true });
  }
})();
