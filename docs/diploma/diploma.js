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
  if ($('knowledge-explorer').open) $('knowledge-explorer').close();
  show('work'); const box = $('evidence-detail'); box.replaceChildren(el('p', r.kind + ' · ' + r.company, 'eyebrow'), el('h3', r.title));
  for (const [key,label] of [['contribution',"Alex's contribution"],['decision','Decision and reasoning'],['result','Illustrative outcome'],['limits','Limits of this evidence']]) {
    box.append(el('h4',label),el('p',r[key],key==='limits'?'limits':''));
  }
  box.append(el('h4','Evidence packet outline'));
  const ul = el('ul'); r.artifacts.forEach(a => ul.append(el('li',a))); box.append(ul,el('p','These are authored specimen summaries. Underlying code, test logs, and research papers have not yet been created.','muted'));
  history.replaceState(null,'','#proof-' + id);
  if (focus) { box.focus({preventScroll:true}); box.scrollIntoView({block:'start'}); }
}
let activeDiscipline = 0;
function makeRadar(items, colors, onSelect, labels) {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox','0 0 500 420'); svg.setAttribute('class','radar');
  svg.setAttribute('role','group'); svg.setAttribute('aria-label','Illustrative depth map. Select a field to inspect it.');
  const point=(i,r)=>[250+Math.cos(i*Math.PI/3-Math.PI/2)*r,210+Math.sin(i*Math.PI/3-Math.PI/2)*r];
  for(let level=1;level<=4;level++) {
    const ring=document.createElementNS(ns,'polygon');
    ring.setAttribute('points',items.map((_,i)=>point(i,level*38).join(',')).join(' '));
    ring.setAttribute('fill','none');ring.setAttribute('stroke','#304359');svg.append(ring);
  }
  items.forEach((item,i)=>{
    const group=document.createElementNS(ns,'g');group.setAttribute('role','button');group.setAttribute('tabindex','0');
    group.setAttribute('aria-label',item.name+': '+item.depth+'. Open details.');group.classList.add('radar-field');
    const a=point(i,item.level*38),b=point((i+1)%6,items[(i+1)%6].level*38);
    const poly=document.createElementNS(ns,'polygon');poly.setAttribute('points','250,210 '+a.join(',')+' '+b.join(','));
    poly.setAttribute('fill',colors[i]);poly.setAttribute('fill-opacity','.8');group.append(poly);
    const dot=document.createElementNS(ns,'circle');dot.setAttribute('cx',a[0]);dot.setAttribute('cy',a[1]);dot.setAttribute('r','6');dot.setAttribute('fill',colors[i]);group.append(dot);
    const title=document.createElementNS(ns,'title');title.textContent=item.name+' / '+item.depth;group.append(title);
    const text=document.createElementNS(ns,'text'),pos=point(i,180);text.setAttribute('x',pos[0]);text.setAttribute('y',pos[1]);text.setAttribute('text-anchor','middle');text.setAttribute('fill',colors[i]);text.setAttribute('font-size','15');text.textContent=labels[i];group.append(text);
    group.addEventListener('click',()=>onSelect(i));group.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onSelect(i);}});svg.append(group);
  });return svg;
}
function selectSkill(id, expand=true) {
  const skill=data.skills.find(s=>s.id===id);
  document.querySelectorAll('.skill').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.skill===id)));
  $('skill-detail').replaceChildren(el('h3',skill.name+' · '+skill.depth),el('p',skill.summary),el('p',skill.experienceMonths+' months of applied experience in the specimen.','muted'),proofButtons(skill.proof));
  if(expand) openDiscipline(data.skills.indexOf(skill));
}
function selectSubfield(index) {
  const field=data.skills[activeDiscipline].subfields[index];
  document.querySelectorAll('.subfield').forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
  const detail=$('subfield-detail');detail.replaceChildren(el('p','Subfield '+(index+1),'eyebrow'),el('h3',field.name),el('p',field.depth+' depth'),el('p',field.summary),el('h4','Applied experience'),el('p',field.experienceMonths?field.experienceMonths+' months in related specimen work.':'No applied experience documented.'));
  if(field.proof.length)detail.append(el('h4','Supporting work'),proofButtons(field.proof));
  else detail.append(el('p','Foundational study only; no supporting work sample has been authored.','limits'));
}
function openDiscipline(index) {
  activeDiscipline=(index+data.skills.length)%data.skills.length;
  const skill=data.skills[activeDiscipline],dialog=$('knowledge-explorer');
  selectSkill(skill.id,false);
  $('explorer-breadcrumb').textContent=skill.name;$('explorer-title').textContent=skill.name;
  $('explorer-summary').textContent=skill.summary+' '+skill.experienceMonths+' months of related applied experience. Subfields show different depths within this discipline.';
  $('discipline-position').textContent=(activeDiscipline+1)+' / '+data.skills.length;
  $('previous-discipline').setAttribute('aria-label','Previous discipline: '+data.skills[(activeDiscipline+data.skills.length-1)%data.skills.length].name);
  $('next-discipline').setAttribute('aria-label','Next discipline: '+data.skills[(activeDiscipline+1)%data.skills.length].name);
  const map=$('subfield-map');map.replaceChildren(makeRadar(skill.subfields,skill.subfields.map(()=>skill.color),selectSubfield,skill.subfields.map((_,i)=>String(i+1).padStart(2,'0'))));
  const grid=el('div','','subfield-grid');skill.subfields.forEach((field,i)=>{
    const button=el('button','','subfield');button.type='button';button.style.setProperty('--skill',skill.color);button.setAttribute('aria-pressed','false');
    button.append(el('strong',String(i+1).padStart(2,'0')+' · '+field.name),el('span',field.depth+' · '+field.experienceMonths+' applied months'));
    button.addEventListener('click',()=>selectSubfield(i));grid.append(button);
  });map.append(grid);selectSubfield(0);
  if(!dialog.open){dialog.showModal();document.body.classList.add('exploring');}
  const shell=dialog.querySelector('.explorer-shell');shell.classList.remove('subject-change');void shell.offsetWidth;shell.classList.add('subject-change');
  $('explorer-title').focus({preventScroll:true});dialog.scrollTop=0;
}
function renderKnowledge() {
  $('knowledge-map').append(makeRadar(data.skills,data.skills.map(s=>s.color),i=>selectSkill(data.skills[i].id),['Electronics','Mechanical','Controls','Coding','Business','Delivery']));
  const grid=el('div','','skills');
  data.skills.forEach(skill=>{const button=el('button','','skill');button.type='button';button.dataset.skill=skill.id;button.style.setProperty('--skill',skill.color);button.setAttribute('aria-pressed','false');
    button.append(el('strong',skill.name),el('span',skill.depth+' · '+skill.experienceMonths+' applied months'),el('span','Explore subfields'));button.addEventListener('click',()=>selectSkill(skill.id));grid.append(button);
  });$('knowledge-map').append(grid);selectSkill('electronics',false);
  $('collapse-knowledge').addEventListener('click',()=>$('knowledge-explorer').close());
  $('knowledge-explorer').addEventListener('close',()=>document.body.classList.remove('exploring'));
  $('previous-discipline').addEventListener('click',()=>openDiscipline(activeDiscipline-1));
  $('next-discipline').addEventListener('click',()=>openDiscipline(activeDiscipline+1));
}
function renderPeople() {
  const context=el('div','','card');context.append(el('h3','Capstone collaborators and partner work'),el('p','Alex worked alongside mechanical, product, and research specialists at Fieldwork Robotics and Loopworks Automation, supported Canopy Systems, and mentored at Common Motion.','muted'),proofButtons(data.partnerProof));$('collaborators').append(context);
  data.references.forEach(r=>{const c=el('div','','card reference');c.append(el('blockquote','“'+r.quote+'”'),el('p',r.name),el('p',r.role,'muted'),proofButtons(r.proof));$('references').append(c);});
  data.network.forEach(n=>{const row=el('div','','network-row'),label=el('div','','network-label');label.append(el('span',n.name),el('span',String(n.count)));const track=el('div','','bar-track'),fill=el('div','','bar-fill');fill.style.width=(n.count/32*100)+'%';track.append(fill);row.append(label,track);$('network').append(row);});
}
function workCard(record) {
  const card=el('div','','card');card.append(el('p',record.kind+' · '+record.company,'kind'),el('h3',record.title),el('p',record.summary,'muted'));
  const button=el('button','Open evidence');button.type='button';button.addEventListener('click',()=>openEvidence(record.id));card.append(button);return card;
}
function renderWork() {
  const list=$('evidence-list');
  [...data.roles].reverse().forEach(role=>{
    const card=el('section','','card resume-role');card.append(el('p','Capstone corporation · '+role.dates+' · '+role.durationMonths+' months','kind'),el('h3',role.company),el('p',role.role,'role-title'),el('p',role.mission,'company-mission'),el('h4','Company goal'),el('p',role.goal),el('h4','Personal accomplishments'));
    const ul=el('ul');role.accomplishments.forEach(a=>ul.append(el('li',a)));card.append(ul,el('h4','Company outcome'),el('p',role.outcome,'muted'),el('h4','Supporting work'),proofButtons(role.proof));list.append(card);
  });
  list.append(el('h3','Partner contributions & mentoring'));data.partnerProof.forEach(id=>list.append(workCard(data.evidence.find(e=>e.id===id))));
  list.append(el('h3','Independent projects'));data.independentProof.forEach(id=>list.append(workCard(data.evidence.find(e=>e.id===id))));
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
  if ($('ask-form')) {
    $('ask-form').addEventListener('submit',e=>{e.preventDefault();ask($('question').value);});
    message('Professional Agent · mock', "Ask about my experience and training, and I can help you find the work behind it. Or introduce yourself and tell me about your company and its mission. I can help surface the work most relevant to what you are trying to accomplish.");
  }
  if(location.hash.startsWith('#proof-'))openEvidence(location.hash.slice(7),false);
}
init().catch(()=>{const target=$('messages') || $('skill-detail');target.textContent='The specimen record could not load. Please reload the page.';if($('ask-form'))$('ask-form').querySelector('button').disabled=true;});
