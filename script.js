(function(){
  var b=document.body, hh=document.querySelector('.hair.h'), hv=document.querySelector('.hair.v');
  var fl=[].slice.call(document.querySelectorAll('.fl')), logo=document.getElementById('logo');
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* mira em cruz + elementos do logo a flutuar com o cursor */
  addEventListener('pointermove',function(e){
    if(e.pointerType==='touch')return;
    b.classList.add('moving');
    hh.style.transform='translateY('+e.clientY+'px)';
    hv.style.transform='translateX('+e.clientX+'px)';
    if(reduce)return;
    var x=(e.clientX/innerWidth-.5), y=(e.clientY/innerHeight-.5);
    fl.forEach(function(g){var d=parseFloat(g.dataset.d);g.style.transform='translate('+(x*d*10)+'px,'+(y*d*10)+'px)'});
  },{passive:true});
  document.addEventListener('pointerleave',function(){b.classList.remove('moving')});

  /* clicar ou premir Enter no logo redesenha a cruz */
  function redraw(){logo.classList.add('again');void logo.getBoundingClientRect();logo.classList.remove('again')}
  logo.addEventListener('click',redraw);
  logo.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();redraw()}});

  /* partilhar */
  var s=document.getElementById('share'), man=document.getElementById('manual'), LABEL='Partilhar esta página';
  function done(t){s.textContent=t;setTimeout(function(){s.textContent=LABEL},2000)}
  function legacyCopy(txt){
    var ta=document.createElement('textarea');ta.value=txt;ta.setAttribute('readonly','');
    ta.style.cssText='position:fixed;top:0;left:0;opacity:0';document.body.appendChild(ta);
    ta.select();ta.setSelectionRange(0,txt.length);
    var ok=false;try{ok=document.execCommand('copy')}catch(e){}
    document.body.removeChild(ta);return ok;
  }
  function manual(url){man.value=url;man.classList.add('on');man.focus();man.select();done('Copia o endereço abaixo')}
  function copy(url){
    function fallback(){legacyCopy(url)?done('Link copiado ✓'):manual(url)}
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(url).then(function(){done('Link copiado ✓')},fallback);
    }else fallback();
  }
  s.addEventListener('click',function(){
    var url=location.href, data={title:document.title,text:'Todos os links da comunidade',url:url};
    if(navigator.share){
      navigator.share(data).catch(function(err){if(!err||err.name!=='AbortError')copy(url)});
    }else copy(url);
  });

  /* tema claro / escuro */
  var root=document.documentElement, t=document.getElementById('tema'), meta=document.querySelector('meta[name="theme-color"]');
  function isDark(){return getComputedStyle(root).getPropertyValue('--bg').trim().toLowerCase()==='#000'}
  function sync(){var d=isDark();t.textContent=d?'Tema claro':'Tema escuro';meta&&meta.setAttribute('content',d?'#000000':'#FFC400')}
  try{var saved=localStorage.getItem('tema');if(saved)root.setAttribute('data-theme',saved)}catch(e){}
  sync();
  t.addEventListener('click',function(){
    var next=isDark()?'light':'dark';
    root.setAttribute('data-theme',next);
    try{localStorage.setItem('tema',next)}catch(e){}
    sync();
  });
  if(matchMedia){matchMedia('(prefers-color-scheme: dark)').addEventListener&&matchMedia('(prefers-color-scheme: dark)').addEventListener('change',sync)}
})();
