'use strict';

const DAYS = [
  { id: 1, date: 'Mon 10/5', title: 'Canyonlands NP – Island in the Sky', color: '#d1495b' },
  { id: 2, date: 'Tue 10/6', title: 'Capitol Reef NP', color: '#e09f3e' },
  { id: 3, date: 'Wed 10/7', title: 'Scenic Byway 12 & Bryce Canyon NP', color: '#00798c' },
  { id: 4, date: 'Thu 10/8', title: 'Zion NP – East side & Watchman', color: '#6a4c93' },
  { id: 5, date: 'Fri 10/9', title: 'Return to Grand Junction', color: '#30638e' },
];

const TYPES = {
  start:   { emoji: '🏁', color: '#333',    label: 'Start / finish' },
  charger: { emoji: '⚡', color: '#e31937', label: 'Tesla Supercharger' },
  l2:      { emoji: '🔌', color: '#f28c28', label: 'Destination (L2) charging' },
  planned: { emoji: '⚡', color: '#9ca3af', label: 'Supercharger – planned / backup', dashed: true },
  camp:    { emoji: '⛺', color: '#2a9d8f', label: 'Camp (Campendium)' },
  alt:     { emoji: '⛺', color: '#84c5bd', label: 'Backup camp', dashed: true },
  avoid:   { emoji: '⚠️', color: '#9ca3af', label: 'Not Model 3-friendly' },
  hike:    { emoji: '🥾', color: '#3a86ff', label: 'Hike / trailhead' },
  scenic:  { emoji: '📸', color: '#8338ec', label: 'Scenic stop' },
  food:    { emoji: '🍴', color: '#fb8500', label: 'Food' },
};

const CATEGORY = {
  start: 'Superchargers & charging', charger: 'Superchargers & charging', l2: 'Superchargers & charging', planned: 'Superchargers & charging',
  camp: 'Camping', alt: 'Camping', avoid: 'Camping',
  hike: 'Hikes & scenery', scenic: 'Hikes & scenery',
  food: 'Food',
};

const CAMP = 'https://maps.campendium.com/us/';

