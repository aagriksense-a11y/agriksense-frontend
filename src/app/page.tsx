import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import LandingNav from "@/components/landing/nav";
import { Reveal } from "@/components/landing/reveal";
import { cx } from "@/components/ui";

export const metadata: Metadata = {
  title: "Agriksense - Know the farm. Move capital.",
  description:
    "Agriksense is the intelligence layer for agricultural operations and bankable farm data.",
};

const TICKER = [
  { value: "38M+", label: "smallholders targeted" },
  { value: "$117B", label: "financing gap" },
  { value: "0-1000", label: "AgriScore" },
  { value: "WhatsApp · SMS · USSD", label: "farmer access" },
  { value: "4 layers", label: "one operating system" },
];

const PRODUCT_NAV = {
  WORKSPACE: ["Overview", "Farm network", "Telemetry", "Field teams", "Credit", "Integrations"],
  TOOLS: ["Bulk onboarding", "Reports", "Governance"],
};

const PRODUCT_KPIS = [
  { label: "Fields monitored", value: "42", delta: "+8 this month" },
  { label: "Telemetry online", value: "96%", delta: "healthy network" },
  { label: "AgriScore avg.", value: "695", delta: "+18 vs cycle" },
  { label: "Open advisories", value: "07", delta: "3 high priority" },
];

const PRODUCT_ROWS = [
  ["Block A", "74%", "Low", "742"],
  ["Block B", "68%", "Low", "711"],
  ["Block C", "51%", "Watch", "633"],
];

const TECH_CARDS = [
  {
    tag: "AERIAL · NDVI",
    img: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=80",
    alt: "Agricultural drone surveying well-structured farmland",
    title: "Drone survey",
    body: "Autonomous passes over structured blocks return crop-health maps before a problem becomes visible from the road.",
    metric: "0.8 cm resolution · weekly pass",
  },
  {
    tag: "SOIL · PROBE",
    img: "https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&w=1200&q=80",
    alt: "Soil testing device taking a root-zone reading",
    title: "Soil testing",
    body: "Field-validated probes measure moisture, pH and nutrients at the root zone  -  the ground truth behind every AgriScore.",
    metric: "71% moisture · 6.2 pH",
  },
  {
    tag: "EDGE · IOT",
    img: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1200&q=80",
    alt: "Electronic sensor node hardware for field telemetry",
    title: "Sensor node",
    body: "LoRa-powered edge nodes stream field telemetry into the command workspace from irrigation lines and block edges.",
    metric: "LoRa mesh · solar powered",
  },
  {
    tag: "FIELD · BLOCKS",
    img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80",
    alt: "Well-structured farmland laid out in GPS-aligned blocks",
    title: "Structured farmland",
    body: "Blocks laid out in GPS-aligned rows, so every parcel keeps a stable identity and a harvest history that travels with it.",
    metric: "42 fields · 186 sensor points",
  },
];

const VALUE_CARDS = [
  {
    num: "01",
    title: "For operators",
    body: "See field conditions, coordinate field officers and surface the next action before a small problem becomes a crop-loss event.",
  },
  {
    num: "02",
    title: "For cooperatives",
    body: "Onboard members, verify records and build a digital history that follows the group from season to season.",
  },
  {
    num: "03",
    title: "For banks & MFIs",
    body: "Move from informal agricultural underwriting toward verified evidence from soil, crop activity, identity and farm history.",
  },
  {
    num: "04",
    title: "For field teams",
    body: "Collect GPS-tagged readings and observations through mobile-friendly workflows built for the environments where the work actually happens.",
  },
];

const BANDS = [
  ["800-1000", "Prime · Tier A"],
  ["600-799", "Standard · Tier B"],
  ["400-599", "Building · Tier C"],
  ["0-399", "Thin file · Tier D"],
];

const ARCH_LAYERS = [
  [
    ["Platform Admin", "Web portal · governance · RBAC"],
    ["Organisation / Co-op", "Web portal · member management"],
    ["DCO / Field Agent", "Mobile web · WhatsApp"],
    ["Farmer", "WhatsApp · SMS · USSD"],
  ],
  [
    ["Core services", "User management · verification · logistics · telemetry & vision"],
    ["Decision layer", "Predictive models · advisories · AgriScore"],
    ["Persistence", "PostgreSQL warehouse · Central Base Vault"],
    ["Integrations", "NIN · CAC · WhatsApp · bank APIs"],
  ],
  [
    ["Identity", "NIN + association signals"],
    ["Telemetry", "GPS · moisture · pH · observations"],
    ["Vision", "Drone imagery · geospatial evidence"],
    ["Credit API", "0-1000 index · partner institutions"],
  ],
];

