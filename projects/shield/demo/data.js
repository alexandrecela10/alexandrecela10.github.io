// Shield demo data. ALL SYNTHETIC. Fictional fund, project company, project and contractor.
// Event 1 reuses the walkthrough record (synthetic-data/01 to 05 in the source repo), renamed.
// Events 2 and 3 reuse the agent's eval dataset (evals/datasets/project_alpha.json).
// Rows marked demoAddition: true were added for this demo and exist in neither source.
window.DEMO = {
  today: "2026-08-26", // fixed "today", same as the walkthrough record

  fund: {
    name: "Infrastructure Fund I",
    asset: "Alpha ProjectCo",
    project: "Alpha Gas Processing Expansion, EPC Package 3",
    contractor: "EPC Contractor A"
  },

  // Assumptions behind the equity numbers. Synthetic, chosen for the demo, shown on the page.
  assumptions: {
    fundShare: 0.60,              // fund owns 60% of ProjectCo equity
    stakeValueUsd: 240000000,     // carrying value of the fund's stake at last quarterly valuation
    contingencyUsd: 12000000,     // unallocated owner contingency left at ProjectCo
    dailyDelayCostUsd: 180000     // cost to ProjectCo of one day of late completion (prolongation + deferred revenue)
  },

  // Who may approve. Mirrors the agent's policy: only registered approvers pass the gate.
  actors: [
    { id: "asset.manager@fund.example", label: "Asset manager, Infrastructure Fund I", approver: true },
    { id: "analyst@fund.example", label: "Analyst, Infrastructure Fund I (not on the approver list)", approver: false }
  ],

  // Source documents. Quotes in the evidence chain must appear word for word in these texts.
  docs: {
    "C-1187": { type: "Letter", date: "2026-08-12", from: "Contractor to Engineer", system: "Document system export",
      text: "Area 7 ground conditions, reservation of rights. \"We reserve our rights regarding ground conditions in Area 7 which differ from the baseline report. A detailed submission will follow.\" Register note: no particulars, no time/cost estimate, no contemporaneous records attached." },
    "DR-1042": { type: "Daily report", date: "2026-08-04", from: "Contractor", system: "Document system export",
      text: "Area 7 grid E12-E15. Piling rig PR-07 refusal at 2.1 m on pile group E13. Trial pit confirms cemented caprock, hand-held breaker ineffective. Works suspended on E13, crew redeployed to grid E16." },
    "DR-1049": { type: "Daily report", date: "2026-08-11", from: "Contractor", system: "Document system export",
      text: "Geotech confirms continuous cemented horizon 2.1-4.5 m across ~60% of the pipe rack corridor. Rotary coring proposed; method statement in preparation. Pile production this week: 14 vs planned 46." },
    "GBR-5.3.4": { type: "Ground conditions baseline report", date: "2025-01-12", from: "Owner", system: "Document system",
      text: "Baseline statement 5.3.4: \"Rippable material is anticipated to a minimum depth of 6.5 m across the Area 7 corridor. Rock excavation above 6.5 m is not baselined and piling is priced on driven piles to refusal in calcarenite.\"" },
    "A7-PIL-010": { type: "Schedule entry", date: "2026-08-20", from: "Contractor", system: "Scheduling tool export",
      text: "A7-PIL-010, Area 7 pipe rack piling grids E12-E22, start 2026-07-28, finish 2026-10-19, total float 0 days, critical Y, 13% complete." },
    "MM-088": { type: "Meeting minutes", date: "2026-08-13", from: "Weekly progress meeting", system: "Document system export",
      text: "Item 6, Area 7. Contractor PM states piling re-forecast \"at least 8-10 weeks late\" pending methodology approval. Owner action: \"assess contractual position.\" Action unassigned, not closed." },
    "GC 4.12(b)": { type: "Contract clause", date: "2026-01-15", from: "Construction contract", system: "Contract archive",
      text: "Formal notice with particulars shall be given no later than 28 days after the Contractor became aware, or should have become aware, of the conditions." },
    "AMD-2": { type: "Contract amendment", date: "2026-03-14", from: "Construction contract", system: "Contract archive",
      text: "GC 4.12(b) amended: \"28 days\" replaced with \"21 days\" for events in Areas 6-8 occurring after the Area 7 access handover date." },
    "GC 20.1": { type: "Contract clause", date: "2026-01-15", from: "Construction contract", system: "Contract archive",
      text: "Where the Owner considers itself entitled to any payment or reduction, the Owner shall give notice and particulars to the Contractor no later than 28 days after the Owner became aware of the event or circumstance." },
    "LTR-002": { type: "Letter", date: "2026-08-05", from: "Contractor to Owner", system: "Document system export",
      text: "Late delivery of long-lead compressors will cause a delay to the critical path of approximately three weeks, per the attached fragnet." },
    "CMP-010": { type: "Schedule entry", date: "2026-08-20", from: "Contractor", system: "Scheduling tool export", demoAddition: true,
      text: "CMP-010, Compressor set and tie-in, total float 0 days, critical Y." },
    "GC 8.4": { type: "Contract clause", date: "2026-01-15", from: "Construction contract", system: "Contract archive",
      text: "GC 8.4: notice of delay events within 28 days." },
    "LTR-003": { type: "Letter", date: "2026-08-10", from: "Contractor to Owner", system: "Document system export",
      text: "Please treat this letter as confirmation of the site instruction to add a third pipe rack in Area 12. We consider this a variation order under the contract." },
    "CR-041": { type: "List of changes", date: "2026-08-21", from: "Owner cost team", system: "Cost system", demoAddition: true,
      text: "CR-041, third pipe rack Area 12 (site instruction), status: not assessed, estimated cost 4,200,000 USD, estimated time 0 days." },
    "GC 13.1": { type: "Contract clause", date: "2026-01-15", from: "Construction contract", system: "Contract archive",
      text: "GC 13.1: variation notices within 14 days (as amended by Amendment 3)." }
  },

  events: [
    {
      id: "EV-1",
      title: "Area 7 ground conditions: contractor preparing a claim",
      kind: "Possible claim",
      summary: "Rock found at 2.1 m. The baseline report expected soft ground to 6.5 m. The contractor reserved its rights without details. Any piling delay moves the finish date.",
      chain: [
        { step: "Letter", ref: "C-1187", quote: "We reserve our rights regarding ground conditions in Area 7 which differ from the baseline report.", note: "Signal: the contractor is preparing a claim." },
        { step: "Letter", ref: "C-1187", quote: "no particulars, no time/cost estimate, no contemporaneous records attached", note: "GC 4.12(b) requires details (particulars). This letter has none." },
        { step: "Site record", ref: "DR-1042", quote: "refusal at 2.1 m on pile group E13", note: "Problem known from 04 Aug 2026. Both deadlines count from here." },
        { step: "Site record", ref: "GBR-5.3.4", quote: "Rippable material is anticipated to a minimum depth of 6.5 m across the Area 7 corridor.", note: "Expected vs found: 6.5 m vs 2.1 m." },
        { step: "Schedule entry", ref: "A7-PIL-010", quote: "total float 0 days, critical Y", note: "No spare days: any piling delay moves the finish date." },
        { step: "Schedule entry", ref: "MM-088", quote: "at least 8-10 weeks late", note: "Delay used for value at risk: 56 days, the low end." },
        { step: "Contract clause", ref: "GC 4.12(b)", quote: "Formal notice with particulars shall be given no later than 28 days after the Contractor became aware", note: "The contractor's notice deadline." },
        { step: "Contract clause", ref: "AMD-2", quote: "\"28 days\" replaced with \"21 days\" for events in Areas 6-8", note: "Area 7 is covered, so the deadline is 21 days." },
        { step: "Contract clause", ref: "GC 20.1", quote: "the Owner shall give notice and particulars to the Contractor no later than 28 days after the Owner became aware", note: "The project company's own notice deadline." }
      ],
      clocks: [
        { label: "Project company notice under GC 20.1", owner: "ProjectCo", primary: true,
          triggerDate: "2026-08-04", periodDays: 28 },
        { label: "Contractor notice deadline under GC 4.12(b)", owner: "Contractor",
          triggerDate: "2026-08-04", periodDays: 28, amendment: { id: "AMD-2", inArchive: true, periodDays: 21 } }
      ],
      value: { delayDays: 56, floatDays: 0, directCostUsd: 9500000,
        directNote: "Owner cost estimate for rock coring and revised piling (fictional)." },
      notice: [
        "From: Alpha ProjectCo (Owner). To: EPC Contractor A. Re: Area 7 ground conditions.",
        "1. We refer to your letter C-1187 dated 12 August 2026. [C-1187]",
        "2. GC 4.12(b), as amended by Amendment 2, requires formal notice with particulars within 21 days of awareness for events in Areas 6-8. [GC 4.12(b)] [AMD-2]",
        "3. Daily report DR-1042 records pile refusal at 2.1 m on 4 August 2026. The 21-day period ended on 25 August 2026. [DR-1042]",
        "4. Letter C-1187 contains no particulars, no estimate of time and cost effect and no contemporaneous records. [C-1187]",
        "5. The Owner gives notice under GC 20.1 of its entitlements arising from the Area 7 conditions. Particulars will follow. [GC 20.1]",
        "6. The Owner reserves all its rights under the Contract."
      ]
    },
    {
      id: "EV-2",
      title: "Compressor delivery: delay notice received",
      kind: "Possible claim",
      summary: "The contractor reports about three weeks of delay to the finish date from late compressors. The project company has not replied.",
      chain: [
        { step: "Letter", ref: "LTR-002", quote: "delay to the critical path of approximately three weeks", note: "Signal: a delay with a stated length. Event date: 05 Aug 2026." },
        { step: "Schedule entry", ref: "CMP-010", quote: "total float 0 days, critical Y", note: "Added for the demo: no spare days to absorb the delay." },
        { step: "Contract clause", ref: "GC 8.4", quote: "notice of delay events within 28 days", note: "Notice deadline for delay events." }
      ],
      clocks: [
        { label: "GC 8.4 notice deadline for the delay", owner: "ProjectCo", primary: true, triggerDate: "2026-08-05", periodDays: 28 }
      ],
      value: { delayDays: 21, floatDays: 0, directCostUsd: 0, directNote: "No direct cost claimed yet." },
      notice: [
        "From: Alpha ProjectCo (Owner). To: EPC Contractor A. Re: Compressor delivery delay.",
        "1. We refer to your letter LTR-002 dated 5 August 2026. [LTR-002]",
        "2. GC 8.4 sets a 28-day notice period for delay events. For this event it ends on 2 September 2026. [GC 8.4]",
        "3. Please provide the fragnet, the critical path analysis and the cause of late delivery before that date.",
        "4. The Owner does not accept entitlement at this stage and reserves all its rights, including under GC 20.1."
      ]
    },
    {
      id: "EV-3",
      title: "Area 12 third pipe rack: scope change deadline",
      kind: "Missed notice deadline",
      summary: "The contractor treats a site instruction as a paid scope change (variation). On the original period, the 14-day deadline has passed. Amendment 3 is missing, so the date is provisional.",
      chain: [
        { step: "Letter", ref: "LTR-003", quote: "confirmation of the site instruction to add a third pipe rack in Area 12", note: "Signal: scope change. Event date: 10 Aug 2026." },
        { step: "Schedule entry", ref: "CR-041", quote: "estimated cost 4,200,000 USD", note: "Added for the demo: entry in the list of changes, not yet assessed." },
        { step: "Contract clause", ref: "GC 13.1", quote: "variation notices within 14 days (as amended by Amendment 3)", note: "Amendment 3 is not in the archive, so the deadline is provisional." }
      ],
      clocks: [
        { label: "GC 13.1 scope change deadline", owner: "ProjectCo", primary: true, triggerDate: "2026-08-10", periodDays: 14,
          amendment: { id: "AMD-3", inArchive: false } }
      ],
      value: { delayDays: 0, floatDays: 0, directCostUsd: 4200000, directNote: "Estimate from the list of changes (added for the demo)." },
      notice: [
        "From: Alpha ProjectCo (Owner). To: EPC Contractor A. Re: Site instruction, third pipe rack, Area 12.",
        "1. We refer to your letter LTR-003 dated 10 August 2026. [LTR-003]",
        "2. The Owner does not accept at this stage that the site instruction is a variation under GC 13.1. [GC 13.1]",
        "3. Please provide particulars of the scope, cost and time you attribute to it.",
        "4. The Owner reserves all its rights under the Contract.",
        "PROVISIONAL: the GC 13.1 period depends on Amendment 3, which is missing from the archive. Confirm the period before reliance."
      ]
    }
  ],

  // Documents the agent read but did not surface, from the precomputed agent run.
  notSurfaced: [
    { ref: "MIN-004", why: "Watch item, no schedule impact yet. Correctly ignored (confidence 0.35)." },
    { ref: "RPT-005", why: "Routine slip, recovered the same day. Correctly ignored (confidence 0.55, bar 0.6)." },
    { ref: "LTR-006", why: "Real delay (foundations stalled, rights reserved). The keyword matcher missed it. Recall gap: 3 of 4 events found." },
    { ref: "LTR-OOS-1", why: "Letter from another project. Refused on arrival and logged." }
  ]
};
