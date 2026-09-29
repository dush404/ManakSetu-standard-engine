// ─────────────────────────────────────────────────────────────
// MANAKSETU — audit report builder (deterministic mock reports)
// ─────────────────────────────────────────────────────────────

import { findAudit, findStandard } from "./mock-data";
import { templateByKey } from "./graph-templates";
import type { AuditReport, Gap } from "./types";

function gapsFor(tKey: string): Gap[] {
  // "pipe" and "water" audits share the cement/water gap family
  const key = tKey === "pipe" || tKey === "water" ? "cement" : tKey;
  return templateByKey(key).gaps;
}

function steelReport(id: string): AuditReport {
  return {
    id,
    product: "Fe500D TMT Bars 500 MT — Metro Viaduct Package C-3",
    agency: "MMRDA, Mumbai",
    category: "Steel & Metallurgy",
    date: "08 Dec 2025",
    evaluator: "Compliance Cell — Graph Traverse v2.4",
    score: 91,
    risk: "Low",
    standardsAudited: 17,
    clausesReviewed: 42,
    summary:
      "Tender specification demonstrates strong alignment with IS 1786:2008. Ductility sub-grade, QCO coverage and test regimes are correctly anchored. Two documentary gaps and one workmanship reference require amendment before award.",
    sections: [
      {
        id: "specs",
        heading: "Recommended Specifications",
        body: [
          {
            text: "The following parameter set should appear in the technical schedule. Values are extracted from IS 1786:2008 (Fifth Revision, incl. Amd 4) and the design code chain.",
          },
        ],
        specRows: [
          {
            parameter: "Grade designation",
            required: "Fe500D",
            reference: "IS 1786, Table 1",
          },
          {
            parameter: "0.2% proof stress",
            required: "≥ 500 N/mm²",
            reference: "IS 1608:2008",
          },
          {
            parameter: "Tensile strength",
            required: "≥ 565 N/mm²",
            reference: "IS 1608:2008",
          },
          {
            parameter: "Elongation A5",
            required: "≥ 14.5%",
            reference: "IS 1786, Table 3",
          },
          {
            parameter: "Sulphur / Phosphorus",
            required: "≤ 0.040% each",
            reference: "IS 228:1993",
          },
          {
            parameter: "Carbon equivalent",
            required: "≤ 0.42%",
            reference: "Amd 4, Nov 2023",
          },
          {
            parameter: "Bend / re-bend",
            required: "Mandrel 3d / 7d",
            reference: "IS 1599:1985",
          },
          {
            parameter: "Mass tolerance",
            required: "± 4.5% (≤ 10 mm)",
            reference: "IS 1786, Cl. 6.4",
          },
        ],
      },
      {
        id: "refs",
        heading: "Normative References",
        body: [
          {
            text: "These standards form the compliance chain and must be cited verbatim in the tender schedule.",
          },
        ],
        chips: [
          { label: "IS 456:2000", kind: "code" },
          { label: "IS 1608:2008", kind: "test" },
          { label: "IS 1599:1985", kind: "test" },
          { label: "IS 228:1993", kind: "test" },
          { label: "IS 2502:1963", kind: "code" },
          { label: "IS 13920:2016", kind: "code" },
          { label: "IS 1893-1:2016", kind: "code" },
          { label: "IS 2751:1989", kind: "code" },
          { label: "IS 9595:1996", kind: "code" },
          { label: "IS 432-1:1996", kind: "standard" },
        ],
      },
      {
        id: "cert",
        heading: "Certification Requirements",
        body: [
          {
            text: "Conformity obligations flow from the Steel & Steel Products (Quality Control) Order, 2024. The following conditions apply to award and dispatch.",
          },
        ],
        requirements: [
          {
            label: "BIS licence (ISI mark)",
            detail:
              "Manufacturer shall hold a valid licence covering Fe500D on Schedule II; licence number quoted in offer.",
            mandatory: true,
          },
          {
            label: "Marking",
            detail:
              "ISI mark with grade embossed at least once every metre along the bar length.",
            mandatory: true,
          },
          {
            label: "Manufacturer's test certificate",
            detail:
              "Lot-wise MTC covering chemical (ladle) and mechanical results, NABL-accredited lab for recheck.",
            mandatory: true,
          },
          {
            label: "Third-party inspection",
            detail:
              "Pre-dispatch inspection by RITES/TPI agency of purchaser's choice at 1 lot per 50 MT.",
            mandatory: false,
          },
        ],
      },
      {
        id: "gaps",
        heading: "Identified Gaps",
        body: [
          {
            text: "Clauses below were absent or under-specified in the input tender documents. Suggested language is drafted for direct insertion.",
          },
        ],
        gaps: gapsFor("steel"),
      },
    ],
    tenderClauses: `3.1  MATERIAL — Reinforcement shall be high tensile deformed steel bars conforming to IS 1786:2008 (Fifth Revision, incl. Amd 4) grade Fe500D.
3.2  CHEMISTRY — Sulphur ≤ 0.040%, Phosphorus ≤ 0.040%, S+P ≤ 0.075%, Carbon Equivalent ≤ 0.42% (ladle analysis, IS 228).
3.3  MECHANICAL — 0.2% proof stress ≥ 500 N/mm², tensile ≥ 565 N/mm², elongation ≥ 14.5% (tests per IS 1608, bend/re-bend per IS 1599).
3.4  CERTIFICATION — Manufacturer shall hold valid BIS licence under Steel & Steel Products (QCO) 2024; ISI marking legible on every metre.
3.5  FABRICATION — Cutting and bending per IS 2502:1963; welding splices per IS 2751:1989 with qualified welders.
3.6  QUALITY ASSURANCE — Lot-wise NABL-accredited test certificates, one lot per 50 MT, submitted before dispatch.`,
  };
}

