import { useState } from "react";

function Calculators() {
  const [active, setActive] = useState("fertilizer");

  // Fertilizer
  const [area, setArea] = useState("5");
  const [fertilizerRate, setFertilizerRate] = useState("50");

  // Seed
  const [seedArea, setSeedArea] = useState("3");
  const [seedRate, setSeedRate] = useState("25");

  // Land
  const [length, setLength] = useState("200");
  const [width, setWidth] = useState("150");

  // Profit
  const [yieldAmount, setYieldAmount] = useState("120");
  const [price, setPrice] = useState("2500");
  const [cost, setCost] = useState("140000");

  // Irrigation
  const [irrigationArea, setIrrigationArea] = useState("4");
  const [waterRate, setWaterRate] = useState("25");

  // Calculations
  const fertilizerAmount = area && fertilizerRate ? Number(area) * Number(fertilizerRate) : 0;
  const seedAmount = seedArea && seedRate ? Number(seedArea) * Number(seedRate) : 0;
  const landAreaSqFt = length && width ? Number(length) * Number(width) : 0;
  const landAreaAcres = landAreaSqFt ? (landAreaSqFt / 43560).toFixed(2) : 0;
  const revenue = yieldAmount && price ? Number(yieldAmount) * Number(price) : 0;
  const profit = revenue && cost ? revenue - Number(cost) : 0;
  const waterLiters = irrigationArea && waterRate ? Number(irrigationArea) * Number(waterRate) * 10000 : 0;

  const tabs = [
    { id: "fertilizer", label: "Fertilizer Dosage", icon: "🌱", desc: "Calculate exact NPK dosage per acre" },
    { id: "seed", label: "Seed Density", icon: "🌾", desc: "Seed requirement based on crop area" },
    { id: "land", label: "Land Area", icon: "📐", desc: "Convert dimensions to acres & sq ft" },
    { id: "profit", label: "Yield & Profit", icon: "💰", desc: "Projected revenue, costs & net profit" },
    { id: "irrigation", label: "Irrigation Volume", icon: "💧", desc: "Water volume requirements in liters" },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-neutral-200/80 pb-6 dark:border-neutral-800/80">
        <div className="flex items-center gap-2">
          <span className="text-base text-emerald-600">⊞</span>
          <h1 className="text-xl font-bold tracking-tight text-neutral-950 dark:text-white sm:text-2xl">
            Agricultural Calculators
          </h1>
        </div>
        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
          Precision calculators for fertilizer dosages, seed density requirements, and harvest profitability.
        </p>
      </div>

      {/* Calculator Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
              active === tab.id
                ? "bg-emerald-600 text-white shadow-xs dark:bg-emerald-500 dark:text-neutral-950"
                : "border border-neutral-200 bg-white text-neutral-600 hover:border-emerald-200 hover:bg-emerald-50/50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800"
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Active Calculator Box */}
      <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 md:p-8">
        {/* FERTILIZER */}
        {active === "fertilizer" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-neutral-950 dark:text-white">
                Fertilizer & NPK Dosage Calculator
              </h3>
              <p className="text-xs text-neutral-400">
                Estimate total fertilizer weight needed for your field area.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Field Area (Acres)
                </label>
                <input
                  type="number"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. 5"
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 outline-none focus:border-emerald-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Recommended Dose (kg / acre)
                </label>
                <input
                  type="number"
                  value={fertilizerRate}
                  onChange={(e) => setFertilizerRate(e.target.value)}
                  placeholder="e.g. 50"
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 outline-none focus:border-emerald-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>
            </div>

            {/* Result Card */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6 dark:border-emerald-800 dark:bg-emerald-950/30">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                Required Total Fertilizer
              </span>
              <p className="mt-1 text-3xl font-extrabold tracking-tight text-emerald-700 dark:text-emerald-400">
                {fertilizerAmount.toLocaleString()} <span className="text-lg font-normal text-emerald-600/80">kg</span>
              </p>
              <p className="mt-1 text-xs text-emerald-700/80 dark:text-emerald-400/80">
                Equivalent to ~{Math.ceil(fertilizerAmount / 50)} standard 50kg bags.
              </p>
            </div>
          </div>
        )}

        {/* SEED DENSITY */}
        {active === "seed" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-neutral-950 dark:text-white">
                Seed Requirement Calculator
              </h3>
              <p className="text-xs text-neutral-400">
                Calculate total quantity of seed needed based on sowing density.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Land Area (Acres)
                </label>
                <input
                  type="number"
                  value={seedArea}
                  onChange={(e) => setSeedArea(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 outline-none focus:border-emerald-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Seed Rate (kg / acre)
                </label>
                <input
                  type="number"
                  value={seedRate}
                  onChange={(e) => setSeedRate(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 outline-none focus:border-emerald-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6 dark:border-emerald-800 dark:bg-emerald-950/30">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                Total Seeds Required
              </span>
              <p className="mt-1 text-3xl font-extrabold tracking-tight text-emerald-700 dark:text-emerald-400">
                {seedAmount.toLocaleString()} <span className="text-lg font-normal text-emerald-600/80">kg</span>
              </p>
              <p className="mt-1 text-xs text-emerald-700/80 dark:text-emerald-400/80">
                Calculated for standard field germination percentage.
              </p>
            </div>
          </div>
        )}

        {/* LAND AREA */}
        {active === "land" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-neutral-950 dark:text-white">
                Land Dimension & Acreage Converter
              </h3>
              <p className="text-xs text-neutral-400">
                Convert rectangular plot measurements into total square feet and acres.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Plot Length (Feet)
                </label>
                <input
                  type="number"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 outline-none focus:border-emerald-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Plot Width (Feet)
                </label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 outline-none focus:border-emerald-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6 dark:border-emerald-800 dark:bg-emerald-950/30">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  Total Area (Acres)
                </span>
                <p className="mt-1 text-3xl font-extrabold tracking-tight text-emerald-700 dark:text-emerald-400">
                  {landAreaAcres} <span className="text-lg font-normal text-emerald-600/80">acres</span>
                </p>
              </div>
              <div className="rounded-2xl border border-neutral-200/80 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-800/50">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  Square Feet
                </span>
                <p className="mt-1 text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
                  {landAreaSqFt.toLocaleString()} <span className="text-lg font-normal text-neutral-500">sq ft</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* PROFIT & YIELD */}
        {active === "profit" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-neutral-950 dark:text-white">
                Crop Economics & Profitability
              </h3>
              <p className="text-xs text-neutral-400">
                Project revenue from harvest output minus cultivation expenditure.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Total Yield (Quintals)
                </label>
                <input
                  type="number"
                  value={yieldAmount}
                  onChange={(e) => setYieldAmount(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 outline-none focus:border-emerald-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Market Price per Qtl (₹)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 outline-none focus:border-emerald-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Total Cultivation Costs (₹)
                </label>
                <input
                  type="number"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 outline-none focus:border-emerald-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-neutral-200/80 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-800/50">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  Gross Revenue
                </span>
                <p className="mt-1 text-2xl font-bold tracking-tight text-neutral-950 dark:text-white">
                  ₹{revenue.toLocaleString()}
                </p>
              </div>
              <div className={`rounded-2xl border p-6 ${
                profit >= 0
                  ? "border-emerald-200 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-950/30"
                  : "border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-950/20"
              }`}>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  Estimated Net Profit
                </span>
                <p className="mt-1 text-2xl font-bold tracking-tight text-emerald-700 dark:text-emerald-400">
                  ₹{profit.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* IRRIGATION */}
        {active === "irrigation" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-neutral-950 dark:text-white">
                Irrigation Volume Calculator
              </h3>
              <p className="text-xs text-neutral-400">
                Calculate water volume needed per watering cycle.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Area to Irrigate (Acres)
                </label>
                <input
                  type="number"
                  value={irrigationArea}
                  onChange={(e) => setIrrigationArea(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 outline-none focus:border-emerald-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Depth of Water Application (mm)
                </label>
                <input
                  type="number"
                  value={waterRate}
                  onChange={(e) => setWaterRate(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 outline-none focus:border-emerald-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6 dark:border-emerald-800 dark:bg-emerald-950/30">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                Estimated Water Volume Required
              </span>
              <p className="mt-1 text-3xl font-extrabold tracking-tight text-emerald-700 dark:text-emerald-400">
                {waterLiters.toLocaleString()} <span className="text-lg font-normal text-emerald-600/80">liters</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Calculators;