// q = Google Maps query used for search + directions. Camps use exact coordinates.
const PLACES = {
  gj:          { name: 'Grand Junction, CO (start / finish)', type: 'start', ll: [39.0639, -108.5506], q: 'Grand Junction, CO', days: [1, 5] },
  sc_gj:       { name: 'Tesla Supercharger – Grand Junction (Patterson Rd)', type: 'charger', ll: [39.09135, -108.552608], q: 'Tesla Supercharger, 2699 Patterson Rd, Grand Junction, CO', note: 'Leave Grand Junction at 100%.', days: [1, 5] },
  sc_moab:     { name: 'Tesla Supercharger – Moab (890 N Main St)', type: 'charger', ll: [38.585988, -109.5566], q: 'Tesla Supercharger, 890 N Main St, Moab, UT', note: '8 stalls, up to 250 kW. Charge to ~90% before climbing up to Island in the Sky.', days: [1] },
  sc_gr:       { name: 'Tesla Supercharger – Green River (1185 E Main St)', type: 'charger', ll: [38.99501, -110.147719], q: 'Tesla Supercharger, 1185 E Main St, Green River, UT', note: '16 stalls, up to 325 kW. Used on Day 2 and Day 5.', days: [2, 5] },
  sc_bryce:    { name: "Tesla Supercharger – Bryce Canyon City (Ruby's Inn)", type: 'charger', ll: [37.672618, -112.157001], q: 'Tesla Supercharger, 26 S Main St, Bryce Canyon City, UT', note: '8 stalls, up to 325 kW. Charge at lunch on arrival, then top off again before camp.', days: [3] },
  sc_toq:      { name: 'Tesla Supercharger – Toquerville', type: 'charger', ll: [37.280154, -113.304646], q: 'Tesla Supercharger, Toquerville, UT', note: "12 stalls, up to 325 kW. There's no Supercharger in Hurricane – this is the closest to Zion.", days: [4, 5] },
  sc_rich:     { name: 'Tesla Supercharger – Richfield (1050 W 1250 S)', type: 'charger', ll: [38.750977, -112.103094], q: 'Tesla Supercharger, 1050 W 1250 S, Richfield, UT', note: '16 stalls, up to 250 kW. Charge to ~95% before the I-70 San Rafael Swell stretch.', days: [5] },
  sc_beaver:   { name: 'Tesla Supercharger – Beaver (backup)', type: 'planned', ll: [38.248688, -112.6529677], q: 'Tesla Supercharger, Beaver, UT', note: 'Backup stop on I-15 if you leave Toquerville below ~90% or it is very windy.', days: [5] },
  sc_torrey:   { name: 'Torrey Supercharger (planned – not open yet)', type: 'planned', ll: [38.29956, -111.402808], q: 'Tesla Supercharger, Torrey, UT', note: 'Listed as planned on supercharge.info as of 10/1/2026. Check the Tesla app before you go – if it opens, it solves the Day 2–3 charging problem.', days: [2] },
  sc_virgin:   { name: 'Virgin Supercharger (planned)', type: 'planned', ll: [37.204886, -113.211488], q: 'Tesla Supercharger, Virgin, UT', note: 'Planned on UT-9 between Springdale and Hurricane. Check the Tesla app before you go.', days: [4] },
  etta:        { name: 'Etta Place Cider – dinner + charging (Torrey)', type: 'l2', ll: [38.299801, -111.436308], q: 'Etta Place Cider, Torrey, UT', note: "Primary Day 2 dinner + charge stop. CRITICAL: leave Torrey at 85%+ for Hwy 12. Confirm charger access, connector, and hours in the Tesla app / PlugShare or call ahead.", days: [2] },
  skyview:     { name: 'Skyview Hotel – destination charging (Torrey)', type: 'l2', ll: [38.300735, -111.439985], q: 'Skyview Hotel, 876 W Main St, Torrey, UT', note: 'Next door to Etta Place Cider. Hotel chargers may be guest-only – call ahead.', days: [2] },
  brokenspur:  { name: 'Broken Spur Inn – destination charging (backup)', type: 'l2', ll: [38.2994784, -111.4005546], q: 'Broken Spur Inn, Torrey, UT', note: "Backup option. Hotel chargers are often for guests only. Last resort: book a powered RV site in Torrey and use the Mobile Connector (NEMA 14-50).", days: [2] },

  camp_lone:   { name: 'Lone Mesa Dispersed Camping', type: 'camp', ll: [38.643131, -109.818306], url: CAMP + 'moab-ut/nature/lone-mesa-dispersed-camping', note: 'Free BLM camping off UT-313. Use existing/designated sites. Do not drive down the Mineral Bottom switchbacks.', days: [1, 2] },
  camp_horse:  { name: 'Horsethief Campground (backup)', type: 'alt', ll: [38.584040, -109.814277], url: CAMP + 'moab-ut/nature/horsethief-campground-moab', note: 'BLM, ~$20–25/night, 83 first-come sites, vault toilets. About 0.5 mi of graded gravel – fine for a Model 3.', days: [1] },
  camp_beas:   { name: 'Beas Lewis Flat Dispersed Camping', type: 'camp', ll: [38.298017, -111.388880], url: CAMP + 'torrey-ut/nature/beas-lewis-flat-dispersed-camping', note: 'Free BLM, ~2 mi from Torrey off UT-24. Rocky but sedan-friendly; avoid after heavy rain.', days: [2, 3] },
  camp_efs:    { name: 'East Fork Sevier River Dispersed Campsite #1 (FR 087)', type: 'camp', ll: [37.584491, -112.259232], url: CAMP + 'ut/nature/east-fork-sevier-river-dispersed-campsite-1', note: 'Dixie NF on FR 087 toward Tropic Reservoir. ~8,000 ft – expect below-freezing nights. Camp Mode can use 10–15% overnight.', days: [3, 4] },
  camp_daves:  { name: "Dave's Hollow Designated Dispersed (backup)", type: 'alt', ll: [37.671341, -112.202767], url: CAMP + 'ut/camping-rv/daves-hollow-designated-dispersed', note: 'Closer to Bryce Canyon City / Ruby\'s Inn.', days: [3] },
  camp_hc:     { name: 'Hurricane Cliffs Designated Dispersed Campsites 1–12 (Sheep Bridge Rd)', type: 'camp', ll: [37.163201, -113.252347], url: CAMP + 'hurricane-ut/nature/hurricane-cliffs-designated-dispersed-campsites-1-12', note: 'Free BLM designated sites on graded Sheep Bridge Rd, about 25 min from Springdale. Replaces Smithsonian Butte.', days: [4, 5] },
  camp_smith:  { name: 'Smithsonian Butte (NOT recommended for Model 3)', type: 'avoid', ll: [37.129744, -113.075733], url: CAMP + 'rockville-ut/nature/smithsonian-butte-dispersed-camping', note: 'No camping within 1/2 mile of the byway. Legal sites are down high-clearance 4x4 spurs, and recent reviews report active ticketing ($275).', days: [4] },

  dewey:       { name: 'Dewey Bridge / UT-128 River Road', type: 'scenic', ll: [38.8117, -109.3081], q: 'Dewey Bridge, UT-128, Utah', note: 'Scenic paved route along the Colorado River past Fisher Towers – take I-70 exit 214 (Cisco).', days: [1] },
  moab_food:   { name: 'Food near Moab Supercharger', type: 'food', ll: [38.5845, -109.5560], q: 'restaurants near 890 N Main St, Moab, UT', days: [1] },
  isky_vc:     { name: 'Island in the Sky Visitor Center', type: 'scenic', ll: [38.4598, -109.8210], q: 'Island in the Sky Visitor Center, Moab, UT', days: [1] },
  shafer:      { name: 'Shafer Canyon Overlook', type: 'scenic', ll: [38.4527, -109.8204], q: 'Shafer Canyon Overlook, Canyonlands National Park, UT', days: [1] },
  mesa_arch:   { name: 'Mesa Arch Trailhead', type: 'hike', ll: [38.3891, -109.8680], q: 'Mesa Arch Trailhead, Canyonlands National Park, UT', note: '0.7 mi loop.', days: [1] },
  grandview:   { name: 'Grand View Point Trail', type: 'hike', ll: [38.30335, -109.86781], q: 'Grand View Point Overlook, Canyonlands National Park, UT', note: '~1.8 mi round trip along the rim.', days: [1] },
  gr_overlook: { name: 'Green River Overlook (sunset)', type: 'scenic', ll: [38.3787, -109.8881], q: 'Green River Overlook, Canyonlands National Park, UT', note: 'Sunset is around 6:55 PM on Oct 5.', days: [1] },
  hickman:     { name: 'Hickman Bridge Trailhead', type: 'hike', ll: [38.2890, -111.2275], q: 'Hickman Bridge Trailhead, Capitol Reef National Park, UT', note: '~1.8 mi round trip to the 133-ft natural bridge.', days: [2] },
  gifford:     { name: 'Gifford Homestead (pies)', type: 'food', ll: [38.28331, -111.24648], q: 'Gifford Homestead, Capitol Reef National Park, UT', note: 'Seasonal – pies often sell out by early afternoon.', days: [2] },
  capgorge:    { name: 'Capitol Gorge Trailhead', type: 'hike', ll: [38.20953, -111.16860], q: 'Capitol Gorge Trailhead, Capitol Reef National Park, UT', note: 'End of the Scenic Drive. Last 2 mi are graded dirt – fine when dry. ~2 mi RT to Pioneer Register & the Tanks.', days: [2] },
  torrey_food: { name: 'Restaurants in Torrey', type: 'food', ll: [38.2997, -111.4196], q: 'restaurants in Torrey, UT', days: [2] },
  boulder_ovl: { name: 'Boulder Mountain overlooks (Larb Hollow area)', type: 'scenic', ll: [38.13234, -111.32580], q: 'Larb Hollow Overlook, UT-12, Utah', note: 'Hwy 12 tops out around 9,600 ft here – expect higher battery use on the climb.', days: [3] },
  hellsback:   { name: "Hell's Backbone Grill (Boulder)", type: 'food', ll: [37.90254, -111.42349], q: "Hell's Backbone Grill, Boulder, UT", note: 'Seasonal – check hours.', days: [3] },
  hogback:     { name: 'The Hogback (Hwy 12)', type: 'scenic', ll: [37.83963, -111.42128], q: 'The Hogback, Scenic Byway 12, Boulder, UT', days: [3] },
  kiva:        { name: 'Kiva Koffeehouse', type: 'food', ll: [37.77212, -111.41680], q: 'Kiva Koffeehouse, Escalante, UT', note: 'Seasonal – check hours.', days: [3] },
  headrocks:   { name: 'Head of the Rocks Overlook', type: 'scenic', ll: [37.7466, -111.4538], q: 'Head of the Rocks Overlook, Escalante, UT', days: [3] },
  mossy:       { name: 'Mossy Cave Trailhead', type: 'hike', ll: [37.6636, -112.1146], q: 'Mossy Cave Trailhead, Bryce Canyon National Park, UT', note: '~0.8 mi round trip.', days: [3] },
  rubys_food:  { name: "Ruby's Inn restaurants", type: 'food', ll: [37.6736, -112.1575], q: "Ruby's Inn Cowboy's Buffet and Steak Room, Bryce Canyon City, UT", note: 'Right next to the Supercharger.', days: [3] },
  sunrise_pt:  { name: 'Sunrise Point', type: 'scenic', ll: [37.6283, -112.1631], q: 'Sunrise Point, Bryce Canyon National Park, UT', days: [3] },
  sunset_pt:   { name: 'Sunset Point – Navajo Loop & Queens Garden', type: 'hike', ll: [37.6234, -112.1671], q: 'Sunset Point, Bryce Canyon National Park, UT', note: '~2.9 mi combined loop. Check NPS for Wall Street closures.', days: [3] },
  inspiration: { name: 'Inspiration Point', type: 'scenic', ll: [37.61331, -112.16880], q: 'Inspiration Point, Bryce Canyon National Park, UT', days: [3] },
  valhalla:    { name: 'Valhalla Pizzeria (in park)', type: 'food', ll: [37.62714, -112.16916], q: 'Valhalla Pizzeria, Bryce Canyon National Park, UT', note: 'Seasonal – check hours.', days: [3] },
  checker:     { name: 'Checkerboard Mesa / slickrock pullouts', type: 'scenic', ll: [37.2257, -112.8808], q: 'Checkerboard Mesa Viewpoint, Zion National Park, UT', note: 'On the way in from the East Entrance.', days: [4] },
  canyon_ovl:  { name: 'Canyon Overlook Trailhead', type: 'hike', ll: [37.21333, -112.94596], q: 'Canyon Overlook Trailhead, Zion National Park, UT', note: '1 mi round trip. Small lot right before the tunnel – arrive early.', days: [4] },
  oscars:      { name: "Oscar's Cafe (Springdale)", type: 'food', ll: [37.18905, -113.00034], q: "Oscar's Cafe, Springdale, UT", days: [4] },
  whiptail:    { name: 'Whiptail Grill (Springdale)', type: 'food', ll: [37.19426, -112.99275], q: 'Whiptail Grill, Springdale, UT', days: [4] },
  zion_vc:     { name: 'Zion Canyon Visitor Center – Watchman Trail', type: 'hike', ll: [37.20092, -112.98697], q: 'Zion Canyon Visitor Center, Springdale, UT', note: '~3.3 mi round trip, no shuttle needed. The VC lot fills early, so park in Springdale and ride the free town shuttle.', days: [4] },
  rays:        { name: "Ray's Tavern (Green River)", type: 'food', ll: [38.9950, -110.1649], q: "Ray's Tavern, Green River, UT", days: [2, 5] },
  rich_food:   { name: 'Food near Richfield Supercharger', type: 'food', ll: [38.7525, -112.1000], q: 'restaurants near 1050 W 1250 S, Richfield, UT', days: [5] },
};

