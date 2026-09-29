// ─────────────────────────────────────────────────────────────
// BIS-Graph — allied standards graph templates & gap analysis
// ─────────────────────────────────────────────────────────────

import type { Gap, GraphData, PrimaryMatch } from "./types";

interface Template {
  key: string;
  keywords: RegExp;
  primary: PrimaryMatch;
  graph: GraphData;
  gaps: Gap[];
  tenderClauses: string;
}

const steel: Template = {
  key: "steel",
  keywords: /tmt|rebar|reinforc|fe500|fe415|steel bar|deformed bar|viaduct|concrete reinforcement/i,
  primary: {
    isNumber: "IS 1786:2008",
    title: "High Tensile Deformed Steel Bars and Wires for Concrete Reinforcement — Specification",
    version: "Fifth Revision",
    amendment: "Amd 4 · Nov 2023",
    certStatus: "Mandatory",
    qcoRef: "Steel & Steel Products (Quality Control) Order, 2024 — Schedule II",
    confidence: 94,
    matchReason: "Tender describes structural rebar supply for a coastal viaduct; Fe500D grade with enhanced ductility and sulphur/phosphorus control maps to IS 1786 Table 3.",
    matchReasonHi: "टेंडर में तटीय वायडक्ट के लिए संरचनात्मक रीबार की आपूर्ति वर्णित है; Fe500D ग्रेड IS 1786 तालिका 3 के अनुरूप है।",
    spec: [
      { label: "Grade", value: "Fe500D" },
      { label: "0.2% Proof Stress", value: "≥ 500 N/mm²" },
      { label: "Tensile Strength", value: "≥ 565 N/mm²" },
      { label: "Elongation (A5)", value: "≥ 14.5%" },
      { label: "Sulphur (max)", value: "0.040%" },
      { label: "Phosphorus (max)", value: "0.040%" },
      { label: "S + P (max)", value: "0.075%" },
      { label: "Carbon Equivalent", value: "≤ 0.42%" },
    ],
  },
  graph: {
    nodes: [
      { id: "s-primary", isNumber: "IS 1786:2008", shortLabel: "TMT Bars Fe500D", title: "High Tensile Deformed Steel Bars — Specification", group: "primary", version: "Fifth Revision", certStatus: "Mandatory", role: "Primary governing standard for the product under tender.", scope: "Fe415–Fe600 deformed bars 4–50 mm for RC construction; mechanical, chemical and bond requirements.", parameters: [{ label: "Yield (Fe500D)", value: "≥ 500 MPa" }, { label: "Elongation", value: "≥ 14.5%" }] },
      { id: "s-test-1", isNumber: "IS 1608:2008", shortLabel: "Tensile Testing", title: "Metallic Materials — Tensile Testing at Ambient Temperature", group: "test", version: "Second Revision", certStatus: "Voluntary", role: "Test method — proof stress & elongation verification.", scope: "Method of tensile testing including determination of 0.2% proof stress, UTS and elongation on rebar specimens.", parameters: [{ label: "Test", value: "0.2% proof stress" }, { label: "Rate", value: "per Annex B" }] },
      { id: "s-test-2", isNumber: "IS 1599:1985", shortLabel: "Bend / Re-bend", title: "Method for Bend Test for Steel Products", group: "test", version: "First Revision", certStatus: "Voluntary", role: "Test method — ductility and bendability verification.", scope: "Bend and re-bend test procedure with mandrel diameters per IS 1786 Table 2.", parameters: [{ label: "Mandrel (≤16 mm)", value: "3d" }, { label: "Re-bend angle", value: "≥ 20°" }] },
      { id: "s-test-3", isNumber: "IS 228:1993", shortLabel: "Chemical Analysis", title: "Methods for Chemical Analysis of Steel", group: "test", version: "Third Revision", certStatus: "Voluntary", role: "Test method — C, S, P and alloying element verification.", scope: "Wet chemical and spectrometric analysis of carbon, sulphur, phosphorus and micro-alloying elements.", parameters: [{ label: "S (Fe500D)", value: "≤ 0.040%" }, { label: "P (Fe500D)", value: "≤ 0.040%" }] },
      { id: "s-rel-1", isNumber: "IS 456:2000", shortLabel: "RC Code", title: "Plain and Reinforced Concrete — Code of Practice", group: "related", version: "Fourth Revision", certStatus: "Voluntary", role: "Design code — consumption context for the rebar.", scope: "Structural design, detailing, cover and durability requirements for RC members.", parameters: [{ label: "Min cover (coastal)", value: "50 mm" }, { label: "M20 min grade", value: "Cl. 6.1.2" }] },
      { id: "s-rel-2", isNumber: "IS 13920:2016", shortLabel: "Ductile Detailing", title: "Ductile Detailing of RC Structures — Code of Practice", group: "related", version: "Fifth Revision", certStatus: "Voluntary", role: "Seismic detailing — governs lap splices and confinement.", scope: "Special confining reinforcement and seismic hook requirements for zones III–V.", parameters: [{ label: "Splice", value: "Cl. 7.2.4" }, { label: "Confinement", value: "Cl. 8.1" }] },
      { id: "s-rel-3", isNumber: "IS 1893-1:2016", shortLabel: "Seismic Criteria", title: "Earthquake Resistant Design — General Provisions", group: "related", version: "Sixth Revision", certStatus: "Voluntary", role: "Seismic load context driving grade selection.", scope: "Zone factors, response reduction and ductility classification for structures.", parameters: [{ label: "Zone (coastal metro)", value: "III" }] },
      { id: "s-rel-4", isNumber: "IS 2502:1963", shortLabel: "Bending & Fixing", title: "Bending and Fixing of Bars for Concrete Reinforcement", group: "related", version: "First Revision", certStatus: "Voluntary", role: "Workmanship — bar bending schedule and mandrels.", scope: "Standard bends, hooks, mandrel diameters and fixing tolerances.", parameters: [{ label: "Mandrel", value: "≥ 4d" }] },
      { id: "s-rel-5", isNumber: "IS 2751:1989", shortLabel: "Rebar Welding", title: "Welding of Mild Steel Bars for RC Construction", group: "related", version: "Second Revision", certStatus: "Voluntary", role: "Process standard — splice welding of reinforcement.", scope: "Weldability classes, joint types and qualified welder requirements.", parameters: [{ label: "Class", value: "II weldable" }] },
      { id: "s-rel-6", isNumber: "IS 9595:1996", shortLabel: "MA Welding", title: "Metal Arc Welding of Carbon Steels — Recommendations", group: "related", version: "Second Revision", certStatus: "Voluntary", role: "Process standard — electrode selection & preheat.", scope: "SMAW recommendations incl. electrode classification per IS 814-1.", parameters: [{ label: "Electrode", value: "IS 814-1" }] },
      { id: "s-rel-7", isNumber: "IS 432-1:1996", shortLabel: "MS Wire", title: "Mild Steel Wire, Annealed — Specification", group: "related", version: "Fourth Revision", certStatus: "Mandatory", role: "Companion supply item — binding wire.", scope: "Annealed MS wire 0.6–8.0 mm for binding rebar cages.", parameters: [{ label: "Binding dia.", value: "0.9–1.6 mm" }] },
      { id: "s-rel-8", isNumber: "IS 1566:1982", shortLabel: "Welded Fabric", title: "Hard Drawn Steel Wire Fabric for Concrete Reinforcement", group: "related", version: "Third Revision", certStatus: "Voluntary", role: "Alternative reinforcement form — welded mesh.", scope: "Square/rectangular welded mesh for slabs, pavements and shotcrete.", parameters: [{ label: "Mesh", value: "100–300 mm" }] },
      { id: "s-rel-9", isNumber: "IS 2062:2011", shortLabel: "Structural Steel", title: "Hot Rolled Medium and High Tensile Structural Steel", group: "related", version: "Eleventh Revision", certStatus: "Mandatory", role: "Grade alignment — steel chemistry baseline.", scope: "E250–E450 structural steel chemistry and mechanical properties.", parameters: [{ label: "Grade", value: "E350 BR" }] },
      { id: "s-amd-1", isNumber: "Amd 4 · 2023", shortLabel: "Amd 4 — S&P limits", title: "Amendment 4 — Sulphur & Phosphorus ceiling 0.040%", group: "amendment", version: "Nov 2023", certStatus: "Voluntary", role: "Latest amendment to the primary standard.", scope: "Aligns S and P individual ceilings at 0.040% for D and S ductility classes; CEq introduced.", parameters: [{ label: "Effective", value: "Nov 2023" }] },
      { id: "s-amd-2", isNumber: "Amd 3 · 2015", shortLabel: "Amd 3 — bond test", title: "Amendment 3 — Bond & rib geometry clarifications", group: "amendment", version: "Feb 2015", certStatus: "Voluntary", role: "Earlier amendment to the primary standard.", scope: "Clarifies transverse rib spacing and relative rib area measurement.", parameters: [{ label: "RRA", value: "≥ 0.056" }] },
      { id: "s-qco", isNumber: "QCO 2024", shortLabel: "Steel QCO", title: "Steel & Steel Products (Quality Control) Order, 2024", group: "related", version: "Schedule II", certStatus: "Mandatory", role: "Regulatory instrument — mandatory BIS certification.", scope: "Conformity assessment requirement; non-licensed supply is prohibited for covered steel products.", parameters: [{ label: "Status", value: "In force" }] },
    ],
    edges: [
      { source: "s-primary", target: "s-test-1", type: "test" },
      { source: "s-primary", target: "s-test-2", type: "test" },
      { source: "s-primary", target: "s-test-3", type: "test" },
      { source: "s-primary", target: "s-rel-1", type: "related" },
      { source: "s-primary", target: "s-rel-2", type: "related" },
      { source: "s-primary", target: "s-rel-3", type: "related" },
      { source: "s-primary", target: "s-rel-4", type: "related" },
      { source: "s-primary", target: "s-rel-5", type: "related" },
      { source: "s-primary", target: "s-rel-9", type: "related" },
      { source: "s-primary", target: "s-amd-1", type: "amendment" },
      { source: "s-primary", target: "s-amd-2", type: "amendment" },
      { source: "s-qco", target: "s-primary", type: "normative" },
      { source: "s-rel-1", target: "s-rel-2", type: "related" },
      { source: "s-rel-1", target: "s-rel-3", type: "related" },
      { source: "s-rel-2", target: "s-test-2", type: "test" },
      { source: "s-rel-5", target: "s-rel-6", type: "related" },
      { source: "s-rel-4", target: "s-rel-1", type: "related" },
      { source: "s-rel-7", target: "s-rel-8", type: "related" },
      { source: "s-rel-8", target: "s-rel-1", type: "related" },
      { source: "s-amd-1", target: "s-test-3", type: "test" },
    ],
  },
  gaps: [
    { id: "g-1", severity: "critical", clause: "Cl. 6.1 — IS 1786, Table 3", title: "Fe500 grade specified without D-ductility suffix for coastal exposure", titleHi: "तटीय वातावरण के लिए Fe500D प्रत्यय अनिर्दिष्ट", detail: "Input specification mentions Fe500 but coastal metro viaduct requires controlled sulphur/phosphorus (≤0.040% each) available only in D sub-grade.", detailHi: "इनपुट में Fe500 उल्लिखित है, परंतु तटीय वायडक्ट हेतु S/P ≤0.040% वाला D सब-ग्रेड आवश्यक है।", suggestion: "Amend supply clause to “Fe500D TMT bars conforming to IS 1786:2008 (Amd 4)” with S, P ≤ 0.040% and CEq ≤ 0.42%.", suggestionHi: "आपूर्ति खंड को “Fe500D, IS 1786:2008 (Amd 4)” में संशोधित करें।", standardRef: "IS 1786:2008" },
    { id: "g-2", severity: "critical", clause: "Cl. 12.4 — IS 456", title: "Bar bending schedule and mandrel reference missing", titleHi: "बार बेंडिंग शेड्यूल संदर्भ अनुपस्थित", detail: "No reference to bending mandrel diameters or BBS preparation; risk of field cracking at bend locations.", detailHi: "बेंडिंग मैंड्रिल व्यास या BBS तैयारी का संदर्भ नहीं; बेंड पर दरार का जोखिम।", suggestion: "Add: “Fabrication shall follow IS 2502:1963 with mandrel ≥ 4d; BBS approved by Engineer-in-Charge.”", suggestionHi: "जोड़ें: “IS 2502:1963 अनुसार फैब्रिकेशन, मैंड्रिल ≥ 4d।”", standardRef: "IS 2502:1963" },
    { id: "g-3", severity: "critical", clause: "Cl. 15 — IS 1786", title: "Bend / re-bend test certificate frequency not defined", titleHi: "बेंड/री-बेंड परीक्षण प्रमाणपत्र आवृत्ति अनिर्दिष्ट", detail: "Compliance matrix lacks lot-wise mechanical test acceptance; manufacturer certificates without lab verification proposed.", detailHi: "लॉट-वार यांत्रिक परीक्षण स्वीकृति अनुपस्थित; केवल निर्माता प्रमाणपत्र प्रस्तावित।", suggestion: "Require lot-wise tensile (IS 1608) and bend/re-bend (IS 1599) tests in NABL lab, 1 lot per 50 MT.", suggestionHi: "NABL प्रयोगशाला में IS 1608 व IS 1599 परीक्षण, प्रति 50 MT।", standardRef: "IS 1608:2008" },
    { id: "g-4", severity: "recommended", clause: "Cl. 7.2.4 — IS 13920", title: "Lap splice welding provisions not addressed", titleHi: "लैप स्प्लाइस वेल्डिंग उपबंध अनुपस्थित", detail: "Tender is silent on splice welding; for seismic zone III, welded laps require qualified welders per IS 2751.", detailHi: "सीमित वेल्डेड लैप — भूकंपीय क्षेत्र III हेतु IS 2751 अनुसार योग्य वेल्डर आवश्यक।", suggestion: "Add welding annexure: “Splice welding per IS 2751 with welders qualified per IS 9595.”", suggestionHi: "जोड़ें: “IS 2751 अनुसार स्प्लाइस वेल्डिंग।”", standardRef: "IS 2751:1989" },
    { id: "g-5", severity: "recommended", clause: "Cl. 16 — IS 1786", title: "Corrosion protection for coastal exposure not specified", titleHi: "तटीय संक्षारण सुरक्षा अनिर्दिष्ट", detail: "Chloride-rich coastal atmosphere warrants protective coating or increased cover; epoxy-coated bars option absent.", detailHi: "क्लोराइड-समृद्ध वातावरण हेतु सुरक्षात्मक कोटिंग/अधिक कवर आवश्यक।", suggestion: "Consider epoxy-coated bars per IS 13620:1993 or specify 50 mm cover with impermeable membrane.", suggestionHi: "IS 13620:1993 इपॉक्सी-कोटेड बार या 50 mm कवर विचार करें।", standardRef: "IS 13620:1993" },
    { id: "g-6", severity: "recommended", clause: "Cl. 21 — IS 1786", title: "Binding wire grade not referenced", titleHi: "बाइंडिंग वायर ग्रेड अनुपस्थित", detail: "Tender omits binding wire specification; annealed MS wire per IS 432-1 ensures cage stability during pours.", detailHi: "बाइंडिंग वायर विनिर्देश अनुपस्थित; IS 432-1 अनुसार अनील्ड MS वायर आवश्यक।", suggestion: "Add: “Binding wire shall conform to IS 432-1:1996, 0.9–1.6 mm annealed.”", suggestionHi: "जोड़ें: “बाइंडिंग वायर IS 432-1:1996 अनुसार।”", standardRef: "IS 432-1:1996" },
  ],
  tenderClauses: `3.1  MATERIAL — Reinforcement shall be high tensile deformed steel bars conforming to IS 1786:2008 (Fifth Revision, incl. Amd 4) grade Fe500D.
3.2  CHEMISTRY — Sulphur ≤ 0.040%, Phosphorus ≤ 0.040%, S+P ≤ 0.075%, Carbon Equivalent ≤ 0.42% (ladle analysis, IS 228).
3.3  MECHANICAL — 0.2% proof stress ≥ 500 N/mm², tensile ≥ 565 N/mm², elongation ≥ 14.5% (tests per IS 1608, bend/re-bend per IS 1599).
3.4  CERTIFICATION — Manufacturer shall hold valid BIS licence under Steel & Steel Products (QCO) 2024; ISI marking legible on every metre.
3.5  FABRICATION — Cutting and bending per IS 2502:1963; welding splices per IS 2751:1989 with qualified welders.
3.6  QUALITY ASSURANCE — Lot-wise NABL-accredited test certificates, one lot per 50 MT, submitted before dispatch.`,
};