function cementReport(id: string): AuditReport {
  return {
    id,
    product: "43 Grade OPC Cement 8,400 MT",
    agency: "PWD Rajasthan",
    category: "Cement & Concrete",
    date: "04 Dec 2025",
    evaluator: "Compliance Cell — Graph Traverse v2.4",
    score: 74,
    risk: "Medium",
    standardsAudited: 12,
    clausesReviewed: 31,
    summary:
      "Base standard reference is correct, however the schedule omits acceptance testing, freshness windows and durability cross-references. Medium residual risk stems from missing lot-wise strength acceptance criteria.",
    sections: [
      {
        id: "specs",
        heading: "Recommended Specifications",
        body: [
          {
            text: "Parameter set derived from IS 8112:2013 (Third Revision, incl. Amd 4) with durability overlay from IS 456:2000.",
          },
        ],
        specRows: [
          {
            parameter: "Grade designation",
            required: "OPC 43",
            reference: "IS 8112, Cl. 4",
          },
          {
            parameter: "28-day mortar strength",
            required: "≥ 43 MPa",
            reference: "IS 4031-6:1988",
          },
          {
            parameter: "Blaine fineness",
            required: "≥ 225 m²/kg",
            reference: "IS 4031-2:1988",
          },
          {
            parameter: "Initial setting time",
            required: "≥ 30 min",
            reference: "IS 4031-5:1988",
          },
          {
            parameter: "Soundness (Le Chatelier)",
            required: "≤ 10 mm",
            reference: "IS 4031-3:1988",
          },
          {
            parameter: "Loss on ignition",
            required: "≤ 4.5%",
            reference: "Amd 4, Aug 2021",
          },
          {
            parameter: "Chloride ion",
            required: "≤ 0.1%",
            reference: "Amd 3, Mar 2018",
          },
          {
            parameter: "Freshness",
            required: "≤ 90 days from grinding",
            reference: "Recommended",
          },
        ],
      },
      {
        id: "refs",
        heading: "Normative References",
        body: [
          {
            text: "Chain of standards to be cited alongside the primary specification.",
          },
        ],
        chips: [
          { label: "IS 4031-1:1996", kind: "test" },
          { label: "IS 4031-6:1988", kind: "test" },
          { label: "IS 4032:1985", kind: "test" },
          { label: "IS 456:2000", kind: "code" },
          { label: "IS 10262:2019", kind: "code" },
          { label: "IS 516-1:2018", kind: "test" },
          { label: "IS 383:2016", kind: "standard" },
        ],
      },
      {
        id: "cert",
        heading: "Certification Requirements",
        body: [
          {
            text: "Cement (Quality Control) Order, 2023 obligations apply to all grades in Schedule I.",
          },
        ],
        requirements: [
          {
            label: "BIS licence (ISI mark)",
            detail:
              "Valid licence under Cement QCO 2023 with IS 8112 scope; licence number printed on every bag.",
            mandatory: true,
          },
          {
            label: "Bag marking",
            detail:
              "50 kg bags marked with grade, batch, date of grinding and licence number.",
            mandatory: true,
          },
          {
            label: "Manufacturer's test certificate",
            detail:
              "Weekly composite MTC with IS 4032 chemical traceability attached to each consignment.",
            mandatory: true,
          },
          {
            label: "Third-party sampling",
            detail:
              "Random sampling by purchaser at 1 sample per 1,000 bags for independent verification.",
            mandatory: false,
          },
        ],
      },
      {
        id: "gaps",
        heading: "Identified Gaps",
        body: [
          {
            text: "Under-specified clauses detected against the standard chain. Insert suggested language to close the audit.",
          },
        ],
        gaps: gapsFor("cement"),
      },
    ],
    tenderClauses: `4.1  MATERIAL — Cement shall be Ordinary Portland Cement 43 grade conforming to IS 8112:2013 (incl. Amd 4).
4.2  PHYSICAL — Blaine fineness ≥ 225 m²/kg; initial setting ≥ 30 min; soundness ≤ 10 mm (IS 4031).
4.3  CHEMICAL — LOI ≤ 4.5%, insoluble residue ≤ 4.0%, SO₃ ≤ 3.5%, MgO ≤ 6.0% (IS 4032).
4.4  CERTIFICATION — Valid BIS licence under Cement (QCO) 2023; ISI marking on every bag.
4.5  FRESHNESS — Dispatch within 90 days of grinding; retest stock older than 90 days.
4.6  DURABILITY — Structural concrete M30 with w/c ≤ 0.45 and 50 mm cover for severe exposure (IS 456 Table 5).`,
  };
}

