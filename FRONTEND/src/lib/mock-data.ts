// ─────────────────────────────────────────────────────────────
// MANAKSETU — deterministic mock dataset
// All dates are pre-formatted strings (no runtime Date in render)
// ─────────────────────────────────────────────────────────────

import type {
  CertType,
  Standard,
  StandardStatus,
  TenderAudit,
  StandardUpdate,
  Kpi,
} from "./types";

// ── Sector constants ─────────────────────────────────────────
export const SECTORS = [
  "Cement & Concrete",
  "Steel & Metallurgy",
  "Electrical",
  "Electronics & IT",
  "Food & Agriculture",
  "Water & Sanitation",
  "Chemicals",
  "Building Materials",
  "Textiles",
  "Auto Components",
] as const;

// ── Hand-curated flagship standards ──────────────────────────
interface Seed {
  code: string;
  year: number;
  title: string;
  sector: (typeof SECTORS)[number];
  version: string;
  amd: string; // "02 Nov 2023"
  amdYear: number;
  status?: StandardStatus;
  mandatory: boolean;
  cert: CertType;
  qco?: string;
  refs: string[];
  ics: string;
  scope: string;
}

const QCO_STEEL = "Steel & Steel Products (Quality Control) Order, 2024";
const QCO_CEMENT = "Cement (Quality Control) Order, 2023";
const QCO_CABLES = "Electric Cables (Quality Control) Order, 2024";
const QCO_CRS =
  "Electronics & IT Goods (Requirements for Compulsory Registration), 2012";