const cement: Template = {
  key: "cement",
  keywords: /cement|opc|ppc|concrete|mortar|pozzolan| slag/i,
  primary: {
    isNumber: "IS 8112:2013",
    title: "Ordinary Portland Cement, 43 Grade — Specification",
    version: "Third Revision",
    amendment: "Amd 4 · Aug 2021",
    certStatus: "Mandatory",
    qcoRef: "Cement (Quality Control) Order, 2023 — Schedule I",
    confidence: 92,
    matchReason: "General structural concrete procurement for works indicates 43 grade OPC; compressive strength class 43 MPa with LOI ≤ 4.5% per Amd 4.",
    matchReasonHi: "सामान्य संरचनात्मक कंक्रीट क्रय हेतु 43 ग्रेड OPC उपयुक्त है; 28-दिवसीय सामर्थ्य 43 MPa।",
    spec: [
      { label: "Strength (28 d)", value: "43 MPa min" },
      { label: "Strength (7 d)", value: "33 MPa min" },
      { label: "Soundness (Le Chatelier)", value: "≤ 10 mm" },
      { label: "Setting — initial", value: "≥ 30 min" },
      { label: "LOI (Amd 4)", value: "≤ 4.5%" },
      { label: "Insoluble residue", value: "≤ 4.0%" },
      { label: "SO₃", value: "≤ 3.5%" },
      { label: "Fineness (Blaine)", value: "≥ 225 m²/kg" },
    ],
  },
  graph: {
    nodes: [
      { id: "c-primary", isNumber: "IS 8112:2013", shortLabel: "OPC 43 Grade", title: "Ordinary Portland Cement, 43 Grade — Specification", group: "primary", version: "Third Revision", certStatus: "Mandatory", role: "Primary governing standard for the product under tender.", scope: "43 grade OPC for general concrete construction; physical and chemical requirements.", parameters: [{ label: "28 d strength", value: "≥ 43 MPa" }, { label: "LOI", value: "≤ 4.5%" }] },
      { id: "c-test-1", isNumber: "IS 4031-1:1996", shortLabel: "Physical Tests", title: "Methods of Physical Tests for Hydraulic Cement, Part 1: Fineness", group: "test", version: "Fifth Revision", certStatus: "Voluntary", role: "Test method — fineness, setting time, soundness.", scope: "Determines Blaine fineness, standard consistency, setting times and soundness of hydraulic cements.", parameters: [{ label: "Blaine", value: "≥ 225 m²/kg" }] },
      { id: "c-test-2", isNumber: "IS 4032:1985", shortLabel: "Chemical Analysis", title: "Chemical Analysis of Hydraulic Cement", group: "test", version: "First Revision", certStatus: "Voluntary", role: "Test method — oxide composition verification.", scope: "Determines LOI, insoluble residue, SO₃, MgO and alkali content.", parameters: [{ label: "MgO", value: "≤ 6.0%" }] },
      { id: "c-test-3", isNumber: "IS 1727:1967", shortLabel: "Pozzolana Tests", title: "Methods of Test for Pozzolanic Materials", group: "test", version: "First Revision", certStatus: "Voluntary", role: "Test method — reactivity of blended constituents.", scope: "Strength activity index and lime reactivity for fly ash / pozzolana blends.", parameters: [{ label: "SAI (7 d)", value: "≥ 75%" }] },
      { id: "c-rel-1", isNumber: "IS 456:2000", shortLabel: "RC Code", title: "Plain and Reinforced Concrete — Code of Practice", group: "related", version: "Fourth Revision", certStatus: "Voluntary", role: "Design code — cement consumption context.", scope: "Durability, cover and min grade requirements by exposure condition.", parameters: [{ label: "Min grade", value: "M20" }] },
      { id: "c-rel-2", isNumber: "IS 10262:2019", shortLabel: "Mix Design", title: "Concrete Mix Proportioning — Guidelines", group: "related", version: "Second Revision", certStatus: "Voluntary", role: "Guidelines — water-cement ratio derivation.", scope: "Design mix methodology incl. target strength and admixture corrections.", parameters: [{ label: "w/c (coastal)", value: "≤ 0.45" }] },
      { id: "c-rel-3", isNumber: "IS 516-1:2018", shortLabel: "Strength Tests", title: "Hardened Concrete — Methods of Test, Part 1: Strength", group: "related", version: "Third Revision", certStatus: "Voluntary", role: "Acceptance testing of concrete cubes.", scope: "Compressive and flexural strength determination on 150 mm cubes.", parameters: [{ label: "Cube", value: "150 mm" }] },
      { id: "c-rel-4", isNumber: "IS 383:2016", shortLabel: "Aggregates", title: "Coarse and Fine Aggregate for Concrete — Specification", group: "related", version: "Third Revision", certStatus: "Mandatory", role: "Companion material — aggregate grading.", scope: "Zones of fine aggregate and grading limits of coarse aggregate.", parameters: [{ label: "Zone II", value: "FM 2.2–3.2" }] },
      { id: "c-rel-5", isNumber: "IS 269:2015", shortLabel: "OPC 33", title: "Ordinary Portland Cement, 33 Grade — Specification", group: "related", version: "Sixth Revision", certStatus: "Mandatory", role: "Lower grade alternative for masonry works.", scope: "33 grade OPC for plaster and non-structural concrete.", parameters: [{ label: "28 d strength", value: "≥ 33 MPa" }] },
      { id: "c-rel-6", isNumber: "IS 1489-1:2015", shortLabel: "PPC Fly Ash", title: "Portland Pozzolana Cement, Part 1: Fly Ash Based", group: "related", version: "Fourth Revision", certStatus: "Mandatory", role: "Durability alternative for mass concrete.", scope: "PPC with 15–35% fly ash for reduced heat of hydration.", parameters: [{ label: "Fly ash", value: "15–35%" }] },
      { id: "c-rel-7", isNumber: "IS 455:2015", shortLabel: "Slag Cement", title: "Portland Slag Cement — Specification", group: "related", version: "Fifth Revision", certStatus: "Mandatory", role: "Marine-works alternative with slag blend.", scope: "PSC with 25–70% GGBS; improved sulphate resistance.", parameters: [{ label: "GGBS", value: "25–70%" }] },
      { id: "c-rel-8", isNumber: "IS 3812-1:2003", shortLabel: "Fly Ash Spec", title: "Pulverized Fuel Ash, Part 1: for Use as Pozzolana", group: "related", version: "Second Revision", certStatus: "Voluntary", role: "Raw material standard for PPC blending.", scope: "Siliceous fly ash grades 1 & 2 with LOI and fineness limits.", parameters: [{ label: "LOI", value: "≤ 5.0%" }] },
      { id: "c-amd-1", isNumber: "Amd 4 · 2021", shortLabel: "Amd 4 — LOI", title: "Amendment 4 — Loss on ignition ceiling revised", group: "amendment", version: "Aug 2021", certStatus: "Voluntary", role: "Latest amendment to the primary standard.", scope: "LOI raised from 4.0% to 4.5% with clinker ratio tracking.", parameters: [{ label: "Effective", value: "Aug 2021" }] },
      { id: "c-amd-2", isNumber: "Amd 3 · 2018", shortLabel: "Amd 3 — Cl traces", title: "Amendment 3 — Chloride ion trace requirement", group: "amendment", version: "Mar 2018", certStatus: "Voluntary", role: "Earlier amendment to the primary standard.", scope: "Introduced chloride ion limit ≤ 0.1% for reinforced concrete cement.", parameters: [{ label: "Cl⁻", value: "≤ 0.1%" }] },
      { id: "c-qco", isNumber: "QCO 2023", shortLabel: "Cement QCO", title: "Cement (Quality Control) Order, 2023", group: "related", version: "Schedule I", certStatus: "Mandatory", role: "Regulatory instrument — mandatory BIS certification.", scope: "ISI marking compulsory for all cement grades; import without licence prohibited.", parameters: [{ label: "Status", value: "In force" }] },
    ],
    edges: [
      { source: "c-primary", target: "c-test-1", type: "test" },
      { source: "c-primary", target: "c-test-2", type: "test" },
      { source: "c-primary", target: "c-test-3", type: "test" },
      { source: "c-primary", target: "c-rel-1", type: "related" },
      { source: "c-primary", target: "c-rel-2", type: "related" },
      { source: "c-primary", target: "c-rel-3", type: "related" },
      { source: "c-primary", target: "c-rel-4", type: "related" },
      { source: "c-primary", target: "c-rel-5", type: "related" },
      { source: "c-primary", target: "c-rel-6", type: "related" },
      { source: "c-primary", target: "c-amd-1", type: "amendment" },
      { source: "c-primary", target: "c-amd-2", type: "amendment" },
      { source: "c-qco", target: "c-primary", type: "normative" },
      { source: "c-qco", target: "c-rel-5", type: "normative" },
      { source: "c-qco", target: "c-rel-6", type: "normative" },
      { source: "c-rel-6", target: "c-rel-8", type: "related" },
      { source: "c-rel-6", target: "c-test-3", type: "test" },
      { source: "c-rel-2", target: "c-rel-1", type: "related" },
      { source: "c-rel-3", target: "c-rel-1", type: "related" },
      { source: "c-rel-7", target: "c-qco", type: "normative" },
      { source: "c-amd-2", target: "c-test-2", type: "test" },
    ],
  },
  gaps: [
    { id: "gc-1", severity: "critical", clause: "Cl. 6.3.3 — IS 8112", title: "28-day compressive strength acceptance criteria missing", titleHi: "28-दिवसीय सामर्थ्य स्वीकृति मानदंड अनुपस्थित", detail: "Input does not define cube strength acceptance at 7/28 days or sampling frequency per IS 4031.", detailHi: "इनपुट में 7/28 दिन क्यूब सामर्थ्य या नमूना आवृत्ति अनिर्दिष्ट।", suggestion: "Specify: “28-day mortar compressive strength ≥ 43 MPa per IS 4031-6, tested per lot of 1,000 bags.”", suggestionHi: "निर्दिष्ट करें: “28-दिवसीय सामर्थ्य ≥ 43 MPa, IS 4031-6।”", standardRef: "IS 4031-1:1996" },
    { id: "gc-2", severity: "critical", clause: "Cl. 5 — IS 8112", title: "Freshness window and retest clause absent", titleHi: "फ्रेशनेस अवधि उपबंध अनुपस्थित", detail: "No age-of-cement restriction; cement older than 90 days may fail strength without retest.", detailHi: "सीमेंट आयु सीमा अनुपस्थित; 90+ दिन पुराने सीमेंट का पुनः परीक्षण आवश्यक।", suggestion: "Add: “Cement shall be dispatched within 90 days of manufacture; older stock retested before use.”", suggestionHi: "जोड़ें: “निर्माण के 90 दिनों के भीतर प्रेषण; अन्यथा पुनः परीक्षण।”", standardRef: "IS 8112:2013" },
    { id: "gc-3", severity: "critical", clause: "Cl. 6.1.2 — IS 456", title: "Exposure-class minimum grade not cross-referenced", titleHi: "एक्सपोज़र वर्ग न्यूनतम ग्रेड अनुपस्थित", detail: "For coastal/marine exposure, IS 456 mandates M30+ with w/c ≤ 0.45; input is silent.", detailHi: "समुद्री एक्सपोज़र हेतु IS 456 M30+ व w/c ≤ 0.45 अनिवार्य करता है।", suggestion: "Add durability clause: “Concrete M30, w/c ≤ 0.45, cover 50 mm for severe exposure per IS 456 Table 5.”", suggestionHi: "जोड़ें: “M30, w/c ≤ 0.45, कवर 50 mm, IS 456 तालिका 5।”", standardRef: "IS 456:2000" },
    { id: "gc-4", severity: "recommended", clause: "Cl. 8 — IS 8112", title: "PPC durability alternative not evaluated", titleHi: "PPC टिकाऊपन विकल्प मूल्यांकित नहीं", detail: "For mass pours, PPC (IS 1489-1) reduces heat of hydration ~20%; consider dual specification.", detailHi: "मास कास्टिंग हेतु PPC ऊष्मा ~20% घटाता है; दोहरा विनिर्देश विचार करें।", suggestion: "Permit equivalent PPC per IS 1489-1:2015 for non-critical mass concrete elements.", suggestionHi: "गैर-महत्वपूर्ण कार्यों हेतु IS 1489-1:2015 PPC अनुमति दें।", standardRef: "IS 1489-1:2015" },
    { id: "gc-5", severity: "recommended", clause: "Cl. 10 — IS 8112", title: "Storage and batch weighing provisions missing", titleHi: "भंडारण व बैच वेइंग उपबंध अनुपस्थित", detail: "Moisture ingress during site storage degrades strength; batch accuracy clause absent.", detailHi: "नमी प्रवेश से सामर्थ्य घटती है; बैच यथार्थता खंड अनुपस्थित।", suggestion: "Add: “Store on raised platforms ≤ 10 bags high; weigh-batch within ±2%.”", suggestionHi: "जोड़ें: “उठी हुई प्लेटफार्म पर भंडारण; बैच ±2%।”", standardRef: "IS 8112:2013" },
    { id: "gc-6", severity: "recommended", clause: "Cl. 13 — IS 8112", title: "Manufacturer test certificate format undefined", titleHi: "निर्माता प्रमाणपत्र प्रारूप अनिर्दिष्ट", detail: "No template for MTC content — chemical limits and IS 4032 traceability required.", detailHi: "MTC सामग्री का टेम्पलेट नहीं — IS 4032 अनुरेखण आवश्यक।", suggestion: "Annex MTC template listing IS 4032 parameters with BIS licence number printed.", suggestionHi: "IS 4032 मापदंडों सहित MTC टेम्पलेट संलग्न करें।", standardRef: "IS 4032:1985" },
  ],
  tenderClauses: `4.1  MATERIAL — Cement shall be Ordinary Portland Cement 43 grade conforming to IS 8112:2013 (incl. Amd 4).
4.2  PHYSICAL — Blaine fineness ≥ 225 m²/kg; initial setting ≥ 30 min; soundness ≤ 10 mm (IS 4031).
4.3  CHEMICAL — LOI ≤ 4.5%, insoluble residue ≤ 4.0%, SO₃ ≤ 3.5%, MgO ≤ 6.0% (IS 4032).
4.4  CERTIFICATION — Valid BIS licence under Cement (QCO) 2023; ISI marking on every bag.
4.5  FRESHNESS — Dispatch within 90 days of grinding; retest stock older than 90 days.
4.6  DURABILITY — Structural concrete M30 with w/c ≤ 0.45 and 50 mm cover for severe exposure (IS 456 Table 5).`,
};