function cableReport(id: string): AuditReport {
  return {
    id,
    product: "PVC Insulated Cables 1.1 kV, Al Conductor",
    agency: "NDMC, New Delhi",
    category: "Electrical",
    date: "27 Nov 2025",
    evaluator: "Compliance Cell — Graph Traverse v2.4",
    score: 58,
    risk: "High",
    standardsAudited: 9,
    clausesReviewed: 24,
    summary:
      "Significant compliance exposure. Routine per-drum testing, insulation resistance at operating temperature and installation radius clauses are all absent. Single-core armour selection is incorrectly specified. Award without amendment carries rejection risk at consignment stage.",
    sections: [
      {
        id: "specs",
        heading: "Recommended Specifications",
        body: [
          {
            text: "Parameter set derived from IS 1554-1:1988 (Second Revision, incl. Amd 2) with test regime per IS 10810 series.",
          },
        ],
        specRows: [
          {
            parameter: "Rated voltage",
            required: "1,100 V",
            reference: "IS 1554-1, Cl. 3",
          },
          {
            parameter: "Conductor class",
            required: "Al, H2/H4",
            reference: "IS 8130:1984",
          },
          {
            parameter: "Insulation",
            required: "PVC Type A / FRLS",
            reference: "IS 5831:1984",
          },
          {
            parameter: "HV withstand",
            required: "3 kV / 4 min",
            reference: "IS 10810-12",
          },
          {
            parameter: "IR at 70°C",
            required: "≥ 0.0037 MΩ·km",
            reference: "IS 10810-13",
          },
          {
            parameter: "Oxygen index (FRLS)",
            required: "≥ 29%",
            reference: "Amd 2, Jan 2010",
          },
          {
            parameter: "Bending radius",
            required: "≥ 12 × D",
            reference: "IS 1255:1983",
          },
          {
            parameter: "Armour",
            required: "GI wire / Al for 1-core",
            reference: "IS 1554-1, Cl. 4",
          },
        ],
      },
      {
        id: "refs",
        heading: "Normative References",
        body: [
          {
            text: "Companion standards covering compounds, installation and accessories.",
          },
        ],
        chips: [
          { label: "IS 10810-1:1984", kind: "test" },
          { label: "IS 5831:1984", kind: "test" },
          { label: "IS 8130:1984", kind: "standard" },
          { label: "IS 732:2018", kind: "code" },
          { label: "IS 1255:1983", kind: "code" },
          { label: "IS 694:2010", kind: "standard" },
          { label: "IS 8828:2015", kind: "standard" },
        ],
      },
      {
        id: "cert",
        heading: "Certification Requirements",
        body: [
          {
            text: "Electric Cables (Quality Control) Order, 2024 requires licensed manufacture for all covered LT cables.",
          },
        ],
        requirements: [
          {
            label: "BIS licence (ISI mark)",
            detail:
              "Valid licence under Cable QCO 2024 for 1.1 kV grade; ISI mark stencilled on drum.",
            mandatory: true,
          },
          {
            label: "Drum marking",
            detail:
              "IS number, licence number, voltage grade, length, batch and date of manufacture on every drum.",
            mandatory: true,
          },
          {
            label: "Routine test certificates",
            detail:
              "Per-drum HV and IR test results attached; not substitutable by type tests.",
            mandatory: true,
          },
          {
            label: "Sample dissection",
            detail:
              "Purchaser may dissect 1 drum per consignment for dimensional verification.",
            mandatory: false,
          },
        ],
      },
      {
        id: "gaps",
        heading: "Identified Gaps",
        body: [
          {
            text: "Critical gaps below carry consignment rejection risk. Suggested language drafted for direct insertion.",
          },
        ],
        gaps: gapsFor("cables"),
      },
    ],
    tenderClauses: `5.1  MATERIAL — Cables shall be PVC insulated heavy duty type conforming to IS 1554-1:1988 (incl. Amd 2), 1,100 V grade.
5.2  CONSTRUCTION — Aluminium conductor H2/H4 per IS 8130; insulation PVC Type A per IS 5831; GI round wire armour (non-magnetic for single-core).
5.3  ROUTINE TESTS — Every drum: HV withstand 3 kV/4 min; insulation resistance ≥ 7 MΩ·km verified at 70°C (IS 10810 series).
5.4  CERTIFICATION — Valid BIS licence under Electric Cables (QCO) 2024; ISI mark on every drum.
5.5  INSTALLATION — Laying per IS 1255:1983; bending radius ≥ 12 × D.
5.6  MARKING — Drum stencil: IS 1554-1, licence no., voltage grade, batch, manufacture date.`,
  };
}

