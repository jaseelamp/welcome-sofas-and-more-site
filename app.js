'use strict';
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const config = window.SITE_CONFIG || {};
if (config.companyName) $$('[data-brand]').forEach(el => { el.setAttribute('aria-label', config.companyName); });
const nav = $('#navigation');
const menu = $('.menu-toggle');
function closeMenu() { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Open navigation'); }
menu.addEventListener('click', () => { const open = !nav.classList.contains('open'); nav.classList.toggle('open', open); menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); });
$$('a', nav).forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menu.focus(); } });
const collections = [
 {name:'Contemporary',group:'contemporary',image:'hero.jpg',sub:'Sculptural lines. Quiet confidence.',description:'Soft curves and grounded proportions create a statement without excess. Use this direction to discuss an expressive centrepiece for a considered interior.'},
 {name:'Classic',group:'classic',image:'green-sofa.jpg',sub:'Familiar forms. A fresh perspective.',description:'Tailored profiles and rich upholstery bring a timeless character to a room. Explore arm shapes, leg finishes and fabric choices in your brief.'},
 {name:'Modular',group:'modular',image:'living.jpg',sub:'A composition of your own.',description:'A flexible seating direction for changing needs. Share your layout, preferred modules and room dimensions to discuss a configuration.'},
 {name:'Luxury',group:'classic',image:'interior.jpg',sub:'Material richness. Understated presence.',description:'Layer texture, generous comfort and considered finishes. Discuss your preferred materials and the experience you want your space to create.'},
 {name:'Sectional',group:'modular',image:'lounge.jpg',sub:'Room to gather. Space to unwind.',description:'A connected seating arrangement for generous spaces. Include orientation, circulation routes and seat count when preparing your project requirements.'},
 {name:'Bespoke',group:'bespoke',image:'craft.jpg',sub:'An individual point of view.',description:'Start with your own dimensions, inspiration and material preferences. Feasibility, technical drawings and specification are subject to review.'}
];
const grid = $('#collection-grid');
function renderCollections(filter = 'all') {
 grid.replaceChildren();
 collections.forEach((c, i) => { if (filter !== 'all' && c.group !== filter) return;
 const article = document.createElement('article'); article.className='collection-card';
 article.innerHTML = `<button type="button" aria-label="Explore ${c.name} direction"><div class="picture"><img src="assets/${c.image}" alt="${c.name} furniture reference" loading="lazy" width="1400" height="933"><span class="number">0${i+1}</span></div><div class="card-line"><div><h3>${c.name}</h3><p>${c.sub}</p></div><span aria-hidden="true">↗</span></div></button>`;
 $('button', article).addEventListener('click', () => openCollection(c));grid.append(article);
 });
}
if(grid) renderCollections();
$$('[data-filter]').forEach(button => button.addEventListener('click', () => { $$('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b === button))); renderCollections(button.dataset.filter); }));
const collectionDialog = $('#collection-dialog');
function openCollection(c) { $('#dialog-image').src=`assets/${c.image}`; $('#dialog-image').alt=`${c.name} illustrative furniture direction`; $('#dialog-title').textContent=c.name; $('#dialog-description').textContent=c.description; $('#dialog-enquire').dataset.collection=c.name; collectionDialog.showModal(); }
$$('dialog').forEach(dialog => { $('.dialog-close',dialog).addEventListener('click',()=>dialog.close()); dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect(); if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}}); });
function enquiryURL(values={}) { return 'enquire.html?'+new URLSearchParams(values).toString()+'#enquire'; }
$('#dialog-enquire')?.addEventListener('click', () => { const name=$('#dialog-enquire').dataset.collection; $('#dialog-enquire').href=enquiryURL({interest:'Custom sofa requirements',collection:name}); });
$$('[data-enquiry]').forEach(a=>{a.href=enquiryURL({interest:a.dataset.enquiry});a.addEventListener('click',()=>{a.href=enquiryURL({interest:a.dataset.enquiry,material:$('#material-name')?.textContent||''});});});
const projects=[
 {type:'RESIDENTIAL INSPIRATION',title:'The art of living well.',image:'living.jpg',alt:'Open-plan contemporary home with generous seating',enquiry:'Custom sofa requirements'},
 {type:'HOSPITALITY MOOD REFERENCE',title:'An invitation to stay.',image:'hero.jpg',alt:'Illustrative lounge setting with sculptural ivory sofa',enquiry:'Hospitality & commercial project'},
 {type:'COMMERCIAL MOOD REFERENCE',title:'Space for connection.',image:'lounge.jpg',alt:'Architectural interior reference with warm wood and concrete',enquiry:'Hospitality & commercial project'},
 {type:'RETAIL MOOD REFERENCE',title:'A considered point of view.',image:'green-sofa.jpg',alt:'Green sofa as a retail display inspiration',enquiry:'Wholesale & dealer enquiry'}
];
$$('[data-project]').forEach(b=>b.addEventListener('click',()=>{const p=projects[Number(b.dataset.project)];$('#project-image').src=`assets/${p.image}`;$('#project-image').alt=p.alt;$('#project-type').textContent=p.type;$('#project-title').textContent=p.title;$('#project-enquiry').dataset.enquiry=p.enquiry;$('#project-enquiry').setAttribute('aria-label',`Discuss ${p.type.toLowerCase()}`);$$('[data-project]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));}));
const materials={'Natural linen':'A relaxed, textured direction with soft tonal variation and an understated, natural feel.','Ivory bouclé':'A soft, looped texture that brings depth and a sculptural character to rounded forms.','Forest velvet':'A rich green direction with a gentle sheen, bringing depth to clean, tailored silhouettes.','Cognac leather':'A warm, expressive material direction. Confirm leather type, finish and care requirements.','Wine weave':'A deep red textile direction that adds a confident, warm accent to a neutral interior.'};
$$('[data-material]').forEach(b=>b.addEventListener('click',()=>{const name=b.dataset.material;$('#material-name').textContent=name;$('#material-text').textContent=materials[name];if($('#material')) $('#material').value=name;$$('[data-material]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));}));
$('#material')?.addEventListener('change',()=>{const b=$$('[data-material]').find(b=>b.dataset.material===$('#material').value);if(b)b.click();});
$$('[data-policy]').forEach(b=>b.addEventListener('click',()=>$('#privacy-dialog').showModal()));
const form=$('#enquiry-form');const status=$('#form-status');const submit=$('#submit-button');
// An endpoint and business-specific privacy notice are both needed before collecting personal data.
let endpoint=null;
if(config.enquiryEndpoint && config.privacyNotice){try{const u=new URL(config.enquiryEndpoint,location.origin);if(u.protocol==='https:'||u.origin===location.origin)endpoint=u.href;}catch{}}
if(endpoint&&form){$('#form-note').textContent='Share your requirements using this form. Required fields help the team respond to your enquiry.';$('.preview-note strong').textContent='Your project enquiry';submit.innerHTML='Send enquiry <span>↗</span>';$('#privacy-text').textContent=config.privacyNotice;}
form?.addEventListener('submit',async e=>{e.preventDefault();if(!form.reportValidity())return;const values=Object.fromEntries(new FormData(form));if(values.website)return;if(window.BulkSelection) values.bulkSchedule=window.BulkSelection.text();
if(!values.name.trim()||!values.company.trim()||!values.location.trim()||values.message.trim().length<15){status.className='full error';status.textContent='Please enter your name, company, delivery location and at least 15 characters describing your order.';return;}
status.className='full';status.textContent='';
if(!endpoint){const lines=['WELCOME SOFAS AND MORE — WHOLESALE ENQUIRY','Prepared locally — not sent','',...Object.entries(values).filter(([k])=>!['website','consent'].includes(k)).map(([k,v])=>`${k.toUpperCase()}: ${v||'Not specified'}`),'','Reference styles and materials are illustrative. Final specifications require confirmation.'];const blob=new Blob([lines.join('\n\n')],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='furniture-project-brief.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);status.className='full success';status.textContent='Your enquiry brief has been downloaded. It has not been sent; keep it ready to share when business contact details are available.';return;}
submit.disabled=true;submit.textContent='Sending…';const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),15000);
try{const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({...values,consent:true,source:'website',schemaVersion:1}),signal:controller.signal});if(!response.ok)throw new Error('Submission rejected');const result=await response.json();if(result.ok!==true)throw new Error('No delivery confirmation');status.className='full success';status.textContent='Thank you. Your enquiry has been received.';form.reset();}catch{status.className='full error';status.textContent='We could not confirm receipt of your enquiry. Your entries are still here. Please try again later.';}finally{clearTimeout(timeout);submit.disabled=false;submit.innerHTML='Send enquiry <span>↗</span>';}});

// Project direction planner: all choices remain in this page until used in a brief.
const planner = {space:'Retail',priority:'Sculptural form',seats:25};
const plannerDirections = {
 'Sculptural form': {name:'Contemporary',image:'hero.jpg',advice:'Explore a contemporary sofa range. Include model dimensions, quantity by configuration and upholstery references in your enquiry.'},
 'Flexible layout': {name:'Modular',image:'living.jpg',advice:'Explore modular sofa configurations for your assortment or project. Specify quantities per module, layouts and upholstery requirements.'},
 'Tailored character': {name:'Classic',image:'green-sofa.jpg',advice:'Explore a tailored sofa range. Specify arm profiles, leg finishes, cushion requirements and upholstery details for each model.'}
};
const motionPreference=window.matchMedia('(prefers-reduced-motion: reduce)');
function animateImage(img){if(motionPreference.matches)return;img.classList.remove('image-transition');requestAnimationFrame(()=>requestAnimationFrame(()=>img.classList.add('image-transition')));}
function updatePlanner(){const d=plannerDirections[planner.priority];$('#planner-title').textContent=`${d.name} · ${planner.seats} units`;$('#planner-advice').textContent=d.advice+(planner.space==='Hospitality'?' For hospitality, include use intensity, cleaning requirements and applicable performance standards.':planner.space==='Retail'?' For retail, include the proposed assortment, quantities and sample requirements.':' For project procurement, include room-wise quantities and phased delivery requirements.');const img=$('#planner-image');if(!img.src.endsWith(d.image)){img.src=`assets/${d.image}`;img.alt=`${d.name} design reference`;animateImage(img);}$('#seat-output').value=planner.seats;$('#planner-status').textContent='';}
for(const [attribute,key] of [['space','space'],['priority','priority']]){$$(`[data-${attribute}]`).forEach(b=>b.addEventListener('click',()=>{planner[key]=b.dataset[attribute];$$(`[data-${attribute}]`).forEach(x=>x.setAttribute('aria-pressed',String(x===b)));updatePlanner();}));}
$('#planner-seats')?.addEventListener('input',e=>{planner.seats=Number(e.target.value);updatePlanner();});
$('#planner-apply')?.addEventListener('click',()=>{$('#planner-apply').href=enquiryURL({space:planner.space,priority:planner.priority,units:String(planner.seats)});});
// Only non-personal design selections travel in URLs. Never place enquiry contact fields in URLs.
if(form){
 const params=new URLSearchParams(location.search);
 const validInterest=[...$('#interest').options].map(o=>o.value);
 const interest=params.get('interest');if(validInterest.includes(interest))$('#interest').value=interest;
 const material=params.get('material');if(Object.hasOwn(materials,material))$('#material').value=material;
 const collection=params.get('collection');if(collections.some(c=>c.name===collection))$('#message').value=`I would like to discuss the ${collection.toLowerCase()} direction for my project.`;
 const space=params.get('space'),priority=params.get('priority'),units=Number(params.get('units'));
 if(['Projects','Hospitality','Retail'].includes(space)&&Object.hasOwn(plannerDirections,priority)&&Number.isInteger(units)&&units>=5&&units<=200&&units%5===0){$('#message').value=`Design direction: ${plannerDirections[priority].name}. Space: ${space}. Priority: ${priority}. Estimated sofa units: ${units}.`;$('#interest').value=space==='Hospitality'?'Hospitality & commercial project':space==='Retail'?'Wholesale & dealer enquiry':'Interior designer & architect partnership';$('#quantity').value=units<=5?'1–5 pieces':units<=20?'6–20 pieces':units<=50?'21–50 pieces':units<=100?'51–100 pieces':'101–200 pieces';$('#buyer-type').value=space==='Retail'?'Furniture dealer / retailer':space==='Hospitality'?'Hospitality / developer':'Interior / procurement firm';}
}
// One-shot reveals preserve full content for reduced-motion users and without JS.
const revealTargets=$$('.discover-grid>a,.section-heading,.philosophy-layout,.statement-image,.craft-copy,.partnership-layout,.material-copy,.specifications>div,.journal-grid article,.planner-layout,.process-story li,.enquiry-intro');
let revealObserver;
function configureReveals(){revealObserver?.disconnect();if(motionPreference.matches||!('IntersectionObserver' in window)){revealTargets.forEach(el=>el.classList.remove('reveal-pending'));return;}revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target);}}),{threshold:.08,rootMargin:'0px 0px 24px 0px'});revealTargets.forEach(el=>{if(el.getBoundingClientRect().top>innerHeight){el.classList.add('reveal-pending');revealObserver.observe(el);}});}
configureReveals();motionPreference.addEventListener('change',configureReveals);
// Animate existing selectors without replacing their behavior.
$$('[data-project]').forEach(b=>b.addEventListener('click',()=>animateImage($('#project-image'))));
let scrollScheduled=false;
function updateReading(){const max=document.documentElement.scrollHeight-innerHeight;$('.reading-progress').style.transform=`scaleX(${max>0?Math.min(1,Math.max(0,scrollY/max)):0})`;$('.header').classList.toggle('has-scrolled',scrollY>20);scrollScheduled=false;}
window.addEventListener('scroll',()=>{if(!scrollScheduled){scrollScheduled=true;requestAnimationFrame(updateReading);}},{passive:true});window.addEventListener('resize',updateReading);updateReading();
