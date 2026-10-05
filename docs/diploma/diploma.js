const el = (tag, text, cls) => { const n = document.createElement(tag); if (text) n.textContent = text; if (cls) n.className = cls; return n; };
let data;
const $ = id => document.getElementById(id);
function show(view) {
  for (const name of ['home','knowledge','people','work']) $(name).hidden = name !== view;
  document.querySelectorAll('.tabs button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === view)));
}
function proofButtons(ids) {
  const wrap=el('ul','','proof-links');
  ids.forEach(id=>{const record=data.evidence.find(e=>e.id===id);if(!record)return;
    const li=el('li'),link=el('a',record.title,'evidence-link');link.href='#proof-'+id;
    link.addEventListener('click',event=>{event.preventDefault();openEvidence(id);});li.append(link);wrap.append(li);
  });return wrap;
}
function syncModalLock() { document.body.classList.toggle('exploring',$('knowledge-explorer').open || $('project-dialog').open); }
function openProject(title,kind,sections,resources=[]) {
  const dialog=$('project-dialog');$('project-title').textContent=title;$('project-kind').textContent=kind;
  const box=$('project-content');box.replaceChildren();
  sections.forEach(([heading,content])=>{box.append(el('h3',heading));if(Array.isArray(content)){const ul=el('ul');content.forEach(item=>ul.append(el('li',item)));box.append(ul);}else box.append(el('p',content));});
  if(resources.length){const links=el('div','','resource-links');resources.forEach(resource=>{const link=el('a',resource.label);link.href=resource.url;link.target='_blank';link.rel='noopener';link.title='Open in a new tab';links.append(link);});box.append(links);}
  if(!dialog.open)dialog.showModal();syncModalLock();$('project-title').focus({preventScroll:true});dialog.scrollTop=0;
}
function openEvidence(id) {
  const record=data.evidence.find(e=>e.id===id);if(!record)return;
  openProject(record.title,record.kind+' · '+record.company,[['Overview',record.summary],['Alex’s contribution',record.contribution],['Decisions and reasoning',record.decision],['Outcome',record.result],['Scope and limitations',record.limits],['Evidence packet',record.artifacts]],record.resources||[]);
}
function openVenture() {
  const venture=data.summerVenture;
  openProject(venture.name,venture.program+' · '+venture.dates,[['Mission',venture.mission],['Formal role',venture.role],['Contribution',venture.contribution],['Outcome',venture.outcome]],[{label:'Open venture dossier',url:'artifacts/summer-venture.html'}]);
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
  $('skill-detail').replaceChildren(el('h3',skill.name+' · '+skill.depth),el('p',skill.summary),el('p',skill.experienceMonths+' months of applied experience.','muted'),proofButtons(skill.proof));
  if(expand) openDiscipline(data.skills.indexOf(skill));
}
function selectSubfield(index) {
  const field=data.skills[activeDiscipline].subfields[index];
  document.querySelectorAll('.subfield').forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
  const detail=$('subfield-detail');detail.replaceChildren(el('p','Subfield '+(index+1),'eyebrow'),el('h3',field.name),el('p',field.depth+' depth'),el('p',field.summary),el('h4','Applied experience'),el('p',field.experienceMonths?field.experienceMonths+' months of related applied work.':'No applied experience documented.'));
  if(field.proof.length)detail.append(el('h4','Supporting work'),proofButtons(field.proof));
  else detail.append(el('p','Foundational study only; no applied work recorded.','limits'));
  detail.append(el('h4','Mentored learning'));
  if(field.mentoredLearning.length){const list=el('ul','','mentored-learning');field.mentoredLearning.forEach(item=>list.append(el('li',item.area+' · '+item.mentor)));detail.append(list);}
  else detail.append(el('p','No mentored learning recorded for this subfield.','muted'));
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
  $('previous-discipline-top').setAttribute('aria-label',$('previous-discipline').getAttribute('aria-label'));
  $('next-discipline-top').setAttribute('aria-label',$('next-discipline').getAttribute('aria-label'));
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
  $('knowledge-explorer').addEventListener('close',syncModalLock);
  $('previous-discipline').addEventListener('click',()=>openDiscipline(activeDiscipline-1));
  $('next-discipline').addEventListener('click',()=>openDiscipline(activeDiscipline+1));
  $('previous-discipline-top').addEventListener('click',()=>openDiscipline(activeDiscipline-1));
  $('next-discipline-top').addEventListener('click',()=>openDiscipline(activeDiscipline+1));
}
let activeNetwork = -1;
let activeRelationship = 'all';
const relationshipKinds = [
  ['coworker','Coworkers','#80c8e8'],
  ['collaborator','University collaborators','#c9b1ec'],
  ['mentor','University mentors','#f0cf7a'],
  ['mentee','Mentees','#8ad5b1'],
  ['external','Outside the university','#f3a986']
];
function relationshipType(person) {
  if(person.scope==='external')return 'external';
  if(/mentee/i.test(person.relation))return 'mentee';
  if(/teammate|coworker/i.test(person.relation))return 'coworker';
  if(/mentor/i.test(person.relation))return 'mentor';
  return 'collaborator';
}
function inPeopleFilter(item) { return activeNetwork<0 || item.specialties.includes(data.network[activeNetwork].name); }
function renderPeopleLists() {
  ['mentorship','recognition','references'].forEach(id=>$(id).replaceChildren());
  data.mentorship.filter(inPeopleFilter).forEach(person=>{const card=el('section','','card');card.append(el('p',person.company+' · '+person.role+' · University','kind'),el('h3',person.name),el('h4','Alex’s contribution'),el('p',person.contribution),el('h4','What they accomplished'),el('p',person.accomplishment),proofButtons(person.proof));$('mentorship').append(card);});
  data.recognition.filter(inPeopleFilter).forEach(item=>{const card=el('div','','card');card.append(el('p',item.scope==='external'?'Industry & community':'University','kind'),el('h3',item.title),el('p',item.detail),proofButtons(item.proof));$('recognition').append(card);});
  data.references.filter(inPeopleFilter).forEach(ref=>{const card=el('div','','card reference');card.append(el('blockquote','“'+ref.quote+'”'),el('p',ref.name),el('p',ref.role+' · '+(ref.scope==='external'?'Industry & community':'University'),'muted'),proofButtons(ref.proof));$('references').append(card);});
  for(const id of ['mentorship','recognition','references'])if(!$(id).children.length)$(id).append(el('p','No matching records for this selection.','muted'));
}
function selectNetwork(index) {
  activeNetwork=index;
  const groups=index<0?data.network:[data.network[index]],all=groups.flatMap(g=>g.connections);
  const connections=all.filter(c=>activeRelationship==='all'||relationshipType(c)===activeRelationship),detail=$('network-detail');
  detail.replaceChildren(el('h3',(index<0?'All connections':groups[0].name)+' · '+all.length));
  const breakdown=el('div','','relationship-breakdown'),chart=el('div','','relationship-chart');
  const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 160 160');svg.setAttribute('role','group');svg.setAttribute('aria-label','Connections by relationship. Select a segment to see its people.');
  const legend=el('div','','relationship-legend');let angle=-Math.PI/2;
  relationshipKinds.forEach(([key,label,color])=>{
    const count=all.filter(person=>relationshipType(person)===key).length;if(!count)return;
    const end=angle+count/all.length*Math.PI*2;
    const segment=document.createElementNS(ns,'path');
    const x=a=>80+69*Math.cos(a),y=a=>80+69*Math.sin(a);
    segment.setAttribute('d',count===all.length?'M 80 11 A 69 69 0 1 1 79.999 11 Z':`M 80 80 L ${x(angle)} ${y(angle)} A 69 69 0 ${end-angle>Math.PI?1:0} 1 ${x(end)} ${y(end)} Z`);
    segment.setAttribute('fill',color);segment.setAttribute('stroke','#101e2e');segment.setAttribute('stroke-width','2');segment.setAttribute('role','button');segment.setAttribute('tabindex','0');segment.setAttribute('aria-label',label+': '+count);segment.setAttribute('aria-pressed',String(activeRelationship===key));segment.style.opacity=activeRelationship==='all'||activeRelationship===key?'1':'.35';
    const choose=()=>{activeRelationship=activeRelationship===key?'all':key;selectNetwork(index);};segment.addEventListener('click',choose);segment.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose();}});svg.append(segment);angle=end;
    const button=el('button','','relationship-key');button.type='button';button.setAttribute('aria-pressed',String(activeRelationship===key));const dot=el('span','','legend-dot');dot.style.background=color;button.append(dot,el('span',label),el('strong',String(count)));button.addEventListener('click',choose);legend.append(button);
  });
  chart.append(svg);breakdown.append(chart,legend);detail.append(breakdown);
  const heading=el('div','','connection-list-heading');heading.append(el('h4',(activeRelationship==='all'?'People and affiliations':relationshipKinds.find(k=>k[0]===activeRelationship)[1])+' · '+connections.length));
  if(activeRelationship!=='all'){const reset=el('button','Show all relationships','relationship-reset');reset.type='button';reset.addEventListener('click',()=>{activeRelationship='all';selectNetwork(index);});heading.append(reset);}detail.append(heading);
  const list=el('div','','connection-list');connections.forEach(person=>{const card=el('div','','connection-person');const icon=el('span','','person-avatar');icon.setAttribute('aria-hidden','true');icon.textContent=person.name.split(' ').map(x=>x[0]).join('');card.append(icon);const text=el('div');text.append(el('strong',person.name),el('span',person.company),el('small',person.relation+' · '+person.specialty+' · '+(person.scope==='internal'?'University':'Industry & community')));card.append(text);list.append(card);});detail.append(list);
  document.querySelectorAll('.network-select').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.group)===index)));
  renderPeopleLists();
}
function renderNetwork() {
  const controls=el('div','','specialty-cards');
  const add=(group,index)=>{const button=el('button','','network-select');button.type='button';button.dataset.group=String(index);button.append(el('span',group.name,'connection-specialty'),el('strong',String(group.count),'connection-total'),el('small',group.externalCount+' outside university','external-badge'));button.addEventListener('click',()=>{activeRelationship='all';selectNetwork(index);});controls.append(button);};
  add({name:'All connections',count:data.network.reduce((sum,g)=>sum+g.count,0),externalCount:data.network.reduce((sum,g)=>sum+g.externalCount,0)},-1);
  data.network.forEach(add);$('network').append(controls);selectNetwork(-1);
}
function renderPeople() { renderNetwork(); }
function workCard(record) {
  const card=el('div','','card');card.append(el('p',record.kind+' · '+record.company,'kind'),el('h3',record.title),el('p',record.summary,'muted'));
  card.append(proofButtons([record.id]));return card;
}
function renderWork() {
  const list=$('evidence-list');
  [...data.roles].reverse().forEach(role=>{
    const card=el('section','','card resume-role');card.append(el('p','Capstone corporation · '+role.dates,'kind'),el('h3',role.company),el('p',role.role,'role-title'),el('p',role.mission,'company-mission'),el('h4','Company goal'),el('p',role.goal),el('h4','Personal accomplishments'));
    const ul=el('ul');role.accomplishments.forEach(a=>ul.append(el('li',a)));card.append(ul,el('h4','Company outcome'),el('p',role.outcome,'muted'),el('h4','Supporting work'),proofButtons(role.proof));list.append(card);
  });
  list.append(el('h3','Partner contributions'));data.partnerProof.filter(id=>id!=='mentoring').forEach(id=>list.append(workCard(data.evidence.find(e=>e.id===id))));
  const venture=data.summerVenture,card=el('section','','card summer-venture');card.id='summer-venture';card.tabIndex=-1;card.append(el('p',venture.program+' · '+venture.dates,'kind'),el('h3',venture.name),el('p',venture.role,'role-title'),el('p',venture.mission,'company-mission'),el('h4','Contribution'),el('p',venture.contribution),el('h4','Venture outcome'),el('p',venture.outcome),proofButtons(venture.proof));list.append(card);
  list.append(el('h3','Independent projects'));data.independentProof.forEach(id=>list.append(workCard(data.evidence.find(e=>e.id===id))));
}
function message(who,text,ids=[]) {
  const row=el('div','','message '+(who==='You'?'user':''));row.append(el('strong',who),el('p',text));if(ids.length)row.append(proofButtons(ids));$('messages').append(row);$('messages').scrollTop=$('messages').scrollHeight;
}
function answer(q) {
  const words=q.toLowerCase().match(/[a-z0-9]+/g)||[];const has=(...terms)=>terms.some(t=>words.includes(t));
  if(has('limitations','limits','weakness','weaknesses'))return {text:'The record supports a hardware-oriented roboticist with integration experience. Coding and business are shown at application depth. The work samples are fictional summaries, not independently verified results. No certification, revenue, production-scale reliability, or guaranteed role fit is established.',ids:['gripper','pilot']};
  if(has('reference','references','coworker','coworkers','jordan','sam'))return {text:data.references.map(r=>r.name+' ('+r.role+') says: “'+r.quote+'”').join(' ')+' These are fictional references, not contactable people.',ids:['field-failure','pilot']};
  if(has('training','education','learned','study','studied'))return {text:'This specimen shows professional learning through electronics work at SafeReach and integration work at Harvest Commons, plus partner collaboration and mentoring. It does not yet contain a course-by-course training history. The knowledge map links disciplines to the authored work records.',ids:['rover-power','gripper','mentoring']};
  if(has('experience','background','career','roles') && !data.skills.some(s=>[s.id,...s.terms].some(t=>words.includes(t))))return {text:'Alex served as Electronics Lead at SafeReach (2030–31) and Robotics Integration Lead at Harvest Commons (2031–32). The record also includes Canopy Systems prototype support and Common Motion mentoring.',ids:['rover-power','gripper','irrigation','mentoring']};
  const scores=data.evidence.map(r=>{const terms=(r.title+' '+r.summary+' '+r.company).toLowerCase().match(/[a-z0-9]+/g)||[];let score=words.filter(w=>w.length>3&&terms.includes(w)).length;data.skills.forEach(s=>{if(r.skills.includes(s.id)&&[s.id,...s.terms].some(t=>words.includes(t)))score+=3;});if(has('failure','failed','debugging','recovery')&&r.id==='field-failure')score+=6;if(has('mentor','mentoring','teach','teaching')&&r.id==='mentoring')score+=6;return {r,score};}).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,2);
  if(!scores.length)return {text:'I cannot support that answer from this specimen. Ask about electronics, motor control, the gripper, customer pilots, failure recovery, mentoring, or references. Compensation, availability, credentials, and undocumented experience are not in the record.',ids:[]};
  return {text:scores.map(({r})=>r.title+': '+r.contribution+' '+r.decision).join(' ')+' Open the evidence to inspect outcomes and limitations.',ids:scores.map(x=>x.r.id)};
}
function ask(q) { q=q.trim().slice(0,600);if(!q)return;message('You',q);const result=answer(q);message('Professional Agent · mock',result.text,result.ids);$('question').value='';}
async function init() {
  const response=await fetch('graduate.json');if(!response.ok)throw Error('Could not load the specimen record');data=await response.json();
  renderKnowledge();renderPeople();renderWork();
  $('profile-summary').textContent=data.summary;
  $('close-project').addEventListener('click',()=>$('project-dialog').close());
  $('project-dialog').addEventListener('close',syncModalLock);
  const visitVenture=()=>openVenture();
  $('summer-badge').addEventListener('click',()=>visitVenture());
  if(location.hash==='#summer-venture')visitVenture();
  document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{show(b.dataset.view);if(b.classList.contains('continue'))document.querySelector('.tabs').scrollIntoView({block:'start'});}));
  document.querySelectorAll('[data-question]').forEach(b=>b.addEventListener('click',()=>ask(b.dataset.question)));
  if ($('ask-form')) {
    $('ask-form').addEventListener('submit',e=>{e.preventDefault();ask($('question').value);});
    message('Professional Agent · mock', "Ask about my experience and training, and I can help you find the work behind it. Or introduce yourself and tell me about your company and its mission. I can help surface the work most relevant to what you are trying to accomplish.");
  }
  if(location.hash.startsWith('#proof-'))openEvidence(location.hash.slice(7),false);
}
init().catch(()=>{const target=$('messages') || $('skill-detail');target.textContent='The specimen record could not load. Please reload the page.';if($('ask-form'))$('ask-form').querySelector('button').disabled=true;});