// stops = [from, ...via, to]. mi/time are routing estimates; batt = planning estimate.
const LEGS = [
  { day: 1, stops: ['gj', 'dewey', 'sc_moab'], title: 'Grand Junction → Moab Supercharger (scenic UT-128 River Road)', mi: 106, time: '2h25', batt: '100% → ~60%', note: 'I-70 W to Cisco (exit 214), then UT-128 along the Colorado River. Charge to ~90% (~20 min) + early lunch.' },
  { day: 1, stops: ['sc_moab', 'shafer', 'mesa_arch'], title: 'Moab → Island in the Sky (Shafer Overlook, Mesa Arch)', mi: 38, time: '1h', batt: '90% → ~70%', note: 'US-191 N → UT-313. A ~2,000 ft climb.' },
  { day: 1, stops: ['mesa_arch', 'grandview', 'gr_overlook'], title: 'Mesa Arch → Grand View Point → Green River Overlook', mi: 14, time: '30m', batt: '70% → ~65%', note: 'Rim walk at Grand View, then sunset at Green River Overlook.' },
  { day: 1, stops: ['gr_overlook', 'camp_lone'], title: 'Green River Overlook → Lone Mesa camp', mi: 22, time: '40m', batt: '65% → ~58%', note: 'Budget 5–10% more if you run Camp Mode overnight.' },

  { day: 2, stops: ['camp_lone', 'sc_gr'], title: 'Lone Mesa → Green River Supercharger', mi: 50, time: '1h', batt: '~50% → ~32%', note: 'Without this stop Capitol Reef is out of range. Charge to 100% (~35–40 min).', warn: true },
  { day: 2, stops: ['sc_gr', 'hickman'], title: 'Green River → Capitol Reef (Hickman Bridge)', mi: 93, time: '1h50', batt: '100% → ~58%', note: 'I-70 W → UT-24 through Hanksville. No fast charging again until Bryce.' },
  { day: 2, stops: ['hickman', 'gifford', 'capgorge'], title: 'Hickman Bridge → Fruita (pies) → Capitol Gorge', mi: 10, time: '30m', batt: '58% → ~54%', note: 'Scenic Drive. The last stretch to Capitol Gorge is graded dirt.' },
  { day: 2, stops: ['capgorge', 'etta', 'camp_beas'], title: 'Capitol Gorge → Torrey (dinner + charge at Etta Place Cider) → Beas Lewis Flat', mi: 22, time: '45m', batt: '54% → ~48% → charge to 85%+', note: 'CRITICAL: Hwy 12 tomorrow needs ~50%, plus whatever Camp Mode uses tonight. Backups: Skyview Hotel (next door), then Broken Spur Inn.', warn: true },

  { day: 3, stops: ['camp_beas', 'boulder_ovl', 'hogback', 'headrocks', 'mossy'], title: 'Scenic Byway 12 → Mossy Cave', mi: 107, time: '2h30 + stops', batt: '~85% → ~30%', note: 'Over Boulder Mountain (~9,600 ft), then the Hogback and Head of the Rocks. Coffee in Boulder or Escalante.' },
  { day: 3, stops: ['mossy', 'sc_bryce'], title: "Mossy Cave → Bryce Canyon City Supercharger (Ruby's Inn)", mi: 5, time: '10m', batt: '~30% → charge to 90%', note: "Moved up to lunchtime. Don't wait until 4:30 PM to charge." },
  { day: 3, stops: ['sc_bryce', 'sunset_pt', 'inspiration', 'camp_efs'], title: 'Bryce Amphitheater → East Fork Sevier camp (FR 087)', mi: 23, time: '50m', batt: '90% → ~80%', note: 'Navajo Loop/Queens Garden, then the rim viewpoints. Top off at Ruby\'s again before camp if you\'ll run Camp Mode.' },

  { day: 4, stops: ['camp_efs', 'checker', 'canyon_ovl'], title: 'FR 087 camp → Zion East Entrance → Canyon Overlook', mi: 82, time: '1h45', batt: '~80% → ~50%', note: 'UT-12 W → US-89 S → UT-9. Stop at the slickrock pullouts on the way in. Mostly downhill, so it\'s efficient.' },
  { day: 4, stops: ['canyon_ovl', 'zion_vc'], title: 'Canyon Overlook → Mt. Carmel Tunnel → Springdale / Visitor Center', mi: 6, time: '15m', batt: '50% → ~48%', note: 'Lunch in Springdale, then the Watchman Trail.' },
  { day: 4, stops: ['zion_vc', 'sc_toq', 'camp_hc'], title: 'Springdale → Toquerville Supercharger → Hurricane Cliffs camp', mi: 39, time: '1h', batt: '48% → ~38% → charge to 90%', note: "There's no Supercharger in Hurricane. Toquerville is closest. Dinner in La Verkin/Hurricane." },

  { day: 5, stops: ['camp_hc', 'sc_toq'], title: 'Hurricane Cliffs → Toquerville Supercharger (top off)', mi: 12, time: '20m', batt: '~85% → ~80% → charge to 100%', note: 'Quick top-off before the long interstate leg.' },
  { day: 5, stops: ['sc_toq', 'sc_rich'], title: 'Toquerville → Richfield Supercharger', mi: 143, time: '2h20', batt: '100% → ~30%', note: 'I-15 N → I-70 E. At 80 mph with climbs. Beaver Supercharger is a backup ~95 mi in.' },
  { day: 5, stops: ['sc_rich', 'sc_gr'], title: 'Richfield → Green River Supercharger', mi: 126, time: '2h05', batt: '95% → ~37%', note: 'No services for ~106 miles between Salina and Green River. Charge to ~95% at Richfield first.', warn: true },
  { day: 5, stops: ['sc_gr', 'gj'], title: 'Green River → Grand Junction', mi: 101, time: '1h45', batt: '80% → ~35%', note: 'Home stretch on I-70 E.' },
];

