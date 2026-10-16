'use strict';
(() => {
  const norm = s => s.toLocaleLowerCase('ru').replace(/ё/g,'е');
  const cards = [...document.querySelectorAll('[data-case-id]')];
  if (cards.length && document.querySelector('#case-results')) {
    const search=document.querySelector('#case-search'), direction=document.querySelector('#case-direction'), status=document.querySelector('#case-status');
    let company='all';
    const knownCompanies=new Set(cards.map(c=>c.dataset.caseCompany));
    function apply(write=true){
      const terms=norm(search.value.trim()).split(/\s+/).filter(Boolean);let visible=0;
      cards.forEach(c=>{const text=norm(c.textContent+' '+c.dataset.caseBrand);const show=(company==='all'||company===c.dataset.caseCompany)&&(direction.value==='all'||direction.value===c.dataset.caseDirection)&&(status.value==='all'||status.value===c.dataset.caseStatus)&&terms.every(t=>text.includes(t));c.hidden=!show;if(show)visible++;});
      document.querySelector('#case-count').textContent='Показано примеров: '+visible;
      document.querySelector('#case-empty').hidden=visible!==0;
      document.querySelectorAll('[data-company-filter]').forEach(b=>b.setAttribute('aria-pressed',String(company===b.dataset.companyFilter)));
      if(write){const url=new URL(location.href);for(const [k,v]of [['company',company],['direction',direction.value],['status',status.value],['q',search.value.trim()]]){if(!v||v==='all')url.searchParams.delete(k);else url.searchParams.set(k,v);}history.replaceState(null,'',url.pathname+url.search+url.hash);}
    }
    function read(){const p=new URLSearchParams(location.search);company=knownCompanies.has(p.get('company'))?p.get('company'):'all';direction.value=[...direction.options].some(o=>o.value===p.get('direction'))?p.get('direction'):'all';status.value=[...status.options].some(o=>o.value===p.get('status'))?p.get('status'):'all';search.value=(p.get('q')||'').slice(0,200);apply(false);}
    function reset(){company='all';direction.value='all';status.value='all';search.value='';apply();search.focus();}
    search.addEventListener('input',()=>apply());direction.addEventListener('change',()=>apply());status.addEventListener('change',()=>apply());
    document.querySelectorAll('[data-company-filter]').forEach(b=>b.addEventListener('click',()=>{company=company===b.dataset.companyFilter?'all':b.dataset.companyFilter;apply();}));
    document.querySelector('#case-reset').addEventListener('click',reset);document.querySelector('#case-empty-reset').addEventListener('click',reset);
    window.addEventListener('popstate',read);read();
  }
  const equipment=[...document.querySelectorAll('[data-facility-category]')];
  if(equipment.length){
    const known=new Set(equipment.map(c=>c.dataset.facilityCategory));
    function apply(category,write=true){let visible=0;equipment.forEach(c=>{const show=category==='all'||category===c.dataset.facilityCategory;c.hidden=!show;if(show)visible++;});document.querySelector('#facility-count').textContent='Установок и комплексов: '+visible;document.querySelectorAll('[data-equipment-filter]').forEach(b=>{const on=b.dataset.equipmentFilter===category;b.setAttribute('aria-pressed',String(on));b.classList.toggle('active',on);});if(write){const u=new URL(location.href);if(category==='all')u.searchParams.delete('type');else u.searchParams.set('type',category);history.replaceState(null,'',u.pathname+u.search+u.hash);}}
    function read(){const c=new URLSearchParams(location.search).get('type');apply(known.has(c)?c:'all',false);}
    document.querySelectorAll('[data-equipment-filter]').forEach(b=>b.addEventListener('click',()=>apply(b.dataset.equipmentFilter)));window.addEventListener('popstate',read);read();
  }
})();
