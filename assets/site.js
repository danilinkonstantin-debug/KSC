'use strict';
(() => {
  const menu=document.querySelector('.menu-toggle'), nav=document.querySelector('#main-nav');
  function closeMenu(){nav?.classList.remove('open');menu?.setAttribute('aria-expanded','false');}
  menu?.addEventListener('click',()=>{const on=menu.getAttribute('aria-expanded')!=='true';nav?.classList.toggle('open',on);menu.setAttribute('aria-expanded',String(on));});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){const restore=nav?.contains(document.activeElement);closeMenu();if(restore)menu?.focus();}});
  document.addEventListener('click',e=>{if(!e.target.closest('.header'))closeMenu();});
  nav?.addEventListener('click',closeMenu);
  window.addEventListener('resize',()=>{if(window.innerWidth>1120)closeMenu();});
  const STORE='ksc-program-v1';
  let selected=[], catalog={groups:[],services:[]}, ready=false;
  try{const v=JSON.parse(localStorage.getItem(STORE)||'[]');if(Array.isArray(v))selected=[...new Set(v.filter(x=>typeof x==='string'&&/^[GMODEAC]\d{2}$/.test(x)))].slice(0,48);}catch{}
  const byId=id=>catalog.services.find(s=>s.id===id);
  const live=document.createElement('div');live.className='sr-only';live.setAttribute('role','status');live.setAttribute('aria-live','polite');document.body.append(live);
  function persist(){try{localStorage.setItem(STORE,JSON.stringify(selected));}catch{}}
  function chip(s){const b=document.createElement('button');b.type='button';b.className='selected-chip';b.dataset.remove=s.id;b.textContent=s.title+' ×';b.setAttribute('aria-label','Убрать из задачи: '+s.title);return b;}
  function updateSelection(){
    document.querySelectorAll('[data-select]').forEach(b=>{const on=selected.includes(b.dataset.select),s=byId(b.dataset.select);b.setAttribute('aria-pressed',String(on));b.textContent=on?'✓ В задаче':'+ К задаче';if(s)b.setAttribute('aria-label',(on?'Убрать из задачи: ':'Добавить к задаче: ')+s.title);});
    document.querySelectorAll('.selection-count').forEach(b=>{b.hidden=!selected.length;b.textContent=String(selected.length);b.setAttribute('aria-label','Выбрано услуг: '+selected.length);});
    document.querySelectorAll('.selection-panel').forEach(p=>{p.hidden=!selected.length;p.querySelector('.selected-chips').replaceChildren(...selected.map(byId).filter(Boolean).map(chip));});
    const request=document.querySelector('#request-selection');
    if(request){request.replaceChildren();if(selected.length){const h=document.createElement('h2');h.textContent='Выбранные услуги';const list=document.createElement('div');list.className='selected-chips';list.append(...selected.map(byId).filter(Boolean).map(chip));request.append(h,list);}}
    const output=document.querySelector('#brief-output');if(output&&!output.hidden){output.hidden=true;live.textContent='Выбор услуг изменён. Подготовьте запрос заново.';}
  }
  document.addEventListener('click',e=>{
    const add=e.target.closest('[data-select]'),remove=e.target.closest('[data-remove]'),clear=e.target.closest('.clear-selection');
    if(!add&&!remove&&!clear)return;
    if(!ready){live.textContent='Каталог загружается. Повторите выбор через несколько секунд.';return;}
    if(clear)selected=[];else{const id=(add||remove).dataset[add?'select':'remove'];if(!byId(id))return;selected=selected.includes(id)?selected.filter(x=>x!==id):[...selected,id];}
    persist();updateSelection();live.textContent='В программу работ выбрано услуг: '+selected.length;
    if(remove||clear)document.querySelector('.contact-button')?.focus();
  });
  window.addEventListener('storage',e=>{if(e.key!==STORE)return;try{const data=JSON.parse(e.newValue||'[]');selected=Array.isArray(data)?[...new Set(data)].filter(id=>byId(id)).slice(0,48):[];updateSelection();}catch{}});
  const search=document.querySelector('#service-search'),cards=[...document.querySelectorAll('#service-results .service-card')];
  let group='all';
  function roots(text){return text.toLocaleLowerCase('ru').replace(/ё/g,'е').replace(/[^\p{L}\p{N}]+/gu,' ').trim().split(/\s+/).filter(Boolean).map(t=>t.length>3?t.replace(/(иями|ениями|ами|ого|ему|ыми|иях|иям|ия|ах|ях|ов|ев|ом|ем|ые|ая|ое|ий|ый|ой|ую|юю|а|я|ы|и|у|ю|е|о)$/u,''):t);}
  function filter(writeUrl=true){
    if(!search)return;
    const tokens=roots(search.value);let count=0;
    cards.forEach(card=>{const s=byId(card.dataset.service),text=roots(s?[s.title,s.category,s.scope,s.result,s.keywords].join(' '):card.textContent).join(' ');const show=(group==='all'||group===card.dataset.group)&&tokens.every(t=>text.includes(t));card.hidden=!show;if(show)count++;});
    document.querySelectorAll('[data-filter]').forEach(b=>{const on=b.dataset.filter===group;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});
    document.querySelector('#results-title').textContent=catalog.groups.find(g=>g.id===group)?.name||'Все услуги';
    document.querySelector('#results-count').textContent='Найдено услуг: '+count;
    document.querySelector('#empty-results').hidden=count!==0;
    if(writeUrl){const url=new URL(location.href);if(group==='all')url.searchParams.delete('direction');else url.searchParams.set('direction',group);if(search.value.trim())url.searchParams.set('q',search.value.trim());else url.searchParams.delete('q');history.replaceState(null,'',url.pathname+url.search+url.hash);}
  }
  function readFilters(){if(!search)return;const p=new URLSearchParams(location.search),v=p.get('direction');group=catalog.groups.some(g=>g.id===v)?v:'all';search.value=(p.get('q')||'').slice(0,250);filter(false);}
  function reset(){group='all';search.value='';filter();search.focus();}
  search?.addEventListener('input',()=>filter());
  document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{group=b.dataset.filter;filter();}));
  document.querySelectorAll('[data-query]').forEach(b=>b.addEventListener('click',()=>{group='all';search.value=b.dataset.query;filter();}));
  document.querySelector('#reset-filters')?.addEventListener('click',reset);
  document.querySelector('#empty-reset')?.addEventListener('click',reset);
  window.addEventListener('popstate',readFilters);
  const form=document.querySelector('#brief-form');
  if(form){
    const field=n=>form.elements.namedItem(n),panel=document.querySelector('#brief-output'),output=document.querySelector('#brief-text'),status=document.querySelector('#brief-status');
    function createText(){const d=Object.fromEntries(new FormData(form).entries()),items=selected.map(byId).filter(Boolean);return ['В Инжиниринговый центр ФИЦ КНЦ РАН','','Тема: обсуждение задачи предприятия','',d.company.trim()?'Предприятие: '+d.company.trim():'','Направление: '+field('direction').selectedOptions[0].textContent,'Стадия проекта: '+d.stage,items.length?'\nВыбранные услуги:\n'+items.map(s=>'• '+s.title).join('\n'):'','\nОбъект и задача:\n'+d.task.trim(),d.result.trim()?'\nОжидаемый результат:\n'+d.result.trim():'','\nПросим рассмотреть возможность выполнения работ и определить исходные данные для подготовки предложения.',d.name.trim()?'\nКонтактное лицо: '+d.name.trim():'',d.email.trim()?'Электронная почта: '+d.email.trim():''].filter((x,i)=>x||i===1||i===3).join('\n').trim();}
    form.addEventListener('input',()=>{field('task').setCustomValidity('');panel.hidden=true;});
    form.addEventListener('change',()=>{panel.hidden=true;});
    form.addEventListener('submit',e=>{e.preventDefault();field('task').setCustomValidity(field('task').value.trim().length<10?'Опишите задачу подробнее: не менее 10 символов.':'');if(!form.reportValidity())return;output.value=createText();panel.hidden=false;status.textContent='Текст подготовлен. Запрос в Центр не отправлен.';output.focus();});
    document.querySelector('#copy-brief').addEventListener('click',async()=>{try{if(!navigator.clipboard?.writeText)throw Error();await navigator.clipboard.writeText(output.value);status.textContent='Текст скопирован. Запрос в Центр не отправлен.';}catch{output.focus();output.select();status.textContent='Текст выделен. Скопируйте его сочетанием Ctrl+C или через меню устройства.';}});
    document.querySelector('#download-brief').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob(['\uFEFF'+output.value],{type:'text/plain;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download='Zapros_KNC_RAN.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);status.textContent='Файл запроса подготовлен. Данные в Центр не отправлены.';});
    document.querySelector('#email-brief').addEventListener('click',()=>{const url='mailto:ksc@ksc.ru?subject='+encodeURIComponent('Запрос в Инжиниринговый центр КНЦ РАН')+'&body='+encodeURIComponent(output.value);if(url.length>6500){status.textContent='Текст слишком длинный для открытия в почте. Скопируйте его или скачайте файл и приложите к письму на ksc@ksc.ru.';return;}location.href=url;status.textContent='Запрос передан почтовой программе. Отправку письма необходимо подтвердить в ней.';});
  }
  fetch('/KSC/assets/catalog.json').then(r=>{if(!r.ok)throw Error();return r.json();}).then(data=>{
    catalog=data;ready=true;selected=selected.filter(id=>byId(id));
    const service=byId(new URLSearchParams(location.search).get('service'));if(service&&!selected.includes(service.id))selected.push(service.id);
    persist();updateSelection();readFilters();
    if(form){const groups=[...new Set(selected.map(byId).filter(Boolean).map(s=>s.group))];if(groups.length===1)form.elements.namedItem('direction').value=groups[0];}
  }).catch(()=>{live.textContent='Не удалось загрузить выбор услуг. Страницы каталога доступны по ссылкам.';document.querySelectorAll('[data-select]').forEach(b=>{b.disabled=true;b.textContent='Выбор недоступен';});readFilters();});
})();