// ---------- helpers ----------
const gSearch = q => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);
const gQuery = key => { const p = PLACES[key]; return p.q || p.ll.join(','); };
function gDir(stopKeys) {
  const params = new URLSearchParams({ api: '1', travelmode: 'driving' });
  params.set('origin', gQuery(stopKeys[0]));
  params.set('destination', gQuery(stopKeys[stopKeys.length - 1]));
  const via = stopKeys.slice(1, -1).map(gQuery);
  if (via.length) params.set('waypoints', via.join('|'));
  return 'https://www.google.com/maps/dir/?' + params.toString();
}
const placeUrl = p => p.url || gSearch(p.q || p.ll.join(','));

function el(tag, attrs = {}, ...kids) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') n.className = v;
    else if (k === 'style') n.style.cssText = v;
    else n.setAttribute(k, v);
  }
  for (const c of kids) if (c != null) n.append(c);
  return n;
}
// VS Code's built-in browser silently drops target=_blank links, so open in the same tab there.
const linkTarget = /\bElectron\//.test(navigator.userAgent) ? '_self' : '_blank';
const extLink = (href, text, cls) => el('a', { href, target: linkTarget, rel: 'noopener noreferrer', class: cls || '' }, text);
const dayOf = id => DAYS.find(d => d.id === id);

