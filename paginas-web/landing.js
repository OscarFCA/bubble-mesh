
(function(){
  document.documentElement.classList.add('js');
  // Safari (Mac, iPhone, iPad) y todo navegador de iOS usan WebKit: versión ligera de los efectos para no agotar la memoria
  var ua=navigator.userAgent;
  if(/iPhone|iPad|iPod/.test(ua)||(/Macintosh/.test(ua)&&navigator.maxTouchPoints>1)||(/Safari\//.test(ua)&&!/Chrome|Chromium|CriOS|FxiOS|Edg|OPR|Firefox|Android/.test(ua))) document.documentElement.classList.add('lp-ligero');
  var MED={"ga4": "", "google_ads": "", "meta_pixel": ""}, seg=document.body.dataset.seg||'';
  window.dataLayer=window.dataLayer||[];
  function evento(n,p){ p=p||{}; p.segmento=seg; if(window.lpCtx) Object.keys(window.lpCtx).forEach(function(k){ if(!(k in p)) p[k]=window.lpCtx[k]; }); window.dataLayer.push(Object.assign({event:n},p)); if(window.gtag) window.gtag('event',n,p); }

  // Contador de la campaña (banner y versión chica del cierre)
  var cajas=document.querySelectorAll('[data-fin]');
  function tic(){ cajas.forEach(function(c){ var r=new Date(c.dataset.fin)-new Date();
    if(r<=0){ if(c.dataset.sig){ c.dataset.fin=c.dataset.sig; delete c.dataset.sig; var t=c.querySelector('[data-txt]'); if(t) t.textContent=c.dataset.sigTxt; var tg=c.querySelector('[data-txt-tag]'); if(tg) tg.hidden=true; return tic(); } c.hidden=true; return; }
    var d=Math.floor(r/864e5),h=Math.floor(r/36e5)%24,m=Math.floor(r/6e4)%60,s=Math.floor(r/1e3)%60;
    var v={d:d,h:h,m:m,s:s}; c.querySelectorAll('[data-u]').forEach(function(b){ var x=v[b.dataset.u]; b.textContent=b.dataset.u==='d'?x:String(x).padStart(2,'0'); }); }); }
  if(cajas.length){ tic(); setInterval(tic,1000); }

  // Aparición al hacer scroll
  var revs=document.querySelectorAll('.lp-rev');
  if('IntersectionObserver' in window){ var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('on'); io.unobserve(e.target); } }); },{rootMargin:'0px 0px -8% 0px'}); revs.forEach(function(r){ io.observe(r); }); }
  else revs.forEach(function(r){ r.classList.add('on'); });
  // Red de seguridad: lo que quedó arriba al saltar con un ancla también aparece
  window.addEventListener('scroll',function(){ revs.forEach(function(r){ if(!r.classList.contains('on') && r.getBoundingClientRect().top<innerHeight) r.classList.add('on'); }); },{passive:true});

  // Video de la burbuja: baja cuando la página ya cargó y solo corre en pantalla
  var vp=document.querySelector('.lp-pantalla');
  if(vp){ window.addEventListener('load',function(){ vp.src=vp.dataset.src; vp.muted=true; var p=vp.play(); if(p&&p.catch) p.catch(function(){}); });
    if('IntersectionObserver' in window) new IntersectionObserver(function(es){ es.forEach(function(e){ if(!vp.src) return; if(e.isIntersecting){ var p=vp.play(); if(p&&p.catch) p.catch(function(){}); } else vp.pause(); }); }).observe(vp); }
  var vb=document.querySelector('.lp-burbuja');
  if(vb){ window.addEventListener('load',function(){ vb.src=vb.dataset.src; vb.muted=true; var p=vb.play(); if(p&&p.catch) p.catch(function(){}); });
    if('IntersectionObserver' in window) new IntersectionObserver(function(es){ es.forEach(function(e){ if(!vb.src) return; if(e.isIntersecting){ var p=vb.play(); if(p&&p.catch) p.catch(function(){}); } else vb.pause(); }); }).observe(vb); }

  // Piezas del portafolio en bucle
  var piezas=document.querySelectorAll('.lp-pieza video[data-src]');
  if(piezas.length&&'IntersectionObserver' in window){ var iov=new IntersectionObserver(function(es){ es.forEach(function(e){ var v=e.target;
    if(e.isIntersecting){ if(!v.src) v.src=v.dataset.src; v.muted=true; var p=v.play(); if(p&&p.catch) p.catch(function(){}); } else v.pause(); }); },{rootMargin:'200px 0px'});
    piezas.forEach(function(v){ iov.observe(v); }); }

  // UTM del anuncio para saber qué trajo cada contacto
  var utm={}; try{ utm=JSON.parse(sessionStorage.getItem('lp-utm')||'{}'); }catch(e){}
  var q=new URLSearchParams(location.search); ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid'].forEach(function(k){ if(q.get(k)) utm[k]=q.get(k); });
  try{ sessionStorage.setItem('lp-utm',JSON.stringify(utm)); }catch(e){}

  // Selector de servicio (landing unificada): ?servicio= y los botones lo preseleccionan; form_start y anchor_view para medición
  var fs=document.getElementById('cotiza'), selS=fs&&fs.querySelector('select[name=servicio]');
  function elegir(k){ if(!selS) return; [].forEach.call(selS.options,function(o){ if(o.dataset.k===k) selS.value=o.value; }); }
  function servicio(){ var o=selS&&selS.selectedOptions[0]; return o&&o.dataset.k||''; }
  var QS={web:'web',paginas:'web','paginas-web':'web',empresas:'web',tienda:'tienda',tiendas:'tienda',crm:'crm',combinado:'combinado'};
  var qsv=new URLSearchParams(location.search).get('servicio'); if(qsv&&QS[qsv]) elegir(QS[qsv]);
  if(fs){ var empezo=false; fs.addEventListener('focusin',function(){ if(empezo) return; empezo=true; evento('form_start',servicio()?{servicio:servicio()}:{}); }); }
  var anclas=document.querySelectorAll('[data-ancla]');
  if(anclas.length&&'IntersectionObserver' in window){ var ioa=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ evento('anchor_view',{seccion:e.target.id}); ioa.unobserve(e.target); } }); },{threshold:.35}); anclas.forEach(function(a){ ioa.observe(a); }); }

  // Contador de la esquina: se minimiza, y se esconde junto al formulario y al pie para no tapar campos
  var esq=document.getElementById('lp-esquina');
  if(esq){ var cerca={}, pill=esq.querySelector('.lp-esq-pill');
    try{ if(sessionStorage.getItem('lp-esq-min')) esq.classList.add('min'); }catch(e){}
    function minimizar(m){ esq.classList.toggle('min',m); pill.setAttribute('aria-expanded',String(!m)); try{ m?sessionStorage.setItem('lp-esq-min','1'):sessionStorage.removeItem('lp-esq-min'); }catch(e){} }
    esq.querySelector('.lp-esq-min').addEventListener('click',function(){ minimizar(true); });
    pill.addEventListener('click',function(){ minimizar(false); });
    var hero=esq.dataset.desde&&document.querySelector('.lp-hero');
    function ver(){ esq.classList.toggle('arriba',hero?hero.getBoundingClientRect().bottom>80:scrollY<320); esq.classList.toggle('fuera',!!(cerca.cierre||cerca.pie||(!hero&&(cerca.promos||cerca.oferta||cerca.reel||cerca.hechos)))); }
    if('IntersectionObserver' in window){ var ioe=new IntersectionObserver(function(es){ es.forEach(function(e){ cerca[e.target.dataset.esq]=e.isIntersecting; }); ver(); },{rootMargin:'0px 0px -10% 0px'});
      [['cierre','#cierre .lp-form'],['pie','.lp-pie'],['promos','#promos .lp-promos'],['oferta','#oferta .lp-fs'],['reel','#reel .lp-reel'],['hechos','#hechos .lp-hechos']].forEach(function(x){ var el=document.querySelector(x[1]); if(el){ el.dataset.esq=x[0]; ioe.observe(el); } }); }
    if('ResizeObserver' in window){ new ResizeObserver(function(){ document.body.style.setProperty('--lp-esq-h',esq.offsetHeight+'px'); }).observe(esq); }
    addEventListener('scroll',ver,{passive:true}); ver(); }

  // CTA → formulario
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('[data-cta]');
    if(a){ e.preventDefault(); var pq=a.dataset.paquete, sv=a.dataset.servicio, ev={ubicacion:a.dataset.cta}; if(pq) ev.paquete=pq; if(sv){ elegir(sv); ev.servicio=sv; } evento('cta_click',ev); var f=document.getElementById('cotiza'); var sel=f&&f.querySelector('select[name=paquete]'); if(sel&&pq) sel.value=pq; if(f){ f.scrollIntoView({behavior:'smooth',block:'center'}); var i=f.querySelector('input'); setTimeout(function(){ if(i) i.focus({preventScroll:true}); },650); } return; }
    var cs=e.target.closest&&e.target.closest('[data-cta-sec]'); if(cs) evento('cta_click',{ubicacion:cs.dataset.ctaSec,destino:cs.getAttribute('href')});
    var w=e.target.closest&&e.target.closest('a[data-wa]'); if(w) evento('whatsapp_click',w.dataset.wa?{ubicacion:w.dataset.wa}:{});
    if(e.target.closest&&e.target.closest('[data-agenda]')) evento('agenda_click',{});
  });

  // Formulario → HubSpot (API v3; si da 404, endpoint legacy). Éxito → página de gracias.
  function cookie(n){ var m=document.cookie.match('(?:^|; )'+n+'=([^;]*)'); return m?decodeURIComponent(m[1]):''; }
  function hubspot(portal,formid,campos,listo,falla){
    var hutk=cookie('hubspotutk'), llenos=Object.keys(campos).filter(function(k){ return campos[k]; });
    var cuerpo={fields:llenos.map(function(k){ return {objectTypeId:'0-1',name:k,value:campos[k]}; }),context:{pageUri:location.href,pageName:document.title}};
    if(hutk) cuerpo.context.hutk=hutk;
    var legacy=function(){ var b=new URLSearchParams(); llenos.forEach(function(k){ b.append(k,campos[k]); });
      b.append('hs_context',JSON.stringify({pageUrl:location.href,pageName:document.title,hutk:hutk}));
      fetch('https://forms.hubspot.com/uploads/form/v2/'+portal+'/'+formid,{method:'POST',body:b,mode:'cors'}).then(function(r){ r.ok?listo():falla(); }).catch(falla); };
    fetch('https://api.hsforms.com/submissions/v3/integration/submit/'+portal+'/'+formid,{method:'POST',mode:'cors',headers:{'Content-Type':'application/json'},body:JSON.stringify(cuerpo)})
      .then(function(r){ if(r.ok) listo(); else if(r.status===404) legacy(); else falla(); }).catch(legacy);
  }
  var NOMBRES={servicio:'Servicio',ciudad:'Ciudad',vendes:'Vende',productos:'Productos aprox.',website:'Sitio actual',anunciar:'Quiere anunciar',paquete:'Paquete',fecha:'Fecha',rubro:'Rubro'};
  var f=document.getElementById('cotiza');
  if(f) f.addEventListener('submit',function(e){ e.preventDefault(); var ok=true, d={};
    f.querySelectorAll('input').forEach(function(c){ var v=c.value.trim(); d[c.name]=v;
      var mal=(!v && c.required) || (v && (c.type==='email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) || (c.type==='tel' && v.replace(/\D/g,'').length<10) || (c.type==='url' && v.indexOf('.')<0));
      var lb=c.closest('label'); if(lb) lb.classList.toggle('lp-mal',mal); if(mal) ok=false; });
    f.querySelectorAll('select').forEach(function(c){ d[c.name]=c.value; var mal=c.required&&!c.value; c.closest('label').classList.toggle('lp-mal',mal); if(mal) ok=false; });
    f.querySelector('.lp-err').hidden=ok; if(!ok){ var m=f.querySelector('.lp-mal input,.lp-mal select'); if(m) m.focus(); return; }
    var extra=Object.keys(NOMBRES).filter(function(k){ return d[k]; }).map(function(k){ return NOMBRES[k]+': '+d[k]; });
    var u=Object.keys(utm).map(function(k){ return k+'='+utm[k]; }).join(' · ');
    var mensaje=['Landing: '+seg,'Me interesa: '+f.dataset.interes].concat(extra).concat(u?['UTM: '+u]:[]).join(' · ');
    var gracias=function(){ evento('form_submit',servicio()?{servicio:servicio()}:{}); location.href=(f.dataset.gracias||'/paginas-web/gracias/')+'?s='+encodeURIComponent(seg); };
    var porWA=function(){ f.removeAttribute('data-enviando'); window.open('https://wa.me/'+f.dataset.wa+'?text='+encodeURIComponent(f.dataset.waMsg+(d.company||d.vendes||d.website||'')+'\n'+mensaje+'\nNombre: '+d.firstname+' · '+d.email),'_blank','noopener'); f.querySelector('.lp-ok').hidden=false; };
    if(!f.dataset.hsPortal||!f.dataset.hsForm){ porWA(); return; }
    f.setAttribute('data-enviando','');
    hubspot(f.dataset.hsPortal,f.dataset.hsForm,{firstname:d.firstname,email:d.email,phone:d.phone,company:d.company,message:mensaje},gracias,porWA);
  });

  // Página de gracias
  var g=document.getElementById('lp-gracias-msg');
  if(g){ var s=new URLSearchParams(location.search).get('s'); try{ var msgs=JSON.parse(g.dataset.msgs); if(msgs[s]) g.textContent=msgs[s]; }catch(e){} seg=s||'gracias'; evento('lead_gracias',{}); }

  // Medición (solo si hay IDs; carga después de la página)
  if(MED.ga4||MED.google_ads){ window.addEventListener('load',function(){ var id=MED.ga4||MED.google_ads; var sc=document.createElement('script'); sc.async=true; sc.src='https://www.googletagmanager.com/gtag/js?id='+id; document.head.appendChild(sc);
    window.gtag=function(){ dataLayer.push(arguments); }; gtag('js',new Date()); if(MED.ga4) gtag('config',MED.ga4); if(MED.google_ads) gtag('config',MED.google_ads); }); }
})();
