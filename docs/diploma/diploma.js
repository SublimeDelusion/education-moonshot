const el = (tag, text, cls) => { const n = document.createElement(tag); if (text) n.textContent = text; if (cls) n.className = cls; return n; };
let data;
const $ = id => document.getElementById(id);
function show(view) {
  for (const name of ['knowledge','people','work']) $(name).hidden = name !== view;
  document.querySelectorAll('.tabs button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === view)));
}
function proofButtons(ids) {
  const wrap = el('div', '', 'proof-links');
  for (const id of ids) {
    const record = data.evidence.find(e => e.id === id); if (!record) continue;
    const b = el('button', record.title); b.type = 'button'; b.addEventListener('click', () => openEvidence(id)); wrap.append(b);
  } return wrap;
}
function openEvidence(id, focus = true) {
  const r = data.evidence.find(e => e.id === id); if (!r) return;
  show('work'); const box = $('evidence-detail'); box.replaceChildren(el('p', r.kind + ' · ' + r.company, 'eyebrow'), el('h3', r.title));
  for (const [key,label] of [['contribution',"Alex's contribution"],['decision','Decision and reasoning'],['result','Illustrative outcome'],['limits','Limits of this evidence']]) {
    box.append(el('h4',label),el('p',r[key],key==='limits'?'limits':''));
  }
  box.append(el('h4','Evidence packet outline'));
  const ul = el('ul'); r.artifacts.forEach(a => ul.append(el('li',a))); box.append(ul,el('p','These are authored specimen summaries. Underlying code, test logs, and research papers have not yet been created.','muted'));
  history.replaceState(null,'','#proof-' + id);
  if (focus) { box.focus({preventScroll:true}); box.scrollIntoView({block:'start'}); }
}
function selectSkill(id) {
  const s = data.skills.find(s => s.id === id);
  document.querySelectorAll('.skill').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.skill===id)));
  $('skill-detail').replaceChildren(el('h3',s.name + ' · ' + s.depth),el('p',s.summary),proofButtons(s.proof));
}
function renderKnowledge() {
  // Radial geometry illustrates categorical depth only; values are fictional.
  const ns='http://www.w3.org/2000/svg', svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 500 420');svg.setAttribute('class','radar');svg.setAttribute('role','img');svg.setAttribute('aria-label','Illustrative knowledge-depth map. Electronics: specialization. Mechanical engineering, controls, and delivery: integration. Coding and business: application.');
  const point=(i,r)=>[250+Math.cos(i*Math.PI/3-Math.PI/2)*r,210+Math.sin(i*Math.PI/3-Math.PI/2)*r];
  for(let level=1;level<=4;level++){const polygon=document.createElementNS(ns,'polygon');polygon.setAttribute('points',data.skills.map((s,i)=>point(i,level*38).join(',')).join(' '));polygon.setAttribute('fill','none');polygon.setAttribute('stroke','#304359');svg.append(polygon);}
  data.skills.forEach((s,i)=>{const a=point(i,s.level*38),b=point((i+1)%6,data.skills[(i+1)%6].level*38);const poly=document.createElementNS(ns,'polygon');poly.setAttribute('points','250,210 '+a.join(',')+' '+b.join(','));poly.setAttribute('fill',s.color);poly.setAttribute('fill-opacity','.8');svg.append(poly);const label=document.createElementNS(ns,'text'),p=point(i,180);label.setAttribute('x',p[0]);label.setAttribute('y',p[1]);label.setAttribute('text-anchor','middle');label.setAttribute('fill',s.color);label.setAttribute('font-size','13');label.textContent=['Electronics','Mechanical','Controls','Coding','Business','Delivery'][i];svg.append(label);});
  $('knowledge-map').append(svg);const grid=el('div','','skills');
  data.skills.forEach(s=>{const b=el('button','','skill');b.type='button';b.dataset.skill=s.id;b.style.setProperty('--skill',s.color);b.setAttribute('aria-pressed','false');b.append(el('strong',s.name),el('span',s.depth));b.addEventListener('click',()=>selectSkill(s.id));grid.append(b);});$('knowledge-map').append(grid);selectSkill('electronics');
}
function renderPeople() {
  data.roles.forEach(r=>{const c=el('div','','card');c.append(el('p',r.dates,'kind'),el('h3',r.company),el('p',r.role),el('p',r.summary,'muted'),proofButtons(r.proof));$('roles').append(c);});
  data.references.forEach(r=>{const c=el('div','','card reference');c.append(el('blockquote','“'+r.quote+'”'),el('p',r.name),el('p',r.role,'muted'),proofButtons(r.proof));$('references').append(c);});
  data.network.forEach(n=>{const row=el('div','','network-row'),label=el('div','','network-label');label.append(el('span',n.name),el('span',String(n.count)));const track=el('div','','bar-track'),fill=el('div','','bar-fill');fill.style.width=(n.count/32*100)+'%';track.append(fill);row.append(label,track);$('network').append(row);});
}
function renderWork() {
  data.evidence.forEach(r=>{const c=el('div','','card');c.append(el('p',r.kind+' · '+r.company,'kind'),el('h3',r.title),el('p',r.summary,'muted'));const b=el('button','Open evidence');b.type='button';b.addEventListener('click',()=>openEvidence(r.id));c.append(b);$('evidence-list').append(c);});
}
function message(who,text,ids=[]) {
  const row=el('div','','message '+(who==='You'?'user':''));row.append(el('strong',who),el('p',text));if(ids.length)row.append(proofButtons(ids));$('messages').append(row);$('messages').scrollTop=$('messages').scrollHeight;
}
function answer(q) {
  const words=q.toLowerCase().match(/[a-z0-9]+/g)||[];const has=(...terms)=>terms.some(t=>words.includes(t));
  if(has('limitations','limits','weakness','weaknesses'))return {text:'The record supports a hardware-oriented roboticist with integration experience. Coding and business are shown at application depth. The work samples are fictional summaries, not independently verified results. No certification, revenue, production-scale reliability, or guaranteed role fit is established.',ids:['gripper','pilot']};
  if(has('reference','references','coworker','coworkers','jordan','sam'))return {text:data.references.map(r=>r.name+' ('+r.role+') says: “'+r.quote+'”').join(' ')+' These are fictional references, not contactable people.',ids:['field-failure','pilot']};
  if(has('training','education','learned','study','studied'))return {text:'This specimen shows professional learning through electronics work at Fieldwork Robotics and integration work at Loopworks Automation, plus partner collaboration and mentoring. It does not yet contain a course-by-course training history. The knowledge map links disciplines to the authored work records.',ids:['rover-power','gripper','mentoring']};
  if(has('experience','background','career','roles') && !data.skills.some(s=>[s.id,...s.terms].some(t=>words.includes(t))))return {text:'Alex served as Electronics Lead at Fieldwork Robotics (2030–31) and Robotics Integration Lead at Loopworks Automation (2031–32). The record also includes Canopy Systems prototype support and Common Motion mentoring.',ids:['rover-power','gripper','irrigation','mentoring']};
  const scores=data.evidence.map(r=>{const terms=(r.title+' '+r.summary+' '+r.company).toLowerCase().match(/[a-z0-9]+/g)||[];let score=words.filter(w=>w.length>3&&terms.includes(w)).length;data.skills.forEach(s=>{if(r.skills.includes(s.id)&&[s.id,...s.terms].some(t=>words.includes(t)))score+=3;});if(has('failure','failed','debugging','recovery')&&r.id==='field-failure')score+=6;if(has('mentor','mentoring','teach','teaching')&&r.id==='mentoring')score+=6;return {r,score};}).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,2);
  if(!scores.length)return {text:'I cannot support that answer from this specimen. Ask about electronics, motor control, the gripper, customer pilots, failure recovery, mentoring, or references. Compensation, availability, credentials, and undocumented experience are not in the record.',ids:[]};
  return {text:scores.map(({r})=>r.title+': '+r.contribution+' '+r.decision).join(' ')+' Open the evidence to inspect outcomes and limitations.',ids:scores.map(x=>x.r.id)};
}
function ask(q) { q=q.trim().slice(0,600);if(!q)return;message('You',q);const result=answer(q);message('Professional Agent · mock',result.text,result.ids);$('question').value='';}
async function init() {
  const response=await fetch('graduate.json');if(!response.ok)throw Error('Could not load the specimen record');data=await response.json();
  renderKnowledge();renderPeople();renderWork();
  document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{show(b.dataset.view);if(b.classList.contains('continue'))document.querySelector('.tabs').scrollIntoView({block:'start'});}));
  document.querySelectorAll('[data-question]').forEach(b=>b.addEventListener('click',()=>ask(b.dataset.question)));
  $('ask-form').addEventListener('submit',e=>{e.preventDefault();ask($('question').value);});
  message('Professional Agent · mock',"I can help you inspect Alex's professional record. Ask about a skill or responsibility and I will point to the evidence. This is a fictional profile and a retrieval demonstration.");
  if(location.hash.startsWith('#proof-'))openEvidence(location.hash.slice(7),false);
}
init().catch(()=>{$('messages').textContent='The specimen record could not load. Please reload the page.';$('ask-form').querySelector('button').disabled=true;});