// ---------- map ----------
const map = L.map('map', { zoomControl: true });
const base = {
  'Streets': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap contributors' }),
  'Topo': L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { maxZoom: 17, attribution: '&copy; OpenStreetMap contributors, SRTM | &copy; OpenTopoMap (CC-BY-SA)' }),
  'Satellite': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19, attribution: 'Tiles &copy; Esri' }),
};
base['Streets'].addTo(map);

const groups = {};
for (const name of new Set(Object.values(CATEGORY))) groups[name] = L.layerGroup().addTo(map);
const routeGroup = L.layerGroup().addTo(map);
L.control.layers(base, { 'Route legs': routeGroup, ...groups }, { collapsed: true }).addTo(map);

function iconFor(type) {
  const t = TYPES[type];
  return L.divIcon({
    className: 'pin',
    html: `<div class="pin-inner${t.dashed ? ' dashed' : ''}" style="background:${t.color}">${t.emoji}</div>`,
    iconSize: [28, 28], iconAnchor: [14, 14], popupAnchor: [0, -14],
  });
}

const markers = [];
for (const [key, p] of Object.entries(PLACES)) {
  const pop = el('div', { class: 'popup' }, el('h3', {}, p.name));
  if (p.note) pop.append(el('div', { class: 'note' }, p.note));
  pop.append(extLink(placeUrl(p), p.url ? 'Campendium ↗' : 'Google Maps ↗', 'gbtn'));
  if (p.url) pop.append(extLink(gSearch(p.ll.join(',')), 'Pin in Google Maps ↗', 'alt'));
  const m = L.marker(p.ll, { icon: iconFor(p.type), title: p.name }).bindPopup(pop);
  markers.push({ key, p, m, group: groups[CATEGORY[p.type]] });
}