function pipeReport(id: string): AuditReport {
  const base = cementReport(id);
  return {
    ...base,
    product: "RCC Hume Pipes DN 600 — Sewerage Phase II",
    agency: "UP Jal Nigam",
    category: "Water & Sanitation",
    date: "09 Nov 2025",
    score: 61,
    risk: "High",
    standardsAudited: 11,
    clausesReviewed: 28,
    summary:
      "Pipe class designation and hydrostatic test regime are under-specified. Absence of load-bearing proof test acceptance and bedding details creates field-rejection exposure for the sewerage package.",
    sections: base.sections.map((s) =>
      s.id === "gaps" ? { ...s, gaps: gapsFor("pipe") } : s,
    ),
  };
}

function waterReport(id: string): AuditReport {
  const base = steelReport(id);
  return {
    ...base,
    product: "Packaged Drinking Water 20 L Jars — Plant Setup",
    agency: "CWC, Bengaluru",
    category: "Food & Agriculture",
    date: "15 Nov 2025",
    score: 93,
    risk: "Low",
    standardsAudited: 8,
    clausesReviewed: 36,
    summary:
      "Strong alignment. IS 14543:2004 anchoring, FSSAI cross-licensing and source-water testing are correctly framed. Minor documentation clause only.",
    sections: base.sections.map((s) =>
      s.id === "gaps" ? { ...s, gaps: gapsFor("water").slice(0, 2) } : s,
    ),
  };
}

function structuralSteelReport(id: string): AuditReport {
  const base = steelReport(id);
  return {
    ...base,
    product: "Structural Steel Sections E250 — Foot Over Bridge",
    agency: "MES, Pune",
    category: "Steel & Metallurgy",
    date: "21 Nov 2025",
    score: 79,
    risk: "Medium",
    standardsAudited: 14,
    clausesReviewed: 39,
    summary:
      "IS 2062:2011 reference is correct; design chain to IS 800:2007 is present. Welding consumable traceability and fracture-toughness test clauses need strengthening for bridge girder work.",
    sections: base.sections.map((s) =>
      s.id === "gaps" ? { ...s, gaps: gapsFor("steel").slice(2, 6) } : s,
    ),
  };
}

export function buildReport(id: string): AuditReport | null {
  if (!findAudit(id)) return null;
  switch (id) {
    case "TND-2025-0907":
      return steelReport(id);
    case "TND-2025-0892":
      return cementReport(id);
    case "TND-2025-0877":
      return cableReport(id);
    case "TND-2025-0861":
      return structuralSteelReport(id);
    case "TND-2025-0849":
      return waterReport(id);
    case "TND-2025-0831":
      return pipeReport(id);
    default: {
      const audit = findAudit(id)!;
      const base = steelReport(id);
      return {
        ...base,
        product: audit.product,
        agency: audit.agency,
        date: audit.date,
        score: audit.score,
        risk: audit.risk,
        standardsAudited: audit.standardsCount,
      };
    }
  }
}

export { findStandard };
