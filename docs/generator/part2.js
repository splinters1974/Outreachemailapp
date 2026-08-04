const { h1, h2, h3, h4, p, bullet, table, snapshot, callout, spacer, pageBreak, caption } = require('./lib');

// Battlecard builder ---------------------------------------------------------
function card(n, name, strap, snap, sections) {
  const out = [
    h2(`6.${n} ${name}`),
    p(strap, { italics: true, color: '5A5A5A' }),
    snapshot(snap),
    spacer(60),
  ];
  sections.forEach((s) => {
    out.push(h4(s.title));
    if (s.para) s.para.forEach((t) => out.push(p(t)));
    if (s.bullets) s.bullets.forEach((t) => out.push(bullet(t)));
    if (s.table) out.push(table(s.table.head, s.table.rows, s.table.widths, { firstColBold: true }));
  });
  return out;
}

module.exports = [
  h1('6. The top ten competitors in detail'),

  p('These ten organisations account for the large majority of competitive losses and near-losses across our target segments. Each battlecard follows the same structure so it can be used cold, in a bid room, without reading the rest of the document.'),

  table(
    ['#', 'Competitor', 'Archetype', 'Primary segments', 'Threat'],
    [
      ['1', 'Vital Energi', 'Funded integrator', 'Public sector, Cities, I&C', 'CRITICAL'],
      ['2', 'E.ON UK — Energy Infrastructure Solutions', 'Funded integrator / utility', 'Cities, Public sector, I&C', 'CRITICAL'],
      ['3', 'EQUANS UK & Ireland', 'Services and FM-led', 'Public sector, Housing, I&C', 'CRITICAL'],
      ['4', 'Centrica Business Solutions', 'Utility and supply-led', 'I&C, Public sector, Data centres', 'HIGH'],
      ['5', 'Veolia UK & Ireland', 'Services-led with heat assets', 'Cities, Public sector, I&C', 'HIGH'],
      ['6', 'Dalkia UK (EDF Group)', 'Services and FM-led', 'Public sector, I&C', 'HIGH'],
      ['7', 'SSE Energy Solutions', 'Utility and network-led', 'I&C, Cities, Grid-scale', 'HIGH'],
      ['8', 'Schneider Electric UK & Ireland', 'Technology / OEM-led', 'Public sector, I&C, Data centres', 'HIGH'],
      ['9', 'Siemens (Smart Infrastructure / SFS)', 'Technology / OEM-led', 'Public sector, I&C', 'MEDIUM'],
      ['10', 'Mitie (Energy, Power & Grid)', 'Services and FM-led', 'Public sector, I&C', 'MEDIUM'],
    ],
    [5, 30, 20, 27, 18], { autoShade: true, centreCols: [0, 4] },
  ),
  caption('Table 6.1 — The top ten, ranked by directness of overlap with the full Ameresco proposition.'),

  pageBreak(),

  // ---------------------------------------------------------------- 1 VITAL
  ...card(1, 'Vital Energi', 'The most direct UK competitor, and the one closing the gap fastest.',
    [
      ['Ownership', 'Private, UK-owned (Blackburn, Lancashire). Corran Capital among investors. Vital Energi Midco issued a £175m senior secured bond 2025/2030, listed on Nordic ABM in September 2025.'],
      ['UK scale', 'Turnover £274.6m for the year to 30 June 2025, up 10.6% from £248.3m. Reported market pipeline of approximately £2.5bn.'],
      ['Model', 'Develops, delivers, owns and operates energy assets and heat networks. Has moved decisively from EPC contractor to asset owner-operator.'],
      ['Technologies', 'Heat networks and energy centres, CHP, heat pumps (including large-scale water and air source), solar PV, BESS, energy efficiency, private wire.'],
      ['Segments', 'Public sector (NHS, universities), Cities and regional heat networks, I&C, residential developments.'],
      ['Wrap score', '26/30 — the highest of any UK-owned competitor.'],
    ],
    [
      { title: 'What they actually deliver', para: [
        'Vital is a genuine multi-technology delivery business with deep, credible heat network engineering. Their reputation is built on energy centres and district heating for NHS trusts, universities and city schemes — Leeds, Manchester, Cardiff and a long tail of campus and hospital energy centres. They self-perform a large proportion of mechanical and electrical work, which gives them cost control and programme certainty that most of our competitors cannot match.',
        'The strategic shift is the important part. Historically Vital built assets for other people to own. With bond financing in place and an investor behind them, they now develop, own and operate — which puts them in the same conversation as us on funded structures, not just on construction price.',
      ] },
      { title: 'How they win', bullets: [
        'Deep incumbency on public sector frameworks and long relationships with NHS and university estates teams.',
        'Credible, referenceable heat network delivery at a scale very few can match — the strongest single technical proof point in their portfolio.',
        'UK-owned and UK-managed, which plays well against US and European parents in local authority and NHS procurement where local value and accountability are scored.',
        'Lower cost base and self-delivery, so they price sharper on the construction element than we can.',
        'Increasingly able to fund, which removes the argument that used to be our clearest differentiator.',
      ] },
      { title: 'Where they beat us', bullets: [
        'Heat network technical depth and reference base.',
        'Construction price on a defined scope.',
        'Framework incumbency and relationship density in the NHS and higher education.',
        'Perceived as a "British company investing in Britain" — a real advantage in social value scoring.',
      ] },
      { title: 'Where we beat them', bullets: [
        'Balance sheet. A £175m bond is real money, but it is not a US-listed parent with a $5bn project backlog. On programmes above roughly £100m, or where a council needs 20-year covenant strength, we are the safer counterparty.',
        'Technology breadth beyond heat. Vital leads with the energy centre; we lead with the estate. Where the answer is not primarily heat, their proposition thins.',
        'City-scale partnership governance. Bristol City Leap is a £1bn+, 20-year, multi-workstream joint venture with a local authority. Vital has large contracts; they do not have an equivalent city partnership.',
        'Grid-scale credentials. Cellarhead (300MW / 624MWh, £196.5m) and Sonnedix (300MWp) put us in a different category on front-of-meter infrastructure.',
        'Savings guarantee and long-horizon M&V discipline. Vital is a builder-owner; we are an outcome business.',
      ] },
      { title: 'Recent proof points to expect in their pitch', bullets: [
        'City and regional heat network programmes, positioned as evidence they can run zone-scale schemes.',
        'FY25 growth and the bond, positioned as evidence of financial strength and long-term commitment.',
        'The £2.5bn pipeline figure, used as a proxy for market confidence.',
      ] },
      { title: 'Trigger events to watch', bullets: [
        'Further equity investment or a change of control — would materially raise their capacity for concession-scale bids.',
        'Any award as a heat network Zone Coordinator delivery partner in one of the six first zones.',
        'Movement into savings-guaranteed contracting, which would erase our clearest remaining structural difference.',
      ] },
      { title: 'Counter-script', para: [
        '**When they lead on heat:** "Vital build excellent energy centres. The question for you is not who builds the energy centre — it is who is accountable for the whole estate\'s cost, carbon and resilience for the next twenty years, and who carries the risk if the savings do not appear. That is a different contract and a different balance sheet."',
        '**When they lead on being British:** "Local value is delivered by the supply chain and the workforce, not the shareholder register. Bristol City Leap has generated £15m of social value including £10m of energy efficiency for households at risk of fuel poverty. Ask any bidder to show the mechanism, not the flag."',
        '**When they lead on price:** "Compare like with like. Our price includes a guarantee, the measurement and verification that proves it, and twenty years of operation. Ask what happens in year seven when performance drifts — and who pays."',
      ] },
    ]),

  pageBreak(),

  // ---------------------------------------------------------------- 2 E.ON
  ...card(2, 'E.ON UK — Energy Infrastructure Solutions', 'Structurally the closest thing in the UK to our own business model.',
    [
      ['Ownership', 'E.ON SE (Germany), one of Europe\'s largest energy and networks groups.'],
      ['UK scale', 'Major UK supply and infrastructure presence; the Energy Infrastructure Solutions arm is the relevant competitor, not the retail business.'],
      ['Model', 'Develops, funds, builds, owns and operates energy infrastructure — heat networks, energy centres, private networks — under long-term partnerships and concessions.'],
      ['Technologies', 'District heating and ectogrid-type ambient networks, heat pumps, CHP, solar, BESS, EV, efficiency, supply.'],
      ['Segments', 'Cities (the strongest), Public sector, I&C, large mixed-use developments.'],
      ['Wrap score', '27/30 — the highest of any competitor.'],
    ],
    [
      { title: 'What they actually deliver', para: [
        'E.ON is the one competitor that does the whole thing: it designs, funds, builds, owns, operates and optimises multi-decade energy infrastructure, and it does so under city-partnership structures that look very like ours. Citigen in the City of London is a mature, owned, operating heat network with new twenty-year connection agreements still being signed. The Coventry Strategic Energy Partnership is a fifteen-year city relationship covering heat, fabric efficiency and social value. The Silvertown scheme with Lendlease deploys an ambient "ectogrid" energy-sharing network across a 760,000m² development serving around 6,500 homes and business units.',
        'They are also positioning hard on heat network zoning, including in the City of London — meaning they intend to be the default owner-operator when zones are designated.',
      ] },
      { title: 'How they win', bullets: [
        'Brand trust with councils and cabinet members, and a long track record of not walking away.',
        'Network and asset ownership: they can hold assets on balance sheet indefinitely, at a cost of capital few can match.',
        'City partnership precedent — Coventry is a genuine comparable to a City Leap-style relationship.',
        'Supply adjacency lets them bundle energy price certainty into a decarbonisation proposition.',
        'Genuine innovation credentials (ambient networks, waste heat recovery) that read well to technically literate buyers.',
      ] },
      { title: 'Where they beat us', bullets: [
        'Cost of capital and willingness to hold long-dated heat assets.',
        'Political and municipal relationships built over fifteen-plus years.',
        'Ability to combine supply, network and infrastructure in one commercial offer.',
        'Scale of European reference base for district heating.',
      ] },
      { title: 'Where we beat them', bullets: [
        '**Independence.** E.ON is a supplier. Every solution they propose sits next to a supply book, and the optimisation they perform is not neutral. We have no supply position to protect, and that is a genuine, checkable difference.',
        'Breadth beyond heat and supply. Their decarbonisation offer is strongest where there is a network to build; ours does not require one.',
        'Agility. Decisions inside a large European utility take time. On complex, fast-moving I&C and data centre opportunities we can move faster and take a commercial view.',
        'Grid-scale front-of-meter EPC credentials.',
        'Bristol City Leap is larger in scope than Coventry: £1bn+, 20 years, and spanning schools, social housing, heat networks, council buildings, EV and community energy under one programme.',
      ] },
      { title: 'Recent proof points to expect in their pitch', bullets: [
        'Citigen and new City of London connection agreements running into the 2040s.',
        'Coventry\'s fifteen-year Strategic Energy Partnership.',
        'Silvertown / Lendlease ectogrid as the first UK application of ambient energy sharing.',
        'Heat zoning readiness in the City of London.',
      ] },
      { title: 'Trigger events to watch', bullets: [
        'Award of Zone Coordinator delivery roles in any of the six first heat network zones.',
        'Any new city-scale strategic partnership announcement — that is a direct assault on our positioning.',
        'Group capital allocation decisions: E.ON has periodically rotated out of non-core UK activity.',
      ] },
      { title: 'Counter-script', para: [
        '**On independence:** "E.ON is a very capable partner and also an energy supplier. Ask them to confirm, in writing, that no part of their proposal depends on you buying supply from them, and that their optimisation of your assets is neutral as to who sells you power. We can give you that assurance without qualification, because we have nothing to sell you afterwards."',
        '**On city scale:** "Coventry is a strong programme. Bristol City Leap is a £1bn, twenty-year joint venture covering the whole city system, with a community energy fund and £15m of social value already delivered. Ask both bidders for the scope breadth, not just the headline duration."',
        '**On speed:** "Ask each bidder what their approval path is for a £30m investment decision and how long it takes. Then ask for an example where they changed a programme mid-flight because the customer\'s circumstances changed."',
      ] },
    ]),

  pageBreak(),

  // ---------------------------------------------------------------- 3 EQUANS
  ...card(3, 'EQUANS UK & Ireland', 'The scale competitor. Beats us on presence and self-delivery; loses to us on what a programme is for.',
    [
      ['Ownership', 'Bouygues Group (France). EQUANS globally reported €18.7bn revenue in 2025 across 20 countries and c.83,000 employees.'],
      ['UK scale', 'Approximately £2.5bn UK & Ireland revenue, c.12,000–15,000 employees.'],
      ['Model', 'Sustainable facilities management, regeneration, energy and digital services. Self-delivering contractor with a very large directly employed workforce.'],
      ['Technologies', 'Retrofit and fabric, heat pumps, solar, BMS and controls, heat networks, EV, technical FM; energy as one of several service lines.'],
      ['Segments', 'Public sector, Social housing (leading position), Local authority estates, I&C, Defence.'],
      ['Wrap score', '24/30 — very high on Deliver and Operate, materially weaker on Finance and Optimise.'],
    ],
    [
      { title: 'What they actually deliver', para: [
        'EQUANS is the largest single competitor by UK headcount and revenue in this space, and the most likely to already be on site when we arrive. They combine hard and soft FM, regeneration and construction, energy services and digital under one roof, and they self-deliver at a scale nobody else in this list matches.',
        'Their strongest market is social housing and public estate retrofit. They have run very large volumes of SHDF / Warm Homes: Social Housing Fund work with dozens of landlord partners, and they were named Retrofit Coordination Company of the Year at the 2026 Retrofit Academy Awards. They hold places on the major public frameworks, including all four work lots of the £480m PfH repairs and disrepair framework.',
      ] },
      { title: 'How they win', bullets: [
        'Incumbency. They are frequently already the FM or repairs provider, so they see the opportunity first and can bid it as an extension.',
        'Sheer capacity — they can mobilise hundreds of operatives against a programme quickly.',
        'Framework coverage across housing, public sector and defence.',
        'Grant bid capability built up through PSDS and SHDF, with in-house funding application teams.',
        'Price: a services cost base with no requirement to earn an asset return.',
      ] },
      { title: 'Where they beat us', bullets: [
        'Volume delivery of fabric and retrofit measures.',
        'Access through incumbency and framework position.',
        'Social value and local employment scale.',
        'Price on defined works packages.',
      ] },
      { title: 'Where we beat them', bullets: [
        '**They are a facilities manager with an energy division; we are an energy infrastructure business.** That is not a slogan — it shows up in who owns the risk. Their commercial model is built on labour and works margin, not on standing behind twenty years of energy performance.',
        'Funded structures. EQUANS can arrange finance; they do not routinely put their own long-term capital into customer energy assets and hold them.',
        'Savings guarantee and long-horizon M&V. This is where the gap is widest.',
        'Multi-technology generation and grid-scale infrastructure engineering.',
        'City-scale partnership governance and concession structures.',
      ] },
      { title: 'Recent proof points to expect in their pitch', bullets: [
        'Large multi-landlord SHDF / Warm Homes programmes and retrofit awards.',
        'Framework positions across PfH, LHC and public sector routes.',
        'Bouygues group scale and balance sheet.',
      ] },
      { title: 'Trigger events to watch', bullets: [
        'Any move to establish a dedicated funded-asset vehicle in the UK — that would close their weakest gap.',
        'Bouygues portfolio decisions on EQUANS; the business has changed hands once already.',
        'Their position on the NHS £1bn framework principal partner lot.',
      ] },
      { title: 'Counter-script', para: [
        '**The core line:** "EQUANS is a very good facilities management and regeneration business with an energy team. We are an energy infrastructure business. If what you need is volume delivery of measures, they are strong. If what you need is somebody to fund the programme, guarantee the savings, prove them for twenty years and carry the risk if they do not appear, ask which of those things sits on their balance sheet."',
        '**On grant capability:** "Grant-writing was the right capability for the last five years. PSDS is closed to new investment. Ask each bidder what their model looks like when there is no grant — because from 2028 that is the only model there is."',
      ] },
    ]),

  pageBreak(),

  // ---------------------------------------------------------------- 4 CENTRICA
  ...card(4, 'Centrica Business Solutions', 'Strong brand, real funding, genuine 1MW+ capability — anchored to a supply book.',
    [
      ['Ownership', 'Centrica plc (LSE: CNA).'],
      ['UK scale', 'Partners with 1,800+ organisations in the UK and Ireland; 7,000+ globally. From 2025 Centrica consolidated business supply and services across British Gas Energy, Bord Gáis and Centrica Business Solutions into a single Business division.'],
      ['Model', 'Behind-the-meter energy solutions at 1MW and above, with in-house financing options, plus supply, optimisation and flexibility routes to market.'],
      ['Technologies', 'Large-scale solar PV, hydrogen-ready CHP, heat pumps, BESS, energy centres, controls, demand response and flexibility.'],
      ['Segments', 'I&C (primary), Public sector, Data centres (PPA and private wire).'],
      ['Wrap score', '23/30.'],
    ],
    [
      { title: 'What they actually deliver', para: [
        'Centrica Business Solutions is a real competitor for large behind-the-meter projects, particularly where an energy centre or a CHP transition is involved. They design, build, operate and maintain assets, they offer flexible financing including in-house options, and they can wrap an energy supply and flexibility proposition around the physical asset. The 2025 reorganisation, which pulled all business supply and services into one division, signals an intent to sell the whole relationship rather than individual projects.',
        'Their public sector credibility is real — the Solihull Hospital energy centre is a recent, referenceable NHS delivery.',
      ] },
      { title: 'How they win', bullets: [
        'Brand recognition and an existing supply relationship with a very large number of UK businesses, which gives them warm access we have to earn.',
        'Ability to package energy price certainty with decarbonisation — attractive to CFOs whose real pain is cost volatility.',
        'Flexibility and optimisation route to market: they can monetise assets in balancing and capacity markets, improving the customer\'s business case.',
        'In-house financing without an external funder in the chain.',
      ] },
      { title: 'Where they beat us', bullets: [
        'Warm access to I&C buyers through the existing supply book.',
        'Ability to bundle commodity risk management with asset delivery.',
        'Flexibility revenue stacking that can make a marginal business case work.',
      ] },
      { title: 'Where we beat them', bullets: [
        '**Independence.** Their decarbonisation offer is built around supply. We are not tied to a supply contract, and we do not need the customer to keep buying energy from us for our model to work.',
        'Full decarbonisation breadth. Their sweet spot is generation assets at 1MW+; ours includes the whole estate — fabric, plant, heat, resilience, EV and grid.',
        'Long-term programme accountability across a multi-site estate over 10–25 years, rather than project-by-project delivery.',
        'Complex public sector and city-scale programme structures.',
        'Speed and entrepreneurialism relative to a large listed utility.',
      ] },
      { title: 'Recent proof points to expect in their pitch', bullets: [
        'Solihull Hospital energy centre and other NHS deliveries.',
        'Large industrial CHP and solar installations.',
        'Their flexibility and optimisation platform and the revenue it can add.',
      ] },
      { title: 'Trigger events to watch', bullets: [
        'Further consolidation of the Business division and any change to the funded-asset appetite disclosed at results.',
        'Movement into heat networks or city partnerships, which would widen the overlap significantly.',
        'Data centre PPA and private wire deals — they are actively pursuing this segment.',
      ] },
      { title: 'Counter-script', para: [
        '**On independence:** "Centrica are good at what they do. Ask them one question: if you never bought another unit of energy from Centrica, would this proposal still work, and would the price be the same? Then ask us the same question."',
        '**On breadth:** "Their strength is generation at a megawatt and above. Your problem is not one megawatt — it is fourteen sites, ageing plant, a grid constraint and a compliance deadline. Ask both bidders to price the whole problem, not the good bit of it."',
      ] },
    ]),

  pageBreak(),

  // ---------------------------------------------------------------- 5 VEOLIA
  ...card(5, 'Veolia UK & Ireland', 'A waste and water company with a very serious heat network ambition.',
    [
      ['Ownership', 'Veolia (France), global environmental services group.'],
      ['UK scale', 'One of the largest environmental services businesses in the UK; energy is a growing division rather than the core.'],
      ['Model', 'Owns and operates energy-from-waste plant and district heating; launched the "Ecothermal Grid" heat network offer in the UK in November 2025 with a stated £1bn project pipeline to 2030 and £210m of 2025 UK project wins.'],
      ['Technologies', 'Energy-from-waste heat recovery, district heating, heat pumps, CHP, geothermal (MoU with Star Energy), efficiency, technical services.'],
      ['Segments', 'Cities and municipal heat, Public sector, I&C process energy.'],
      ['Wrap score', '24/30.'],
    ],
    [
      { title: 'What they actually deliver', para: [
        'Veolia\'s competitive advantage in heat is that it already owns the heat source. Energy-from-waste facilities give it a low-cost, dispatchable heat supply that a competitor has to build. Southwark 2.0 supplies more than 2,500 homes with around 8,000 tonnes of CO₂ saved annually, and phase two — starting March 2026 — extends supply towards around 7,000 homes using recovered EfW heat.',
        'The Ecothermal Grid launch is a serious statement of intent: a £1bn pipeline to 2030 across Wiltshire, London, Bristol, Yorkshire and Cambridgeshire, positioning Veolia as a zone-scale heat network owner-operator just as zoning regulations arrive.',
      ] },
      { title: 'How they win', bullets: [
        'Owned heat sources from energy-from-waste — a structural cost advantage in district heating that we cannot replicate.',
        'Deep, long-standing municipal relationships through waste and water contracts, often decades old.',
        'Scale and covenant strength.',
        'Ability to present heat as an extension of an existing council relationship rather than a new procurement.',
      ] },
      { title: 'Where they beat us', bullets: [
        'Heat source economics wherever an EfW plant is within reach.',
        'Municipal incumbency and political familiarity.',
        'Scale of civil and infrastructure delivery.',
      ] },
      { title: 'Where we beat them', bullets: [
        '**Technology agnosticism.** Veolia\'s heat proposition is strongest where their waste infrastructure is; ours is strongest wherever the customer is. Where there is no EfW plant, their advantage evaporates and their offer becomes conventional.',
        'Estate-wide breadth. Veolia sells heat and technical services. We sell the whole estate — solar, BESS, EV, efficiency, resilience and heat as one programme.',
        'Funded structures with savings guarantees and M&V.',
        'Grid-scale front-of-meter capability, which they do not have.',
        'City partnership governance covering more than the utility layer.',
      ] },
      { title: 'Recent proof points to expect in their pitch', bullets: [
        'Southwark 2.0 phases one and two.',
        'The Ecothermal Grid launch and £1bn pipeline.',
        'The Star Energy geothermal memorandum of understanding for district heating, hospitals, campuses and industrial process heat.',
      ] },
      { title: 'Trigger events to watch', bullets: [
        'Zone Coordinator delivery awards in cities with Veolia EfW assets — a very strong position for them.',
        'Progress of the Star Energy geothermal partnership from MoU to delivery.',
        'Any move to acquire an ESCO or energy services platform to broaden beyond heat.',
      ] },
      { title: 'Counter-script', para: [
        '**Where they have an EfW source:** "Their heat is genuinely cheap and you should take that seriously. Ask them what happens to the other 70% of your carbon and cost — the buildings, the plant, the power, the fleet. Heat is one workstream in a programme, not the programme."',
        '**Where they do not:** "Ask where the heat comes from and what it costs. Without a waste plant nearby, this is a conventional heat network priced by a company whose core business is waste."',
      ] },
    ]),

  pageBreak(),

  // ---------------------------------------------------------------- 6 DALKIA
  ...card(6, 'Dalkia UK (EDF Group)', 'Riding the tail of the grant era harder than anyone. Watch what happens when it ends.',
    [
      ['Ownership', 'Dalkia, a subsidiary of EDF Group (France).'],
      ['UK scale', 'Turnover £657m in 2025, up 8%; pre-tax profit £8.2m (from £0.3m). The engineering division grew turnover 30% to £228m on public sector energy retrofit work.'],
      ['Model', 'Technical and energy services: M&E, technical FM, energy performance, retrofit delivery, with EDF group synergies including nuclear and supply.'],
      ['Technologies', 'Heat pumps, BMS and controls, LED and fabric measures, CHP, energy centres, technical services.'],
      ['Segments', 'Public sector (dominant), I&C, defence and nuclear-adjacent.'],
      ['Wrap score', '23/30.'],
    ],
    [
      { title: 'What they actually deliver', para: [
        'Dalkia UK is a technical services and engineering business that has grown sharply on the back of government-backed public sector decarbonisation schemes. The 30% growth in engineering turnover to £228m is almost entirely a PSDS-era phenomenon: grant-funded retrofit at volume, delivered competently and priced keenly, with EDF group backing behind it.',
        'They are a serious M&E delivery organisation with strong nuclear and industrial credentials, and increasing energy services ambition. They are not primarily a funder of customer assets.',
      ] },
      { title: 'How they win', bullets: [
        'EDF parentage: covenant strength, supply adjacency and credibility in regulated and safety-critical environments.',
        'Public sector retrofit delivery machine built during PSDS, with the estimating and mobilisation capability that goes with it.',
        'Competitive pricing on grant-funded scopes where the customer needs delivery, not finance.',
        'Technical services incumbency that generates project pipeline from existing contracts.',
      ] },
      { title: 'Where they beat us', bullets: [
        'Price and speed on grant-funded, defined-scope retrofit.',
        'Depth of M&E and technical services self-delivery.',
        'EDF group relationships in central government and regulated industry.',
      ] },
      { title: 'Where we beat them', bullets: [
        '**Their growth is grant-shaped and the grant has stopped.** PSDS is closed to new investment. Their 2025–26 numbers reflect awarded work; their 2028 numbers will reflect whether they built a funded model. Today they largely have not.',
        'Funded structures — EaaS, energy supply contracts, EPC+ — backed by a parent balance sheet committed to holding energy assets.',
        'Savings guarantees and 10–25 year M&V accountability.',
        'Multi-technology generation and grid-scale infrastructure.',
        'City-scale programme structures.',
        'Independence from a supply and generation parent.',
      ] },
      { title: 'Recent proof points to expect in their pitch', bullets: [
        'Volume of PSDS-funded public sector retrofit delivered.',
        '2025 financial turnaround and EDF backing.',
        'Nuclear and high-compliance environment credentials.',
      ] },
      { title: 'Trigger events to watch', bullets: [
        'Launch of a funded or performance-guaranteed offer in the UK — the obvious strategic response to PSDS ending.',
        'EDF group strategy on UK services following the wider EDF restructuring.',
        'Their positioning on the NHS £1bn framework.',
      ] },
      { title: 'Counter-script', para: [
        '**The timing line:** "Dalkia have delivered a lot of grant-funded work very well. Ask them what their proposition is for the projects that have no grant — because that is every project you procure after this one. Then ask whether their price includes a guarantee, or just a scope."',
        '**On EDF:** "EDF is a strong parent and also a generator and supplier. If independence of advice matters to you, ask where the conflict sits."',
      ] },
    ]),

  pageBreak(),

  // ---------------------------------------------------------------- 7 SSE
  ...card(7, 'SSE Energy Solutions', 'Networks and private wire are the weapon. Estate-wide programmes are not.',
    [
      ['Ownership', 'SSE plc (LSE: SSE). Group strategy has shifted towards partnering, including the sale of a 25% stake in SSEN Transmission to Ontario Teachers\' Pension Plan for £1.465bn.'],
      ['UK scale', 'Large UK utility group; Energy Solutions is the distributed energy and business customer arm.'],
      ['Model', 'Distributed energy infrastructure — funded on-site and near-site generation under long-term PPA, private wire, electricity networks and connections, green supply.'],
      ['Technologies', 'Solar PV (funded, PPA-based), BESS, private wire networks, electricity network ownership and connections, EV, green supply.'],
      ['Segments', 'I&C, Cities and large estates, Grid-scale adjacency, transport and infrastructure.'],
      ['Wrap score', '22/30.'],
    ],
    [
      { title: 'What they actually deliver', para: [
        'SSE Energy Solutions\' distinctive capability is the combination of funded generation with network ownership. They will develop, build, own, operate and maintain solar on a customer\'s site or on nearby land at no upfront cost under a fixed-term PPA, and where there is no space on site they will secure off-site land and deliver power by private wire. They also own and operate electricity networks and deliver connections — a capability that is becoming the scarcest thing in the market.',
        'The London Underground private wire solar agreement announced in March 2026 — potentially up to 65,000 MWh a year, covering around 4% of annual electricity consumption — is exactly the deal shape they will bring to large estates.',
      ] },
      { title: 'How they win', bullets: [
        'Network ownership and connection capability at a time when grid capacity is the constraint.',
        'Genuinely funded PPA structures with no upfront customer capital.',
        'Green supply bundling and renewable provenance from SSE\'s own generation.',
        'Utility covenant strength and long-dated asset appetite.',
      ] },
      { title: 'Where they beat us', bullets: [
        'Grid connections and private network delivery — a capability gap on our side.',
        'Off-site land acquisition and private wire structuring at scale.',
        'Renewable supply provenance for customers with Scope 2 reporting pressure.',
      ] },
      { title: 'Where we beat them', bullets: [
        '**They sell power; we sell programmes.** An SSE proposition typically addresses generation and supply. It does not address the boiler house, the fabric, the controls, the resilience strategy or the compliance deadline.',
        'Multi-technology estate programmes with a single accountable partner.',
        'Savings guarantees and long-horizon M&V.',
        'Public sector estate programme delivery at building level.',
        'Independence from a supply and generation position.',
      ] },
      { title: 'Recent proof points to expect in their pitch', bullets: [
        'The London Underground / TfL private wire solar deal.',
        'Funded solar PPAs across corporate estates.',
        'Network and IDNO capability, and SSE group partnering transactions as evidence of capital strength.',
      ] },
      { title: 'Trigger events to watch', bullets: [
        'Further SSE group portfolio decisions — the partnering strategy has already reshaped the transmission business and could reach Energy Solutions.',
        'Any acquisition of building-level energy services capability, which would close their main gap.',
        'Their role in data centre power provision, where network ownership is decisive.',
      ] },
      { title: 'Counter-script', para: [
        '**On breadth:** "SSE will build you excellent solar and, if you need it, a private wire. Ask them what they are proposing to do about heat, about the plant that fails in 2029, and about the compliance deadline. Then ask who is accountable if the savings across all of it do not land."',
        '**On grid, honestly:** "If your binding constraint is a grid connection, SSE have a genuine advantage and we would rather partner than pretend. If your binding constraint is a whole estate, that is our lane."',
      ] },
    ]),

  pageBreak(),

  // ---------------------------------------------------------------- 8 SCHNEIDER
  ...card(8, 'Schneider Electric UK & Ireland', 'The global ESCO brand. In the UK, a technology and advisory business more than a delivery one.',
    [
      ['Ownership', 'Schneider Electric SE (France), listed.'],
      ['UK scale', 'Large UK presence across products, software, services and data centre infrastructure.'],
      ['Model', 'Energy performance contracting and advisory, EcoStruxure platform, microgrids, building and grid technology. Ranked the leading global ESCO by Guidehouse Insights for close to a decade.'],
      ['Technologies', 'BMS and controls, power distribution, microgrid control, metering and analytics, data centre power and cooling; delivery largely through partners.'],
      ['Segments', 'Public sector, I&C, Data centres.'],
      ['Wrap score', '22/30 — strongest of the field on Design and Optimise, weakest of the top ten on self-delivery.'],
    ],
    [
      { title: 'What they actually deliver', para: [
        'Schneider is the strongest technology and analytics proposition in this document, and it carries the most credible global ESCO brand — which matters in rooms where the buyer has researched the market. Their performance contracting model uses energy savings to fund a wider scope of facility improvement and backlog maintenance, and their public sector messaging in the UK is explicitly about turning maintenance backlog into a funded upgrade programme. They forecast smart technologies delivering around £650m a year of UK public sector energy savings by 2037.',
        'The important qualification is that in the UK, Schneider is predominantly a technology, software and advisory business that delivers through a partner ecosystem. They are not a large UK self-delivering construction organisation.',
      ] },
      { title: 'How they win', bullets: [
        'The global ESCO league table position — genuinely persuasive with buyers who benchmark.',
        'Best-in-class digital, metering, analytics and control platform, which makes the optimisation story tangible.',
        'Strong consulting and advisory front end that can shape a client\'s strategy before procurement begins.',
        'Data centre credibility from the power and cooling product estate.',
      ] },
      { title: 'Where they beat us', bullets: [
        'Digital platform depth and the demonstrability of the optimisation layer.',
        'Advisory access at strategy stage, upstream of procurement.',
        'Global brand recognition in ESCO benchmarking.',
      ] },
      { title: 'Where we beat them', bullets: [
        '**Technology is part of the answer; we are the programme, not the product.** Their commercial model is anchored to their own equipment and software. Ours is anchored to the outcome, and we select technology on merit.',
        'UK self-delivery and construction capability at scale.',
        'Funded structures with our own long-term capital in the asset.',
        'Generation assets — solar, BESS, CHP, heat networks — which are not their business.',
        'City-scale and public estate programme delivery.',
      ] },
      { title: 'Recent proof points to expect in their pitch', bullets: [
        'Guidehouse ESCO leadership ranking.',
        'EcoStruxure deployments and analytics case studies.',
        'Public sector performance contracting references, largely international.',
      ] },
      { title: 'Trigger events to watch', bullets: [
        'Acquisition of a UK delivery contractor — this would change them from an advisory threat to a delivery threat.',
        'Expansion of UK microgrid delivery, particularly around AI Growth Zones and data centres.',
      ] },
      { title: 'Counter-script', para: [
        '**The core line:** "Schneider make outstanding technology and we are happy to install it. The question is who is accountable when the programme underperforms. Ask them whether they will take construction risk on the whole scope, fund it, and guarantee the savings — or whether they will provide the platform and a specification, and leave a contractor to carry the rest."',
        '**On technology independence:** "We are technology agnostic. Ask any vendor-led bidder to show you the options they evaluated and rejected, and why."',
      ] },
    ]),

  pageBreak(),

  // ---------------------------------------------------------------- 9 SIEMENS
  ...card(9, 'Siemens (Smart Infrastructure and Siemens Financial Services)', 'Technology plus captive finance. The nearest thing to our structure among the OEMs.',
    [
      ['Ownership', 'Siemens AG (Germany), listed.'],
      ['UK scale', 'Very large UK presence across mobility, industry, smart infrastructure and financial services.'],
      ['Model', 'Building performance contracting supported by Siemens Financial Services, plus building automation, electrification and grid technology.'],
      ['Technologies', 'Desigo and building automation, electrical distribution, grid technology, metering and analytics, e-mobility infrastructure.'],
      ['Segments', 'Public sector (NHS and universities especially), I&C, industry.'],
      ['Wrap score', '22/30.'],
    ],
    [
      { title: 'What they actually deliver', para: [
        'Siemens is the OEM competitor most likely to appear with a funded proposition, because Siemens Financial Services can finance a performance contract from within the group. That combination — technology, controls, and captive finance — is genuinely close to our structure in shape, if not in scope.',
        'Their strongest position is BMS and controls incumbency in hospitals, universities and large public buildings. Once Desigo is on an estate, they have a standing relationship with the engineering team and a route into every upgrade conversation.',
      ] },
      { title: 'How they win', bullets: [
        'Controls incumbency across NHS and higher education estates.',
        'Captive finance from Siemens Financial Services, so the funding conversation stays inside the group.',
        'Engineering brand credibility with technical buyers.',
        'Breadth across electrification and grid technology as estates electrify.',
      ] },
      { title: 'Where they beat us', bullets: [
        'BMS and controls estate incumbency and the access it gives.',
        'Brand trust with engineers and technical directors.',
        'Integrated technology plus finance in a single group offer.',
      ] },
      { title: 'Where we beat them', bullets: [
        '**They are positioned as the technology supplier with a finance wrapper, not as the accountable programme integrator.** The distinction shows up in scope: their contracts rarely span generation, heat, fabric, resilience and grid together.',
        'Multi-technology generation — solar, BESS, CHP, heat networks — is not their business.',
        'Long-term O&M across a whole programme rather than a controls system.',
        'City-scale concessions and public estate programmes.',
        'UK construction self-delivery.',
      ] },
      { title: 'Recent proof points to expect in their pitch', bullets: [
        'NHS and university building performance contracts.',
        'Siemens Financial Services structures presented as equivalent to an ESCO funding model.',
        'Digital twin and analytics capability.',
      ] },
      { title: 'Trigger events to watch', bullets: [
        'Any expansion of SFS appetite for UK energy asset ownership.',
        'Partnership with a UK delivery contractor to close the construction gap.',
      ] },
      { title: 'Counter-script', para: [
        '**The core line:** "Siemens will finance and deliver an excellent controls and building performance programme. Ask them to include the boiler house replacement, the solar, the battery, the grid connection and twenty years of operation in the same guarantee. That is the programme; controls are one part of it."',
      ] },
    ]),

  pageBreak(),

  // ---------------------------------------------------------------- 10 MITIE
  ...card(10, 'Mitie (Energy, Power & Grid)', 'Buying its way into our market. Watch the trajectory, not the current position.',
    [
      ['Ownership', 'Mitie Group plc (LSE: MTO).'],
      ['UK scale', 'One of the UK\'s largest FM businesses; reported record revenue up 11% at the end of FY26.'],
      ['Model', 'Facilities management with a deliberately assembled decarbonisation and power capability, built by acquisition.'],
      ['Acquisitions', 'Custom Solar (solar EPC — £15m revenue and £2m PBT in the year to March 2022, acquired for an initial £8.8m plus £4.4m deferred); Rock Power Connections (HV grid connections, electrical infrastructure, EV); G2 Energy; ESM Power; a heat pump team from RMS.'],
      ['Segments', 'Public sector, I&C, Defence (e.g. a £3.9m solar installation at Bassingbourn Barracks with the DIO).'],
      ['Wrap score', '22/30 — high on Deliver and Operate, low on Finance.'],
    ],
    [
      { title: 'What they actually deliver', para: [
        'Mitie has assembled, rather than grown, an energy capability: solar EPC, high-voltage grid connections, electrical infrastructure, EV charging and heat pumps, sitting alongside a very large FM business under the "Plan Zero" banner. The strategic logic is sound and the grid connections capability in particular (Rock Power) is genuinely valuable in the current market.',
        'What they have not assembled is a funding model. Mitie sells and delivers; it does not routinely own long-term customer energy assets or guarantee savings across a programme.',
      ] },
      { title: 'How they win', bullets: [
        'FM incumbency across an enormous UK estate portfolio — they are already inside the building.',
        'Grid connections capability, which is scarce and increasingly decisive.',
        'Integrated solar plus electrical infrastructure delivery at competitive prices.',
        'Public sector and defence framework presence.',
      ] },
      { title: 'Where they beat us', bullets: [
        'Access. FM incumbency means they hear about the requirement before it becomes a tender.',
        'Grid connections and HV electrical infrastructure self-delivery.',
        'Price on defined technology scopes.',
      ] },
      { title: 'Where we beat them', bullets: [
        'Funding. This is the decisive gap — Mitie is not a long-term asset owner.',
        'Savings guarantee and M&V.',
        'Programme scale and complexity; multi-technology integration under one accountable structure.',
        'City-scale and concession structures.',
        'Independence from an FM contract that the customer may want to re-tender.',
      ] },
      { title: 'Recent proof points to expect in their pitch', bullets: [
        'Custom Solar defence and public sector installations.',
        'Rock Power grid connection deliveries.',
        'FY26 record revenue and acquisition-led growth story.',
      ] },
      { title: 'Trigger events to watch', bullets: [
        '**Acquisition of a funding platform or launch of an EaaS vehicle — this is the single most likely move that would elevate Mitie into the top five.**',
        'Further bolt-on acquisitions in heat, BESS or O&M.',
        'Any move to bundle energy performance guarantees into FM renewals.',
      ] },
      { title: 'Counter-script', para: [
        '**The core line:** "Mitie have bought some good businesses. Ask them who owns the asset, who funds it, and who pays if the savings do not appear. Today the answer to all three is you."',
        '**On FM incumbency:** "There is a reason to think carefully about putting your energy infrastructure inside your FM contract. When you re-tender FM in four years, do you want your twenty-year energy assets in that scope?"',
      ] },
    ]),
];
