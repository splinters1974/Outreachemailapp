const { h1, h2, h3, h4, p, bullet, table, snapshot, callout, spacer, pageBreak, caption } = require('./lib');

const TW = [28, 46, 26];
const TOPTS = { firstColBold: true, autoShade: true, centreCols: [2] };

module.exports = [
  pageBreak(),

  // ===================== 9. TECHNOLOGY COMPONENT COMPETITORS =====================
  h1('9. Technology-component competitors: the partial players'),

  p('Ameresco is technology agnostic, which means almost every specialist in this section is simultaneously a potential subcontractor, a potential partner and a potential competitor. They become competitors at the moment a buyer decides to procure a technology instead of a programme.'),

  callout('The rule for this section',
    'A component specialist is only dangerous when the scope has already been narrowed to their component. **The competitive act is therefore upstream — in how the requirement is framed — not at tender stage.** By the time a solar-only tender is issued, we have already lost or already decided not to play.'),

  h2('9.1 Solar PV — rooftop, ground-mount and funded'),

  table(['Organisation', 'What they do', 'Threat / role'], [
    ['Lightsource bp', 'Largest UK solar developer-owner; ownership in flux following bp\'s process to sell a c.50% stake', 'Partner / compete (grid-scale)'],
    ['Belectric', 'Global EPC; c.210MWp UK contract with Severn Trent Green Power from March 2026; UK global BESS centre of excellence', 'HIGH (EPC)'],
    ['Anesco', 'Vertically integrated EPC with ICP capability and O&M across solar and BESS', 'HIGH (EPC)'],
    ['Ethical Power / Ethical Power Connections', 'EPC and balance of plant; over 1GW of grid connections delivered', 'HIGH (EPC)'],
    ['Custom Solar (Mitie)', 'Commercial and public sector rooftop and ground-mount; defence estate work', 'MEDIUM'],
    ['Voltalia, BSR, RES, Enviromena', 'EPC and O&M contractors', 'MEDIUM'],
    ['Atrato Onsite Energy', 'Funded on-site solar for commercial customers — closest to our behind-the-meter funding model in solar alone', 'MEDIUM'],
    ['Geo Green Power, Absolute Solar & Wind, AEG, regional installers', 'Commercial rooftop EPC at keen prices', 'MEDIUM (disaggregation)'],
    ['NextEnergy Capital, Foresight Solar, Bluefield, Low Carbon, Octopus Energy Generation, Elgin Energy, Enso Energy, Island Green Power', 'Developers and fund owners', 'Client / funder'],
    ['Statkraft (ex-Solarcentury)', 'Developer and PPA offtaker', 'Both'],
  ], TW, TOPTS),

  h2('9.2 Battery energy storage (BESS)'),

  table(['Organisation', 'What they do', 'Threat / role'], [
    ['Zenobe', '300MW/600MWh Kilmarnock online early 2026; 1,100MW+ contracted; targeting 1.2GW by 2027', 'HIGH (developer-owner)'],
    ['Statera Energy', 'Developer-owner; acquired the 680MW Carrington project January 2025', 'HIGH'],
    ['Harmony Energy, Field, Eku Energy (Macquarie), Fidra Energy, NatPower UK, Penso Power, Root-Power, Pacific Green', 'Developer-owners across the GB pipeline', 'Client / compete'],
    ['Gresham House Energy Storage Fund', 'Listed owner of operating BESS', 'Client / funder'],
    ['Wärtsilä, Fluence, Tesla, Sungrow, BYD, CATL, Trina Storage, Envision', 'Integrators and suppliers, increasingly offering full-wrap delivery', 'Supplier / compete'],
    ['Belectric, Anesco, Ethical Power, G2 Energy (Mitie)', 'BESS EPC and balance of plant', 'HIGH (EPC)'],
    ['Powerstar, Connected Energy', 'Behind-the-meter industrial storage, voltage optimisation, second-life batteries', 'MEDIUM (I&C disaggregation)'],
    ['Modo Energy, Habitat, Flexitricity, Limejump, Axle', 'Optimisers and route to market', 'PARTNER'],
  ], TW, TOPTS),

  p('**Note on our position:** Cellarhead (300MW / 624MWh, £196.5m) sits at the top end of UK BESS delivery. But the EPC market is broadening quickly — Belectric, Anesco and Ethical Power all now have credible large-scale references, and both full-wrap EPC and multi-contracting models remain viable for clients, which erodes the premium for a single accountable contractor. Expect continued margin compression.'),

  h2('9.3 CHP, engines and thermal generation'),

  table(['Organisation', 'What they do', 'Threat / role'], [
    ['Clarke Energy', 'Jenbacher (Kohler) distributor and EPC; the dominant UK gas engine integrator', 'PARTNER / MEDIUM'],
    ['Edina', 'MWM engine distributor, CHP and BESS packages, O&M', 'PARTNER / MEDIUM'],
    ['Centrica Business Solutions', 'Hydrogen-ready CHP within funded packages', 'HIGH'],
    ['Veolia, Vital Energi, Dalkia, E.ON', 'CHP within energy centres and heat networks', 'HIGH'],
    ['Finning (Caterpillar), Cummins, Rolls-Royce mtu, Kohler, 2G Energy, Bosch', 'Engine and package supply, standby and prime power', 'Supplier / partner'],
    ['ENER-G / legacy cogeneration providers', 'CHP supply and maintenance', 'LOW'],
  ], TW, TOPTS),

  p('The strategic framing here matters more than the competitor list. Existing CHP fleets are a decarbonisation liability and a commercial opportunity: **CHP transition — replacing or repurposing gas cogeneration with heat pumps, electrification and network heat — is a programme-shaped problem that suits our model and does not suit an engine distributor.** Lead with transition, not with plant.'),

  h2('9.4 Heat pumps, at commercial and district scale'),

  table(['Organisation', 'What they do', 'Threat / role'], [
    ['Vital Energi', 'Large-scale water and air source heat pump energy centres', 'CRITICAL'],
    ['Star Refrigeration / Star Renewable Energy', 'High-temperature ammonia heat pumps for district heating and industrial process heat', 'PARTNER / MEDIUM'],
    ['Kensa Group', 'UK\'s leading ground source manufacturer; shared ground loop arrays and networked heat pump infrastructure, including investor-funded network models', 'PARTNER / MEDIUM'],
    ['Mitsubishi Electric, Daikin, Vaillant, Ideal Heating, Baxi, Clade Engineering', 'Manufacture and commercial supply', 'Supplier'],
    ['Dalkia, EQUANS, Mitie, Sureserve', 'Installation at estate and housing volume', 'MEDIUM'],
    ['E.ON, Veolia, Hemiko', 'Heat pumps as the generation layer in networks and ambient grids', 'HIGH'],
  ], TW, TOPTS),

  h2('9.5 Geothermal and deep heat'),

  table(['Organisation', 'What they do', 'Threat / role'], [
    ['Geothermal Engineering Ltd (GEL)', 'Deep geothermal in Cornwall — the UK\'s most advanced deep geothermal developer', 'PARTNER'],
    ['Star Energy', 'Signed an MoU with Veolia to jointly develop large-scale geothermal heating for district heating, commercial property, hospitals, education campuses and industrial process', 'MEDIUM (via Veolia)'],
    ['GT Energy', 'Deep geothermal heat for district heating', 'PARTNER'],
    ['Kensa, Rendesco, Erda Energy', 'Shallow geothermal, shared ground loops and ground energy systems', 'PARTNER'],
    ['CeraPhi Energy, Town Rock Energy', 'Repurposed wells and shallow/deep geothermal engineering', 'PARTNER'],
  ], TW, TOPTS),

  p('Geothermal is a small but strategically useful capability: it is one of the few technologies where a technology-agnostic integrator can differentiate a heat network bid against an incumbent with a fixed heat source. The Veolia–Star Energy MoU is the move to watch — it would give Veolia a differentiated heat source outside its EfW footprint, closing the gap identified in their battlecard.'),

  h2('9.6 Heat networks — development, operation and metering'),

  table(['Organisation', 'What they do', 'Threat / role'], [
    ['Vital Energi', 'Design, build, own, operate at city and campus scale', 'CRITICAL'],
    ['E.ON', 'Owned networks (Citigen), ambient ectogrid networks, city partnerships', 'CRITICAL'],
    ['Hemiko (DIF)', 'Investor-developer-operator with c.£1bn to 2030; first UK data centre waste heat network', 'CRITICAL'],
    ['Veolia', 'EfW-linked networks; Ecothermal Grid, £1bn pipeline to 2030; Southwark 2.0', 'HIGH'],
    ['Vattenfall Heat UK (sale to Reinova Capital reported)', 'Bristol, Brent Cross, Midlothian networks', 'Counterparty / compete'],
    ['1Energy', 'City-scale low carbon heat network developer', 'MEDIUM'],
    ['Switch2 Energy, Insite Energy, Metropolitan', 'Metering, billing and network operation services', 'PARTNER'],
    ['Triple Point Heat Networks Investment Management', 'Delivery partner for the Green Heat Network Fund — the gatekeeper for grant', 'Influence'],
    ['Ramboll, Arup, AECOM, Buro Happold, Mott MacDonald', 'Zone and network design, techno-economic modelling, client-side advice', 'Influence'],
  ], TW, TOPTS),

  h2('9.7 Energy efficiency, controls and building performance'),

  p('The deck is right that efficiency alone is not our lane. It becomes our lane when it is bundled with generation or with a larger programme — the Schneider-style proposition. These are the organisations that sell it standalone.'),

  table(['Organisation', 'What they do', 'Threat / role'], [
    ['Schneider Electric', 'EcoStruxure, performance contracting, analytics, microgrid control', 'HIGH'],
    ['Siemens', 'Desigo building automation, performance contracts with SFS finance', 'HIGH'],
    ['Johnson Controls (Asset+)', 'Acquired Asset Plus — energy reduction and zero carbon measures for UK public sector, NHS and local authority', 'MEDIUM'],
    ['Honeywell Building Solutions', 'Building automation and performance contracting', 'MEDIUM'],
    ['Trane Technologies, Carrier, ABB, Danfoss, Bosch', 'HVAC, drives, controls and plant', 'Supplier'],
    ['Bellrock, Amey, ISS, CBRE, Sodexo, OCS, Sureserve', 'FM-led efficiency and compliance', 'LOW-MEDIUM'],
    ['Demand Logic, measurable.energy, Carbon Numbers, EnergyPro', 'Analytics and sub-metering specialists', 'PARTNER'],
    ['Sustainable Building Services, Melius Homes', 'Fabric-first retrofit delivery', 'LOW'],
  ], TW, TOPTS),

  h2('9.8 Grid connections, private networks and IDNOs — our clearest capability gap'),

  table(['Organisation', 'What they do', 'Threat / role'], [
    ['Eclipse Power Group', 'IDNO and ICP; acquiring Vattenfall Networks (subsidiary of the Octopus Sky Fund) to create one of the UK\'s leading IDNOs', 'PARTNER / compete'],
    ['UK Power Networks (ENGIE, from May 2026)', 'DNO for London, the South East and the East — the geography where data centre and commercial demand concentrates', 'Strategic'],
    ['OCU Group', 'Utility infrastructure, connections and civils at national scale', 'PARTNER'],
    ['Freedom Networks, GTC, Last Mile, ESP Utilities, Leep Utilities, Energy Assets Networks, Fulcrum, MUA, Harlaxton, Indigo Power, Utility Assets', 'IDNO and ICP networks', 'PARTNER'],
    ['Rock Power Connections (Mitie)', 'HV connections and electrical infrastructure inside an FM group', 'COMPETE'],
    ['Ethical Power Connections', 'Grid connections and BOP for renewables', 'PARTNER / compete'],
    ['Balfour Beatty, M Group, Morgan Sindall Infrastructure, Murphy, Omexom Taylor Woodrow', 'Transmission and HV delivery; appointed to National Grid\'s £1.2bn Electricity Transmission Partnership phase', 'Adjacent'],
    ['SP Energy Networks framework contractors', 'Regional HV overhead line and reinforcement work', 'Adjacent'],
  ], TW, TOPTS),

  callout('Strategic gap: connections',
    'Grid connection capability is now the scarcest and most decisive asset in I&C, data centres and grid-scale. We do not own it. **Every competitor in our top ten either owns a network, has bought a connections business, or has a preferential route to one.** This is the single clearest case in this document for a partnership, a framework agreement or an acquisition. Continuing to treat connections as a subcontract line item understates its strategic weight.'),

  h2('9.9 Microgrids, resilience and standby power'),

  table(['Organisation', 'What they do', 'Threat / role'], [
    ['Aggreko', 'Hired energy-as-a-service, modular microgrids combining generation, solar and storage; explicitly targeting the data centre and industrial power gap', 'PARTNER / MEDIUM'],
    ['Schneider Electric, Eaton, Vertiv, ABB', 'Microgrid control, UPS, switchgear and power distribution', 'Supplier / partner'],
    ['Rolls-Royce mtu, Caterpillar/Finning, Cummins, Kohler', 'Standby and prime generation', 'Supplier / partner'],
    ['Powerstar', 'Voltage optimisation, behind-the-meter storage and resilience packages', 'MEDIUM'],
  ], TW, TOPTS),

  h2('9.10 Hydrogen, biomethane and RNG'),

  table(['Organisation', 'What they do', 'Threat / role'], [
    ['ENGIE', 'Ten-year biomethane supply agreement with PepsiCo (2026) supporting a new anaerobic digestion unit; c.10,900 tCO₂/yr abated', 'MEDIUM'],
    ['Centrica, EDF, Storegga, Progressive Energy (HyNet)', 'Hydrogen production, storage and industrial cluster infrastructure', 'LOW (different market)'],
    ['Future Biogas, Bennamann, Severn Trent Green Power', 'Biomethane and anaerobic digestion', 'PARTNER'],
  ], TW, TOPTS),

  p('Ameresco\'s renewable natural gas capability is a strong differentiator in the US and only a marginal one in the UK today, where the biomethane market is served by established developers and the industrial hydrogen market is cluster-driven and outside our delivery model. Treat as an opportunistic capability, not a segment.'),

  pageBreak(),

  // ===================== 10. CAPITAL =====================
  h1('10. Capital: private equity, infrastructure funds and public funders'),

  p('Capital providers do not deliver anything, which is precisely why they matter. They play three distinct roles against us, sometimes simultaneously, and the role determines how we should treat them.'),

  table(['Role', 'What it looks like', 'Implication for us'], [
    ['Rival funder', 'A fund offers a customer capital directly, or backs a competitor\'s funded proposition, removing our funding advantage', 'Our funding claim must be paired with accountability, not stated alone'],
    ['Enabler and partner', 'A fund provides project or portfolio capital alongside us, extending our capacity beyond balance sheet', 'A live commercial option we should use more deliberately in large city and I&C programmes'],
    ['Acquirer of competitors', 'A fund buys a competitor and recapitalises it into a direct rival — DIF/Hemiko, Corran/Vital, HGGC/Inspired', 'Competitor capability can change overnight without any operational change'],
  ], [20, 46, 34], { firstColBold: true }),
  caption('Table 10.1 — The three roles capital plays in our market.'),

  h2('10.1 Infrastructure funds active in UK energy services and heat'),

  table(['Fund', 'Relevance', 'Role'], [
    ['DIF Capital Partners', 'Majority owner of Hemiko, with c.£1bn to deploy into city heat by 2030', 'Backs a direct competitor'],
    ['Corran Capital', 'Investor in Vital Energi, alongside the £175m senior secured bond 2025/2030', 'Backs a direct competitor'],
    ['Equitix', 'Long-standing UK infrastructure manager with energy efficiency and heat network mandates', 'Rival funder / partner'],
    ['Amber Infrastructure', 'Manager of the Mayor of London\'s Energy Efficiency Fund (MEEF), whose investment period ended in 2025 after seven years; invested in district heat networks with water source heat pumps and energy performance contracts with guaranteed savings', 'Partner / rival funder'],
    ['Reinova Capital', 'Reported acquirer of Vattenfall\'s UK heat businesses including Bristol Heat Networks', 'Counterparty in Bristol City Leap'],
    ['Macquarie Asset Management / Green Investment Group', 'Owner of Eku Energy and a large UK renewables portfolio', 'Partner / rival funder'],
    ['Greencoat Capital / Schroders Greencoat', 'Renewables and heat infrastructure funds', 'Partner / rival funder'],
    ['InfraRed Capital Partners, Infracapital (M&G), Igneo, Ancala, Arjun, Copenhagen Infrastructure Partners', 'UK infrastructure managers active in energy transition assets', 'Partner / rival funder'],
    ['Foresight Group, Gresham House, Downing, Triple Point, Bluefield, NextEnergy Capital, Octopus Energy Generation', 'Listed and unlisted renewable asset owners', 'Client / funder'],
    ['Aviva Investors, Legal & General, Pension Insurance Corporation, USS', 'Institutional capital seeking long-dated, inflation-linked UK infrastructure — including city partnerships', 'Partner — under-used by us'],
  ], [26, 52, 22], { firstColBold: true }),

  h2('10.2 Private equity in the delivery supply chain'),

  table(['Investor', 'Asset', 'Why it matters'], [
    ['HGGC', 'Inspired plc — c.£183.6m recommended offer, delisted from AIM September 2025; 3,500+ UK customers with large, complex energy footprints', 'PE capital behind an adviser that sits between us and I&C buyers and shapes their procurement'],
    ['Cap10 / PE ownership', 'Sureserve Group', 'Consolidating compliance and retrofit delivery capacity'],
    ['OMERS Private Equity', 'Network Plus — UK utility and infrastructure repair and maintenance', 'Consolidation of the utility delivery supply chain'],
    ['Turner Construction', 'Dornan — c.€700m acquisition creating a c.1,000-person entity with a c.€1.6bn backlog, c.85% in advanced technology projects', 'Concentration of data centre MEP capability'],
    ['EQT', 'InstaVolt', 'Charging infrastructure consolidation'],
    ['Zouk Capital / Liberty Global', 'Believ', 'Funded public charging concessions with councils'],
    ['KKR and infrastructure co-investors', 'Zenobe', 'The funded EaaS model at platform scale'],
    ['Kuwait-backed consortium (reported)', 'Lightsource bp — bp process to sell c.50%', 'Ownership uncertainty at the largest UK solar developer'],
  ], [22, 44, 34], { firstColBold: true }),

  h2('10.3 Public capital — the funders that set the rules'),

  table(['Funder', 'What it does', 'How it affects competition'], [
    ['Great British Energy', 'c.£180m committed for solar and efficiency on schools and NHS sites (c.£80m schools, c.£100m NHS in England, £9.3m devolved); 2026 round open on a rolling basis; 250+ schools signed agreements for a share of up to £100m', 'Grant capital pointed at one technology in our target estates — arms solar EPCs against funded propositions'],
    ['Salix Finance', 'Delivering PSDS Phase 3c (to 31 March 2026) and Phase 4 (to 31 March 2028); no further phases', 'The end of the grant era is our strongest structural tailwind, arriving on a two-year lag'],
    ['Green Heat Network Fund (Triple Point HNIM)', 'Over £500m allocated; £68m across eight projects December 2025; c.£195m a year signalled; Round 12 closes 25 September 2026; up to (not including) 50% of eligible commercialisation and construction costs', 'Determines which heat schemes are viable and therefore which competitors get built'],
    ['Warm Homes Plan / WH:SHF', 'c.£15bn programme targeting up to 5 million homes by 2030; Wave 3 c.£1.2bn 2025–28', 'Sustains the volume retrofit contractors as a competitive force in city programmes'],
    ['National Wealth Fund (formerly UK Infrastructure Bank)', 'Investing in battery storage, district heating, grid infrastructure and supply chain', 'Can co-fund us or a competitor; a genuine partnership route'],
    ['DESNZ Heat Network Zoning / Heat Networks Delivery Unit', 'Zone designation, Zone Coordinators, statutory instruments anticipated spring 2026', 'Determines who is allowed to build city heat, and for how long'],
    ['Scottish National Investment Bank, Development Bank of Wales, Combined Authorities', 'Regional co-investment in energy infrastructure', 'Local capital that can tip a city partnership'],
  ], [22, 48, 30], { firstColBold: true }),

  callout('The conclusion of Section 10',
    'There is now more capital chasing UK energy infrastructure than there are bankable, well-structured programmes to put it in. **That inverts the traditional ESCO pitch.** Money is not scarce; the ability to originate, structure, deliver and stand behind a twenty-year programme is scarce. Our proposition should be sold as origination and accountability that capital can trust — not as access to capital.'),

  pageBreak(),

  // ===================== 11. ADVISERS =====================
  h1('11. Advisers, consultants and framework gatekeepers'),

  p('These organisations rarely appear on a bid list and frequently decide the outcome. They write the feasibility study, set the technical specification, design the payment mechanism and advise on evaluation criteria. A specification written around measure counts and capital cost cannot be won by a programme proposition, whatever the bid quality.'),

  table(['Organisation', 'Where they sit', 'Why they matter to us'], [
    ['AECOM, Arup, Ramboll, WSP, Mott MacDonald, Buro Happold, Hoare Lea, Cundall', 'Technical advisers on heat networks, estates decarbonisation and zoning', 'They set the technology assumptions and the network design before we see it'],
    ['Turner & Townsend, Gleeds, Currie & Brown, AtkinsRéalis (Faithful+Gould), Rider Levett Bucknall', 'Cost and programme management, client-side PMO', 'They frame the comparison as capital cost per measure unless persuaded otherwise'],
    ['Inspired plc (HGGC), Inenco, Cornwall Insight, Enistic', 'Energy consultancy and procurement advice to I&C buyers', 'They run the competitive process and increasingly recommend the structure'],
    ['Local Partnerships, Energy Systems Catapult, Carbon Trust', 'Public sector advisory and delivery support', 'Influential on local authority and NHS structuring decisions'],
    ['Bevan Brittan, Trowers & Hamlins, Pinsent Masons, Burges Salmon, Browne Jacobson', 'Legal advisers on concessions, JVs and heat network structures', 'They draft the risk allocation that determines whether a guarantee is worth anything'],
    ['Grant Thornton, EY, KPMG, PwC, Deloitte', 'Financial advisers on business cases and affordability', 'They test whether a funded structure passes the client\'s value-for-money assessment'],
    ['NOE CPC, NHS SBS, CCS, SCAPE, Pagabo, Procure Partnerships, YPO, ESPO, LHC, Fusion21, Efficiency North, PfH', 'Framework operators', 'They define the lot structure — and therefore whether the market is allowed to buy a programme at all'],
  ], [26, 34, 40], { firstColBold: true }),

  callout('The most actionable point in this document',
    'Lot structure is competitive strategy. The NHS £1bn framework splits into 20 lots, only one of which — Lot 6, total service provision, up to £200m — describes what Ameresco is. **Influence at framework design stage is worth more than bid quality at tender stage**, and it is currently not resourced as a competitive activity.'),

  pageBreak(),

  // ===================== 12. PROCUREMENT ROUTES =====================
  h1('12. Procurement routes: where competition is actually decided'),

  table(['Route', 'Segment', 'Detail', 'Our position'], [
    ['NOE CPC Decarbonisation & Energy Infrastructure (NOE.0655)', 'NHS / public', '£1bn; 20 lots; up to 180 suppliers; £350m national (6 lots), £600m regional (15 lots), £200m principal partner (Lot 6); bids due 1 May 2026; live 1 Oct 2026 – 30 Sep 2029. Requires PAS 2035, TM65 and NHS net zero 2040 alignment', 'Lot 6 is the only lot that pays for our model'],
    ['NHS SBS Decarbonisation of Estates (SBS10504)', 'NHS', 'Established route for estate decarbonisation works and services', 'Secondary route'],
    ['Crown Commercial Service, SCAPE, Pagabo, Procure Partnerships, YPO, ESPO', 'Wider public sector', 'General construction and services frameworks with decarbonisation lots', 'Access route; commoditised'],
    ['Re:fit', 'Public sector', 'Energy performance contracting framework — historically the natural ESCO route', 'Structurally aligned to our model where still used'],
    ['LHC Procurement Group, Fusion21, Efficiency North, PfH (incl. £480m repairs and disrepair)', 'Housing', 'Retrofit and decarbonisation frameworks dominated by volume contractors', 'Partner route, not a lead route'],
    ['Competitive dialogue / concession (City Leap model)', 'Cities', 'Long-form dialogue leading to JV or concession; the structure we win in', 'Our strongest ground'],
    ['Heat network zone designation', 'Cities', 'Zone Coordinators determine what is built, where and by whom; SIs anticipated spring 2026; six first zones including Bristol', 'Emerging; engagement must be pre-designation'],
    ['Bilateral / direct negotiation', 'I&C, Data centres', 'No framework; relationship and origination led', 'Our best margin, our weakest coverage'],
    ['EPC tender', 'Grid-scale', 'Price-led competition against a broadening contractor field', 'Selective participation only'],
  ], [24, 14, 42, 20], { firstColBold: true }),
  caption('Table 12.1 — Procurement routes by segment and our relative position.'),
];