// ---------- legs ----------
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let currentDay = 'all';
let activeLeg = null;
const inDay = s => currentDay === 'all' || s.leg.day === currentDay;

const legState = LEGS.map((leg, i) => {
  const color = dayOf(leg.day).color;
  const pts = leg.stops.map(k => PLACES[k].ll);
  const line = L.polyline(pts, { color, weight: 5, opacity: 0.85, dashArray: '6 8' }).addTo(routeGroup);
  line.on('click', e => {
    if (!inDay(legState[i])) { applyFilter(leg.day); return; }
    selectLeg(i, false);
    openLegPopup(i, e.latlng);
  });
  return { leg, idx: i, color, pts, line, card: null, loaded: false };
});

// Current day in full color, previous day faded in its own color ("where you came from"), the rest grey.
function styleFor(s) {
  const dashArray = s.loaded ? null : '6 8';
  if (inDay(s)) {
    if (activeLeg === null) return { color: s.color, weight: 5, opacity: 0.9, dashArray };
    const on = s.idx === activeLeg;
    return { color: s.color, weight: on ? 8 : 4, opacity: on ? 1 : 0.35, dashArray };
  }
  if (s.leg.day === currentDay - 1) return { color: s.color, weight: 4, opacity: 0.45, dashArray };
  return { color: '#7a7a7a', weight: 3, opacity: 0.25, dashArray };
}
function restyle() {
  for (const s of legState) s.line.setStyle(styleFor(s));
  for (const s of legState) if (inDay(s)) s.line.bringToFront();
  if (activeLeg !== null) legState[activeLeg].line.bringToFront();
}

function moveTo(bounds, duration) {
  if (reduceMotion) map.fitBounds(bounds, { padding: [40, 40] });
  else map.flyToBounds(bounds, { padding: [40, 40], duration });
}