const SEEDS: Seed[] = [
  {
    code: "1786",
    year: 2008,
    title:
      "High Tensile Deformed Steel Bars and Wires for Concrete Reinforcement — Specification",
    sector: "Steel & Metallurgy",
    version: "Fifth Revision",
    amd: "02 Nov 2023",
    amdYear: 2023,
    mandatory: true,
    cert: "ISI Mark",
    qco: QCO_STEEL,
    refs: [
      "IS 1608:2008",
      "IS 1599:1985",
      "IS 228:1993",
      "IS 456:2000",
      "IS 2502:1963",
    ],
    ics: "77.140.15",
    scope:
      "Covers high tensile deformed steel bars and wires from 4–50 mm for reinforced concrete construction in Fe415, Fe500, Fe550, Fe600 grades and ductility sub-grades D and S.",
  },
  {
    code: "456",
    year: 2000,
    title: "Plain and Reinforced Concrete — Code of Practice",
    sector: "Cement & Concrete",
    version: "Fourth Revision",
    amd: "18 Jan 2021",
    amdYear: 2021,
    mandatory: false,
    cert: "ISI Mark",
    refs: ["IS 8112:2013", "IS 383:2016", "IS 10262:2019", "IS 1893-1:2016"],
    ics: "91.100.30",
    scope:
      "Code of practice for structural design of plain and reinforced concrete members, materials, workmanship, inspection and testing requirements.",
  },
  {
    code: "8112",
    year: 2013,
    title: "Ordinary Portland Cement, 43 Grade — Specification",
    sector: "Cement & Concrete",
    version: "Third Revision",
    amd: "14 Aug 2021",
    amdYear: 2021,
    mandatory: true,
    cert: "ISI Mark",
    qco: QCO_CEMENT,
    refs: ["IS 4031-1:1996", "IS 4032:1985", "IS 456:2000"],
    ics: "91.100.10",
    scope:
      "Covers manufacture and physical/chemical requirements of 43 grade ordinary Portland cement for general concrete construction.",
  },
  {
    code: "12269",
    year: 2013,
    title: "Ordinary Portland Cement, 53 Grade — Specification",
    sector: "Cement & Concrete",
    version: "Second Revision",
    amd: "09 Mar 2019",
    amdYear: 2019,
    mandatory: true,
    cert: "ISI Mark",
    qco: QCO_CEMENT,
    refs: ["IS 4031-1:1996", "IS 4032:1985", "IS 456:2000"],
    ics: "91.100.10",
    scope:
      "Covers 53 grade ordinary Portland cement for high-strength structural concrete, precast elements and prestressed applications.",
  },
  {
    code: "269",
    year: 2015,
    title: "Ordinary Portland Cement, 33 Grade — Specification",
    sector: "Cement & Concrete",
    version: "Sixth Revision",
    amd: "22 Jun 2018",
    amdYear: 2018,
    mandatory: true,
    cert: "ISI Mark",
    qco: QCO_CEMENT,
    refs: ["IS 4031-1:1996", "IS 4032:1985"],
    ics: "91.100.10",
    scope:
      "Covers 33 grade OPC for low-rise masonry, plastering and non-structural applications.",
  },
  {
    code: "1489-1",
    year: 2015,
    title: "Portland Pozzolana Cement — Part 1: Fly Ash Based — Specification",
    sector: "Cement & Concrete",
    version: "Fourth Revision",
    amd: "11 Feb 2022",
    amdYear: 2022,
    mandatory: true,
    cert: "ISI Mark",
    qco: QCO_CEMENT,
    refs: ["IS 3812-1:2003", "IS 4031-1:1996", "IS 1727:1967"],
    ics: "91.100.10",
    scope:
      "Covers PPC manufactured by intergrinding fly ash with OPC clinker; durability-focused blends for mass concrete.",
  },
  {
    code: "455",
    year: 2015,
    title: "Portland Slag Cement — Specification",
    sector: "Cement & Concrete",
    version: "Fifth Revision",
    amd: "30 Sep 2020",
    amdYear: 2020,
    mandatory: true,
    cert: "ISI Mark",
    qco: QCO_CEMENT,
    refs: ["IS 12089:1987", "IS 4031-1:1996"],
    ics: "91.100.10",
    scope:
      "Covers PSC with granulated blast furnace slag content 25–70%; sulphate-resisting blends for marine works.",
  },
  {
    code: "383",
    year: 2016,
    title: "Coarse and Fine Aggregate for Concrete — Specification",
    sector: "Cement & Concrete",
    version: "Third Revision",
    amd: "27 Jul 2020",
    amdYear: 2020,
    mandatory: true,
    cert: "ISI Mark",
    qco: QCO_CEMENT,
    refs: ["IS 2386-1:1963", "IS 456:2000"],
    ics: "91.100.20",
    scope:
      "Covers natural and manufactured coarse/fine aggregates including gradation zones, deleterious limits and alkali-silica reactivity screening.",
  },
  {
    code: "10262",
    year: 2019,
    title: "Concrete Mix Proportioning — Guidelines",
    sector: "Cement & Concrete",
    version: "Second Revision",
    amd: "—",
    amdYear: 2019,
    mandatory: false,
    cert: "ISI Mark",
    refs: ["IS 456:2000", "IS 8112:2013", "IS 383:2016"],
    ics: "91.100.30",
    scope:
      "Guidelines for nominal and design mix proportioning of normal, standard and high strength concrete.",
  },
  {
    code: "516",
    year: 2018,
    title: "Hardened Concrete — Methods of Test, Part 1: Strength of Specimens",
    sector: "Cement & Concrete",
    version: "Third Revision",
    amd: "—",
    amdYear: 2018,
    mandatory: false,
    cert: "ISI Mark",
    refs: ["IS 10086:1982", "IS 456:2000"],
    ics: "91.100.30",
    scope:
      "Methods for compressive and flexural strength determination on cast and cored concrete specimens.",
  },
  {
    code: "800",
    year: 2007,
    title: "General Construction in Steel — Code of Practice",
    sector: "Steel & Metallurgy",
    version: "Third Revision",
    amd: "26 Nov 2015",
    amdYear: 2015,
    mandatory: false,
    cert: "ISI Mark",
    refs: ["IS 2062:2011", "IS 816:1969", "IS 875-1:1987"],
    ics: "77.140.01",
    scope:
      "Limit-state design code for steel structures covering members, connections, beams, columns and trusses.",
  },
  {
    code: "2062",
    year: 2011,
    title:
      "Hot Rolled Medium and High Tensile Structural Steel — Specification",
    sector: "Steel & Metallurgy",
    version: "Eleventh Revision",
    amd: "05 May 2022",
    amdYear: 2022,
    mandatory: true,
    cert: "ISI Mark",
    qco: QCO_STEEL,
    refs: ["IS 1608:2008", "IS 228:1993", "IS 800:2007"],
    ics: "77.140.01",
    scope:
      "Covers structural steel plates, sections, bars in E250–E450 grades for welded, bolted and riveted construction.",
  },
  {
    code: "808",
    year: 1989,
    title: "Hot Rolled Steel Beam, Column, Channel and Angle Sections",
    sector: "Steel & Metallurgy",
    version: "Third Revision",
    amd: "12 Dec 2009",
    amdYear: 2009,
    mandatory: false,
    cert: "ISI Mark",
    refs: ["IS 2062:2011", "IS 808:1989"],
    ics: "77.140.70",
    scope:
      "Dimensional standard for hot-rolled steel beam, column, channel and angle sections including tolerances.",
  },
  {
    code: "1239-1",
    year: 2004,
    title:
      "Steel Tubes, Structural — Part 1: Hot Finished Welded (ERW) — Specification",
    sector: "Steel & Metallurgy",
    version: "Third Revision",
    amd: "19 Oct 2016",
    amdYear: 2016,
    mandatory: true,
    cert: "ISI Mark",
    qco: QCO_STEEL,
    refs: ["IS 2062:2011", "IS 1608:2008"],
    ics: "77.140.75",
    scope:
      "Covers ERW steel tubes for structural scaffolding and furniture in light/medium/heavy classes.",
  },
  {
    code: "13920",
    year: 2016,
    title:
      "Ductile Detailing of Reinforced Concrete Structures Subjected to Seismic Forces — Code of Practice",
    sector: "Cement & Concrete",
    version: "Fifth Revision",
    amd: "08 Aug 2020",
    amdYear: 2020,
    mandatory: false,
    cert: "ISI Mark",
    refs: ["IS 456:2000", "IS 1893-1:2016", "IS 1786:2008"],
    ics: "91.120.25",
    scope:
      "Special confining reinforcement, lap splices and detailing rules for RC moment-resisting frames in seismic zones III–V.",
  },
  {
    code: "1893-1",
    year: 2016,
    title:
      "Criteria for Earthquake Resistant Design of Structures, Part 1: General Provisions and Buildings",
    sector: "Cement & Concrete",
    version: "Sixth Revision",
    amd: "—",
    amdYear: 2016,
    mandatory: false,
    cert: "ISI Mark",
    refs: ["IS 456:2000", "IS 13920:2016", "IS 800:2007"],
    ics: "91.120.25",
    scope:
      "Seismic zone factors, response spectra, importance factors and dynamic analysis provisions for buildings.",
  },
  {
    code: "2502",
    year: 1963,
    title:
      "Bending and Fixing of Bars for Concrete Reinforcement — Code of Practice",
    sector: "Steel & Metallurgy",
    version: "First Revision",
    amd: "—",
    amdYear: 1963,
    mandatory: false,
    cert: "ISI Mark",
    refs: ["IS 1786:2008", "IS 456:2000"],
    ics: "91.080.40",
    scope:
      "Standard bends, hooks, seismic hooks and mandrel diameters for cutting and bending reinforcement.",
  },
  {
    code: "9595",
    year: 1996,
    title:
      "Metal Arc Welding of Carbon and Carbon Manganese Steels — Recommendations",
    sector: "Steel & Metallurgy",
    version: "Second Revision",
    amd: "—",
    amdYear: 1996,
    mandatory: false,
    cert: "ISI Mark",
    refs: ["IS 814-1:1991", "IS 2062:2011", "IS 2751:1989"],
    ics: "25.160.10",
    scope:
      "Recommendations for SMAW/GMAW of carbon steels including preheat, electrode classification and welder qualification.",
  },
  {
    code: "2751",
    year: 1989,
    title:
      "Recommended Practice for Welding of Mild Steel Bars Used for Reinforced Concrete Construction",
    sector: "Steel & Metallurgy",
    version: "Second Revision",
    amd: "—",
    amdYear: 1989,
    mandatory: false,
    cert: "ISI Mark",
    refs: ["IS 9595:1996", "IS 1786:2008"],
    ics: "25.160.10",
    scope:
      "Weldability classes of rebar, joint types, lap butt and splice weld procedures for reinforcement assemblies.",
  },
  {
    code: "814-1",
    year: 1991,
    title:
      "Covered Electrodes for Manual Metal Arc Welding of Carbon and Carbon Manganese Steel, Part 1",
    sector: "Steel & Metallurgy",
    version: "Fourth Revision",
    amd: "—",
    amdYear: 1991,
    mandatory: true,
    cert: "ISI Mark",
    qco: QCO_STEEL,
    refs: ["IS 9595:1996"],
    ics: "25.160.20",
    scope:
      "Covers classification, chemical composition and all-weld metal mechanical properties of MMAW electrodes.",
  },
  {
    code: "432-1",
    year: 1996,
    title:
      "Mild Steel Wire for General Engineering Purposes, Part 1: Annealed — Specification",
    sector: "Steel & Metallurgy",
    version: "Fourth Revision",
    amd: "—",
    amdYear: 1996,
    mandatory: true,
    cert: "ISI Mark",
    qco: QCO_STEEL,
    refs: ["IS 2062:2011"],
    ics: "77.140.65",
    scope:
      "Covers annealed mild steel wire 0.60–8.00 mm for binding, fencing and general engineering.",
  },
  {
    code: "1566",
    year: 1982,
    title:
      "Hard Drawn Steel Wire Fabric for Concrete Reinforcement — Specification",
    sector: "Steel & Metallurgy",
    version: "Third Revision",
    amd: "—",
    amdYear: 1982,
    mandatory: false,
    cert: "ISI Mark",
    refs: ["IS 432-1:1996", "IS 456:2000"],
    ics: "77.140.65",
    scope:
      "Covers welded square-mesh hard-drawn steel wire fabric in square and rectangular grids for slabs and pavements.",
  },
  {
    code: "732",
    year: 2018,
    title: "Electrical Installations — Code of Practice",
    sector: "Electrical",
    version: "Fourth Revision",
    amd: "—",
    amdYear: 2018,
    mandatory: false,
    cert: "ISI Mark",
    refs: ["IS 694:2010", "IS 1554-1:1988", "IS 1293:2019"],
    ics: "91.140.50",
    scope:
      "Code covering selection, erection and verification of wiring installations up to and including 1,100 V.",
  },
  {
    code: "1554-1",
    year: 1988,
    title:
      "PVC Insulated (Heavy Duty) Electric Cables, Part 1: Working Voltages up to and including 1,100 V",
    sector: "Electrical",
    version: "Second Revision",
    amd: "24 Jan 2010",
    amdYear: 2010,
    mandatory: true,
    cert: "ISI Mark",
    qco: QCO_CABLES,
    refs: ["IS 5831:1984", "IS 10810-1:1984", "IS 1255:1983"],
    ics: "29.060.20",
    scope:
      "Covers PVC insulated heavy-duty power cables with copper/aluminium conductors up to 1.1 kV grade.",
  },
  {
    code: "694",
    year: 2010,
    title:
      "PVC Insulated Cables for Working Voltages up to and including 1,100 V",
    sector: "Electrical",
    version: "Fifth Revision",
    amd: "—",
    amdYear: 2010,
    mandatory: true,
    cert: "ISI Mark",
    qco: QCO_CABLES,
    refs: ["IS 5831:1984", "IS 10810-1:1984"],
    ics: "29.060.20",
    scope:
      "Covers 250/440 V PVC insulated flexible and house-wiring cables, sheathed and unsheathed.",
  },
  {
    code: "7098-1",
    year: 1988,
    title:
      "Cross-linked Polyethylene Insulated Thermoplastic Sheathed Cables, Part 1: up to 1,100 V",
    sector: "Electrical",
    version: "Second Revision",
    amd: "—",
    amdYear: 1988,
    mandatory: true,
    cert: "ISI Mark",
    qco: QCO_CABLES,
    refs: ["IS 10810-1:1984", "IS 1255:1983"],
    ics: "29.060.20",
    scope:
      "Covers XLPE insulated PVC sheathed cables for distribution networks with short-circuit temperature 250°C.",
  },
  {
    code: "1293",
    year: 2019,
    title:
      "Plugs and Socket-Outlets of Rated Voltage up to and including 250 V and Rated Current up to 16 A",
    sector: "Electrical",
    version: "Fourth Revision",
    amd: "—",
    amdYear: 2019,
    mandatory: true,
    cert: "ISI Mark",
    qco: QCO_CABLES,
    refs: ["IS 732:2018"],
    ics: "29.120.30",
    scope:
      "Covers 2P+E plugs and socket outlets 6 A and 16 A with shuttered entries and temperature-rise limits.",
  },
  {
    code: "8828",
    year: 2015,
    title:
      "Residual Current Operated Circuit-Breakers with Integral Overcurrent Protection (RCBO)",
    sector: "Electrical",
    version: "Second Revision",
    amd: "—",
    amdYear: 2015,
    mandatory: true,
    cert: "ISI Mark",
    refs: ["IS 732:2018", "IS 1293:2019"],
    ics: "29.120.50",
    scope:
      "Covers RCBOs for household 50/60 Hz, IΔn 6–30 mA with breaking capacity up to 10 kA.",
  },
  {
    code: "1255",
    year: 1983,
    title:
      "Code of Practice for Installation and Maintenance of Indoor/Outdoor Power Cables up to 33 kV",
    sector: "Electrical",
    version: "Second Revision",
    amd: "—",
    amdYear: 1983,
    mandatory: false,
    cert: "ISI Mark",
    refs: ["IS 1554-1:1988", "IS 7098-1:1988"],
    ics: "29.240.01",
    scope:
      "Covers handling, bending radius, trenching, direct burial, ducting and termination practices for power cables.",
  },
  {
    code: "10500",
    year: 2012,
    title: "Drinking Water — Specification",
    sector: "Water & Sanitation",
    version: "Second Revision",
    amd: "—",
    amdYear: 2012,
    mandatory: false,
    cert: "ISI Mark",
    refs: ["IS 3025-11:1983", "IS 3025-44:1993"],
    ics: "13.060.20",
    scope:
      "Prescribes acceptable and permissible limits for 56 physico-chemical and bacteriological parameters of potable water.",
  },
  {
    code: "14543",
    year: 2004,
    title:
      "Packaged Drinking Water (Other than Packaged Natural Mineral Water) — Specification",
    sector: "Food & Agriculture",
    version: "Second Revision",
    amd: "—",
    amdYear: 2004,
    mandatory: true,
    cert: "ISI Mark",
    refs: ["IS 10500:2012", "IS 3025-11:1983"],
    ics: "67.160.20",
    scope:
      "Covers treated packaged drinking water; mandatory ISI certification under FSSAI-BIS coordination.",
  },
  {
    code: "13428",
    year: 2005,
    title: "Packaged Natural Mineral Water — Specification",
    sector: "Food & Agriculture",
    version: "Third Revision",
    amd: "—",
    amdYear: 2005,
    mandatory: true,
    cert: "ISI Mark",
    refs: ["IS 10500:2012", "IS 3025-44:1993"],
    ics: "67.160.20",
    scope:
      "Covers bottled natural mineral water from protected sources with minimum residence time underground.",
  },
  {
    code: "1165",
    year: 2017,
    title: "Milk Powder — Specification (Skimmed and Whole)",
    sector: "Food & Agriculture",
    version: "Fifth Revision",
    amd: "—",
    amdYear: 2017,
    mandatory: true,
    cert: "ISI Mark",
    refs: ["IS 1479-1:1960"],
    ics: "67.100.10",
    scope:
      "Covers spray-dried skimmed and whole milk powder including moisture, fat, TPC and coliform limits.",
  },
  {
    code: "4985",
    year: 2000,
    title: "Unplasticized PVC Pipes for Potable Water Supplies — Specification",
    sector: "Water & Sanitation",
    version: "Third Revision",
    amd: "—",
    amdYear: 2000,
    mandatory: true,
    cert: "ISI Mark",
    qco: "PVC Pipes (Quality Control) Order, 2023",
    refs: ["IS 10500:2012", "IS 4985:2000"],
    ics: "23.040.20",
    scope:
      "Covers uPVC pipes PN 2.5–PN 16 classes with lead-free formulation for drinking water distribution.",
  },
  {
    code: "458",
    year: 2003,
    title:
      "Precast Concrete Pipes (with and without Reinforcement) — Specification",
    sector: "Water & Sanitation",
    version: "Fourth Revision",
    amd: "—",
    amdYear: 2003,
    mandatory: true,
    cert: "ISI Mark",
    refs: ["IS 456:2000", "IS 516:2018"],
    ics: "93.030",
    scope:
      "Covers NP/SP classes of RCC and PCC pipes DN 80–2000 for sewers, culverts and irrigation.",
  },
  {
    code: "13252-1",
    year: 2010,
    title: "Information Technology Equipment — Safety — General Requirements",
    sector: "Electronics & IT",
    version: "Second Revision",
    amd: "—",
    amdYear: 2010,
    mandatory: true,
    cert: "CRS",
    qco: QCO_CRS,
    refs: ["IS 616:2017"],
    ics: "35.260",
    scope:
      "Safety of IT equipment incl. business electronics under BIS CRS scheme; registration mandatory for import/sale.",
  },
  {
    code: "616",
    year: 2017,
    title:
      "Audio, Video and Similar Electronic Apparatus — Safety Requirements",
    sector: "Electronics & IT",
    version: "Second Revision",
    amd: "—",
    amdYear: 2017,
    mandatory: true,
    cert: "CRS",
    qco: QCO_CRS,
    refs: ["IS 13252-1:2010"],
    ics: "33.160.01",
    scope:
      "Covers mains-powered AV apparatus under CRS Schedule; electric shock, fire and mechanical hazard limits.",
  },
  {
    code: "16102-1",
    year: 2017,
    title:
      "Self-ballasted LED Lamps for General Lighting Services, Part 1: Safety Requirements",
    sector: "Electronics & IT",
    version: "First Revision",
    amd: "—",
    amdYear: 2017,
    mandatory: true,
    cert: "CRS",
    qco: QCO_CRS,
    refs: ["IS 616:2017", "IS 10322-5-1:2018"],
    ics: "29.140.99",
    scope:
      "Safety and interchangeability of integrated LED lamps >2,500 lm, incl. thermal test conditions.",
  },
  {
    code: "486",
    year: 1995,
    title: "Hydrochloric Acid — Specification",
    sector: "Chemicals",
    version: "Third Revision",
    amd: "—",
    amdYear: 1995,
    mandatory: true,
    cert: "ISI Mark",
    refs: ["IS 266:1993"],
    ics: "71.060.30",
    scope:
      "Covers technical grade hydrochloric acid 30–36% HCl with iron, arsenic and heavy metal limits.",
  },
  {
    code: "266",
    year: 1993,
    title: "Sulphuric Acid — Specification",
    sector: "Chemicals",
    version: "Fifth Revision",
    amd: "—",
    amdYear: 1993,
    mandatory: true,
    cert: "ISI Mark",
    refs: ["IS 3025-2:1983"],
    ics: "71.060.10",
    scope:
      "Covers concentrated sulphuric acid grades for batteries, fertilizers and water treatment.",
  },
  {
    code: "1077",
    year: 1992,
    title: "Common Burnt Clay Building Bricks — Specification",
    sector: "Building Materials",
    version: "Fifth Revision",
    amd: "—",
    amdYear: 1992,
    mandatory: true,
    cert: "ISI Mark",
    refs: ["IS 3495-1:1992", "IS 1905:1987"],
    ics: "91.080.15",
    scope:
      "Covers machine/hand moulded clay bricks classes 3.5–35 N/mm² with water absorption ≤20%.",
  },
  {
    code: "1905",
    year: 1987,
    title: "Structural Use of Unreinforced Masonry — Code of Practice",
    sector: "Building Materials",
    version: "Third Revision",
    amd: "—",
    amdYear: 1987,
    mandatory: false,
    cert: "ISI Mark",
    refs: ["IS 1077:1992", "IS 1893-1:2016"],
    ics: "91.080.15",
    scope:
      "Design of loadbearing masonry walls incl. effective height, slenderness ratio and eccentricity rules.",
  },
  {
    code: "2185-1",
    year: 2005,
    title: "Concrete Masonry Units, Part 1: Hollow and Solid Concrete Blocks",
    sector: "Building Materials",
    version: "Third Revision",
    amd: "—",
    amdYear: 2005,
    mandatory: true,
    cert: "ISI Mark",
    refs: ["IS 456:2000", "IS 1905:1987"],
    ics: "91.080.30",
    scope:
      "Covers hollow/solid blocks grades M3–M15 with drying shrinkage and wet compressive strength limits.",
  },
  {
    code: "2925",
    year: 1984,
    title: "Industrial Safety Helmets — Specification",
    sector: "Auto Components",
    version: "Second Revision",
    amd: "—",
    amdYear: 1984,
    mandatory: true,
    cert: "ISI Mark",
    refs: ["IS 4151:1993"],
    ics: "13.340.20",
    scope:
      "Covers industrial crash helmets incl. shock absorption, penetration and chin-strap retention tests.",
  },
  {
    code: "4151",
    year: 1993,
    title:
      "Protective Helmets for Two and Three Wheeler Riders — Specification",
    sector: "Auto Components",
    version: "Second Revision",
    amd: "—",
    amdYear: 1993,
    mandatory: true,
    cert: "ISI Mark",
    refs: ["IS 2925:1984"],
    ics: "43.140",
    scope:
      "Covers full/open/half face helmets with impact attenuation, rigidity and retention system tests.",
  },
  {
    code: "15633",
    year: 2005,
    title:
      "Automotive Vehicles — Brakes and Braking Systems — Performance Requirements",
    sector: "Auto Components",
    version: "First Revision",
    amd: "—",
    amdYear: 2005,
    mandatory: false,
    cert: "ISI Mark",
    refs: ["IS 4151:1993"],
    ics: "43.040.40",
    scope:
      "Covers service, secondary and parking braking performance for M/N category vehicles per CMVR alignment.",
  },
  {
    code: "1964",
    year: 2001,
    title:
      "Methods of Test for Textiles — Determination of Yarn Count and Twist",
    sector: "Textiles",
    version: "Third Revision",
    amd: "—",
    amdYear: 2001,
    mandatory: false,
    cert: "ISI Mark",
    refs: ["IS 1963:1970"],
    ics: "59.060.01",
    scope:
      "Laboratory methods for linear density (Ne, Tex) and twist per metre of spun and filament yarns.",
  },
  {
    code: "5983",
    year: 1986,
    title: "Eye Protectors for Industrial Use — Specification",
    sector: "Auto Components",
    version: "Second Revision",
    amd: "—",
    amdYear: 1986,
    mandatory: true,
    cert: "ISI Mark",
    refs: ["IS 2925:1984"],
    ics: "13.340.70",
    scope:
      "Covers goggles, face shields and spectacles with impact, abrasion and corrisive-liquid resistance tests.",
  },
];

