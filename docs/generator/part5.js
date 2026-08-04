const { h1, h2, h3, h4, p, bullet, num, table, callout, spacer, pageBreak, caption } = require('./lib');

const MW = [23, 15, 26, 13, 23];
const MOPTS = { firstColBold: true, autoShade: true, centreCols: [3] };

module.exports = [
  pageBreak(),

  // ===================== 13. THREAT MATRIX =====================
  h1('13. Master threat matrix'),

  p('The full competitive universe in one table, scored against the whole Ameresco proposition. "Compete or partner" is a default posture, not a rule — several organisations are both on the same pursuit, and the choice should be made deal by deal.'),

  h2('13.1 Critical and high threat'),

  table(['Organisation', 'Archetype', 'Segments', 'Threat', 'Posture'], [
    ['Vital Energi', 'Funded integrator', 'Public sector, Cities, I&C', 'CRITICAL', 'Compete'],
    ['E.ON UK (EIS)', 'Funded integrator / utility', 'Cities, Public sector, I&C', 'CRITICAL', 'Compete'],
    ['EQUANS UK & Ireland', 'Services / FM-led', 'Public sector, Housing, I&C', 'CRITICAL', 'Compete'],
    ['Hemiko (DIF)', 'Pure-play city heat', 'Cities, Data centres (heat export)', 'CRITICAL', 'Compete'],
    ['Centrica Business Solutions', 'Utility / supply-led', 'I&C, Public sector, Data centres', 'HIGH', 'Compete'],
    ['Veolia UK & Ireland', 'Services-led with heat assets', 'Cities, Public sector, I&C', 'HIGH', 'Compete'],
    ['Dalkia UK (EDF)', 'Services / FM-led', 'Public sector, I&C', 'HIGH', 'Compete'],
    ['SSE Energy Solutions', 'Utility / network-led', 'I&C, Cities, Grid-scale', 'HIGH', 'Both'],
    ['Schneider Electric UK&I', 'Technology / OEM', 'Public sector, I&C, Data centres', 'HIGH', 'Both'],
    ['ENGIE UK', 'Utility / network-led', 'I&C, Grid-scale, Data centres', 'HIGH (rising)', 'Both'],
    ['Zenobe', 'Funded developer-operator', 'EV/fleet, Grid-scale', 'HIGH', 'Both'],
    ['Siemens (SI / SFS)', 'Technology / OEM', 'Public sector, I&C', 'MEDIUM-HIGH', 'Both'],
    ['Mitie (Energy, Power & Grid)', 'Services / FM-led', 'Public sector, I&C, EV', 'MEDIUM-HIGH', 'Compete'],
    ['Octopus Energy (business / Octopus Sky)', 'Utility / supply-led', 'I&C, Data centres, Networks', 'MEDIUM-HIGH', 'Both'],
    ['Lightsource bp', 'Developer-owner', 'Grid-scale', 'MEDIUM-HIGH', 'Both'],
    ['Statera Energy', 'Developer-owner', 'Grid-scale', 'MEDIUM-HIGH', 'Both'],
  ], MW, MOPTS),

  h2('13.2 Medium threat'),

  table(['Organisation', 'Archetype', 'Segments', 'Threat', 'Posture'], [
    ['Johnson Controls (Asset+)', 'Technology / OEM', 'Public sector, I&C', 'MEDIUM', 'Both'],
    ['Honeywell Building Solutions', 'Technology / OEM', 'Public sector, I&C', 'MEDIUM', 'Both'],
    ['Belectric', 'EPC', 'Grid-scale', 'MEDIUM', 'Compete'],
    ['Anesco', 'EPC / owner-operator', 'Grid-scale, I&C', 'MEDIUM', 'Both'],
    ['Ethical Power / EPC Connections', 'EPC / ICP', 'Grid-scale', 'MEDIUM', 'Both'],
    ['Vattenfall Heat UK (→ Reinova, reported)', 'Heat owner-operator', 'Cities', 'MEDIUM', 'JV partner'],
    ['Sureserve Group', 'Retrofit / compliance', 'Housing, Public sector', 'MEDIUM', 'Partner'],
    ['United Living', 'Retrofit contractor', 'Housing', 'MEDIUM', 'Partner'],
    ['Amey', 'Services / FM-led', 'Public sector, EV', 'MEDIUM', 'Compete'],
    ['Balfour Beatty', 'Construction / infrastructure', 'Grid-scale, Public sector', 'MEDIUM', 'Both'],
    ['Kier, Morgan Sindall, Wates, Willmott Dixon', 'Construction', 'Public sector, Housing', 'MEDIUM', 'Both'],
    ['Clarke Energy', 'CHP integrator', 'I&C, Public sector', 'MEDIUM', 'Partner'],
    ['Edina', 'CHP / BESS integrator', 'I&C', 'MEDIUM', 'Partner'],
    ['Kensa Group', 'GSHP manufacturer / networks', 'Housing, Cities', 'MEDIUM', 'Partner'],
    ['Star Renewable Energy / Star Energy', 'Heat pumps / geothermal', 'Cities, Public sector, I&C', 'MEDIUM', 'Partner'],
    ['1Energy', 'Heat network developer', 'Cities', 'MEDIUM', 'Compete'],
    ['Atrato Onsite Energy', 'Funded solar', 'I&C', 'MEDIUM', 'Compete'],
    ['Custom Solar (Mitie)', 'Solar EPC', 'Public sector, I&C', 'MEDIUM', 'Compete'],
    ['Powerstar', 'BTM storage / voltage optimisation', 'I&C', 'MEDIUM', 'Both'],
    ['Aggreko', 'Hired EaaS / microgrids', 'I&C, Data centres', 'MEDIUM', 'Partner'],
    ['Wärtsilä, Fluence, Tesla, Sungrow', 'BESS integrators', 'Grid-scale', 'MEDIUM', 'Supplier'],
    ['Inspired plc (HGGC)', 'Adviser', 'I&C', 'MEDIUM (influence)', 'Neutralise'],
    ['AECOM, Arup, Ramboll, WSP, Mott MacDonald', 'Adviser', 'All', 'MEDIUM (influence)', 'Influence'],
    ['Believ, Connected Kerb', 'Funded EV concessions', 'EV, Cities', 'MEDIUM', 'Partner'],
    ['Eclipse Power Group', 'IDNO / ICP', 'All', 'MEDIUM', 'Partner'],
    ['OCU Group', 'Utility infrastructure', 'All', 'MEDIUM', 'Partner'],
    ['Mercury, Winthrop, Kirby, Dornan (Turner), Collen', 'Critical MEP', 'Data centres', 'MEDIUM', 'Partner — do not compete'],
  ], MW, MOPTS),

  h2('13.3 Lower or niche threat — monitor only'),

  table(['Organisation', 'Archetype', 'Segments', 'Threat', 'Posture'], [
    ['ISS, CBRE, Sodexo, OCS, Bellrock, Churchill', 'FM', 'Public sector, I&C', 'LOW', 'Partner'],
    ['Harmony Energy, Field, Eku, Fidra, NatPower, Penso, Root-Power, Pacific Green, Elgin, Enso', 'BESS/solar developers', 'Grid-scale', 'LOW', 'Client / partner'],
    ['Gresham House, Foresight, NextEnergy, Bluefield, Low Carbon, Downing, Triple Point', 'Asset funds', 'Grid-scale', 'LOW', 'Funder / client'],
    ['Voltalia, BSR, RES, Enviromena', 'EPC', 'Grid-scale', 'LOW', 'Compete'],
    ['Fortem, Mears, Novus, Ian Williams, Bell Group, Lovell, MSPS', 'Housing contractors', 'Housing', 'LOW', 'Partner'],
    ['Warmworks, AgilityEco, Melius Homes, Sustainable Building Services', 'Retrofit / ECO delivery', 'Housing', 'LOW', 'Partner'],
    ['Switch2, Insite Energy, Metropolitan', 'Heat metering & billing', 'Cities', 'LOW', 'Partner'],
    ['GT Energy, GEL, CeraPhi, Town Rock, Rendesco, Erda', 'Geothermal', 'Cities, Public sector', 'LOW', 'Partner'],
    ['Mitsubishi, Daikin, Vaillant, Ideal, Baxi, Clade, Bosch, Danfoss, Trane, Carrier, ABB, Eaton, Vertiv', 'Manufacturers', 'All', 'LOW', 'Supplier'],
    ['bp pulse, InstaVolt, Osprey, Gridserve, Pod Point, char.gy, ubitricity, SWARCO, Mer, Voltempo, Milence, Paua', 'EV charging networks', 'EV', 'LOW', 'Partner'],
    ['Freedom Networks, GTC, Last Mile, ESP, Leep, Energy Assets, Fulcrum, MUA, Harlaxton, Indigo, Utility Assets', 'IDNOs', 'All', 'LOW', 'Partner'],
    ['Rolls-Royce mtu, Finning/Caterpillar, Cummins, Kohler, 2G Energy', 'Generation packages', 'I&C, Data centres', 'LOW', 'Supplier'],
    ['Flexitricity, Limejump, Habitat, Axle, Modo', 'Flexibility & optimisation', 'I&C, Grid-scale', 'LOW', 'Partner'],
    ['Demand Logic, measurable.energy, Carbon Numbers', 'Analytics', 'I&C, Public sector', 'LOW', 'Partner'],
    ['Storegga, Progressive Energy, Future Biogas, Bennamann', 'Hydrogen / biomethane', 'Industrial', 'LOW', 'Partner'],
    ['ScottishPower, Statkraft, EDF (generation)', 'Utilities', 'Grid-scale, I&C', 'LOW-MEDIUM', 'Both'],
  ], MW, MOPTS),

  pageBreak(),

  // ===================== 14. CONCLUSIONS =====================
  h1('14. Conclusions and recommended actions'),

  h2('14.1 What the analysis actually shows'),

  p('**We are more differentiated than we behave.** Only E.ON and Vital Energi score above 24 on wrap coverage, and neither of them matches us on all five elements at once. The proposition is real. The problem is that its value is invisible at the moment most buying decisions are shaped — which is well before tender.'),
  p('**Our differentiation is concentrated in the least legible element.** Finance is no longer scarce; delivery is available from twenty organisations; design is available from every consultancy. **Optimise — guaranteed savings, measurement and verification, and continuous improvement over 10–25 years — is where the field genuinely thins.** It is also the hardest thing for a buyer to evaluate, which means it must be made contractual and specific in every proposal rather than described as a capability.'),
  p('**The market is moving our way on a two-year lag.** The end of PSDS, the arrival of heat network zoning and the shift from grant to structure all favour a funded, accountable, long-horizon partner. But competitors carrying awarded grant backlogs will look strong until 2027–28, and GB Energy grant will keep single-technology propositions competitive in our target public estates in the meantime.'),
  p('**Two capability gaps are strategic rather than tactical.** Grid connections and digital optimisation platform. Every top-ten competitor has an answer to at least one of them; several have both.'),

  h2('14.2 Ten recommended actions'),

  num('**Resource framework and specification influence as a competitive activity.** Lot structure decides more outcomes than bid quality. Prioritise the NHS £1bn framework Lot 6 position and equivalent principal-partner routes; treat consultancy lots as contested ground.'),
  num('**Agree and circulate one line on the Vattenfall / Bristol counterparty change this month.** Competitors will raise it in city pursuits. The line should be confident, factual and immediately followed by Bristol delivery evidence — the £424m five-year delivery expectation, £15m of social value, £10m for households at risk of fuel poverty, the community energy fund and the 1MW heat pump energy centre from autumn 2026.'),
  num('**Close the grid connections gap by partnership or acquisition.** Establish a preferred relationship with an IDNO or ICP (Eclipse Power, OCU, GTC or equivalent) so that connections are a capability we bring rather than a risk we flag. This is the highest-value single move in this document.'),
  num('**Make the guarantee and M&V contractual and quantified in every proposal.** Our sharpest edge is the least visible. Publish the mechanism, the measurement standard, the reporting cadence and the remedy — and ask evaluators to require the same from every bidder.'),
  num('**Stop competing with grant.** Where GB Energy funding is available for solar on a school or NHS site, concede the roof and sell the heat, plant, resilience and M&V. Build a specific play for this and brief the public sector team.'),
  num('**Engage in the six first heat network zones before Zone Coordinator appointments are made.** Leeds, Plymouth, Bristol, Stockport, Sheffield and the two London areas. Bristol is an advantage; the other five are open. After designation these markets close for twenty years.'),
  num('**Build a formal partner map for data centres.** Named relationships with the critical MEP ecosystem (Mercury, Winthrop, Kirby, Dornan/Turner) and with standby and microgrid suppliers, so we compete on grid, land, private wire and heat export and never on white space.'),
  num('**Track five trigger events monthly:** a Mitie funding platform; a Schneider or Siemens UK delivery acquisition; an ENGIE UK services acquisition; Vital Energi moving into guaranteed savings; and any Zone Coordinator delivery appointment. Each would change the competitive picture materially and each is publicly observable.'),
  num('**Use infrastructure capital deliberately as a capacity extender.** Institutional investors — Aviva, L&G, PIC, the National Wealth Fund — are looking for exactly the long-dated, inflation-linked assets our programmes create. Co-investment lets us bid larger than balance sheet without diluting accountability.'),
  num('**Enforce the qualification test that already exists in the value proposition.** If the buyer only wants the cheapest price for a single technology, we are not in our strongest lane. Every pursuit that fails that test consumes capacity that belongs in a funded programme. The discipline is the strategy.'),

  h2('14.3 What we would still like to know'),
  p('Three questions this analysis cannot answer from public sources and which would materially sharpen it:'),
  bullet('**Our own win/loss data.** Which of these ten we actually lose to, at what stage, and on what stated reason. Public analysis identifies who can beat us; only internal data shows who does.'),
  bullet('**Competitor pricing behaviour on funded structures.** Whether Vital, E.ON and Centrica are pricing funded deals at or below our hurdle rates, which determines whether the funding differentiator is being competed away or simply matched.'),
  bullet('**Framework outcomes.** The awarded supplier list for the NHS £1bn framework, particularly Lot 6, once published — that single document will define the public sector competitive set through to 2029.'),

  pageBreak(),

  // ===================== APPENDIX A =====================
  h1('Appendix A — Full company index'),

  p('Every organisation referenced in this analysis, grouped by primary role. Organisations appearing in more than one role are listed under each.'),

  h3('A1. Funded multi-technology integrators (direct peers)'),
  p('Ameresco · E.ON UK Energy Infrastructure Solutions · Vital Energi · Veolia UK & Ireland · EQUANS UK & Ireland · Centrica Business Solutions · Dalkia UK (EDF) · SSE Energy Solutions · ENGIE UK · Hemiko (DIF Capital Partners)'),

  h3('A2. Services, FM and construction-led'),
  p('EQUANS · Mitie · Dalkia UK · Veolia · Amey · ISS · CBRE · Sodexo · OCS · Bellrock · Churchill · Sureserve Group · United Living · Fortem (Willmott Dixon) · Mears · Wates · Novus · Ian Williams · Bell Group · Lovell · Morgan Sindall Property Services · Kier · Balfour Beatty · Morgan Sindall Infrastructure · Willmott Dixon · NG Bailey · SPIE UK · Skanska UK · Laing O\'Rourke · Mace · BAM'),

  h3('A3. Utility and supply-led'),
  p('Centrica / British Gas Business · E.ON UK · EDF · SSE · ENGIE (incl. UK Power Networks) · Octopus Energy (incl. Octopus Sky Fund / Eclipse Power) · ScottishPower · Statkraft · Bord Gáis (Centrica) · Good Energy · Drax'),

  h3('A4. Technology, OEM and platform'),
  p('Schneider Electric · Siemens (Smart Infrastructure, Siemens Financial Services) · Johnson Controls (Asset+) · Honeywell Building Solutions · Trane Technologies · Carrier · ABB · Danfoss · Bosch · Eaton · Vertiv · Mitsubishi Electric · Daikin · Vaillant · Ideal Heating · Baxi · Clade Engineering · Kensa Group · Powerstar · Connected Energy'),

  h3('A5. Solar — developers, owners and EPC'),
  p('Lightsource bp · Belectric · Anesco · Ethical Power / Ethical Power Connections · Custom Solar (Mitie) · Voltalia · BSR · RES · Enviromena · Geo Green Power · Absolute Solar & Wind · Atrato Onsite Energy · NextEnergy Capital · Foresight Solar · Bluefield Solar · Low Carbon · Island Green Power · Elgin Energy · Enso Energy · Octopus Energy Generation · Statkraft · Severn Trent Green Power'),

  h3('A6. Battery storage — developers, owners, integrators and EPC'),
  p('Zenobe · Statera Energy · Harmony Energy · Field · Eku Energy (Macquarie) · Fidra Energy · NatPower UK · Penso Power · Root-Power · Pacific Green · Gresham House Energy Storage Fund · Elgin Energy · Wärtsilä · Fluence · Tesla · Sungrow · BYD · CATL · Trina Storage · Envision · Belectric · Anesco · Ethical Power · G2 Energy (Mitie) · Powerstar · Connected Energy'),

  h3('A7. CHP, engines and thermal generation'),
  p('Clarke Energy (Jenbacher/Kohler) · Edina (MWM) · Centrica Business Solutions · Veolia · Vital Energi · Dalkia · E.ON · Finning (Caterpillar) · Cummins · Rolls-Royce mtu · Kohler · 2G Energy · Bosch · ENER-G legacy cogeneration'),

  h3('A8. Heat pumps, geothermal and heat networks'),
  p('Vital Energi · E.ON · Veolia · Hemiko · Vattenfall Heat UK (sale to Reinova Capital reported) · 1Energy · Switch2 Energy · Insite Energy · Metropolitan · Star Refrigeration / Star Renewable Energy · Star Energy · Geothermal Engineering Ltd · GT Energy · CeraPhi Energy · Town Rock Energy · Rendesco · Erda Energy · Kensa Group · Clade Engineering · Triple Point Heat Networks Investment Management · Ramboll · Arup · AECOM · Buro Happold'),

  h3('A9. Grid connections, IDNOs and network infrastructure'),
  p('Eclipse Power Group · UK Power Networks (ENGIE) · OCU Group · Freedom Networks · GTC · Last Mile Asset Management · ESP Utilities Group · Leep Utilities · Energy Assets Networks · Fulcrum · MUA Group · Harlaxton Energy Networks · Indigo Power · Utility Assets · UK Power Distribution · Rock Power Connections (Mitie) · Ethical Power Connections · Balfour Beatty · M Group · Morgan Sindall Infrastructure · Murphy · Omexom Taylor Woodrow · Network Plus (OMERS)'),

  h3('A10. Data centre energy and critical infrastructure'),
  p('Mercury Engineering · Winthrop Technologies · Kirby Group Engineering · Dornan (Turner Construction) · Collen Construction · Designer Group · Ethos Engineering · LotusWorks · Keysource (Salute) · Sudlows · Comtec · RED Engineering · Arup · Aggreko · Vertiv · Eaton · Schneider Electric · ABB · Rolls-Royce mtu · Finning · Cummins · Kohler · Skanska UK · Mace · Laing O\'Rourke · BAM Ireland · Blu-3 · JCA Engineering · DPR Construction'),

  h3('A11. EV infrastructure and fleet'),
  p('Zenobe · Believ (Liberty Global / Zouk) · Connected Kerb · SWARCO Smart Charging · Mer (Statkraft) · bp pulse · InstaVolt (EQT) · Osprey · Gridserve (Infracapital) · Pod Point (EDF) · char.gy · ubitricity (Shell) · Voltempo · Milence · Paua · Rock Power Connections (Mitie) · EQUANS · Amey'),

  h3('A12. Retrofit and housing decarbonisation'),
  p('EQUANS · Sureserve Group (incl. Everwarm, Providor) · United Living · Fortem · Mears · Wates · Novus · Ian Williams · Bell Group · Lovell · Morgan Sindall Property Services · K&T Heating · Warmworks · AgilityEco · Melius Homes · Sustainable Building Services · E.ON · British Gas / Centrica'),

  h3('A13. Infrastructure funds, private equity and public funders'),
  p('DIF Capital Partners · Corran Capital · Reinova Capital · Equitix · Amber Infrastructure (MEEF, LEEF) · Macquarie Asset Management / Green Investment Group · Greencoat Capital / Schroders Greencoat · InfraRed Capital Partners · Infracapital (M&G) · Igneo Infrastructure Partners · Ancala Partners · Arjun Infrastructure · Copenhagen Infrastructure Partners · KKR · EQT · Zouk Capital · HGGC · Cap10 · OMERS Private Equity · Foresight Group · Gresham House · Downing · Triple Point · Bluefield · NextEnergy Capital · Octopus Energy Generation · Aviva Investors · Legal & General · Pension Insurance Corporation · USS · National Wealth Fund · Great British Energy · Salix Finance · Green Heat Network Fund · Scottish National Investment Bank · Development Bank of Wales · British Business Bank'),

  h3('A14. Advisers, consultants and framework operators'),
  p('AECOM · Arup · Ramboll · WSP · Mott MacDonald · Buro Happold · Hoare Lea · Cundall · Turner & Townsend · Gleeds · Currie & Brown · AtkinsRéalis (Faithful+Gould) · Rider Levett Bucknall · Inspired plc (HGGC) · Inenco · Cornwall Insight · Local Partnerships · Energy Systems Catapult · Carbon Trust · Bevan Brittan · Trowers & Hamlins · Pinsent Masons · Burges Salmon · Browne Jacobson · Grant Thornton · EY · KPMG · PwC · Deloitte · NOE CPC · NHS SBS · Crown Commercial Service · SCAPE · Pagabo · Procure Partnerships · YPO · ESPO · LHC Procurement Group · Fusion21 · Efficiency North · Procurement for Housing (PfH) · Re:fit'),

  h3('A15. Flexibility, optimisation and analytics'),
  p('Flexitricity · Limejump · Habitat Energy · Axle Energy · Modo Energy · Octopus Energy · Centrica Business Solutions · Demand Logic · measurable.energy · Carbon Numbers · EnergyPro'),

  pageBreak(),

  // ===================== APPENDIX B =====================
  h1('Appendix B — Sources'),

  p('Primary sources consulted, August 2026. Company financials are from filed accounts and published announcements; market and policy data from government publications and trade press. Where a transaction is reported but unconfirmed by the parties it is flagged as such in the text.'),

  h3('Company financials and announcements'),
  bullet('Vital Energi Utilities Ltd report and financial statements; Vital Holdings results coverage (Construction News, January 2026); Vital Energi investor information and Nordic ABM bond listing, September 2025.'),
  bullet('Bouygues / EQUANS full-year 2025 results; EQUANS UK & Ireland corporate information and Carbon Reduction Plan 2025.'),
  bullet('Centrica plc preliminary results for the year ended 31 December 2025 and Annual Report 2025; Centrica Business Solutions announcements (Solihull Hospital energy centre).'),
  bullet('Dalkia UK results coverage (Construction Enquirer, July 2025 and April 2026); EDF 2025 annual results; EDF Energy Holdings Ltd annual report.'),
  bullet('E.ON UK news releases 2025–26: Citigen and City of London connections, Coventry Strategic Energy Partnership, Silvertown / Lendlease ectogrid, heat zoning in the City of London.'),
  bullet('Veolia press releases and coverage: Ecothermal Grid UK launch and £1bn pipeline (November 2025); Southwark 2.0.'),
  bullet('SSE plc business information; SSE Energy Solutions distributed energy infrastructure materials; London Underground private wire solar agreement (March 2026); SSEN Transmission stake sale to Ontario Teachers\' Pension Plan.'),
  bullet('Mitie Group announcements: Custom Solar and Rock Power Connections acquisitions, G2 Energy, ESM Power, heat pump team; FY26 trading update; Bassingbourn Barracks / DIO.'),
  bullet('Ameresco Inc. Q4 and full year 2025 results and 2026 guidance; Bristol City Leap portfolio materials.'),
  bullet('Bristol City Leap business plan 2025–2030 and two-year progress release; Vattenfall Heat UK Bristol partnership materials; Energy UK Vattenfall heat networks case study.'),
  bullet('Vattenfall group press releases on district heating ownership assessment (March 2025) and UK electricity distribution divestment; coverage of the reported Reinova Capital transaction (City AM); Eclipse Power Group announcement on acquiring Vattenfall Networks.'),
  bullet('Hemiko / DIF Capital Partners announcements; Heat Networks Industry Council and UKDEA directory entries; data centre waste heat network coverage (Datacenter Dynamics, BeBeez).'),
  bullet('ENGIE corporate materials on UK operations, the UK Power Networks acquisition, the 157MW UK portfolio acquisition and the PepsiCo biomethane agreement.'),
  bullet('Zenobe funding announcements (£980m platform financing 2026; €325m European facility; ScotZEB); Kilmarnock BESS coverage.'),
  bullet('bp / Lightsource bp announcements and coverage of the stake sale process; Statera Energy Carrington acquisition; Belectric Severn Trent Green Power EPC contract; Anesco and Ethical Power corporate materials.'),
  bullet('HGGC announcement on the completion of the Inspired plc acquisition (October 2025); Turner Construction / Dornan transaction coverage; OMERS / Network Plus announcement.'),
  bullet('Johnson Controls UK materials on Asset Plus and public sector decarbonisation; Schneider Electric performance contracting materials and UK 2026 energy transition predictions; Guidehouse Insights ESCO leaderboard coverage.'),

  h3('Policy, funding and market'),
  bullet('Salix Finance: Public Sector Decarbonisation Scheme Phase 3c and Phase 4 guidance and status; Local Government Chronicle coverage of the June 2025 decision to commit no further PSDS investment.'),
  bullet('Great British Energy: solar for schools and hospitals programme announcements and progress updates; DESNZ written ministerial statement, March 2025.'),
  bullet('DESNZ: Heat Network Zoning government response to the 2023 consultation (January 2026); heat network zoning maps for England; Heat Networks Delivery Unit guidance; DESNZ Heat Networks Newsletter, February 2026; Trowers & Hamlins heat zoning explainer.'),
  bullet('Green Heat Network Fund: scheme overview (February 2026), guidance for applicants Round 12, December 2025 award announcements; Triple Point Heat Networks Investment Management.'),
  bullet('NOE CPC Decarbonisation and Energy Infrastructure framework (NOE.0655) tender notice and coverage (Construction Enquirer, Mills & Reeve, March 2026); NHS SBS Decarbonisation of Estates framework SBS10504.'),
  bullet('Warm Homes Plan and Warm Homes: Social Housing Fund Wave 3 guidance and statistics (GOV.UK, February and April 2026); National Housing Federation materials; PfH and LHC framework award coverage.'),
  bullet('AI Growth Zones policy paper and analysis (Baker McKenzie, January 2026); Electric Insights Q1 2026 quarterly report on grid capacity; BCLP analysis of UK data centres and power strategy.'),
  bullet('National Grid Electricity Transmission Partnership appointments (New Civil Engineer, June 2026); SP Energy Networks framework awards.'),
  bullet('Market sizing: Mordor Intelligence (UK CHP; ESCO market), IMARC Group (UK energy-as-a-service), Technavio (UK energy efficiency services), Modo Energy (GB battery storage EPC landscape), IndexBox (UK BESS outlook 2026).'),

  spacer(200),
  p('**Document ends.**', { italics: true }),
];
