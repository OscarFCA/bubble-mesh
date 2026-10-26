
window.BMPRE=(function(){ var l=document.querySelector('link[href$="studio.css"]'); return l? l.getAttribute('href').replace('studio.css','') : ''; })();
(function(){
  // Videos que solo bajan cuando se ven (data-src)
  var vs=document.querySelectorAll('video[data-src]'); if(!vs.length||!('IntersectionObserver' in window)) return;
  var io=new IntersectionObserver(function(es){ es.forEach(function(e){ var v=e.target;
    if(e.isIntersecting){ if(!v.src){ var ds=v.getAttribute('data-src'); v.src=/^\.\.\//.test(ds)?ds:window.BMPRE+ds; } v.muted=true; var p=v.play(); if(p&&p.catch) p.catch(function(){}); }
    else if(v.src) v.pause(); }); },{rootMargin:'200px'});
  vs.forEach(function(v){ io.observe(v); });
})();
(function(){
  // Menús del header
  function cerrarmenus(salvo){ document.querySelectorAll('.bm-drop-btn').forEach(function(b){ if(b!==salvo){ b.setAttribute('aria-expanded','false'); var p=document.getElementById(b.getAttribute('aria-controls')); if(p) p.hidden=true; } }); }
  document.addEventListener('click',function(e){
    var b=e.target.closest('.bm-drop-btn');
    if(b){ var abierto=b.getAttribute('aria-expanded')==='true'; cerrarmenus(b); b.setAttribute('aria-expanded',abierto?'false':'true'); document.getElementById(b.getAttribute('aria-controls')).hidden=abierto; return; }
    var g=e.target.closest('.bm-burger');
    if(g){ var m=document.getElementById('bm-movil'); var ab=g.getAttribute('aria-expanded')==='true'; g.setAttribute('aria-expanded',ab?'false':'true'); m.hidden=ab; return; }
    if(!e.target.closest('.bm-drop')) cerrarmenus();
  });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape') cerrarmenus(); });

  // Efecto al pasar el mouse (style-hover de la plantilla original)
  document.addEventListener('mouseover',function(e){ var el=e.target.closest('[data-hover]'); if(!el||el.dataset.base!==undefined) return; el.dataset.base=el.getAttribute('style')||''; el.setAttribute('style',el.dataset.base+';'+el.dataset.hover);
    el.addEventListener('mouseleave',function f(){ el.setAttribute('style',el.dataset.base); delete el.dataset.base; el.removeEventListener('mouseleave',f); }); });

  // Medición: dataLayer siempre; GA4, Google Ads y Meta solo con IDs y consentimiento
  window.dataLayer=window.dataLayer||[];
  function evento(nombre,params){ params=params||{}; window.dataLayer.push(Object.assign({event:nombre},params)); if(window.gtag) window.gtag('event',nombre,params); if(window.fbq && /whatsapp_click|arma_paquete_enviar|form_submit/.test(nombre)) window.fbq('track', nombre==='form_submit'?'Lead':'Contact'); }
  window.bmEvento=evento;
  document.addEventListener('click',function(e){
    var a=e.target.closest('a[href*="wa.me/"]');
    if(a){ var s=a.closest('section,header,footer'); evento('whatsapp_click',{producto:document.body.dataset.producto||'general',seccion:s?(s.id||s.tagName.toLowerCase()):'otro'}); }
    var d=e.target.closest('[data-evento]');
    if(d){ var p=d.dataset.evento.split(':'); var o={}; o[p[0]==='paquete_click'?'paquete':'campana']=p[1]||''; evento(p[0],o); }
  },true);
  function medir(){
    var m=window.BM_MEDICION||{};
    if(m.ga4||m.google_ads){ var s=document.createElement('script'); s.async=true; s.src='https://www.googletagmanager.com/gtag/js?id='+(m.ga4||m.google_ads); document.head.appendChild(s);
      window.gtag=function(){ window.dataLayer.push(arguments); }; window.gtag('js',new Date()); if(m.ga4) window.gtag('config',m.ga4); if(m.google_ads) window.gtag('config',m.google_ads); }
    if(m.meta_pixel){ !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js'); window.fbq('init',m.meta_pixel); window.fbq('track','PageView'); }
  }
  var galleta=null; try{ galleta=localStorage.getItem('bm-cookies'); }catch(e){}
  if(galleta==='si') medir();
  var banner=document.getElementById('bm-cookies');
  if(banner && !galleta) banner.hidden=false;
  document.addEventListener('click',function(e){ var c=e.target.closest('[data-cookies]'); if(!c) return; var v=c.dataset.cookies; try{ localStorage.setItem('bm-cookies',v); }catch(er){} banner.hidden=true; if(v==='si') medir(); });

  // CTA → formulario de cotización (si la página no lo tiene, Contacto)
  function irACotiza(interes,detalle,reiniciar){
    var t=document.getElementById('cotiza'); if(!t){ location.href='contacto.html#cotiza'; return; }
    var f=t.tagName==='FORM'?t:t.querySelector('form'); if(!f) return;
    var sel=f.querySelector('select[name=interes],select[name=producto]');
    if(sel && reiniciar) sel.value='';
    if(sel && interes){ [].forEach.call(sel.options,function(o){ if(o.text===interes||o.value===interes) sel.value=o.value; }); }
    var d=f.querySelector('input[name=detalle]'), pd=f.querySelector('.bm-hs-detalle');
    if(d){ d.value=detalle||''; } if(pd){ pd.textContent=detalle||''; pd.hidden=!detalle; }
    t.scrollIntoView({behavior:'smooth',block:'start'});
    var n=f.querySelector('input:not([type=hidden])'); if(n) setTimeout(function(){ n.focus({preventScroll:true}); },600);
    evento('cta_cotiza',{producto:interes||'',seccion:detalle||''});
  }
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('[data-cotiza]'); if(!a) return;
    e.preventDefault(); var m=document.getElementById('bm-movil'); if(m&&!m.hidden){ m.hidden=true; var g=document.querySelector('.bm-burger'); if(g) g.setAttribute('aria-expanded','false'); }
    irACotiza(a.dataset.cotiza,a.dataset.detalle);
  });
  if(location.hash==='#cotiza') setTimeout(function(){ irACotiza('',''); },300);

  // Banda de temporada según la fecha del visitante
  var hoy=new Date(); var iso=hoy.getFullYear()+'-'+String(hoy.getMonth()+1).padStart(2,'0')+'-'+String(hoy.getDate()).padStart(2,'0');
  document.querySelectorAll('[data-desde][data-hasta]').forEach(function(el){ el.hidden=!(iso>=el.dataset.desde && iso<=el.dataset.hasta); });

  // Arma tu paquete → formulario con las opciones marcadas
  var arma=document.getElementById('bm-arma');
  if(arma) arma.addEventListener('submit',function(e){ e.preventDefault(); var ops=[].slice.call(arma.querySelectorAll('input:checked')).map(function(i){return i.value;});
    var err=arma.querySelector('.bm-arma-error'); if(!ops.length){ err.hidden=false; return; } err.hidden=true;
    evento('arma_paquete_enviar',{opciones:ops.join(', ')});
    var mapa={'Comercial con IA':'Comercial con IA','Campaña en Google':'Comercial con IA','Videoclip':'Videoclip','Video inmobiliario':'Video inmobiliario'};
    var ints=ops.map(function(o){ return mapa[o]||'Página web con WhatsApp'; }).filter(function(v,i,a){ return a.indexOf(v)===i; });
    irACotiza(ints.length===1?ints[0]:'', (arma.dataset.lpaq||'Paquete')+': '+ops.join(', '), true); });

  // HubSpot: endpoint legacy (acepta formularios del editor nuevo y CORS). Sin IDs → WhatsApp.
  function cookie(n){ var m=document.cookie.match('(?:^|; )'+n+'=([^;]*)'); return m?decodeURIComponent(m[1]):''; }
  // Primero la API v3 que recomienda HubSpot (JSON); si responde 404 —pasa con formularios del editor nuevo,
  // como en APC— se reintenta en el endpoint legacy. Éxito solo cuando HubSpot confirma.
  function hubspot(portal,formid,campos,listo,falla){
    var hutk=cookie('hubspotutk'), llenos=Object.keys(campos).filter(function(k){ return campos[k]; });
    var v3={fields:llenos.map(function(k){ return {objectTypeId:'0-1',name:k,value:campos[k]}; }),context:{pageUri:location.href,pageName:document.title}};
    if(hutk) v3.context.hutk=hutk;
    var legacy=function(){
      var b=new URLSearchParams(); llenos.forEach(function(k){ b.append(k,campos[k]); });
      b.append('hs_context',JSON.stringify({pageUrl:location.href,pageName:document.title,hutk:hutk}));
      fetch('https://forms.hubspot.com/uploads/form/v2/'+portal+'/'+formid,{method:'POST',body:b,mode:'cors'})
        .then(function(r){ if(r.ok) listo(); else falla(); }).catch(falla);
    };
    fetch('https://api.hsforms.com/submissions/v3/integration/submit/'+portal+'/'+formid,{method:'POST',mode:'cors',headers:{'Content-Type':'application/json'},body:JSON.stringify(v3)})
      .then(function(r){ if(r.ok) listo(); else if(r.status===404) legacy(); else falla(); }).catch(legacy);
  }
  document.querySelectorAll('form.bm-hs').forEach(function(f){
    f.addEventListener('submit',function(e){ e.preventDefault();
      var d={}; new FormData(f).forEach(function(v,k){ d[k]=String(v).trim(); });
      var mal=!d.firstname || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email); f.querySelector('.bm-err').hidden=!mal; if(mal) return;
      evento('form_submit',{producto:d.interes||'',origen:'formulario_corto'});
      var porWA=function(){ window.open('https://wa.me/'+f.dataset.wa+'?text='+encodeURIComponent(f.dataset.pre+'\n'+f.dataset.lnom+': '+d.firstname+'\n'+f.dataset.lcor+': '+d.email+(d.phone?'\nWhatsApp: '+d.phone:'')+(d.interes?'\n'+f.dataset.lint+': '+d.interes:'')+(d.detalle?'\n'+d.detalle:'')),'_blank','noopener'); };
      var hecho=function(){ f.removeAttribute('data-enviando'); f.querySelector('.bm-form-ok').hidden=false; f.querySelector('.bm-hs-campos').hidden=true; f.querySelector('button').hidden=true; };
      if(!f.dataset.hsPortal||!f.dataset.hsForm){ porWA(); hecho(); return; }
      f.setAttribute('data-enviando','');
      hubspot(f.dataset.hsPortal,f.dataset.hsForm,{firstname:d.firstname,email:d.email,phone:d.phone,message:[d.interes&&f.dataset.lint+': '+d.interes,d.detalle,document.title].filter(Boolean).join(' · ')},hecho,function(){ porWA(); hecho(); });
    });
  });

  // Formulario de contacto → HubSpot (o WhatsApp con los datos mientras no haya IDs)
  var form=document.getElementById('bm-contacto');
  if(form) form.addEventListener('submit',function(e){ e.preventDefault(); var ok=true;
    form.querySelectorAll('[data-req]').forEach(function(c){ var v=c.value.trim(); var mal=!v || (c.name==='whatsapp' && v.replace(/\D/g,'').length!==10) || (c.name==='email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)); var m=form.querySelector('[data-err="'+c.name+'"]'); if(m) m.hidden=!mal; if(mal) ok=false; });
    if(!ok) return; var d={}; new FormData(form).forEach(function(v,k){ d[k]=v; });
    evento('form_submit',{producto:d.producto||'',presupuesto:d.presupuesto||''});
    var txt=form.dataset.pre+'\n'+form.dataset.lnom+': '+d.nombre+'\n'+form.dataset.lneg+': '+d.negocio+'\n'+form.dataset.lpro+': '+d.producto+(d.presupuesto?'\n'+form.dataset.lpre+': '+d.presupuesto:'')+(d.fecha?'\n'+form.dataset.lfec+': '+d.fecha:'');
    var ok2=function(){ form.querySelector('.bm-form-ok').hidden=false; };
    var porWA=function(){ window.open('https://wa.me/'+form.dataset.wa+'?text='+encodeURIComponent(txt),'_blank','noopener'); ok2(); };
    if(!form.dataset.hsPortal||!form.dataset.hsForm){ porWA(); return; }
    var okHS=form.querySelector('.bm-form-ok'); okHS.textContent=okHS.dataset.hs||okHS.textContent;
    hubspot(form.dataset.hsPortal,form.dataset.hsForm,{firstname:d.nombre,email:d.email,phone:d.whatsapp,company:d.negocio,
      message:[form.dataset.lpro+': '+d.producto,d.presupuesto&&form.dataset.lpre+': '+d.presupuesto,d.fecha&&form.dataset.lfec+': '+d.fecha,d.detalle].filter(Boolean).join(' · ')},ok2,porWA); });

  // Filtros de Trabajo
  document.addEventListener('click',function(e){ var f=e.target.closest('[data-filtro]'); if(!f) return; var v=f.dataset.filtro;
    document.querySelectorAll('[data-filtro]').forEach(function(b){ b.setAttribute('aria-pressed', b===f?'true':'false'); });
    var todos=(v===document.querySelector('[data-filtro]').dataset.filtro);
    document.querySelectorAll('.bm-trab-item').forEach(function(it){ it.hidden = !(todos || it.dataset.producto===v); }); });

  // Reel completo: se abre en el visor; el bloque de video de abajo lo arranca por HLS
  document.addEventListener('click',function(e){
    var r=e.target.closest('[data-reel-abrir]'); if(!r) return;
    var dentro=e.target.closest('a,button,input,label,summary');
    if(dentro && dentro!==r && !dentro.hasAttribute('data-reel-abrir')) return;
    var pre=window.BMPRE;
    var lb=document.createElement('div'); lb.className='bm-lb'; lb.setAttribute('role','dialog'); lb.setAttribute('aria-modal','true');
    lb.innerHTML='<button type="button">'+(document.documentElement.lang==='en'?'Close':'Cerrar')+' ✕</button><video data-reel controls playsinline></video>';
    var v=lb.querySelector('video'); v.dataset.src=pre+'media/showreel.mp4'; v.dataset.hls=pre+'media/showreel-hls/master.m3u8'; v.poster=pre+'media/showreel.webp';
    function cerrar(){ v.pause(); lb.remove(); document.body.style.overflow=''; document.removeEventListener('keydown',tecla); }
    function tecla(ev){ if(ev.key==='Escape') cerrar(); }
    lb.addEventListener('click',function(ev){ if(ev.target===lb||ev.target.tagName==='BUTTON') cerrar(); });
    document.addEventListener('keydown',tecla); document.body.appendChild(lb); document.body.style.overflow='hidden';
    window.bmEvento && window.bmEvento('reel_open',{});
  });

  // Comparador antes / después
  document.querySelectorAll('.bm-cmp2 input').forEach(function(r){ r.addEventListener('input',function(){ var c=r.closest('.bm-cmp2'); c.querySelector('.bm-cmp2-a').style.clipPath='inset(0 '+(100-r.value)+'% 0 0)'; c.querySelector('.bm-cmp2-m').style.left=r.value+'%'; }); });
})();

(function(){
  // Nombres en minúscula: support.js toma "<espacio>camelCase=" por atributo y rompe el script
  var abierto=false, clic=0, hlsvivo=null, cola=null;
  var hd = window.innerWidth >= 1024;  // escritorio: hero 1080p; celular: 720p
  function play(v){ var p=v.play(); if(p&&p.catch) p.catch(function(){}); }
  // Con sonido; si el navegador lo bloquea, arranca sin sonido en vez de quedarse detenido
  function playaudio(v){ var p=v.play(); if(p&&p.catch) p.catch(function(){ v.muted=true; play(v); }); }

  // HostGator limita las descargas simultáneas por visitante: al abrir un video se
  // corta la descarga del hero y de los loops, y al cerrarlo siguen donde iban
  function pausar(){
    document.querySelectorAll('video[data-hero],video[data-loop]').forEach(function(v){
      if(v.bmhls){ v.pause(); v.bmhls.stopLoad(); v.dataset.parado='1'; return; }
      if(!v.getAttribute('src')) return;
      v.dataset.prev=v.getAttribute('src'); v.dataset.t=v.currentTime;
      v.pause(); v.removeAttribute('src'); v.load();
    });
  }
  function reanudar(){
    abierto=false;
    document.querySelectorAll('video[data-hero],video[data-loop]').forEach(function(v){
      if(v.bmhls && v.dataset.parado){ delete v.dataset.parado; v.bmhls.startLoad(); v.muted=true; play(v); return; }
      if(!v.dataset.prev) return;
      v.src=v.dataset.prev; var t=+v.dataset.t||0; delete v.dataset.prev;
      v.addEventListener('loadedmetadata',function(){ try{ v.currentTime=t; }catch(e){} },{once:true});
      v.muted=true; play(v);
    });
  }

  // Visor de video: cualquier elemento con data-video="media/..." lo abre
  function abrir(src){
    abierto='visor'; pausar();
    var lb=document.createElement('div'); lb.className='bm-lb'; lb.setAttribute('role','dialog'); lb.setAttribute('aria-modal','true');
    lb.innerHTML='<button type="button">'+(document.documentElement.lang==='en'?'Close':'Cerrar')+' ✕</button><video controls autoplay playsinline></video>';
    var v=lb.querySelector('video'); v.src=src; v.poster=src.replace(/\.mp4$/,'.webp'); playaudio(v);
    function cerrar(){ v.pause(); v.removeAttribute('src'); v.load(); lb.remove(); document.body.style.overflow=''; document.removeEventListener('keydown',tecla); reanudar(); }
    function tecla(e){ if(e.key==='Escape') cerrar(); }
    lb.addEventListener('click',function(e){ if(e.target===lb||e.target.tagName==='BUTTON') cerrar(); });
    document.addEventListener('keydown',tecla);
    document.body.appendChild(lb); document.body.style.overflow='hidden';
  }
  // Visor de imágenes (storyboards y hojas de personaje): data-imagen="assets/..."
  function abririmg(src){
    abierto='visor';
    var lb=document.createElement('div'); lb.className='bm-lb'; lb.setAttribute('role','dialog'); lb.setAttribute('aria-modal','true');
    lb.innerHTML='<button type="button">'+(document.documentElement.lang==='en'?'Close':'Cerrar')+' ✕</button><img alt="">';
    // Primero la miniatura (ya está en caché) y después la versión grande cuando termine de bajar
    var im=lb.querySelector('img'), chica=src.replace(/\.webp$/,'-t.webp'), grande=new Image();
    im.src=chica; im.onerror=function(){ im.onerror=null; im.src=src; };
    grande.onload=function(){ im.src=src; }; grande.src=src;
    function cerrar(){ lb.remove(); document.body.style.overflow=''; document.removeEventListener('keydown',tecla); abierto=false; }
    function tecla(e){ if(e.key==='Escape') cerrar(); }
    lb.addEventListener('click',function(e){ if(e.target===lb||e.target.tagName==='BUTTON'||e.target.tagName==='IMG') cerrar(); });
    document.addEventListener('keydown',tecla);
    document.body.appendChild(lb); document.body.style.overflow='hidden';
  }
  document.addEventListener('click',function(e){
    clic=Date.now();
    var im=e.target.closest&&e.target.closest('[data-imagen]');
    if(im){ e.preventDefault(); e.stopPropagation(); abririmg(im.getAttribute('data-imagen')); return; }
    var t=e.target.closest&&e.target.closest('[data-video]'); if(!t) return;
    var src=t.getAttribute('data-video')||''; if(!/^(\.\.\/)?media\//.test(src)) return;
    e.preventDefault(); e.stopPropagation(); abrir(src);
  },true);

  function cargarhls(cb){
    if(window.Hls) return cb();
    if(cola) return cola.push(cb);
    cola=[cb]; var sc=document.createElement('script');
    sc.src='https://cdn.jsdelivr.net/npm/hls.js@1.5.20/dist/hls.min.js';
    sc.onload=sc.onerror=function(){ cola.forEach(function(f){ f(); }); };
    document.head.appendChild(sc);
  }
  // Reel: solo se descarga tras el clic que lo abre (la plantilla sin hidratar también
  // trae el <video>, y sin esta guarda se pedía al cargar la página)
  function reel(){
    if(Date.now()-clic>2000) return;
    document.querySelectorAll('video[data-reel]').forEach(function(v){
      if(v.dataset.on) return; v.dataset.on='1';
      abierto='reel'; pausar();
      // HLS adaptativo: la calidad sube o baja según la conexión del visitante
      cargarhls(function(){
        if(window.Hls && window.Hls.isSupported()){ var h=new window.Hls({capLevelToPlayerSize:true}); h.loadSource(v.dataset.hls); h.attachMedia(v); hlsvivo=h; playaudio(v); }
        else if(v.canPlayType('application/vnd.apple.mpegurl')){ v.src=v.dataset.hls; playaudio(v); }
        else { v.src=v.dataset.src; playaudio(v); }
      });
    });
  }
  // El modal del reel lo pinta React justo después del clic: se busca dentro del
  // mismo gesto para que el navegador permita el audio
  document.addEventListener('click',function(){ reel(); setTimeout(reel,0); setTimeout(reel,60); setTimeout(reel,250); },true);

  function iniciarhero(v){
    cargarhls(function(){
      if(window.Hls && window.Hls.isSupported()){
        var h=new window.Hls({maxBufferLength:8,maxMaxBufferLength:12,capLevelToPlayerSize:true});
        h.loadSource(window.BMPRE+'media/hero-hls/master.m3u8'); h.attachMedia(v); v.bmhls=h;
        if(abierto){ h.stopLoad(); v.dataset.parado='1'; } else play(v);
      }
      else if(v.canPlayType('application/vnd.apple.mpegurl')){ v.src=window.BMPRE+'media/hero-hls/master.m3u8'; play(v); }
      else { v.src = hd ? window.BMPRE+'media/hero-1080.mp4' : window.BMPRE+'media/hero.mp4'; play(v); }
    });
  }
  function revisar(){
    // React cerró el modal del reel: se libera HLS y vuelve el hero
    if(abierto==='reel' && !document.querySelector('video[data-reel][data-on]')){
      if(hlsvivo){ hlsvivo.destroy(); hlsvivo=null; }
      reanudar();
    }
    if(abierto) return reel();
    // React no pone el atributo muted: sin él, iOS no reproduce el hero solo
    document.querySelectorAll('video[data-hero]').forEach(function(v){
      v.muted=true;
      // Espera a que cargue la página y baja por segmentos con buffer corto (8-12 s):
      // HostGator sirve todo por una conexión HTTP/2 y un MP4 completo la acapararía
      if(document.readyState==='complete' && !v.dataset.on){ v.dataset.on='1'; iniciarhero(v); }
      else if(v.paused && (v.bmhls || v.getAttribute('src'))) play(v);
    });
    // Loops silenciosos de fondo (tarjetas grandes)
    document.querySelectorAll('video[data-loop]').forEach(function(v){ v.muted=true; if(v.paused && v.getAttribute('src')) play(v); });
    reel();
  }
  new MutationObserver(revisar).observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('DOMContentLoaded',revisar);
  window.addEventListener('load',function(){ setTimeout(revisar,300); });
})();
