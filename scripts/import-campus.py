"""Convert an OSM API XML extract to a small, attributed geographic dataset.
Usage: python3 scripts/import-campus.py /path/to/campus.osm
Source: https://api.openstreetmap.org/api/0.6/map?bbox=7.407,51.486,7.425,51.498
Coordinates are retained as WGS84 [longitude, latitude]; no hand-positioned geometry.
"""
import sys,json,datetime,xml.etree.ElementTree as ET
from pathlib import Path
root=ET.parse(sys.argv[1]).getroot()
nodes={n.get('id'):n for n in root.findall('node')}
def tags(e):return {t.get('k'):t.get('v') for t in e.findall('tag')}
def coord(n):return [float(n.get('lon')),float(n.get('lat'))]
def nearby(p):
 # Keep detailed geometry around the FH buildings and the sports precinct shown
 # south-west of OH3, without importing the surrounding residential area.
 fh_detail=7.4158<=p[0]<=7.424 and 51.4923<=p[1]<=51.4963
 sports_detail=7.4120<=p[0]<=7.4180 and 51.4860<=p[1]<=51.4914
 return fh_detail or sports_detail
# Named map locations outside the local FH detail extent. Keep their exact OSM
# outlines without loading every surrounding residential building into the scene.
named_buildings={17059736,23106346,17058381,1179680969,134024651,1264162239}
features=[]
for w in root.findall('way'):
 t=tags(w);pts=[coord(nodes[n.get('ref')]) for n in w.findall('nd')]
 if not any(nearby(p) for p in pts) and int(w.get('id')) not in named_buildings:continue
 kind='building' if 'building' in t else 'road' if 'highway' in t else 'area' if t.get('landuse') in ['grass','forest','meadow'] or t.get('natural') in ['wood','scrub','water','grassland','sand'] or t.get('leisure') in ['garden','park','pitch','track','fitness_station'] or t.get('amenity')=='parking' else None
 if not kind:continue
 if kind!='road' and pts[0]!=pts[-1]:continue
 keep={k:v for k,v in t.items() if k in ['building','building:levels','height','highway','name','addr:housenumber','addr:street','landuse','natural','amenity','leisure','sport','width','service','access','foot','surface','layer','bridge','tunnel']}
 features.append({'id':int(w.get('id')),'kind':kind,'tags':keep,'coordinates':pts})
for n in nodes.values():
 t=tags(n)
 if nearby(coord(n)) and (t.get('natural')=='tree' or t.get('amenity') in ['library','restaurant']):
  features.append({'id':int(n.get('id')),'kind':'tree' if t.get('natural')=='tree' else 'poi','tags':{k:v for k,v in t.items() if k in ['name','amenity','addr:housenumber']},'coordinates':coord(n)})
out={'attribution':'© OpenStreetMap contributors','license':'https://www.openstreetmap.org/copyright','source':'https://api.openstreetmap.org/api/0.6/map?bbox=7.407,51.486,7.425,51.498','retrievedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'origin':[7.42025,51.49425],'features':features}
Path('src/campus-geography.json').write_text(json.dumps(out,separators=(',',':'))+'\n')
print({k:sum(f['kind']==k for f in features) for k in ['building','road','area','tree','poi']})