/** Shared button styles from .btn / .btn-lime / .btn-ghost */
const BTN =
  "inline-flex items-center justify-center gap-2 rounded-full px-[17px] py-[13px] text-[12px] font-[650] transition-transform duration-300 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-0.5 max-680px:w-full max-680px:px-[18px] max-680px:py-[15px]";
const BTN_LIME = "bg-lime text-[#102018]";
const BTN_GHOST = "border border-white/20 bg-white/[0.06] text-white backdrop-blur-[12px]";

/** .eyebrow overrides used on the dark sections */
const EYEBROW_DARK = "text-[#819087]";

const PULSE = "size-1.5 rounded-full bg-lime shadow-[0_0_0_7px_rgba(213,241,127,0.12)]";

const LIVE_CHIP =
  "absolute bottom-3.5 left-3.5 z-2 inline-flex items-center gap-2 rounded-full border border-white/[0.16] bg-[rgba(8,13,10,0.55)] px-3 py-[9px] font-ui-mono text-[10px] tracking-[0.08em] text-white uppercase backdrop-blur-[14px]";

export default function LandingPage() {
  return (
    <>
      <LandingNav />

      <main id="top" className="bg-paper font-sans text-ink">
        {/* HERO */}
        <section className="relative h-[100svh] max-h-[980px] min-h-[860px] overflow-hidden bg-[#0a1510] text-white max-1000px:h-auto max-1000px:max-h-none max-1000px:min-h-[900px] max-680px:min-h-[760px] max-420px:min-h-[680px]">
          <div className="hero-image absolute inset-0" />
          <video
            className="video-grade absolute inset-0 size-full object-cover opacity-[0.48]"
            autoPlay
            muted
            loop
            playsInline
            poster="/images/hero-poster.jpg"
          >
            <source
              src="https://cdn.coverr.co/videos/coverr-farming-fields-w6sspugcpx/1080p.mp4"
              type="video/mp4"
            />
          </video>
          <div className="hero-overlay absolute inset-0" />
          <div className="hero-grid absolute inset-0 opacity-[0.08]" />

          <div className="wrap relative z-20 flex h-full items-center pt-20 max-1000px:block max-1000px:pt-[105px] max-420px:pt-[90px]">
            <div className="w-[63%] pb-[30px] max-1000px:w-full max-1000px:pt-20">
              <div className="inline-flex items-center gap-[9px] rounded-full border border-white/15 bg-white/[0.06] px-[11px] py-2 text-[10px] tracking-[0.13em] text-white/[0.72] uppercase backdrop-blur-[15px] max-420px:px-2.5 max-420px:py-[7px] max-420px:text-[9px]">
                <span className={PULSE} /> Agricultural intelligence infrastructure
              </div>
              <h1 className="my-[25px] mb-[26px] max-w-[900px] text-[clamp(66px,8.5vw,122px)] leading-[0.87] font-semibold tracking-[-0.085em] max-680px:text-[58px] max-420px:mt-[22px] max-420px:mb-6 max-420px:text-[52px]">
                Know the farm.
                <br />
                <span className="text-lime">Move capital.</span>
              </h1>
              <p className="m-0 max-w-[650px] text-[16px] leading-[1.62] text-white/[0.63] max-680px:text-[14px] max-420px:text-[13px] max-420px:leading-[1.58]">
                Agriksense connects what is happening in the field to the decisions that happen next
                {"  -  "}operations, agronomy and agricultural finance.
              </p>
              <div className="mt-7 flex flex-wrap gap-[9px] max-680px:flex-col max-680px:items-stretch">
                <Link href="#platform" className={cx(BTN, BTN_LIME)}>
                  Explore the platform ↗
                </Link>
                <Link href="mailto:hello@raoatech.com" className={cx(BTN, BTN_GHOST)}>
                  Partner with us
                </Link>
              </div>
              <div className="mt-[17px] text-[10px] text-white/[0.36]">
                Incubated in the Raoatech Venture Studio · Yaba, Lagos
              </div>
            </div>

            <div className="absolute right-0 bottom-[10%] z-20 w-[42%] max-1000px:relative max-1000px:right-auto max-1000px:bottom-auto max-1000px:mt-[30px] max-680px:hidden">
              <div className="relative h-[360px] max-1000px:h-[270px]">
                <div className="absolute top-1/2 left-1/2 size-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-lime/[0.18] max-1000px:size-[350px]" />
                <div className="absolute top-1/2 left-1/2 size-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-lime/[0.18]" />
                <div className="absolute top-1/2 left-1/2 size-[210px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-lime/[0.18]" />
                <div className="absolute top-1/2 left-1/2 grid size-[78px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-lime/50 bg-lime/10 shadow-[0_0_70px_rgba(213,241,127,0.15)]">
                  <span className="size-3.5 rounded-full bg-lime shadow-[0_0_0_12px_rgba(213,241,127,0.08)]" />
                </div>
                {[
                  { cls: "top-[8%] left-[3%]", small: "soil moisture", strong: "71%", note: "LIVE" },
                  { cls: "top-[30%] right-0", small: "canopy stress", strong: "Low", note: "+2.4" },
                  { cls: "bottom-[6%] left-[13%]", small: "soil pH", strong: "6.2", note: "stable" },
                  { cls: "right-[14%] bottom-0", small: "AgriScore", strong: "695", note: "/ 1000" },
                ].map((node) => (
                  <div
                    key={node.small}
                    className={cx(
                      "absolute rounded-[13px] border border-white/[0.16] bg-[rgba(8,16,11,0.58)] px-3 py-2.5 min-w-[118px] backdrop-blur-[14px]",
                      node.cls,
                    )}
                  >
                    <small className="block font-ui-mono text-[9px] tracking-[0.08em] text-[#85928a] uppercase">
                      {node.small}
                    </small>
                    <strong className="mt-1 block text-[15px] tracking-[-0.03em]">
                      {node.strong} <b className="ml-1 text-[9px] text-lime">{node.note}</b>
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* TICKER */}
        <div className="overflow-hidden border-y border-white/[0.07] bg-[#0a110d] text-[#9aa79f]">
          <div className="animate-marquee flex w-max">
            {[0, 1].map((copy) => (
              <div key={copy} className="contents" aria-hidden={copy === 1}>
                {TICKER.map((item) => (
                  <div
                    key={`${copy}-${item.value}`}
                    className="px-[30px] py-[17px] font-ui-mono text-[10px] tracking-[0.12em] whitespace-nowrap uppercase max-420px:px-[22px] max-420px:py-[14px] max-420px:text-[9px]"
                  >
                    <b className="font-medium text-lime">{item.value}</b> {item.label}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* INTRO / PLATFORM */}
        <section id="platform" className="section-pad bg-white">
          <div className="wrap grid grid-cols-[0.7fr_1.3fr] gap-[90px] max-1000px:grid-cols-1 max-1000px:gap-[45px]">
            <Reveal className="relative">
              <span className="eyebrow">The platform</span>
              <div className="relative mt-[46px] h-[540px] max-1000px:h-[480px] max-680px:mt-7 max-680px:h-[360px] max-420px:mt-6 max-420px:h-[320px]">
                <div className="absolute top-0 right-[4%] bottom-0 left-0 overflow-hidden rounded-[26px] shadow-[0_30px_70px_rgba(22,47,32,0.16)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/collage-main.jpg"
                    alt="Aerial view of structured farmland"
                    loading="lazy"
                    className="photo-grade size-full object-cover"
                  />
                  <span className={LIVE_CHIP}>
                    <i className={PULSE} />
                    192 fields mapped · LIVE
                  </span>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=800&q=80"
                  alt="Field blocks across the season"
                  loading="lazy"
                  className="absolute right-0 bottom-[9%] aspect-[4/3] w-[46%] rotate-[2.5deg] rounded-[18px] border-[6px] border-white object-cover shadow-[0_22px_50px_rgba(22,47,32,0.24)] max-680px:border-4"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&w=800&q=80"
                  alt="Crop canopy close-up"
                  loading="lazy"
                  className="absolute top-[8%] -left-[9%] aspect-[4/3] w-[40%] -rotate-[2.5deg] rounded-[18px] border-[6px] border-white object-cover shadow-[0_22px_50px_rgba(22,47,32,0.24)] max-1000px:-left-[3%] max-680px:hidden"
                />
              </div>
            </Reveal>
            <div>
              <Reveal
                as="p"
                className="m-0 max-w-[800px] text-[clamp(36px,4.4vw,62px)] leading-none tracking-[-0.07em] max-680px:text-[38px] max-420px:text-[34px] max-420px:leading-[1.08]"
              >
                The farm is full of signals. <em className="text-[#89938c] not-italic">Agriksense makes them useful.</em>
              </Reveal>
              <div className="mt-[75px] grid grid-cols-2 gap-[35px] max-1000px:mt-[45px] max-680px:grid-cols-1">
                {[
                  ["38M+", "smallholders are the long-term network opportunity across Sub-Saharan Africa."],
                  ["$117B", "agricultural financing gap the platform is designed to help address."],
                ].map(([value, copy]) => (
                  <Reveal key={value} className="border-t border-line pt-[17px]">
                    <strong className="text-[50px] leading-none tracking-[-0.065em] max-680px:text-[44px] max-420px:text-[40px]">
                      {value}
                    </strong>
                    <p className="mt-2.5 mb-0 max-w-[250px] text-[12px] leading-[1.55] text-muted">{copy}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PRODUCT / FIELD COMMAND */}
        <section id="network" className="section-pad bg-paper">
          <div className="wrap">
            <Reveal className="max-w-[850px]">
              <span className="eyebrow">Field command</span>
              <h2 className="my-[18px] text-[clamp(48px,6vw,82px)] leading-[0.93] font-semibold tracking-[-0.075em] max-680px:text-[47px] max-420px:text-[42px]">
                One operating picture.
                <br />
                From the ground up.
              </h2>
              <p className="max-w-[630px] text-[15px] leading-[1.7] text-muted">
                Field telemetry, aerial observations, farm records and identity signals converge into
                one workspace for teams that need to know what is happening now.
              </p>
            </Reveal>

            <Reveal className="mt-[70px] rounded-[32px] border border-[#d9ded8] bg-[#e8ede7] p-2.5 shadow-[0_35px_100px_rgba(22,47,32,0.08)] max-680px:mt-[35px] max-680px:rounded-[22px] max-680px:p-[7px] max-420px:rounded-lg max-420px:p-1.5">
              <div className="overflow-hidden rounded-[24px] border border-[#dce2dc] bg-white max-680px:rounded-[17px]">
                <div className="flex h-[55px] items-center justify-between border-b border-[#e5e9e5] px-[18px]">
                  <div className="text-[12px] font-bold tracking-[-0.03em]">
                    Agriksense <span className="ml-2 font-medium text-[#9aa39d]">/ Operations</span>
                  </div>
                  <div className="font-ui-mono text-[9px] text-[#55715d]">● ALL SYSTEMS NOMINAL</div>
                </div>
                <div className="grid min-h-[600px] grid-cols-[180px_1fr] max-1000px:grid-cols-[145px_1fr] max-680px:grid-cols-1">
                  <aside className="border-r border-[#e6eae5] bg-[#f7f9f6] p-[18px_12px] max-680px:hidden">
                    <div className="px-2.5 pt-[7px] pb-[11px] font-ui-mono text-[9px] text-[#a0a9a3]">WORKSPACE</div>
                    {PRODUCT_NAV.WORKSPACE.map((item, i) => (
                      <a
                        key={item}
                        href="#network"
                        className={cx(
                          "mb-0.5 block rounded-lg p-2.5 text-[10px]",
                          i === 0 ? "bg-[#e6eee4] font-[650] text-[#194e37]" : "text-[#7a857d]",
                        )}
                      >
                        {item}
                      </a>
                    ))}
                    <div className="mt-5 px-2.5 pt-[7px] pb-[11px] font-ui-mono text-[9px] text-[#a0a9a3]">TOOLS</div>
                    {PRODUCT_NAV.TOOLS.map((item) => (
                      <a key={item} href="#network" className="mb-0.5 block rounded-lg p-2.5 text-[10px] text-[#7a857d]">
                        {item}
                      </a>
                    ))}
                  </aside>
                  <div className="p-[25px] max-680px:p-[13px]">
                    <div className="flex items-end justify-between max-420px:block">
                      <div>
                        <h3 className="m-0 text-[20px] tracking-[-0.045em]">Farm network</h3>
                        <p className="mt-[5px] mb-0 text-[10px] text-[#8b958e]">
                          42 fields · 186 sensor points · 12 field officers
                        </p>
                      </div>
                      <div className="rounded-lg border border-[#e1e6e1] px-2.5 py-2 text-[9px] text-[#727d75] max-420px:mt-2.5 inline-block">
                        Today · 09:42
                      </div>
                    </div>
                    <div className="my-[22px] mb-2.5 grid grid-cols-4 gap-[9px] max-1000px:grid-cols-2 max-680px:gap-[7px] max-420px:grid-cols-1 max-420px:gap-1.5">
                      {PRODUCT_KPIS.map((kpi) => (
                        <div key={kpi.label} className="rounded-[13px] border border-[#e2e7e2] p-[13px] max-680px:p-2.5">
                          <small className="block text-[8px] tracking-[0.08em] text-[#8a948d] uppercase">
                            {kpi.label}
                          </small>
                          <strong className="mt-[7px] block text-[21px] tracking-[-0.05em] max-680px:text-[18px]">
                            {kpi.value}
                          </strong>
                          <span className="mt-1 block text-[8px] text-[#4d8156]">{kpi.delta}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2.5 grid grid-cols-[1.3fr_0.7fr] gap-2.5 max-1000px:grid-cols-1">
                      <div className="rounded-2xl border border-[#e2e7e2] bg-white p-[13px]">
                        <div className="mb-2.5 flex items-center justify-between text-[9px] text-[#7c877f]">
                          <span>FIELD COVERAGE</span>
                          <span className="font-mono">LIVE</span>
                        </div>
                        <div className="mapbox relative h-[270px] overflow-hidden rounded-xl max-680px:h-[220px]">
                          <div className="absolute bottom-2.5 left-2.5 z-2 rounded-[7px] bg-white/75 px-2 py-1.5 font-ui-mono text-[8px] text-[#486050] backdrop-blur-[8px]">
                            6.5244° N · 3.3792° E · NORTH CLUSTER
                          </div>
                        </div>
                      </div>
                      <div className="rounded-2xl border border-[#e2e7e2] bg-[#0d1712] p-3.5 text-white">
                        <div className="mb-2.5 flex items-center justify-between text-[9px] text-[#8b9a91]">
                          <span>AGRISCORE</span>
                          <span>BAND B</span>
                        </div>
                        <div className="mt-[65px] text-[72px] leading-[0.9] tracking-[-0.08em]">
                          695 <span className="text-[10px] tracking-normal text-[#819087]">/ 1000</span>
                        </div>
                        <div className="score-line my-5 mb-[15px] h-1.5 rounded-full" />
                        <div className="border-t border-white/10 pt-3 text-[10px] leading-[1.55] text-[#a0aca5]">
                          <b className="text-white">Standard</b>
                          <br />
                          Based on field telemetry, verified identity, crop activity and historical
                          performance.
                        </div>
                      </div>
                    </div>
                    <div className="mt-2.5 overflow-hidden rounded-2xl border border-[#e2e7e2] bg-white">
                      <div className="grid grid-cols-[1.3fr_1fr_1fr_1fr] border-b border-[#edf0ed] bg-[#f7f9f6] px-[13px] py-[11px] font-ui-mono text-[8px] tracking-[0.07em] text-[#919b94] uppercase">
                        <span>Field</span>
                        <span>Moisture</span>
                        <span>Stress</span>
                        <span>Score</span>
                      </div>
                      {PRODUCT_ROWS.map((row) => (
                        <div
                          key={row[0]}
                          className="grid grid-cols-[1.3fr_1fr_1fr_1fr] border-t border-[#edf0ed] px-[13px] py-[11px] text-[9px] text-[#69746d]"
                        >
                          {row.map((cell) => (
                            <span key={cell}>{cell}</span>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* FIELD TECH */}
        <section id="field" className="section-pad overflow-hidden bg-[#0b110e] text-white">
          <div className="wrap grid grid-cols-[0.8fr_1.2fr] items-start gap-[60px] max-1000px:grid-cols-1 max-1000px:gap-[45px]">
            <Reveal className="sticky top-[120px] max-1000px:static">
              <span className={cx("eyebrow", EYEBROW_DARK)}>In the field</span>
              <h2 className="my-5 mb-[20px] mt-[20px] text-[clamp(48px,6vw,80px)] leading-[0.93] tracking-[-0.075em] max-420px:text-[42px]">
                Hardware in the ground.
                <br />
                Sky in the picture.
              </h2>
              <p className="max-w-[440px] text-[15px] leading-[1.7] text-[#89968e]">
                Agriksense pairs structured farmland with the instruments that make it legible  -
                {" "}
                drones for the whole block, probes for the root zone and edge nodes for the record.
              </p>
            </Reveal>
            <div className="grid grid-cols-2 gap-3.5 max-680px:grid-cols-1 max-420px:gap-3">
              {TECH_CARDS.map((card) => (
                <Reveal
                  as="article"
                  key={card.title}
                  className="group overflow-hidden rounded-[22px] border border-white/10 bg-[#0e1712] transition-[transform,border-color] duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-[5px] hover:border-lime/40 max-420px:rounded-[18px]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden max-680px:aspect-[16/10]">
                    <span className="absolute top-3 left-3 z-2 rounded-full border border-white/[0.14] bg-[rgba(8,16,11,0.55)] px-2.5 py-[7px] font-ui-mono text-[9px] tracking-[0.1em] text-[#e5f1da] backdrop-blur-[12px] max-420px:px-[9px] max-420px:text-[8px]">
                      {card.tag}
                    </span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={card.img}
                      alt={card.alt}
                      loading="lazy"
                      className="shot-grade size-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105"
                    />
                  </div>
                  <div className="px-5 pt-[18px] pb-5 max-420px:px-[17px] max-420px:pt-3.5 max-420px:pb-[18px]">
                    <strong className="block text-[15px] tracking-[-0.025em] max-420px:text-[14px]">{card.title}</strong>
                    <span className="mt-1.5 block max-w-[400px] text-[11px] leading-[1.6] text-[#819087] max-420px:text-[10px]">
                      {card.body}
                    </span>
                    <span className="mt-1.5 block max-w-[400px] border-t border-white/[0.12] pt-3 font-ui-mono text-[11px] leading-[1.6] text-[#819087] max-420px:text-[10px]">
                      {card.metric}
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* VALUE */}
        <section id="solutions" className="section-pad bg-[#0b110e] text-white">
          <div className="wrap grid grid-cols-[0.8fr_1.2fr] items-start gap-[100px] max-1000px:grid-cols-1 max-1000px:gap-[55px]">
            <Reveal>
              <span className={cx("eyebrow", EYEBROW_DARK)}>Why Agriksense</span>
              <h2 className="my-5 mb-[20px] mt-[20px] text-[clamp(48px,6vw,80px)] leading-[0.93] tracking-[-0.075em] max-680px:text-[47px] max-420px:text-[42px]">
                Not another app.
                <br />
                A data layer.
              </h2>
              <p className="max-w-[500px] text-[15px] leading-[1.7] text-[#89968e]">
                Farmers can keep the channels they already use. Institutions get a system that makes
                the farm legible.
              </p>
            </Reveal>
            <div className="grid gap-px border border-white/[0.09] bg-white/[0.09]">
              {VALUE_CARDS.map((card) => (
                <Reveal
                  as="article"
                  key={card.num}
                  className="grid min-h-[190px] grid-cols-[65px_1fr] gap-5 bg-[#0b110e] p-[27px] transition-colors hover:bg-[#101a14] max-680px:grid-cols-[40px_1fr] max-680px:p-[22px] max-420px:grid-cols-1 max-420px:gap-3 max-420px:p-5 max-420px:text-left"
                >
                  <div className="font-ui-mono text-[10px] text-[#6d7c73] max-420px:mb-0">{card.num}</div>
                  <div>
                    <h3 className="mb-2 mt-0 text-[25px] tracking-[-0.05em] max-680px:text-[22px]">{card.title}</h3>
                    <p className="m-0 max-w-[500px] text-[12px] leading-[1.65] text-[#7e8d83]">{card.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CREDIT */}
        <section id="credit" className="section-pad bg-white">
          <div className="wrap grid grid-cols-2 items-center gap-[90px] max-1000px:grid-cols-1 max-1000px:gap-[45px]">
            <Reveal>
              <span className="eyebrow">Credit infrastructure</span>
              <h2 className="my-[18px] text-[clamp(48px,5.5vw,74px)] leading-[0.93] tracking-[-0.07em] max-680px:text-[47px] max-420px:text-[42px]">
                Bankable profiles, generated from the soil up.
              </h2>
              <p className="max-w-[520px] text-[15px] leading-[1.7] text-muted">
                AgriScore turns verified field evidence into a 0-1000 index for partner institutions.
                Every new telemetry event can make the profile more current.
              </p>
              <div className="mt-7 grid gap-3">
                {[
                  "Profiles tied to NIN and association membership records.",
                  "Input vouchers redeemable against certified suppliers.",
                  "Advisory history becomes part of the evidence trail.",
                ].map((line) => (
                  <div key={line} className="flex gap-2.5 text-[12px] leading-[1.5]">
                    <i className="grid size-5 shrink-0 place-items-center rounded-full bg-[#e5f0d7] text-[10px] text-[#416d37] not-italic">
                      ✓
                    </i>
                    <span>{line}</span>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal className="relative min-h-[520px] overflow-hidden rounded-[30px] bg-[#0b110e] text-white">
              <div className="relative h-[225px] overflow-hidden max-680px:h-[180px] max-420px:h-40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/farmer-profile.jpg"
                  alt="Farmer in a field reviewing the season with harvested produce"
                  loading="lazy"
                  className="photo-grade size-full object-cover"
                />
                <span className={LIVE_CHIP}>
                  <i className={PULSE} />
                  Verified identity · NIN linked
                </span>
              </div>
              <div className="credit-glow relative p-[30px_34px_34px] max-680px:p-[25px_25px_26px] max-420px:p-[22px_22px_24px]">
                <span className={cx("eyebrow", EYEBROW_DARK)}>LIVE EXAMPLE · AGRISCORE</span>
                <div className="mt-[90px] text-[125px] leading-[0.82] tracking-[-0.09em] max-680px:mt-[65px] max-680px:text-[90px] max-420px:mt-[50px] max-420px:text-[75px]">
                  695 <span className="text-[12px] tracking-normal text-[#78877e]">/ 1000</span>
                </div>
                <div className="score-line mt-[27px] h-[9px] rounded-full" />
                <div className="mt-[22px] grid grid-cols-2 gap-2 max-420px:grid-cols-1">
                  {BANDS.map(([range, name]) => (
                    <div key={range} className="rounded-xl border border-white/10 p-3 text-[9px] text-[#829087]">
                      <b className="mb-1 block text-[11px] text-white">{range}</b>
                      {name}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ARCHITECTURE */}
        <section id="architecture" className="section-pad bg-[#eef2ed]">
          <div className="wrap grid grid-cols-[0.65fr_1.35fr] gap-[80px] max-1000px:grid-cols-1 max-1000px:gap-[45px]">
            <Reveal className="sticky top-[120px] h-max min-w-0 max-1000px:static">
              <span className="eyebrow">Architecture</span>
              <h2 className="my-[18px] text-[clamp(48px,5.5vw,74px)] leading-[0.93] tracking-[-0.07em] max-680px:text-[47px] max-420px:text-[42px]">
                One network.
                <br />
                Every access point.
              </h2>
              <p className="text-[14px] leading-[1.7] text-muted">
                Different people use different interfaces. The underlying data stays connected:
                platform admins, organisations, field agents and farmers.
              </p>
            </Reveal>
            <Reveal className="min-w-0 rounded-[30px] border border-[#dce2dc] bg-white p-4 shadow-[0_25px_70px_rgba(20,42,29,0.07)] max-680px:p-[7px] max-420px:rounded-lg max-420px:p-1.5">
              <div className="dotted-canvas relative min-h-[550px] overflow-hidden rounded-[21px] p-5 max-680px:overflow-auto max-680px:p-2.5 max-420px:p-2.5">
                {ARCH_LAYERS.map((layer, layerIndex) => (
                  <div key={layerIndex}>
                    <div className="relative z-2 grid min-w-0 grid-cols-4 gap-2 max-680px:w-max max-680px:grid-cols-[repeat(4,170px)] max-420px:grid-cols-[repeat(4,155px)]">
                      {layer.map(([title, sub]) => (
                        <div
                          key={title}
                          className="min-h-[105px] rounded-[15px] border border-[#d9e1da] bg-white/85 p-[13px] backdrop-blur-[10px] max-420px:min-h-[95px] max-420px:p-[11px]"
                        >
                          <strong className="block text-[10px] max-420px:text-[9px]">{title}</strong>
                          <small className="mt-[7px] block text-[8px] leading-[1.5] text-[#7d887f] max-420px:text-[7px]">
                            {sub}
                          </small>
                        </div>
                      ))}
                    </div>
                    {layerIndex < ARCH_LAYERS.length - 1 ? (
                      <div className="relative h-[75px] max-680px:w-[680px]">
                        <div className="absolute top-[37px] right-[10%] left-[10%] border-t border-dashed border-[#9ba69f]" />
                        {[0, 1, 2].map((i) => (
                          <i
                            key={i}
                            className="animate-flow absolute top-[33px] size-2 rounded-full bg-green"
                            style={{ animationDelay: `${i * 1.1}s` }}
                          />
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* CTA */}
        <section id="company" className="bg-[#0b110e] px-0 py-[130px] text-white max-680px:py-[90px]">
          <div className="wrap">
            <Reveal className="cta-surface flex items-end justify-between gap-[35px] rounded-[34px] border border-white/10 p-[65px] max-1000px:block max-680px:rounded-[26px] max-680px:p-[35px_25px] max-420px:p-[28px_22px]">
              <div>
                <span className={cx("eyebrow", EYEBROW_DARK)}>Agriksense</span>
                <h2 className="mt-[18px] mb-0 max-w-[850px] text-[clamp(50px,6vw,82px)] leading-[0.9] tracking-[-0.08em] max-680px:text-[48px] max-420px:text-[40px]">
                  Make your farm network visible to the people who need to act on it.
                </h2>
              </div>
              <Link href="mailto:hello@raoatech.com" className={cx(BTN, BTN_LIME)}>
                Talk to the innovation lab ↗
              </Link>
            </Reveal>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer id="contact" className="border-t border-white/[0.07] bg-[#080d0a] pt-[65px] pb-[22px] text-white max-420px:pt-[50px] max-420px:pb-[18px]">
        <div className="wrap">
          <div className="grid grid-cols-2 gap-20 pb-15 max-680px:grid-cols-1 max-680px:gap-10">
            <div>
              <Link
                href="#top"
                className="flex items-center gap-2.5 text-[20px] font-bold tracking-[-0.045em] max-420px:text-[15px]"
              >
                <Image
                  src="/images/logo/logo-light.png"
                  alt="Agriksense"
                  width={1320}
                  height={750}
                  className="h-[58px] w-auto max-w-[240px] rounded-xl bg-white/5 object-contain p-1.5"
                />
              </Link>
              <p className="max-w-[310px] text-[12px] leading-[1.6] text-[#69766e] max-420px:text-[11px]">
                Intelligent farm data for precision agriculture and bankable digital credit across
                Africa.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-[30px] max-680px:grid-cols-2 max-420px:grid-cols-1">
              {[
                ["Platform", [["Overview", "#platform"], ["Field command", "#network"], ["In the field", "#field"], ["Credit", "#credit"]]],
                ["Company", [["Architecture", "#architecture"], ["Contact", "mailto:hello@raoatech.com"], ["Back to top", "#top"]]],
                ["Direct", [["hello@raoatech.com", "mailto:hello@raoatech.com"], ["+234 809 722 7051", "tel:+2348097227051"]]],
              ].map(([heading, links]) => (
                <div key={heading as string}>
                  <b className="font-ui-mono text-[9px] font-normal tracking-[0.12em] text-[#6f7b74] uppercase">{heading as string}</b>
                  {(links as string[][]).map(([label, href]) => (
                    <Link
                      key={label}
                      href={href}
                      className="mt-[13px] block text-[11px] text-[#a0aaa3] max-420px:mt-[11px] max-420px:text-[10px]"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between border-t border-white/[0.07] pt-[18px] text-[9px] text-[#56615a] max-680px:block">
            <span className="max-680px:mt-2 max-680px:block">© 2026 Raoatech IT-Electromech Limited.</span>
            <span className="max-680px:mt-2 max-680px:block">Yaba, Lagos, Nigeria</span>
          </div>
        </div>
      </footer>
    </>
  );
}
