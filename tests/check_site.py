from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import xml.etree.ElementTree as ET
root=Path('dist');errors=[]
class P(HTMLParser):
 def __init__(self):super().__init__();self.links=[];self.ids=[];self.labels=[];self.fields=[];self.h1=0
 def handle_starttag(self,t,at):
  a=dict(at)
  if t=='h1':self.h1+=1
  if a.get('id'):self.ids.append(a['id'])
  if t=='label' and a.get('for'):self.labels.append(a['for'])
  if t in ('input','select','textarea') and a.get('id'):self.fields.append(a['id'])
  if t=='img' and 'alt' not in a:errors.append('Missing image alternative')
  for k in ('href','src'):
   if a.get(k,'').startswith('/'):self.links.append(a[k])
for f in root.rglob('*.html'):
 p=P();p.feed(f.read_text());assert p.h1==1,(f,p.h1);assert len(p.ids)==len(set(p.ids)),f;assert not(set(p.fields)-set(p.labels)),f
 for link in p.links:
  u=urlsplit(link);target=root/unquote(u.path).lstrip('/')
  if target.is_dir():target=target/'index.html'
  if not target.exists():errors.append(f'{f}: {link}')
  elif u.fragment and target.suffix=='.html':
   z=P();z.feed(target.read_text())
   if u.fragment not in z.ids:errors.append(f'{f}: bad fragment {link}')
ET.parse(root/'assets/logo.svg');ET.parse(root/'assets/favicon.svg');ET.parse(root/'sitemap.xml')
assert not errors,errors
print('PASS: internal URLs, assets, fragment targets, headings, field labels, SVG and sitemap XML.')