const cables: Template = {
  key: "cables",
  keywords: /cable|wire|pvc|xlpe|wiring|conductor|switch|socket|electric/i,
  primary: {
    isNumber: "IS 1554-1:1988",
    title: "PVC Insulated (Heavy Duty) Electric Cables — Working Voltages up to 1,100 V",
    version: "Second Revision",
    amendment: "Amd 2 · Jan 2010",
    certStatus: "Mandatory",
    qcoRef: "Electric Cables (Quality Control) Order, 2024 — Schedule I",
    confidence: 90,
    matchReason: "LT power distribution supply scope with aluminium conductor matches heavy-duty PVC cables at 1.1 kV grade.",
    matchReasonHi: "1.1 kV ग्रेड हैवी-ड्यूटी PVC केबल एलटी वितरण आपूर्ति के अनुरूप हैं।",
    spec: [
      { label: "Rated voltage", value: "1,100 V" },
      { label: "Conductor", value: "Al, H2/H4 class" },
      { label: "Insulation", value: "PVC Type A" },
      { label: "Insulation resistance", value: "≥ 7 MΩ·km" },
      { label: "High voltage test", value: "3 kV / 4 min" },
      { label: "Conductor temp", value: "70°C max" },
      { label: "Short-circuit temp", value: "160°C" },
      { label: "Armour", value: "GI round wire" },
    ],
  },
  graph: {
    nodes: [
      { id: "e-primary", isNumber: "IS 1554-1:1988", shortLabel: "PVC Cables 1.1 kV", title: "PVC Insulated (Heavy Duty) Electric Cables, Part 1", group: "primary", version: "Second Revision", certStatus: "Mandatory", role: "Primary governing standard for the product under tender.", scope: "Heavy-duty PVC insulated cables with Al/Cu conductors up to 1,100 V; construction and tests.", parameters: [{ label: "HV test", value: "3 kV / 4 min" }, { label: "IR", value: "≥ 7 MΩ·km" }] },
      { id: "e-test-1", isNumber: "IS 10810-1:1984", shortLabel: "Cable Test Methods", title: "Methods of Test for Cables, Part 1: General", group: "test", version: "First Revision", certStatus: "Voluntary", role: "Test methods — insulation resistance & HV withstand.", scope: "Series covering dimensional checks, tensile, HV tests and ageing on cable components.", parameters: [{ label: "Ageing", value: "80°C / 168 h" }] },
      { id: "e-test-2", isNumber: "IS 5831:1984", shortLabel: "PVC Compound", title: "PVC Insulating and Sheathing Compounds for Electric Cables", group: "test", version: "Third Revision", certStatus: "Voluntary", role: "Material standard — insulation compound grade.", scope: "Types A, C, D, E, F compounds with thermal stability and dielectric limits.", parameters: [{ label: "Type A", value: "70°C rating" }] },
      { id: "e-rel-1", isNumber: "IS 732:2018", shortLabel: "Installation Code", title: "Electrical Installations — Code of Practice", group: "related", version: "Fourth Revision", certStatus: "Voluntary", role: "Installation context — wiring rules.", scope: "Selection and erection of wiring; protection and verification.", parameters: [{ label: "Erection", value: "Part 6" }] },
      { id: "e-rel-2", isNumber: "IS 1255:1983", shortLabel: "Cable Laying", title: "Code of Practice for Installation of Power Cables up to 33 kV", group: "related", version: "Second Revision", certStatus: "Voluntary", role: "Installation context — trenching & bending radius.", scope: "Bending radii, direct burial depth, duct sizing and termination practices.", parameters: [{ label: "Bend radius", value: "12 × D" }] },
      { id: "e-rel-3", isNumber: "IS 694:2010", shortLabel: "House Wiring", title: "PVC Insulated Cables up to 1,100 V (Flexible)", group: "related", version: "Fifth Revision", certStatus: "Mandatory", role: "Companion supply item — flexible wiring.", scope: "250/440 V flexible and house wiring cables.", parameters: [{ label: "Grade", value: "650/1,100 V" }] },
      { id: "e-rel-4", isNumber: "IS 7098-1:1988", shortLabel: "XLPE Alt.", title: "XLPE Insulated Cables, Part 1: up to 1,100 V", group: "related", version: "Second Revision", certStatus: "Mandatory", role: "Higher temperature alternative insulation.", scope: "XLPE cables with 90°C operation and 250°C short-circuit rating.", parameters: [{ label: "SC temp", value: "250°C" }] },
      { id: "e-rel-5", isNumber: "IS 8828:2015", shortLabel: "RCBO", title: "Residual Current Breakers with Overcurrent Protection", group: "related", version: "Second Revision", certStatus: "Mandatory", role: "Downstream protection coordination.", scope: "RCBOs 6–30 mA sensitivity for household shock protection.", parameters: [{ label: "IΔn", value: "30 mA" }] },
      { id: "e-rel-6", isNumber: "IS 1293:2019", shortLabel: "Plugs & Sockets", title: "Plugs and Socket-Outlets up to 250 V / 16 A", group: "related", version: "Fourth Revision", certStatus: "Mandatory", role: "Termination accessories.", scope: "Shuttered 6/16 A outlets with temperature rise limits.", parameters: [{ label: "Rating", value: "6 / 16 A" }] },
      { id: "e-amd-1", isNumber: "Amd 2 · 2010", shortLabel: "Amd 2 — FR grade", title: "Amendment 2 — Flame retardant compound adoption", group: "amendment", version: "Jan 2010", certStatus: "Voluntary", role: "Latest amendment to the primary standard.", scope: "Permits FR/FRLS compounds with oxygen index ≥ 29% and smoke density limits.", parameters: [{ label: "OI", value: "≥ 29%" }] },
      { id: "e-qco", isNumber: "QCO 2024", shortLabel: "Cable QCO", title: "Electric Cables (Quality Control) Order, 2024", group: "related", version: "Schedule I", certStatus: "Mandatory", role: "Regulatory instrument — mandatory ISI certification.", scope: "ISI marking compulsory for LT cables; customs clearance requires BIS licence.", parameters: [{ label: "Status", value: "In force" }] },
    ],
    edges: [
      { source: "e-primary", target: "e-test-1", type: "test" },
      { source: "e-primary", target: "e-test-2", type: "test" },
      { source: "e-primary", target: "e-rel-1", type: "related" },
      { source: "e-primary", target: "e-rel-2", type: "related" },
      { source: "e-primary", target: "e-rel-3", type: "related" },
      { source: "e-primary", target: "e-rel-4", type: "related" },
      { source: "e-primary", target: "e-amd-1", type: "amendment" },
      { source: "e-qco", target: "e-primary", type: "normative" },
      { source: "e-qco", target: "e-rel-3", type: "normative" },
      { source: "e-qco", target: "e-rel-4", type: "normative" },
      { source: "e-rel-1", target: "e-rel-5", type: "related" },
      { source: "e-rel-1", target: "e-rel-6", type: "related" },
      { source: "e-rel-2", target: "e-test-1", type: "test" },
      { source: "e-amd-1", target: "e-test-2", type: "test" },
      { source: "e-rel-4", target: "e-test-1", type: "test" },
    ],
  },
  gaps: [
    { id: "ge-1", severity: "critical", clause: "Cl. 12 — IS 1554-1", title: "High voltage test acceptance per drum missing", titleHi: "प्रति ड्रम HV परीक्षण स्वीकृति अनुपस्थित", detail: "Tender accepts type-test reports only; routine 3 kV/4 min test on every drum length is required.", detailHi: "केवल टाइप-टेस्ट रिपोर्ट स्वीकार्य; प्रत्येक ड्रम पर 3 kV/4 min आवश्यक।", suggestion: "Add: “Routine HV test 3 kV AC for 4 min on every drum, witnessed or certified (IS 10810-12).”", suggestionHi: "जोड़ें: “प्रत्येक ड्रम पर 3 kV AC / 4 min परीक्षण।”", standardRef: "IS 10810-1:1984" },
    { id: "ge-2", severity: "critical", clause: "Cl. 4 — IS 1554-1", title: "Armour specification silent on single-core cables", titleHi: "सिंगल-कोर केबल आर्मर अनिर्दिष्ट", detail: "GI round wire armour specified without excluding single-core use where magnetic induction rules apply.", detailHi: "सिंगल-कोर के लिए चुंबकीय आर्मर प्रतिबंध अनुपस्थित।", suggestion: "State: “Single-core cables shall use non-magnetic armour (Al wire); multicore GI wire per IS 1554-1.”", suggestionHi: "स्पष्ट करें: “सिंगल-कोर हेतु गैर-चुंबकीय आर्मर।”", standardRef: "IS 1554-1:1988" },
    { id: "ge-3", severity: "critical", clause: "Cl. 8 — IS 1554-1", title: "Insulation resistance verification at 70°C missing", titleHi: "70°C पर इन्सुलेशन रेजिस्टेंस अनुपस्थित", detail: "Ambient IR only accepted; volume resistivity at max operating temperature drives long-term safety.", detailHi: "केवल सामान्य तापमान IR; 70°C पर मापन आवश्यक।", suggestion: "Require IR at 70°C ≥ 0.0037 MΩ·km per IS 10810-13.", suggestionHi: "70°C पर IR ≥ 0.0037 MΩ·km आवश्यक करें।", standardRef: "IS 10810-1:1984" },
    { id: "ge-4", severity: "recommended", clause: "Cl. 6 — IS 1554-1", title: "FRLS compound option not evaluated", titleHi: "FRLS कंपाउंड विकल्प मूल्यांकित नहीं", detail: "Confined tunnels/metros justify flame retardant low smoke compounds (Amd 2).", detailHi: "मेट्रो/टनल हेतु FRLS कंपाउंड उचित (Amd 2)।", suggestion: "Permit or mandate FRLS insulation with OI ≥ 29% for ducted runs.", suggestionHi: "डक्टेड रन हेतु FRLS (OI ≥ 29%) अनिवार्य करें।", standardRef: "Amd 2 · 2010" },
    { id: "ge-5", severity: "recommended", clause: "Cl. 9 — IS 1255", title: "Bending radius and laying clause missing", titleHi: "बेंडिंग रेडियस उपबंध अनुपस्थित", detail: "No installation radius; unprotected bends damage insulation and void warranty.", detailHi: "स्थापना त्रिज्या अनुपस्थित; बेंड पर इन्सुलेशन क्षति।", suggestion: "Add: “Laying per IS 1255:1983; minimum bending radius 12 × overall diameter.”", suggestionHi: "जोड़ें: “IS 1255 अनुसार विन्यास, त्रिज्या 12 × D।”", standardRef: "IS 1255:1983" },
    { id: "ge-6", severity: "recommended", clause: "Cl. 14 — IS 1554-1", title: "Drum marking and batch traceability incomplete", titleHi: "ड्रम मार्किंग व अनुरेखण अपूर्ण", detail: "Drum markings must carry IS number, licence no., voltage grade and length for traceability.", detailHi: "ड्रम पर IS संख्या, लाइसेंस, वोल्टेज व लंबाई अंकित होनी चाहिए।", suggestion: "Require drum stencil with licence number, IS 1554-1, batch and date of manufacture.", suggestionHi: "ड्रम स्टेंसिल में लाइसेंस संख्या व बैच अनिवार्य करें।", standardRef: "IS 1554-1:1988" },
  ],
  tenderClauses: `5.1  MATERIAL — Cables shall be PVC insulated heavy duty type conforming to IS 1554-1:1988 (incl. Amd 2), 1,100 V grade.
5.2  CONSTRUCTION — Aluminium conductor H2/H4 per IS 8130; insulation PVC Type A per IS 5831; GI round wire armour (non-magnetic for single-core).
5.3  ROUTINE TESTS — Every drum: HV withstand 3 kV/4 min; insulation resistance ≥ 7 MΩ·km verified at 70°C (IS 10810 series).
5.4  CERTIFICATION — Valid BIS licence under Electric Cables (QCO) 2024; ISI mark on every drum.
5.5  INSTALLATION — Laying per IS 1255:1983; bending radius ≥ 12 × D.
5.6  MARKING — Drum stencil: IS 1554-1, licence no., voltage grade, batch, manufacture date.`,
};

const GENERIC_GRAPH = cement;

export function pickTemplate(description: string): Template {
  if (steel.keywords.test(description)) return steel;
  if (cables.keywords.test(description)) return cables;
  if (cement.keywords.test(description)) return cement;
  return GENERIC_GRAPH;
}

export function templateByKey(key: string): Template {
  switch (key) {
    case "steel":
      return steel;
    case "cables":
      return cables;
    default:
      return cement;
  }
}

export function allTemplates(): Template[] {
  return [steel, cement, cables];
}

export type { Template };