// ── Deterministic PRNG (mulberry32) ──────────────────────────
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function fmtDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${String(d).padStart(2, "0")} ${MONTHS[m - 1]} ${y}`;
}

const REVISION_WORDS = [
  "First",
  "Second",
  "Third",
  "Fourth",
  "Fifth",
  "Sixth",
  "Seventh",
  "Eighth",
];

const GENERIC_TITLES: Record<string, string[]> = {
  "Cement & Concrete": [
    "Methods of Physical Tests for Hydraulic Cement",
    "Chemical Analysis of Hydraulic Cement",
    "Concrete Admixtures — Specification",
    "Integral Waterproofing Compounds for Cement Mortar and Concrete",
    "Concrete Vibrators, Immersion Type — Specification",
    "Methods of Sampling and Analysis of Concrete",
    "Rubber Forms and Moulds for Concrete Test Specimens",
    "Splitting Tensile Strength of Concrete — Method of Test",
  ],
  "Steel & Metallurgy": [
    "Cold Reduced Steel Wire for Prestressed Concrete",
    "Hollow Steel Sections for Structural Use — Specification",
    "Dimensions for Hot Rolled Steel Sheet Piling",
    "Steel Plates for Pressure Vessels — Specification",
    "Tolerances for Bright Drawn Steel Bars",
    "Fusion Welded Steel Wire Fabric — Specification",
  ],
  Electrical: [
    "Methods of Test for Electric Cables, Part 1: General",
    "PVC Insulating Sheath of Electric Cables — Specification",
    "Low Voltage Switchgear and Controlgear — Circuit Breakers",
    "Code of Practice for Interior Illumination",
    "A.C. Electricity Meters, Class 1 and 2 — Specification",
    "Conduit Pipes for Electrical Wiring — Specification",
  ],
  "Electronics & IT": [
    "Household and Similar Electrical Appliances — Safety, Part 2: Microwave Ovens",
    "Power Supply Units for IT Equipment — Safety Requirements",
    "Wireless Mouse and Keyboard Input Devices — Safety",
    "Mobile Phone Chargers — Performance and Safety Requirements",
    "Rooftop Solar Inverters — Safety Requirements",
    "Lithium Cells for Portable Applications — Safety",
  ],
  "Food & Agriculture": [
    "White Sugar — Specification",
    "Wheat Flour (Atta) — Specification",
    "Basmati Rice Grading and Marking Rules",
    "Mustard Oil — Specification",
    "Turmeric Powder — Specification",
    "Biscuits — General Specification",
    "Tea, Grades and Testing — Specification",
  ],
  "Water & Sanitation": [
    "Methods of Sampling and Test (Physical and Chemical) for Water, Part 11: pH Value",
    "Polyethylene Pipes for Water Supply — Specification",
    "Rubber Sealing Rings for Water Supply Pipelines",
    "Manhole Covers and Frames — Specification",
    "Ductile Iron Pipes for Water and Sewerage — Specification",
  ],
  Chemicals: [
    "Caustic Soda, Anhydrous — Specification",
    "Sodium Hypochlorite Solution — Specification",
    "Hydrated Lime for Water Treatment — Specification",
    "Anti-Corrosive Paints for Steel Structures",
    "Solvent Cement for uPVC Pipes — Specification",
  ],
  "Building Materials": [
    "Gypsum Plaster Boards — Specification",
    "Autoclaved Aerated Concrete Blocks — Specification",
    "Fiber Cement Sheets — Specification",
    "Structural Glass for Buildings — Code of Practice",
    "Fly Ash-Lime-Gypsum Bricks — Specification",
  ],
  Textiles: [
    "Polyester Multifilament Industrial Yarn — Specification",
    "Polypropylene Sewing Thread — Specification",
    "Cotton Canvas Tarpaulins — Specification",
    "High Visibility Safety Jackets — Specification",
    "Geotextiles, Woven — Methods of Test",
  ],
  "Auto Components": [
    "Automotive V-Belts — Specification",
    "Pneumatic Tyres for Commercial Vehicles — Specification",
    "Automotive Lamps, Rear — Performance Requirements",
    "Brake Hoses for Motor Vehicles — Specification",
    "Laminated Safety Glass for Automobiles — Specification",
  ],
};

const CERTS: CertType[] = ["ISI Mark", "CRS", "Hallmark", "Eco Mark"];

function buildExtendedStandards(): Standard[] {
  const rnd = mulberry32(20251208);
  const out: Standard[] = [];

  // 1) Hand-curated flagships
  for (const s of SEEDS) {
    out.push({
      id: `IS-${s.code.replace(/\W/g, "")}-${s.year}`,
      isNumber: `IS ${s.code}:${s.year}`,
      code: s.code,
      title: s.title,
      sector: s.sector,
      version: s.version,
      lastAmended: s.amd === "—" ? "—" : s.amd, // seeds are pre-formatted "DD Mon YYYY"
      amendedYear: s.amdYear,
      status: s.status ?? "Active",
      mandatory: s.mandatory,
      certType: s.cert,
      qcoRef: s.qco ?? null,
      normativeRefs: s.refs,
      ics: s.ics,
      scope: s.scope,
    });
  }

  // 2) Programmatic body (~280 rows) — realistic variation per sector
  let serial = 900;
  for (const sector of SECTORS) {
    const titles = GENERIC_TITLES[sector];
    for (let i = 0; i < 28; i++) {
      serial += 7 + Math.floor(rnd() * 23);
      const year = 1988 + Math.floor(rnd() * 37); // 1988–2024
      const isWithdrawn = rnd() < 0.08;
      const underRevision = !isWithdrawn && rnd() < 0.07;
      const mandatory = !isWithdrawn && rnd() < 0.55;
      const revIdx = Math.floor(rnd() * REVISION_WORDS.length);
      const amdOffset = Math.min(2024, year + 1 + Math.floor(rnd() * 14));
      const hasAmd = amdOffset > year && !isWithdrawn && rnd() < 0.72;
      const part = rnd() < 0.3 ? `-1` : "";
      const code = `${serial}${part}`;
      const title = `${titles[i % titles.length]}${part ? ", Part 1" : ""}`;
      const cert = mandatory
        ? sector === "Electronics & IT"
          ? "CRS"
          : rnd() < 0.94
            ? "ISI Mark"
            : CERTS[3]
        : rnd() < 0.5
          ? "ISI Mark"
          : CERTS[Math.floor(rnd() * CERTS.length)];
      const refsCount = 2 + Math.floor(rnd() * 3);
      const refs: string[] = [];
      for (let r = 0; r < refsCount; r++) {
        const rc = serial - 40 - Math.floor(rnd() * 220);
        refs.push(`IS ${rc}:${1988 + Math.floor(rnd() * 30)}`);
      }
      out.push({
        id: `IS-${code.replace(/\W/g, "")}-${year}`,
        isNumber: `IS ${code}:${year}`,
        code,
        title,
        sector,
        version: `${REVISION_WORDS[revIdx]} Revision`,
        lastAmended: hasAmd
          ? fmtDate(
              `${amdOffset}-${String(1 + Math.floor(rnd() * 12)).padStart(2, "0")}-${String(1 + Math.floor(rnd() * 28)).padStart(2, "0")}`,
            )
          : "—",
        amendedYear: hasAmd ? amdOffset : year,
        status: isWithdrawn
          ? "Withdrawn"
          : underRevision
            ? "Under Revision"
            : "Active",
        mandatory,
        certType: cert,
        qcoRef:
          mandatory && rnd() < 0.4
            ? sector === "Cement & Concrete"
              ? QCO_CEMENT
              : sector === "Steel & Metallurgy"
                ? QCO_STEEL
                : sector === "Electrical"
                  ? QCO_CABLES
                  : sector === "Electronics & IT"
                    ? QCO_CRS
                    : null
            : null,
        normativeRefs: refs,
        ics: `${50 + Math.floor(rnd() * 40)}.${Math.floor(rnd() * 100)}`,
        scope: `Covers requirements, sampling criteria and test methods applicable to ${title.toLowerCase().replace(/ — specification$| — code of practice$/i, "")} as per BIS conformity assessment procedures.`,
      });
    }
  }

  return out;
}

export const STANDARDS: Standard[] = buildExtendedStandards();

// ── KPI row ──────────────────────────────────────────────────
export const KPIS: Kpi[] = [
  {
    id: "indexed",
    label: "Standards Indexed",
    value: "24,318",
    delta: "+124",
    deltaDirection: "up",
    deltaGood: true,
    series: [
      18.2, 18.6, 18.4, 19.1, 19.8, 20.2, 20.0, 20.9, 21.6, 22.1, 22.8, 23.4,
    ],
  },
  {
    id: "qcos",
    label: "Active QCOs",
    value: "462",
    delta: "+9",
    deltaDirection: "up",
    deltaGood: true,
    series: [380, 392, 398, 405, 411, 420, 428, 431, 444, 451, 455, 462],
  },
  {
    id: "audits",
    label: "Tenders Audited",
    value: "3,207",
    delta: "+38",
    deltaDirection: "up",
    deltaGood: true,
    series: [
      2100, 2240, 2310, 2390, 2520, 2610, 2705, 2810, 2900, 3010, 3120, 3207,
    ],
  },
  {
    id: "score",
    label: "Avg Compliance Score",
    value: "82.4",
    delta: "-1.2",
    deltaDirection: "down",
    deltaGood: false,
    series: [
      84.9, 85.1, 84.2, 84.8, 85.3, 84.6, 83.9, 84.1, 83.2, 82.9, 82.8, 82.4,
    ],
  },
];

// ── Recent tender audits ─────────────────────────────────────
export const AUDITS: TenderAudit[] = [
  {
    id: "TND-2025-0907",
    product: "Fe500D TMT Bars 500 MT — Metro Viaduct Pkg C-3",
    agency: "MMRDA, Mumbai",
    risk: "Low",
    score: 91,
    date: "08 Dec 2025",
    standardsCount: 17,
  },
  {
    id: "TND-2025-0892",
    product: "43 Grade OPC Cement 8,400 MT",
    agency: "PWD Rajasthan",
    risk: "Medium",
    score: 74,
    date: "04 Dec 2025",
    standardsCount: 12,
  },
  {
    id: "TND-2025-0877",
    product: "PVC Insulated Cables 1.1 kV, Al Conductor",
    agency: "NDMC, New Delhi",
    risk: "High",
    score: 58,
    date: "27 Nov 2025",
    standardsCount: 9,
  },
  {
    id: "TND-2025-0861",
    product: "Structural Steel Sections E250 — Foot Over Bridge",
    agency: "MES, Pune",
    risk: "Medium",
    score: 79,
    date: "21 Nov 2025",
    standardsCount: 14,
  },
  {
    id: "TND-2025-0849",
    product: "Packaged Drinking Water 20 L Jars — Plant Setup",
    agency: "CWC, Bengaluru",
    risk: "Low",
    score: 93,
    date: "15 Nov 2025",
    standardsCount: 8,
  },
  {
    id: "TND-2025-0831",
    product: "RCC Hume Pipes DN 600 — Sewerage Phase II",
    agency: "UP Jal Nigam",
    risk: "High",
    score: 61,
    date: "09 Nov 2025",
    standardsCount: 11,
  },
];

// ── Standard updates feed ────────────────────────────────────
export const UPDATES: StandardUpdate[] = [
  {
    id: "upd-1",
    severity: "mandatory",
    tag: "QCO",
    ref: "IS 1786:2008",
    title: "Steel QCO 2024 — Schedule II amended for Fe500D",
    date: "08 Dec 2025",
    summary:
      "Conformity assessment now mandatory for Fe500/Fe500D bars up to 12 mm dia. Import shipments require BIS licence from 01 Feb 2026.",
  },
  {
    id: "upd-2",
    severity: "amendment",
    tag: "AMD",
    ref: "IS 8112:2013",
    title: "Amd 4 (Aug 2021) — LOI limit revised to 4.5%",
    date: "04 Dec 2025",
    summary:
      "Loss on ignition ceiling raised from 4.0% to 4.5% with corresponding clinker ratio tracking requirements.",
  },
  {
    id: "upd-3",
    severity: "inclusion",
    tag: "NEW",
    ref: "IS 16102-1:2017",
    title: "Self-ballasted LED lamps added to CRS Schedule",
    date: "20 Nov 2025",
    summary:
      "Registration mandatory from 01 Mar 2026. Existing stock grandfathered until 31 Aug 2026.",
  },
  {
    id: "upd-4",
    severity: "draft",
    tag: "DRAFT",
    ref: "IS 456:2000",
    title: "Fifth revision draft circulated for public comment",
    date: "14 Nov 2025",
    summary:
      "Clause 6.2.3 (admixtures) and durability chapter opened for comments until 15 Jan 2026 via BIS portal.",
  },
  {
    id: "upd-5",
    severity: "mandatory",
    tag: "QCO",
    ref: "IS 694:2010",
    title: "Cable QCO enforcement for house wiring grades",
    date: "06 Nov 2025",
    summary:
      "Frangible PVC compounds under 250/440 V grade now require ISI marking; field surveillance intensified.",
  },
  {
    id: "upd-6",
    severity: "amendment",
    tag: "AMD",
    ref: "IS 383:2016",
    title: "Amd 2 — manufactured sand zone limits updated",
    date: "28 Oct 2025",
    summary:
      "M-sand fineness modulus band widened to 2.2–3.2 with silt content cap of 3% by mass.",
  },
  {
    id: "upd-7",
    severity: "inclusion",
    tag: "NEW",
    ref: "IS 1893-1:2016",
    title: "Seismic zonation data aligned to GSHAP 2025",
    date: "19 Oct 2025",
    summary:
      "Zone factor tables cross-referenced with updated national hazard maps; transition guidance issued.",
  },
];

export const NOTIFICATIONS = [
  {
    id: "n-1",
    title: "Steel QCO 2024 amended",
    body: "Fe500D up to 12 mm — licence mandatory from 01 Feb 2026.",
    date: "08 Dec",
    unread: true,
  },
  {
    id: "n-2",
    title: "IS 16102-1 added to CRS",
    body: "LED lamps — registration window opens 01 Mar 2026.",
    date: "20 Nov",
    unread: true,
  },
  {
    id: "n-3",
    title: "Audit due",
    body: "TND-2025-0907 review sign-off pending with evaluation cell.",
    date: "17 Nov",
    unread: false,
  },
  {
    id: "n-4",
    title: "Draft IS 456 revision",
    body: "Public comments open until 15 Jan 2026.",
    date: "14 Nov",
    unread: false,
  },
];

// ── Lookup helpers ───────────────────────────────────────────
export function findStandard(isNumber: string): Standard | undefined {
  return STANDARDS.find((s) => s.isNumber === isNumber);
}

export function findAudit(id: string): TenderAudit | undefined {
  return AUDITS.find((a) => a.id === id);
}