function legPopup(s) {
  const { leg } = s;
  const box = el('div', { class: 'popup' },
    el('h3', {}, `Leg ${s.idx + 1}: ${leg.title}`),
    el('div', { class: 'note' }, `${dayOf(leg.day).date} · ${leg.mi} mi · ~${leg.time} · 🔋 ${leg.batt}`),
  );
  if (leg.note) box.append(el('div', { class: 'note' }, leg.note));
  box.append(extLink(gDir(leg.stops), 'Open leg in Google Maps ↗', 'gbtn'));
  return box;
}
function openLegPopup(i, latlng) {
  const s = legState[i];
  L.popup({ maxWidth: 320 }).setLatLng(latlng || s.line.getBounds().getCenter()).setContent(legPopup(s)).openOn(map);
}

function saveState() {
  const p = new URLSearchParams();
  if (currentDay !== 'all') p.set('day', currentDay);
  if (activeLeg !== null) p.set('leg', activeLeg + 1);
  const qs = p.toString();
  history.replaceState(null, '', qs ? '#' + qs : location.pathname + location.search);
}

function selectLeg(i, zoom = true) {
  activeLeg = i;
  saveState();
  legState.forEach((s, j) => s.card && s.card.classList.toggle('active', j === i));
  restyle();
  const s = legState[i];
  if (zoom) moveTo(s.line.getBounds(), 0.8);
  s.card && s.card.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

// ---------- sidebar ----------
const list = document.getElementById('legList');
for (const d of DAYS) {
  const legs = legState.filter(s => s.leg.day === d.id);
  const miles = legs.reduce((a, s) => a + s.leg.mi, 0);
  const dayStops = legs.flatMap((s, j) => (j === 0 ? s.leg.stops : s.leg.stops.slice(1)));
  const sec = el('section', { class: 'day', 'data-day': String(d.id) },
    el('div', { class: 'day-head', style: `border-color:${d.color}` },
      el('div', {}, el('h2', {}, `Day ${d.id} · ${d.date}`), el('div', { class: 'meta' }, `${d.title} · ${miles} mi`)),
      extLink(gDir(dayStops), 'Whole day ↗', 'day-link'),
    ),
  );
  for (const s of legs) {
    const card = el('div', { class: 'leg', tabindex: '0', role: 'button' },
      el('div', { class: 'leg-title' }, el('span', { class: 'badge', style: `background:${s.color}` }, String(s.idx + 1)), s.leg.title),
      el('div', { class: 'leg-meta' }, `${s.leg.mi} mi · ~${s.leg.time} · 🔋 ${s.leg.batt}`),
      s.leg.note ? el('div', { class: 'leg-note' + (s.leg.warn ? ' warn' : '') }, s.leg.note) : null,
      extLink(gDir(s.leg.stops), 'Google Maps ↗', 'gbtn'),
    );
    card.addEventListener('click', e => { if (e.target.closest('a')) return; selectLeg(s.idx); openLegPopup(s.idx); });
    card.addEventListener('keydown', e => { if (e.key === 'Enter') { selectLeg(s.idx); openLegPopup(s.idx); } });
    s.card = card;
    sec.append(card);
  }
  list.append(sec);
}

const legend = document.getElementById('legend');
for (const t of Object.values(TYPES)) {
  legend.append(el('span', {}, (() => { const d = el('div', { class: 'pin-inner' + (t.dashed ? ' dashed' : ''), style: `background:${t.color}` }); d.textContent = t.emoji; return d; })(), t.label));
}

// ---------- day filter ----------
const filterBar = document.getElementById('dayFilter');
const filterBtns = [];
let handoff = null;
let transitionToken = 0;

function pulseMarker(ll, color, text, side) {
  return L.marker(ll, {
    icon: L.divIcon({ className: 'pulse', html: `<div class="pulse-ring" style="--c:${color}"></div>`, iconSize: [40, 40], iconAnchor: [20, 20] }),
    interactive: false, keyboard: false, zIndexOffset: -1000,
  }).bindTooltip(text, { permanent: true, direction: side, offset: [side === 'left' ? -20 : 20, 0], className: 'handoff-tip' });
}

// Draws the day's legs in travel order so the direction of travel is obvious.
function drawIn(dayLegs, token) {
  let delay = 0;
  for (const s of dayLegs) {
    const path = s.line.getElement();
    if (!path || !s.loaded) continue;
    const len = path.getTotalLength();
    const dur = Math.min(1100, Math.max(350, len * 1.2));
    path.dataset.draw = String(token);
    path.style.transition = 'none';
    path.style.strokeDasharray = `${len} ${len}`;
    path.style.strokeDashoffset = String(len);
    path.getBoundingClientRect();
    path.style.transition = `stroke-dashoffset ${dur}ms ease-in-out ${delay}ms`;
    path.style.strokeDashoffset = '0';
    setTimeout(() => {
      if (path.dataset.draw !== String(token)) return;
      path.style.transition = path.style.strokeDasharray = path.style.strokeDashoffset = '';
    }, delay + dur + 50);
    delay += dur * 0.85;
  }
}

function showHandoff(day, dayLegs, token) {
  if (day === 'all') return;
  const first = dayLegs[0].leg.stops[0];
  const last = dayLegs[dayLegs.length - 1].leg.stops.slice(-1)[0];
  const startText = day === 1 ? 'Trip starts here' : `Day ${day} starts · end of Day ${day - 1}`;
  const endText = day === DAYS.length ? 'Home' : `Day ${day} ends · camp`;
  handoff = L.layerGroup([
    pulseMarker(PLACES[first].ll, dayOf(day).color, startText, 'left'),
    pulseMarker(PLACES[last].ll, '#333', endText, 'right'),
  ]).addTo(map);
  if (!reduceMotion) drawIn(dayLegs, token);
}

function applyFilter(day, animate = true) {
  currentDay = day;
  activeLeg = null;
  saveState();
  legState.forEach(s => s.card && s.card.classList.remove('active'));
  map.closePopup();
  filterBtns.forEach(b => b.classList.toggle('on', b.dataset.day === String(day)));
  restyle();
  for (const { p, m, group } of markers) {
    const show = day === 'all' || p.days.includes(day);
    if (show) group.addLayer(m); else group.removeLayer(m);
  }
  document.querySelectorAll('.day').forEach(sec => { sec.style.display = (day === 'all' || sec.dataset.day === String(day)) ? '' : 'none'; });
  if (handoff) { map.removeLayer(handoff); handoff = null; }

  const dayLegs = legState.filter(inDay);
  const bounds = L.latLngBounds([]);
  dayLegs.forEach(s => bounds.extend(s.line.getBounds()));
  if (!bounds.isValid()) return;
  const token = ++transitionToken;
  if (!animate || reduceMotion) {
    map.fitBounds(bounds, { padding: [40, 40] });
    showHandoff(day, dayLegs, token);
    return;
  }
  // moveend may not fire if the view doesn't change, so fall back to a timer.
  let landed = false;
  const land = () => {
    if (landed || token !== transitionToken) return;
    landed = true;
    showHandoff(day, dayLegs, token);
  };
  map.once('moveend', land);
  setTimeout(land, 1900);
  map.flyToBounds(bounds, { padding: [40, 40], duration: 1.5 });
}
for (const opt of ['all', ...DAYS.map(d => d.id)]) {
  const b = el('button', { type: 'button', 'data-day': String(opt) }, opt === 'all' ? 'All days' : `Day ${opt}`);
  b.addEventListener('click', () => applyFilter(opt));
  filterBtns.push(b);
  filterBar.append(b);
}
// Restore the day/leg from the URL hash (e.g. after pressing Back from Google Maps).
const saved = new URLSearchParams(location.hash.slice(1));
const savedDay = Number(saved.get('day'));
applyFilter(DAYS.some(d => d.id === savedDay) ? savedDay : 'all', false);
const savedLeg = Number(saved.get('leg')) - 1;
if (legState[savedLeg] && inDay(legState[savedLeg])) selectLeg(savedLeg);

// ---------- road geometry (OSRM, cached in localStorage) ----------
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function fetchRoute(pts) {
  const coords = pts.map(([la, ln]) => `${ln},${la}`).join(';');
  const key = 'osrm:v1:' + coords;
  try { const c = localStorage.getItem(key); if (c) return { line: JSON.parse(c), cached: true }; } catch (_) { /* storage blocked */ }
  const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`);
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const data = await res.json();
  if (data.code !== 'Ok') throw new Error(data.code);
  const line = data.routes[0].geometry.coordinates.map(([ln, la]) => [+la.toFixed(5), +ln.toFixed(5)]);
  try { localStorage.setItem(key, JSON.stringify(line)); } catch (_) { /* quota or blocked */ }
  return { line, cached: false };
}
(async () => {
  for (const s of legState) {
    try {
      const { line, cached } = await fetchRoute(s.pts);
      s.line.setLatLngs(line);
      s.loaded = true;
      s.line.setStyle(styleFor(s));
      if (!inDay(s)) s.line.bringToBack();
      if (!cached) await sleep(1100); // public OSRM demo server: max 1 req/sec
    } catch (err) {
      console.warn('Route fetch failed for leg', s.idx + 1, err);
    }
  }
  restyle();
})();
