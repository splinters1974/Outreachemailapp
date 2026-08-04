const { h1, h2, h3, h4, p, bullet, table, snapshot, callout, spacer, pageBreak, caption } = require('./lib');

function segment(n, title, rows, body) {
  const out = [h2(`8.${n} ${title}`), snapshot(rows), spacer(60)];
  body.forEach((s) => {
    out.push(h4(s.title));
    if (s.para) s.para.forEach((t) => out.push(p(t)));
    if (s.bullets) s.bullets.forEach((t) => out.push(bullet(t)));
    if (s.table) out.push(table(s.table.head, s.table.rows, s.table.widths, s.table.opts || { firstColBold: true }));
    if (s.caption) out.push(caption(s.caption));
  });
  return out;
}

module.exports = [
  pageBreak(),

  // ===================== 7. CHALLENGERS =====================
  h1('7. Three challengers who could enter the top ten within 24 months'),

  p('These three are not currently among our most frequent competitors, but each has a specific, identifiable path into direct competition with the full Ameresco proposition. They should be tracked as if they were already in the top ten.'),

  h2('7.1 Hemiko — the purpose-built city heat competitor'),
  snapshot([
    ['Ownership', 'DIF Capital Partners holds a significant majority following acquisition; management retains a minority stake.'],
    ['Formerly', 'Pinnacle Power. Founded 2012; rebranded and recapitalised as Hemiko.'],
    ['Firepower', 'c.£1bn of investment to deploy into town and city-wide low-carbon heat networks by 2030.'],
    ['Model', 'Investor, developer, owner and operator of heat networks — a pure-play city-scale ESCO for heat.'],
    ['Notable', 'Selected as project developer on what is described as the UK\'s first data centre waste heat network — a bridge between the Cities and Data Centres segments.'],
  ]),
  spacer(60),
  p('Hemiko matters because it is the competitor most precisely designed for the market that heat network zoning is about to create. It has patient infrastructure capital, no legacy business to defend, no supply book, and a single strategic objective: own city heat. In a zoned, concession-based market that is a very strong position.'),
  p('**Where we beat them:** breadth. Hemiko does heat. A city partnership is schools, social housing, council buildings, EV, solar, community energy and heat — Bristol City Leap is the proof that the integrated version is deliverable. Where a council procures a heat concession alone, Hemiko is formidable; where a council procures a city energy partnership, they need partners and we do not.'),
  p('**Where they beat us:** focus and cost of capital in heat alone, plus the credibility of an owner whose only business is the thing being procured.'),
  p('**Watch for:** Zone Coordinator delivery appointments in the six first zones; any move to broaden beyond heat; further DIF capital commitments.'),

  h2('7.2 ENGIE UK — the sleeping giant that just bought a network'),
  snapshot([
    ['Ownership', 'ENGIE SA (France).'],
    ['The move', 'Acquired UK Power Networks in May 2026 — c.8.5m households across London, the South East and the East of England, c.192,000km of network, c.6,500 employees. The UK became ENGIE\'s second-largest country of operation.'],
    ['Other 2025–26 activity', 'Acquired a 157MW solar and onshore wind portfolio in England and Wales (2025); signed a ten-year biomethane supply agreement with PepsiCo (2026); supplies c.17,000 UK business customers.'],
    ['Gap', 'ENGIE sold its services arm — which became EQUANS — and therefore lacks a large UK building-level delivery organisation.'],
  ]),
  spacer(60),
  p('ENGIE now owns regulated network, generation, supply and a large business customer base in the UK. The one thing it does not have is the services and delivery capability it divested. **If ENGIE rebuilds or acquires a UK services arm, it becomes a top-five competitor almost immediately** — with a cost of capital, a network position and a customer base that few can match.'),
  p('**Watch for:** any UK services or ESCO acquisition; use of UKPN connection capability as a commercial weapon in data centre and large I&C deals; re-entry into UK heat networks.'),

  h2('7.3 Zenobe — the funded energy-as-a-service model, pointed elsewhere for now'),
  snapshot([
    ['Ownership', 'Private, infrastructure and PE-backed.'],
    ['Scale', 'More than £3.2bn raised since 2017. A £980m platform financing in 2026 for 1,200+ additional electric buses and associated infrastructure in the UK and Ireland, following a €325m European facility. Targeting up to 5,000 electric buses across the UK and Europe by 2028.'],
    ['Grid-scale', 'Brought a 300MW / 600MWh BESS online at Kilmarnock in early 2026; over 1,100MW of contracted storage with a large pipeline.'],
    ['Model', 'Funds, owns, installs and operates charging infrastructure, batteries and vehicles, and manages the energy — a genuine EaaS wrap in its chosen niche.'],
  ]),
  spacer(60),
  p('Zenobe is the clearest proof in the UK market that the funded, own-and-operate energy-as-a-service model works at scale outside the traditional ESCO sector. Today they compete with us only at the edges — depot electrification and grid-scale storage. The risk is directional: an organisation with that much capital, that operating model and a proven ability to raise platform debt could extend into behind-the-meter industrial energy with very little adaptation.'),
  p('**Where we beat them:** technology breadth. Zenobe is fleet and battery. They have no heat, fabric, CHP or estate capability.'),
  p('**Watch for:** any move into non-fleet behind-the-meter generation or industrial energy programmes.'),

  pageBreak(),

  // ===================== 8. SEGMENT MAPS =====================
  h1('8. Segment-by-segment competitive maps'),

  p('Each segment has a different buyer, a different procurement route and a different competitor set. The same competitor can be Critical in one segment and irrelevant in another. These maps are the working tool for qualification.'),

  // ---------------- 8.1 I&C
  ...segment(1, 'Industrial & Commercial (I&C)', [
    ['The buyer', 'MD/CEO, CFO, Energy Director, Operations Director, Sustainability Director, Site Director, Facilities/Property Director.'],
    ['Lead pain', 'Cost, resilience and grid risk across multi-site, grid-constrained estates with ageing plant and board pressure on energy spend and compliance.'],
    ['How it is bought', 'Direct negotiation, RFP, or increasingly via an energy consultancy running a competitive process. Rarely a formal framework.'],
    ['Our lane', 'Complexity. Multi-site, multi-technology, grid-constrained estates where the answer is a programme, not a product.'],
  ], [
    { title: 'Competitor set', table: {
      head: ['Competitor', 'How they come at it', 'Threat'],
      rows: [
        ['Centrica Business Solutions', '1MW+ behind-the-meter generation with in-house finance, warm access via the supply book', 'HIGH'],
        ['SSE Energy Solutions', 'Funded solar PPA, private wire, off-site land, connections', 'HIGH'],
        ['E.ON', 'Supply plus infrastructure bundle, private networks', 'HIGH'],
        ['EDF / Dalkia', 'Supply relationship plus technical services and retrofit delivery', 'HIGH'],
        ['Vital Energi', 'Energy centres, CHP transition, heat and process energy for industrial sites', 'HIGH'],
        ['Octopus Energy (business)', 'Supply, export tariffs, multi-site portfolios, solar-plus-battery economics; strongest on optimisation and price signals', 'MEDIUM'],
        ['Mitie', 'FM incumbency plus solar and grid connections', 'MEDIUM'],
        ['EQUANS', 'FM incumbency plus efficiency and retrofit at volume', 'MEDIUM'],
        ['Schneider / Siemens / JCI / Honeywell', 'Controls, analytics and performance contracts on the building stock', 'MEDIUM'],
        ['Atrato Onsite Energy, Custom Solar, Anesco, Geo Green Power', 'Funded or EPC rooftop solar only — the classic disaggregation threat', 'MEDIUM'],
        ['Clarke Energy, Edina', 'CHP and engine-based generation, often as our subcontractor or our displacer', 'PARTNER / MEDIUM'],
        ['Aggreko', 'Modular microgrids and hired energy-as-a-service for temporary or bridging power', 'PARTNER / LOW'],
        ['Inspired plc (HGGC-owned)', 'Consultancy that shapes the buying process and can recommend structures; 3,500+ customers', 'MEDIUM (influence)'],
      ],
      widths: [26, 56, 18],
      opts: { firstColBold: true, autoShade: true, centreCols: [2] },
    } },
    { title: 'The real threat in this segment', para: [
      'It is not any single name on that list. It is **the consultant-led competitive process that reduces a programme to a comparable unit price.** Energy consultancies — now increasingly PE-backed, of which HGGC\'s acquisition of Inspired is the clearest example — earn their fee by demonstrating savings against a benchmark. That pushes towards single-technology, lowest-price outcomes.',
      'The deck\'s existing warning stands and should be sharpened: **watch large buyers insourcing energy management with PE-backed advisers.** The counter is to engage before the specification is written, and to reframe the comparison around risk transfer rather than unit cost.',
    ] },
    { title: 'How to land it here', bullets: [
      'Never lead with technology. Lead with cost volatility, grid constraint and plant risk at board level.',
      'Use funded structures and long-term O&M to escape EPC-contractor comparison.',
      'Qualify out early where the buyer wants the cheapest price for a single technology — that is not our lane and pursuing it costs us more than losing it.',
      'Where a grid connection is the binding constraint, consider partnering with SSE, an IDNO or an ICP rather than competing on a capability we do not hold.',
    ] },
  ]),

  pageBreak(),

  // ---------------- 8.2 Public sector
  ...segment(2, 'Public Sector — NHS, universities, central government, local authority estates', [
    ['The buyer', 'NHS Estates Director, Trust CFO, University Estates, Council Property, Procurement Lead.'],
    ['Lead pain', 'Compliance, funding and estate risk — resilience, backlog maintenance, ageing plant, service continuity, binding net zero deadlines (NHS net zero 2040).'],
    ['How it is bought', 'Frameworks, overwhelmingly. The NOE CPC £1bn Decarbonisation and Energy Infrastructure framework (live 1 Oct 2026 – 30 Sep 2029) and NHS SBS Decarbonisation of Estates (SBS10504) dominate NHS. Elsewhere: CCS, SCAPE, Pagabo, Procure Partnerships, YPO, ESPO, LHC, Fusion21, Re:fit.'],
    ['Our lane', 'Funded delivery under the NHS Net Zero pathway; EaaS structures that free capital for clinical priorities; long-term M&V accountability across multi-site estates.'],
  ], [
    { title: 'Competitor set', table: {
      head: ['Competitor', 'How they come at it', 'Threat'],
      rows: [
        ['Vital Energi', 'Energy centres, heat networks, NHS and university incumbency, framework presence', 'CRITICAL'],
        ['EQUANS', 'Volume retrofit, framework coverage, grant bid capability, self-delivery', 'CRITICAL'],
        ['Dalkia UK', 'Public sector retrofit machine built on PSDS; EDF backing', 'HIGH'],
        ['E.ON', 'Heat networks and campus infrastructure under long partnerships', 'HIGH'],
        ['Veolia', 'Municipal heat, EfW-linked district heating, technical services', 'HIGH'],
        ['Centrica Business Solutions', 'Hospital energy centres, CHP transition, funded generation', 'HIGH'],
        ['Siemens / Schneider / Johnson Controls (Asset+)', 'Controls incumbency, performance contracts, funded via captive finance', 'MEDIUM'],
        ['Mitie', 'FM incumbency, defence estate, solar and connections', 'MEDIUM'],
        ['Amey, Kier, Balfour Beatty, Morgan Sindall, Wates', 'Construction and estates contractors bidding decarbonisation lots', 'MEDIUM'],
        ['Regional M&E and solar contractors', 'Single-lot price competition on regional framework lots', 'MEDIUM'],
        ['AECOM, Arup, Ramboll, WSP, Mott MacDonald, Turner & Townsend', 'Consultancy lots — they write the specification we then have to live with', 'MEDIUM (influence)'],
      ],
      widths: [26, 56, 18],
      opts: { firstColBold: true, autoShade: true, centreCols: [2] },
    } },
    { title: 'The two things that decide this segment in 2026–28', para: [
      '**First, framework position.** The NOE CPC framework admits up to 180 suppliers across 20 lots. Being on it is necessary and almost meaningless; being on **Lot 6, the £200m principal partner / total service provision lot**, is the only position that pays for our model. Every other lot invites us into a price fight or a subcontract.',
      '**Second, the grant cliff.** PSDS is closed to new investment; Phase 3c ends March 2026 and Phase 4 ends March 2028. Great British Energy grant is available for solar and efficiency on schools and NHS sites — roughly £180m committed, with a 2026 round open on a rolling basis. The competitive consequence is specific: **do not sell funded solar into a building that can get a GBE grant.** Sell the heat, the plant, the resilience and the M&V, and let the grant do the roof.',
    ] },
    { title: 'How to land it here', bullets: [
      'Lead with estate risk — resilience, compliance, plant condition — before commercial structure. Estates directors buy risk reduction; finance directors buy the structure.',
      'Use the end of grant as the strategic frame: "what is your plan for the estate after March 2028?"',
      'Quantify the capital release. EaaS that frees capital for clinical priorities is a CFO argument, and the CFO is the person who can say yes.',
      'Treat the consultancy lots as a competitive battleground, not neutral ground. Whoever writes the feasibility study writes the payment mechanism.',
    ] },
  ]),

  pageBreak(),

  // ---------------- 8.3 Grid scale
  ...segment(3, 'Grid-Scale / Front-of-Meter — asset and development market', [
    ['The buyer', 'IPP Development Directors, Infrastructure Fund Investment teams, Utility Portfolio Leads.'],
    ['Lead pain', 'Scale, grid connection and route to market. Delivery speed, planning risk and capital deployment at programme scale.'],
    ['How it is bought', 'Bilateral EPC awards, competitive EPC tenders, development partnerships, asset sales.'],
    ['Our lane', 'Top-tier EPC credentials — Cellarhead (300MW / 624MWh, £196.5m) and Sonnedix (300MWp). **Decide the role before pursuit: developer, EPC, owner, funder, optimiser or partner.**'],
  ], [
    { title: 'Competitor and partner set', table: {
      head: ['Organisation', 'Role', 'Compete or partner'],
      rows: [
        ['Lightsource bp', 'Largest UK solar developer; ownership in flux following bp\'s "Project Scala" process', 'Both — developer client and rival'],
        ['Statera Energy', 'Developer-owner at scale; acquired the 680MW Carrington BESS project (Jan 2025)', 'Both'],
        ['Zenobe', 'Developer-owner-operator; 300MW/600MWh Kilmarnock online early 2026', 'Both'],
        ['Harmony Energy, Field, Eku Energy (Macquarie), Fidra, NatPower, Penso Power, Root-Power, Elgin, Enso', 'Developer-owners across BESS and solar', 'Client / partner'],
        ['Gresham House Energy Storage, Foresight, NextEnergy, Bluefield, Low Carbon, Octopus Energy Generation', 'Fund owners of operating assets', 'Client / funder'],
        ['Belectric', 'EPC — secured c.210MWp across four UK plants with Severn Trent Green Power, construction from March 2026; UK arm hosts its global BESS centre of excellence', 'COMPETE'],
        ['Anesco', 'Vertically integrated EPC with BESS leadership and ICP capability', 'COMPETE'],
        ['Ethical Power / Ethical Power Connections', 'EPC and BOP with over a gigawatt of grid connections delivered', 'COMPETE'],
        ['Voltalia, BSR, RES', 'EPC and O&M', 'COMPETE'],
        ['Wärtsilä, Fluence, Tesla, Sungrow, BYD, CATL, Trina Storage', 'Technology suppliers, increasingly offering integrated delivery', 'Supplier / compete'],
        ['Balfour Beatty, M Group, Morgan Sindall Infrastructure, Murphy, Omexom Taylor Woodrow', 'HV and transmission delivery; appointed to National Grid\'s £1.2bn Electricity Transmission Partnership phase', 'Adjacent / partner'],
        ['EDF, SSE, ENGIE, ScottishPower, Statkraft', 'Utility developer-owners', 'Both'],
      ],
      widths: [30, 48, 22],
      opts: { firstColBold: true },
    } },
    { title: 'The structural read', para: [
      'This is a development and asset market, not a larger version of behind-the-meter. The scarce goods are **grid connection rights, land and capital** — not construction capability. EPC margin is compressing as more contractors qualify, while connection queue positions appreciate.',
      'Our credentials are genuinely top-tier and they open doors. But competing purely as an EPC puts us in a commoditising market against Belectric, Anesco, Ethical Power and a lengthening list of European entrants. **The value of this segment to Ameresco is mainly as proof for the other four segments** — evidence that we design, deliver and operate nationally significant infrastructure — plus selective participation where we can take a development, funding or optimisation role rather than a construction one.',
    ] },
    { title: 'How to land it here', bullets: [
      'Define the role before the pursuit. An EPC bid, a development partnership and a funding role need different teams, different pricing and different risk appetite.',
      'Treat developers and funds as clients and partners first, competitors second.',
      'Use Cellarhead and Sonnedix as proof points in I&C, Public Sector, Cities and Data Centres — that is where they earn their keep.',
      'Be selective. Winning low-margin EPC at scale consumes delivery capacity that is worth more in funded programmes.',
    ] },
  ]),

  pageBreak(),

  // ---------------- 8.4 Cities
  ...segment(4, 'Cities and city-wide partnerships', [
    ['The buyer', 'Council CEO, Cabinet Leader, Director of Place, S151 Officer, Net Zero Lead.'],
    ['Lead pain', 'Governance, investment scale and local value. Complex multi-asset estates, political accountability and long-term community obligations.'],
    ['How it is bought', 'Competitive dialogue, concession and joint-venture structures, and — from 2026 — heat network zone designation with Zone Coordinators determining what is built, where and by whom.'],
    ['Our lane', 'The integrated funded proposition: schools, social housing, heat networks, council buildings, EV and community energy under one programme rather than separate workstreams. Bristol City Leap is the strongest proof point we have.'],
  ], [
    { title: 'Competitor set', table: {
      head: ['Competitor', 'How they come at it', 'Threat'],
      rows: [
        ['E.ON (EIS)', 'City strategic energy partnerships (Coventry, 15 years), owned networks (Citigen), ambient networks (Silvertown/Lendlease), heat zoning positioning', 'CRITICAL'],
        ['Vital Energi', 'City and regional heat networks, energy centres, UK-owned local value story', 'CRITICAL'],
        ['Hemiko (DIF)', 'Pure-play city heat investor-developer-operator with c.£1bn to 2030', 'CRITICAL'],
        ['Veolia', 'EfW-linked municipal heat; Ecothermal Grid with a £1bn pipeline to 2030 and £210m of 2025 UK wins; Southwark 2.0', 'HIGH'],
        ['SSE Energy Solutions', 'Networks, private wire and funded generation across council estates', 'HIGH'],
        ['EQUANS', 'Regeneration plus retrofit plus FM across the council estate and housing stock', 'HIGH'],
        ['Vattenfall Heat UK (sale reported to Reinova Capital)', 'Incumbent heat networks in Bristol, Midlothian and Brent Cross — and our JV partner in Bristol', 'Counterparty change'],
        ['1Energy, Switch2, Metropolitan, Star Energy + Veolia (geothermal)', 'Heat network development, operation and metering/billing', 'MEDIUM'],
        ['Equitix, Amber Infrastructure, Greencoat, InfraRed, Triple Point HNIM', 'Capital that will back whichever developer wins — including our competitors', 'Funder'],
        ['Ramboll, Arup, AECOM, Buro Happold, Local Partnerships', 'Zone and network design, and adviser to the council', 'Influence'],
      ],
      widths: [26, 56, 18],
      opts: { firstColBold: true, autoShade: true, centreCols: [2] },
    } },
    { title: 'What zoning changes', para: [
      'Six first zones have been designated — Leeds, Plymouth, **Bristol**, Stockport, Sheffield and two London areas — sharing £5.8m of development funding, with construction expected from 2026/27. Statutory instruments for zoning and for the rights and powers regime were anticipated in spring 2026, and new buildings within designated zones face heat-network-ready requirements.',
      'This converts city heat from a business development market into a **regulated concession market**. Incumbency inside a zone becomes structurally valuable, and the decisions are being made now. Bristol being one of the six first zones is a material advantage to us and a target for every competitor above.',
    ] },
    { title: 'The Bristol counterparty question — handle it before a competitor raises it', para: [
      'Vattenfall began an ownership assessment of its UK district heating business in March 2025; press reporting indicates a sale of Bristol Heat Networks, Midlothian Energy and Vattenfall Brent Cross to Reinova Capital, with the UK IDNO business separately sold to Eclipse Power (Octopus Sky Fund). At the time of writing this is reported rather than confirmed by the parties.',
      '**Competitors will use this in city pursuits.** The line needs to be agreed centrally, said confidently and said first: the City Leap partnership is a contracted twenty-year structure with Bristol City Council; Ameresco\'s commitment, capital and obligations are unchanged; a change in a partner\'s shareholder is a normal event in twenty-year infrastructure and the partnership is designed to survive it. Then move immediately to delivery evidence: expected to exceed the £424m of low carbon delivery set out in the bid by the end of the first five years, £15m of social value generated, £10m invested in energy efficiency for households at risk of fuel poverty, a community energy fund with £750,000 from each partner, and a new 1MW air source heat pump energy centre joining the network from autumn 2026.',
    ] },
    { title: 'How to land it here', bullets: [
      'Show the whole city system under one programme. Every competitor above can do a heat network; almost none can do schools, housing, buildings, EV, community energy and heat together.',
      'Lead with governance and political risk management, not technology. Councils fail on governance more often than on engineering.',
      'Quantify local value with mechanisms, not adjectives — the Bristol social value numbers are the strongest evidence in the market.',
      'Engage before zone designation. Once a Zone Coordinator has appointed a delivery partner, the market is closed for twenty years.',
    ] },
  ]),

  pageBreak(),

  // ---------------- 8.5 Data centres
  ...segment(5, 'Data Centres', [
    ['The buyer', 'DC Development Directors, Hyperscaler Energy Procurement, Colocation Infrastructure Leads.'],
    ['Lead pain', 'Speed to power, resilience and grid mitigation. Planning, land, connection and heat export at development stage.'],
    ['How it is bought', 'Bilateral development agreements, PPAs, private wire agreements, connection agreements. Not frameworks.'],
    ['Our lane', 'Compete on grid capacity, land, power resilience, planning and energy infrastructure funding. **Partner on internal critical infrastructure — do not compete.**'],
  ], [
    { title: 'The competitor set is not who you would expect', table: {
      head: ['Organisation', 'What they bring', 'Compete or partner'],
      rows: [
        ['Octopus Energy', 'PPA, flexibility, supply and increasingly network via Eclipse Power (Octopus Sky Fund) which acquired Vattenfall Networks', 'COMPETE'],
        ['EDF', 'Baseload PPA, nuclear provenance, supply', 'COMPETE'],
        ['Centrica', 'PPA, private wire, on-site generation', 'COMPETE'],
        ['SSE Energy Solutions', 'Private wire, off-site land, networks and connections', 'COMPETE'],
        ['ENGIE (with UK Power Networks)', 'Regulated network ownership in exactly the geography where demand is concentrated', 'COMPETE — and increasingly decisive'],
        ['Statera, NatPower, Fidra, Eku', 'Co-located generation and storage, land with queue positions', 'Both'],
        ['Aggreko', 'Modular microgrids and bridging power for the gap between demand and grid', 'PARTNER'],
        ['Rolls-Royce mtu, Caterpillar/Finning, Cummins, Kohler', 'Standby and prime power generation', 'PARTNER'],
        ['Vertiv, Eaton, Schneider Electric, ABB', 'UPS, switchgear, power train, cooling', 'PARTNER'],
        ['Mercury Engineering, Winthrop Technologies, Kirby Group, Dornan (Turner), Collen, Designer Group, Ethos', 'Critical MEP and turnkey data centre delivery — an established, hyperscaler-trusted ecosystem', 'PARTNER — do not compete'],
        ['Keysource (Salute), Sudlows, Comtec, RED Engineering, Arup', 'Design, commissioning and consultancy', 'PARTNER'],
        ['Hemiko', 'Selected as developer on a first-of-a-kind UK data centre waste heat network — the heat export play', 'COMPETE'],
        ['Vattenfall Heat UK / successor, Veolia, Vital Energi', 'Heat offtake and district heating for waste heat export', 'Both'],
      ],
      widths: [28, 50, 22],
      opts: { firstColBold: true },
    } },
    { title: 'The structural read', para: [
      'Around 140 proposed UK data centres have requested approximately 50GW of grid connection capacity against a national peak of roughly 45GW, and high-capacity connections take over a year to secure even once approved. AI Growth Zones — Culham designated first, with further sites expected near existing transmission capacity — give priority connection access and the right for developers to build their own high-voltage lines and substations. The UK framework permits private wire and bilateral PPAs, letting generators sell directly to large end users.',
      'The consequence is that **this segment is won on scarcity, not service**. Whoever controls land with a connection, or can deliver private wire and on-site generation fast, sets the terms. Our positioning line holds and is worth repeating verbatim: data centres do not have a power problem, they have an energy infrastructure problem.',
    ] },
    { title: 'How to land it here', bullets: [
      'Lead with grid mitigation, private wire, funded connection infrastructure and heat export economics — the things that de-risk a development.',
      'Use Cellarhead and Sonnedix as evidence of nationally significant infrastructure delivery. This is the segment where those credentials land hardest.',
      'Partner deliberately and early with the critical MEP ecosystem. Competing with Mercury, Winthrop, Kirby or Dornan on white space is a losing position and damages our standing as a partner.',
      'Heat export is a genuine differentiator and a bridge to the Cities segment — but note Hemiko has moved first on a first-of-a-kind scheme.',
      'Track AI Growth Zone designations closely; the zones effectively pre-select where this market exists.',
    ] },
  ]),

  pageBreak(),

  // ---------------- 8.6 Retrofit
  ...segment(6, 'Social Housing & Schools Retrofit', [
    ['The buyer', 'Housing association Asset Directors, Council Housing and Property leads, Multi-Academy Trust and school business managers, DfE.'],
    ['Lead pain', 'EPC C targets, fuel poverty, damp and mould liability, grant compliance (PAS 2035), and a maintenance backlog with no capital.'],
    ['How it is bought', 'Frameworks and grant-linked programmes — Warm Homes: Social Housing Fund (Wave 3, c.£1.2bn 2025–28, within a £15bn Warm Homes Plan targeting up to 5 million homes by 2030), PfH (including a £480m repairs and disrepair framework), LHC retrofit and decarbonisation frameworks, Efficiency North, Fusion21.'],
    ['Our lane', '**Narrow, and it should stay narrow.** Access this segment inside city-wide programmes — as Bristol City Leap does — rather than as a standalone retrofit contractor.'],
  ], [
    { title: 'Competitor set', table: {
      head: ['Competitor', 'Position', 'Threat to us'],
      rows: [
        ['EQUANS', 'Market-leading retrofit coordinator and deliverer; Retrofit Coordination Company of the Year 2026; on all four lots of the £480m PfH framework', 'HIGH (in city programmes)'],
        ['Sureserve Group', 'End-to-end retrofit from funding and design to installation at scale; PE-owned', 'MEDIUM'],
        ['United Living', 'SHDF assessment through to installation; major framework positions', 'MEDIUM'],
        ['Fortem (Willmott Dixon), Mears, Wates, Novus, Ian Williams, Bell Group, Morgan Sindall Property Services, Lovell', 'Volume housing maintenance and retrofit contractors', 'LOW-MEDIUM'],
        ['E.ON, British Gas/Centrica, Warmworks', 'ECO and grant-funded measure delivery at household level', 'LOW'],
        ['Sustainable Building Services, Melius Homes, AgilityEco', 'Retrofit specialists and grant delivery partners', 'LOW'],
        ['Kensa, Clade, Vaillant, Mitsubishi, Daikin, Ideal', 'Heat pump manufacture and shared ground loop infrastructure', 'PARTNER'],
      ],
      widths: [28, 50, 22],
      opts: { firstColBold: true, autoShade: true, centreCols: [2] },
    } },
    { title: 'Honest assessment', para: [
      'This is not an Ameresco market on its own terms. It is a volume, labour-margin, grant-compliance business where the winners have thousands of operatives and PAS 2035 machinery. Across the Warm Homes: Social Housing Fund, solar PV is the single most common measure at around 42% of installations, insulation around 36% and low carbon heating around 13% — a measure-counting programme, not a systems programme.',
      '**Where it does matter to us is inside city programmes.** A council or city partnership that wants schools, social housing, heat and council buildings under one governance structure needs somebody who can hold the whole thing together — and that is exactly the Bristol City Leap shape. Compete for the programme; subcontract the volume.',
    ] },
    { title: 'How to land it here', bullets: [
      'Bid it only as a workstream inside a wider funded programme, never as a standalone retrofit tender.',
      'Partner with volume retrofit contractors rather than building the capability.',
      'Use the fuel poverty and social value mechanism from Bristol — £10m of energy efficiency investment for households at risk of fuel poverty — as the credibility bridge into housing conversations.',
    ] },
  ]),

  pageBreak(),

  // ---------------- 8.7 EV
  ...segment(7, 'EV Infrastructure & Fleet', [
    ['The buyer', 'Fleet Directors, Depot and Operations Managers, Local authority transport leads, Bus and logistics operators.'],
    ['Lead pain', 'Depot power capacity, capital cost of chargers and vehicles, grid connection lead times, and uptime risk on operational fleets.'],
    ['How it is bought', 'Funded platform deals, concession agreements (public charging), framework call-offs, and increasingly bundled vehicle-plus-infrastructure financing.'],
    ['Our lane', 'EV as a workstream inside an estate or city programme — depot electrification alongside generation, storage and grid works — not as a standalone charging business.'],
  ], [
    { title: 'Competitor set', table: {
      head: ['Organisation', 'Model', 'Relevance to us'],
      rows: [
        ['Zenobe', 'Funds, owns and operates vehicles, chargers and energy management; £3.2bn+ raised; £980m 2026 platform financing for 1,200+ buses', 'CRITICAL in depot electrification'],
        ['Believ (Liberty Global / Zouk)', 'Funded public charging concessions with local authorities', 'MEDIUM (city programmes)'],
        ['Connected Kerb (Aviva-backed)', 'On-street and destination charging under long concessions', 'MEDIUM'],
        ['SWARCO Smart Charging, Mer (Statkraft), char.gy, ubitricity (Shell)', 'On-street and residential charging concessions', 'LOW-MEDIUM'],
        ['bp pulse, InstaVolt (EQT), Osprey, Gridserve (Infracapital), Pod Point (EDF)', 'Public rapid charging networks', 'LOW'],
        ['Voltempo, Milence, Paua', 'Heavy fleet and HGV charging', 'LOW'],
        ['Mitie (Rock Power), OCU, Freedom Networks, GTC, Eclipse Power', 'Depot grid connections and HV infrastructure', 'PARTNER / compete'],
        ['EQUANS, Amey, SSE', 'Depot electrification within wider contracts', 'MEDIUM'],
      ],
      widths: [28, 48, 24],
      opts: { firstColBold: true, autoShade: true, centreCols: [2] },
    } },
    { title: 'Honest assessment', para: [
      'Zenobe has effectively defined the funded model in this segment and has raised capital at a scale that makes head-on competition on bus and coach depots unattractive. The credible Ameresco position is **depot electrification as part of a larger estate or city energy programme** — where the customer needs the connection, the on-site generation, the storage and the chargers solved together, and where the charging alone is too small to interest a specialist platform.',
      'Public on-street charging concessions are a different business — long, capital-intensive, local-authority-facing — and are best treated as a partnering opportunity inside city programmes rather than a market to enter.',
    ] },
  ]),
];
