
(function(){
  document.documentElement.classList.add('js');
  var MED={"ga4": "", "google_ads": "", "meta_pixel": ""}, seg=document.body.dataset.seg||'';
  window.dataLayer=window.dataLayer||[];
  function evento(n,p){ p=p||{}; p.segmento=seg; window.dataLayer.push(Object.assign({event:n},p)); if(window.gtag) window.gtag('event',n,p); }

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

  // CTA → formulario
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('[data-cta]');
    if(a){ e.preventDefault(); var pq=a.dataset.paquete; evento('cta_click',pq?{ubicacion:a.dataset.cta,paquete:pq}:{ubicacion:a.dataset.cta}); var f=document.getElementById('cotiza'); var sel=f&&f.querySelector('select[name=paquete]'); if(sel&&pq) sel.value=pq; if(f){ f.scrollIntoView({behavior:'smooth',block:'center'}); var i=f.querySelector('input'); setTimeout(function(){ if(i) i.focus({preventScroll:true}); },650); } return; }
    var w=e.target.closest&&e.target.closest('[data-wa]'); if(w) evento('whatsapp_click',{});
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
  var NOMBRES={ciudad:'Ciudad',vendes:'Vende',productos:'Productos aprox.',website:'Sitio actual',anunciar:'Quiere anunciar',paquete:'Paquete'};
  var f=document.getElementById('cotiza');
  if(f) f.addEventListener('submit',function(e){ e.preventDefault(); var ok=true, d={};
    f.querySelectorAll('input').forEach(function(c){ var v=c.value.trim(); d[c.name]=v;
      var mal=!v || (c.type==='email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) || (c.type==='tel' && v.replace(/\D/g,'').length<10) || (c.type==='url' && v.indexOf('.')<0);
      c.closest('label').classList.toggle('lp-mal',mal); if(mal) ok=false; });
    f.querySelectorAll('select').forEach(function(c){ d[c.name]=c.value; });
    f.querySelector('.lp-err').hidden=ok; if(!ok){ var m=f.querySelector('.lp-mal input'); if(m) m.focus(); return; }
    var extra=Object.keys(NOMBRES).filter(function(k){ return d[k]; }).map(function(k){ return NOMBRES[k]+': '+d[k]; });
    var u=Object.keys(utm).map(function(k){ return k+'='+utm[k]; }).join(' · ');
    var mensaje=['Landing: '+seg,'Me interesa: '+f.dataset.interes].concat(extra).concat(u?['UTM: '+u]:[]).join(' · ');
    var gracias=function(){ evento('form_submit',{}); location.href='/paginas-web/gracias/?s='+encodeURIComponent(seg); };
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
