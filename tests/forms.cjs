const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const source=fs.readFileSync('dist/app.js','utf8');
function run(type,channel,picks,query=''){
 const events={},messages=[],fields=new Map([['name','Test Café Owner'],['business','QA & Coffee'],['email','test@example.com'],['phone','+91 9000000000'],['city','Kozhikode'],['businessType','Café / coffee shop'],['stage','Still planning'],['volume','2.5'],['interest','Custom blend'],['message','A café & bakery.\nNeed guidance.']]);
 let status={hidden:true,scrollIntoView(){}};let first={setCustomValidity(v){this.validationMessage=v},reportValidity(){},addEventListener(){}};const check={dataset:{blend:'house'},checked:false};
 const form={dataset:{type},addEventListener(e,fn){events[e]=fn},reportValidity(){return true},querySelector(s){if(s==='.send-status')return status;if(s==='[name="sample"]')return first;return null},querySelectorAll(){return [first]}};
 class FD {get(k){return fields.get(k)}getAll(){return picks}}
 const doc={querySelector(s){return s==='.enquiry-form'?form:null},querySelectorAll(s){return s==='[data-blend]'?[check]:[]},addEventListener(){}};
 const win={addEventListener(){},matchMedia(){return {matches:false}},open(url){messages.push(url)},location:{href:''}};
 vm.runInNewContext(source,{document:doc,window:win,location:{search:query},URLSearchParams,FormData:FD,console});
 events.submit({preventDefault(){},submitter:{value:channel}});
 return {messages,href:win.location.href,status,first,check};
}
let a=run('Business enquiry','whatsapp',[]);assert.equal(a.messages.length,1);assert.match(a.messages[0],/^https:\/\/wa.me\/919847599828\?text=/);assert.match(decodeURIComponent(a.messages[0]),/QA & Coffee/);assert.equal(a.status.hidden,false);
let b=run('Sample request','email',['House Blend','Please recommend samples'],'?blend=house');assert.match(b.href,/^mailto:hello@bermito.com/);assert.match(decodeURIComponent(b.href),/confirm sample availability, fees and delivery charges/);assert.equal(b.check.checked,true);
let c=run('Sample request','whatsapp',[]);assert.equal(c.messages.length,0);assert.equal(c.status.hidden,true);assert.match(c.first.validationMessage,/Choose at least one/);
console.log('PASS: WhatsApp message, email sample enquiry, URL preselection, empty sample selection. No external messages sent.');
