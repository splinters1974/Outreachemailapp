const { h1, h2, h3, p, bullet, num, table, callout, spacer, pageBreak, caption } = require('./lib');

module.exports = [
  // ===================== 1. EXECUTIVE SUMMARY =====================
  h1('1. Executive summary'),

  p('This document maps the full UK competitive landscape for Ameresco across Industrial & Commercial, Public Sector, Grid-Scale / Front-of-Meter, Cities, Data Centres, Social Housing & Schools Retrofit, and EV Infrastructure. It covers organisations that compete with the whole Ameresco proposition — design, finance, deliver, operate, optimise — and, separately, the much larger population of organisations that compete with parts of it.'),

  p('The central finding is simple and uncomfortable. **Our proposition is genuinely rare; our competitive risk is not that someone replicates it, but that buyers stop asking for it.** The programme wrap only wins where the buyer has been persuaded to buy a programme. Where the buyer buys technology lots, we are compared against contractors with lower overheads and no funding cost, and we lose on price.'),

  h2('The ten-point read'),

  num('**No UK competitor matches the full wrap, but three come close.** E.ON (Energy Infrastructure Solutions) and Vital Energi are the only two organisations in the UK that can credibly claim design, finance, delivery, long-term operation and optimisation across multiple technologies at city scale. Veolia is close on heat but narrow elsewhere. Everyone else is strong on two or three of the five.'),
  num('**Disaggregation is the real competitor.** Our most common loss is not to a rival integrator; it is to a procurement decision that splits a programme into solar, BESS, heat and efficiency lots. Once that happens the ESCO premium has nothing to attach to. Qualification discipline is a competitive weapon, not an admin step.'),
  num('**The grant era in the public sector has ended.** Government committed no further investment in the Public Sector Decarbonisation Scheme beyond already-awarded projects (June 2025). Phase 3c funding runs to 31 March 2026 and Phase 4 to 31 March 2028, and there is no Phase 5. This is the single strongest structural tailwind for funded models we will get this decade — but it arrives with a two-to-three year lag while awarded projects work through.'),
  num('**Great British Energy has partly replaced the grant, in the worst possible shape for us.** Roughly £180m of capital grant for rooftop solar and efficiency on schools and NHS sites (£80m schools, £100m NHS in England, plus £9.3m devolved) arms low-cost solar EPCs in exactly the estates where we want to sell funded multi-technology programmes. Where GBE grant is available, we should not be selling a funded solar proposition — we should be selling the rest of the estate.'),
  num('**Vital Energi is the number one direct threat and is now capitalised to behave like us.** FY25 turnover £274.6m (up 10.6%), a reported pipeline of approximately £2.5bn, and a £175m senior secured bond listed in September 2025. They have moved from contractor to developer-owner-operator. The gap between their model and ours is closing faster than any other competitor\'s.'),
  num('**Bristol City Leap — our strongest proof point — carries a live counterparty question.** Vattenfall began an ownership review of its UK heat business in March 2025 and press reporting indicates a sale of Bristol Heat Networks, Midlothian Energy and Brent Cross to Reinova Capital. Competitors will use this in city pursuits. We need one agreed, confident line on it before they do.'),
  num('**Capital has stopped being the moat.** DIF-backed Hemiko has c.£1bn to deploy into city-scale heat by 2030. Equitix, Amber, Greencoat, Macquarie and a dozen others will fund a competitor\'s programme as readily as ours. "We bring the funding" is now a hygiene claim. **The durable moat is single-point accountability for outcome — guarantee plus M&V plus 10–25 year O&M — not the presence of money.**'),
  num('**Heat network zoning converts Cities from a business-development market into a regulated concession market.** Six first zones are designated (Leeds, Plymouth, Bristol, Stockport, Sheffield and two London areas), with statutory instruments expected in Parliament in spring 2026 and construction from 2026/27. Zone by zone this is winner-takes-all for 20+ years, and the winners are being chosen now.'),
  num('**The £1bn NHS decarbonisation framework will define public sector access for three years.** Up to 180 suppliers across 20 lots, running 1 October 2026 to 30 September 2029. Lot 6 — "total service provision", principal partner for the full lifecycle, up to £200m — is the only lot that describes what Ameresco actually is. Everything else in that framework invites us to be a subcontractor.'),
  num('**Data centres are not an ESCO fight.** The competitor set is grid capacity, land, planning and capital — not other energy service companies. Compete on energy infrastructure, private wire, heat export and funded connection; partner on critical MEP with the specialist contractors who own that market (Mercury, Winthrop, Kirby, Dornan/Turner). Roughly 140 proposed UK data centres have requested c.50GW of connection capacity against a c.45GW national peak — scarcity, not service, is the currency.'),

  spacer(),
  callout('The one-line competitive position',
    'Nobody in the UK does all of what we do; almost everybody does some of it cheaper. We win by making the buyer value the join between the parts — and we lose whenever the join is not part of what is being bought.'),

  pageBreak(),

  // ===================== 2. HOW TO USE =====================
  h1('2. How to use this document'),

  p('This is a reference document, not a read-through. Four different uses:'),

  table(
    ['If you are…', 'Read…', 'Why'],
    [
      ['Preparing for a specific bid', 'Section 6 battlecard for the named competitor, then the Section 8 segment map', 'Gives you their model, their likely angle, and the counter-script in two pages'],
      ['Qualifying an opportunity', 'Section 5 (archetypes and wrap coverage) and Section 8 (segment maps)', 'Tells you whether this is a programme sale or a technology sale before you spend money on it'],
      ['Planning territory or account strategy', 'Sections 4, 10 and 12', 'Where the money and the procurement routes are moving over the next 24 months'],
      ['Briefing a new starter', 'Sections 1, 5 and 6', 'The shape of the market and the ten names they will meet most often'],
    ],
    [24, 40, 36], { firstColBold: true },
  ),
  spacer(),

  p('**Threat ratings** used throughout: **Critical** — competes for the same whole-programme mandate and can win it; **High** — competes for the mandate but with a narrower model or weaker funding; **Medium** — competes for large parts of scope, often as our subcontractor or our displacer on single lots; **Low** — component or niche overlap only. **Partner** — more valuable to us as a delivery or funding partner than as a rival, though the two can flip on a single deal.'),

  pageBreak(),

  // ===================== 3. SCOPE AND METHOD =====================
  h1('3. Scope, method and confidence'),

  h2('3.1 What is in scope'),
  bullet('Organisations active in the UK (and Ireland where the same team sells into the UK) in energy infrastructure, decarbonisation, energy services and energy construction.'),
  bullet('Seven market segments: I&C; Public Sector (NHS, universities, central government, local authority estates); Grid-Scale / Front-of-Meter; Cities and city-wide concessions; Data Centres; Social Housing & Schools Retrofit; EV Infrastructure & Fleet.'),
  bullet('Heat networks are treated as a battleground inside Cities and Public Sector rather than as a separate segment, because that is where the procurement decisions are actually taken.'),
  bullet('Capital providers — private equity, infrastructure funds, public funders — analysed as facilitators, funders, rival funders and acquirers of our competitors.'),
  bullet('Advisers, consultants and framework operators, because they shape specifications and payment mechanisms before any contractor is asked to price.'),

  h2('3.2 What is deliberately excluded'),
  bullet('Pure energy supply and retail (except where supply adjacency is the competitive weapon, e.g. Centrica, E.ON, SSE, Octopus, EDF).'),
  bullet('Pure commodity trading, brokerage and flexibility aggregation, except where it forms part of a competitor\'s route to market.'),
  bullet('Offshore wind, nuclear new-build and transmission-owner work, which sit outside the Ameresco delivery model.'),
  bullet('Domestic retail retrofit and consumer heat pump installation as standalone businesses.'),

  h2('3.3 Method'),
  p('Competitor positions are assessed against the five elements of the Ameresco wrap — **Design, Finance, Deliver, Operate, Optimise** — plus technology breadth and segment coverage. Each element is scored 0–5. A score of 5 means the competitor does this at our scale and quality as a matter of course; 3 means they do it but with narrower structures or in fewer segments; 1 means occasional or partner-dependent; 0 means not offered.'),

  h2('3.4 Confidence and currency'),
  p('Financial and ownership data is drawn from published accounts, company announcements and trade press to **August 2026**. Where a transaction is reported but not confirmed by the parties, it is flagged in the text as reported. Private company figures are filed accounts and therefore lag; divisional revenue for subsidiaries of large groups is often not separately disclosed and is estimated or omitted rather than guessed. Market sizing figures from third-party analysts carry wide error bars and are used for direction, not precision.'),

  callout('A caution on one number',
    'Published "UK energy-as-a-service" and "ESCO market" figures vary by more than a factor of three between analyst houses, because they draw the boundary in different places. Treat any single market-size number in a competitor\'s pitch — or in ours — as an argument rather than a fact.'),

  pageBreak(),

  // ===================== 4. MARKET CONTEXT =====================
  h1('4. Market context 2026: what has actually changed'),

  p('Six structural shifts are reshaping who we compete against and how. Each changes the competitive set, not just the market size.'),

  h2('4.1 Public sector capital has moved from grant to structure'),
  p('The Public Sector Decarbonisation Scheme is closed to new investment. Salix continues to deliver Phase 3c (grant funding to 31 March 2026) and Phase 4 (to 31 March 2028), but there is no further phase. For a decade the dominant public sector competitive question was "who can write the best grant bid?" — a question that favoured consultancy-led and contractor-led competitors with bid factories. The question is becoming "who can fund this without grant and stand behind the savings?", which favours us.'),
  p('**The competitive implication is a timing trap.** Competitors with large PSDS-funded backlogs (Dalkia\'s engineering division grew turnover 30% to £228m on public sector retrofit; Equans and Vital both carry substantial awarded programmes) will look strong for two more years on work that is already funded. Their weakness appears when that backlog runs off in 2027–28. Our funded model looks relatively expensive today and relatively essential in eighteen months. Sequence pursuit accordingly.'),

  h2('4.2 Great British Energy has re-armed the technology sellers'),
  p('GB Energy\'s solar programme has committed around £180m of capital grant into schools and NHS sites — approximately £80m for around 200 schools and £100m for nearly 200 NHS sites in England, plus £9.3m across Scotland, Wales and Northern Ireland, with a further round opened in January 2026 on a rolling basis. Over 250 schools have signed agreements for a share of up to £100m.'),
  p('This is grant capital pointed at a single technology in exactly the estates we target. It makes a funded solar proposition uncompetitive in those buildings and it gives solar EPCs — Custom Solar/Mitie, Anesco, Geo Green Power, regional installers — a credentialled route into estates teams. **Do not compete with a grant. Let the grant take the roof, and sell the heat, the plant replacement, the resilience and the M&V that the grant does not cover.**'),

  h2('4.3 Heat network zoning turns cities into regulated concessions'),
  p('DESNZ selected six first zones — Leeds, Plymouth, Bristol, Stockport, Sheffield and two London areas — sharing £5.8m of development funding, with construction expected from 2026/27. Two statutory instruments, one for zoning and one for the rights and powers regime, were anticipated to be laid in Parliament in spring 2026. Zone Coordinators will designate zones and determine what gets built, where and by whom.'),
  p('The Green Heat Network Fund has allocated over £500m to date, including £68m across eight projects in December 2025, and government has signalled around £195m a year for green heat networks. Round 12 closes 25 September 2026, with grants covering up to (but not including) 50% of eligible commercialisation and construction costs.'),
  p('**Competitive implication:** in a zoned market, the incumbent network owner in a city has a structural advantage over a challenger, because connection rights and existing pipe determine economics. Vital Energi, E.ON, Veolia and Hemiko are all positioning as zone-scale owner-operators. Bristol is one of the six first zones — that is an asset for us and a target for them.'),

  h2('4.4 The NHS is consolidating access into one framework'),
  p('The NHS northern procurement hub (NOE CPC, notice NOE.0655) has tendered a £1bn Decarbonisation and Energy Infrastructure framework: 20 lots, up to 180 suppliers, £350m across six national lots, £600m across fifteen regional delivery lots, and a single £200m principal partner lot. Bids were due 1 May 2026 with the framework running 1 October 2026 to 30 September 2029. Technical requirements span PAS 2035 retrofit assessment, TM65 operational energy modelling and NHS net zero 2040 alignment. NHS SBS separately operates a Decarbonisation of Estates framework (SBS10504).'),
  p('**Competitive implication:** a framework with 180 suppliers is a commoditisation machine for everything except Lot 6. Presence on regional works lots puts us in a price fight with regional contractors. The principal partner lot is the only structure that pays for what we are.'),

  h2('4.5 Clean Power 2030 and the grid queue have made connections the scarce good'),
  p('Grid connection capacity, not construction capability, is now the binding constraint on front-of-meter and on large behind-the-meter projects. Around 140 proposed data centres have requested approximately 50GW of connection capacity against a national peak of roughly 45GW. AI Growth Zones give designated sites priority connection access and the ability to build their own high-voltage infrastructure including private lines and substations.'),
  p('**Competitive implication:** the value in a project has shifted upstream, from EPC margin to connection rights and land. This favours competitors that own networks (E.ON, SSE, ENGIE via UK Power Networks, the IDNOs) and developers holding queue positions (Statera, Lightsource bp, NatPower, Fidra). Our grid-scale EPC credentials — Cellarhead at 300MW/624MWh and £196.5m, Sonnedix at 300MWp — are top-tier but they buy us a seat in a market where someone else increasingly holds the scarce asset.'),

  h2('4.6 Capital is rotating, and it is rotating through our competitors'),
  p('The ownership map of the UK energy services sector has changed more in eighteen months than in the previous decade:'),

  table(
    ['Move', 'What happened', 'Why it matters to us'],
    [
      ['ENGIE acquires UK Power Networks', 'May 2026. 8.5m customers, c.192,000km of network, 6,500 staff. UK becomes ENGIE\'s second-largest country of operation.', 'Creates a UK player with regulated network, generation, supply and a services heritage. If ENGIE rebuilds a UK services arm post-Equans, it becomes a top-five threat quickly.'],
      ['Vattenfall exits UK heat and networks', 'Ownership review from March 2025; UK IDNO sold to Eclipse Power (Octopus Sky Fund); heat businesses reported to be heading to Reinova Capital.', 'Direct counterparty change inside Bristol City Leap. Also removes a competitor and replaces it with a financial owner of unknown appetite.'],
      ['DIF Capital Partners acquires Hemiko (ex-Pinnacle Power)', 'Majority stake; c.£1bn to deploy into town and city-wide heat networks by 2030.', 'A pure-play, well-funded city-scale heat competitor built specifically for the zoning market.'],
      ['bp retreats from Lightsource bp', 'Full ownership taken October 2024, then a process to sell c.50% ("Project Scala"); reported talks with a Kuwait-backed consortium.', 'Ownership uncertainty at the UK\'s largest solar developer creates both partnership openings and irrational pricing.'],
      ['HGGC acquires Inspired plc', 'c.£183.6m recommended offer; delisted from AIM September 2025. 3,500+ customers, I&C focus.', 'PE money behind an adviser that sits between us and I&C buyers, and increasingly recommends structures.'],
      ['Corran Capital investment and £175m bond at Vital Energi', 'Senior secured bond 2025/2030 listed on Nordic ABM, September 2025.', 'Funds Vital\'s move from contractor to asset owner — the single most direct capability convergence with our model.'],
    ],
    [22, 40, 38], { firstColBold: true },
  ),
  caption('Table 4.1 — Ownership changes reshaping the UK competitive set, 2024–2026.'),

  pageBreak(),

  // ===================== 5. THE COMPETITIVE MAP =====================
  h1('5. The competitive map'),

  h2('5.1 Six archetypes'),
  p('Competitors are easier to counter when you classify them by business model rather than by sector, because the model determines what they can and cannot say yes to.'),

  table(
    ['Archetype', 'Who', 'How they make money', 'Their structural weakness'],
    [
      ['A. Funded multi-technology integrator', 'Ameresco, E.ON EIS, Vital Energi; Veolia and Centrica partially', 'Long-term asset ownership, availability and energy payments, O&M, development gain', 'Slow to mobilise; expensive-looking against a single-technology price; needs a sophisticated buyer'],
      ['B. Services and FM-led', 'EQUANS, Mitie, Dalkia, Veolia, Amey, ISS, CBRE, Sodexo, Bellrock, OCS', 'Labour margin, contract renewal, project uplift on an incumbent estate', 'Energy is one service line among many; funding is thin; investment case competes with FM P&L'],
      ['C. Utility and supply-led', 'Centrica, E.ON, EDF/Dalkia, SSE, Octopus, ENGIE, ScottishPower', 'Supply margin, PPA spread, asset returns, flexibility revenue', 'Solutions bend towards the supply book; independence is questionable; conflicted on optimisation'],
      ['D. Technology and OEM-led', 'Schneider, Siemens, Johnson Controls, Honeywell, Trane, Carrier, ABB, Danfoss', 'Product, platform, software subscription, service contracts', 'Vendor-tied; will not take whole-programme construction risk; integration is somebody else\'s problem'],
      ['E. Pure-play developer / owner-operator', 'Lightsource bp, Statera, Zenobe, Harmony, Hemiko, Field, Eku, NextEnergy, Atrato', 'Development premium, asset yield, merchant and contracted revenue', 'Single-technology; no estate-wide capability; cannot address efficiency, heat and resilience together'],
      ['F. Capital-only facilitator', 'DIF, Equitix, Amber, Greencoat, Macquarie, InfraRed, Foresight, NWF, GB Energy', 'Fund fees, asset returns, development gain', 'No delivery capability at all — they must back somebody, and it can be us'],
    ],
    [20, 24, 28, 28], { firstColBold: true },
  ),
  caption('Table 5.1 — The six competitor archetypes.'),

  h2('5.2 Wrap coverage: who can actually do what we do'),
  p('Each competitor scored 0–5 against the five elements of the Ameresco wrap, plus technology breadth. "Wrap score" is the total out of 30. This is the single most useful table in the document for qualification.'),

  table(
    ['Organisation', 'Design', 'Finance', 'Deliver', 'Operate', 'Optimise', 'Tech breadth', 'Wrap /30'],
    [
      ['Ameresco (reference)', '5', '5', '5', '5', '5', '5', '30'],
      ['E.ON UK (EIS)', '5', '5', '4', '5', '4', '4', '27'],
      ['Vital Energi', '5', '4', '5', '5', '3', '4', '26'],
      ['Veolia UK', '4', '4', '5', '5', '3', '3', '24'],
      ['EQUANS UK&I', '4', '3', '5', '5', '3', '4', '24'],
      ['Centrica Business Solutions', '4', '4', '4', '4', '4', '3', '23'],
      ['ENGIE UK', '4', '5', '3', '4', '3', '4', '23'],
      ['Dalkia UK', '4', '3', '5', '5', '3', '3', '23'],
      ['SSE Energy Solutions', '4', '4', '4', '4', '3', '3', '22'],
      ['Schneider Electric', '5', '3', '3', '3', '5', '3', '22'],
      ['Siemens', '5', '4', '3', '3', '5', '2', '22'],
      ['Mitie', '3', '2', '5', '5', '3', '4', '22'],
      ['Hemiko', '4', '5', '4', '4', '2', '2', '21'],
      ['Johnson Controls (Asset+)', '4', '3', '3', '4', '4', '2', '20'],
      ['Zenobe', '4', '5', '4', '4', '3', '1', '21'],
      ['Honeywell', '4', '2', '3', '3', '4', '2', '18'],
      ['Lightsource bp', '4', '5', '4', '4', '1', '1', '19'],
      ['Statera Energy', '4', '5', '4', '3', '1', '1', '18'],
      ['Anesco', '3', '2', '5', '4', '2', '2', '18'],
      ['Octopus Energy (business)', '2', '4', '2', '3', '5', '2', '18'],
      ['Sureserve', '3', '1', '5', '3', '1', '2', '15'],
      ['Clarke Energy', '4', '2', '5', '4', '2', '1', '18'],
      ['Kensa', '4', '3', '4', '3', '1', '1', '16'],
      ['Balfour Beatty', '3', '3', '5', '2', '1', '2', '16'],
      ['Amey', '3', '1', '4', '4', '2', '2', '16'],
    ],
    [26, 10, 10, 10, 10, 10, 12, 12], { firstColBold: true, centreCols: [1, 2, 3, 4, 5, 6, 7] },
  ),
  caption('Table 5.2 — Wrap coverage scores. Ameresco is set at the reference maximum; scores are relative to our UK delivery model, not absolute capability.'),

  spacer(),
  callout('How to read Table 5.2',
    'Nobody scores 30 but four organisations score 24 or above, and the top of that list is not the one most people name in the room. **E.ON is structurally the closest competitor to Ameresco in the UK; Vital Energi is the fastest-converging.** The gap that keeps most of the field below us is Optimise — long-horizon M&V and continuous performance improvement — which is also the hardest element for a buyer to evaluate at bid stage. That is precisely why it must be made concrete and contractual in our proposals rather than described.'),

  h2('5.3 Where the field is strong and weak, in one view'),

  table(
    ['Capability', 'Strongest competitors', 'Our position'],
    [
      ['Heat networks and city-scale heat', 'Vital Energi, E.ON, Veolia, Hemiko', 'Competitive via Bristol; not a heat-first business — sell the estate, not the pipe'],
      ['Multi-site public estate delivery', 'EQUANS, Dalkia, Mitie, Vital', 'Strong; differentiate on funding structure not delivery capacity'],
      ['Behind-the-meter generation at 1MW+', 'Centrica, SSE, Vital, Mitie', 'Strong; differentiate on multi-technology and guarantee'],
      ['Grid-scale EPC', 'Statera, Anesco, Belectric, Ethical Power, Wärtsilä', 'Top-tier credentials (Cellarhead, Sonnedix); commoditising fast'],
      ['Funded structures (EaaS / ESC / EPC+)', 'E.ON, Centrica, SSE, Zenobe, Hemiko', 'Strong; no longer unique — must be paired with guarantee'],
      ['Savings guarantee and M&V', 'Schneider, Siemens, Johnson Controls', 'This is our sharpest edge against everyone in archetypes B, C and E'],
      ['Grid connections and networks', 'ENGIE/UKPN, SSE, E.ON, OCU, Eclipse, GTC, Mitie/Rock', 'Gap — buy or partner; do not pretend'],
      ['Digital / BEMS / optimisation platform', 'Schneider, Siemens, Johnson Controls, Octopus', 'Gap relative to OEMs — counter with outcome accountability, not features'],
      ['Social housing retrofit at volume', 'EQUANS, Sureserve, United Living, Fortem, Mears', 'Weak and should stay weak — access it inside city programmes only'],
      ['Long-term asset ownership', 'E.ON, Vital, Hemiko, Veolia, infra funds', 'Strong; the US parent balance sheet is a genuine differentiator against UK mid-caps'],
    ],
    [26, 38, 36], { firstColBold: true },
  ),
  caption('Table 5.3 — Capability-by-capability competitive position.'),
];
