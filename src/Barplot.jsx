import * as d3 from "d3";

const data = [
  { country: "United States", students: 68, continent: "North America" },
  { country: "France", students: 21, continent: "Europe" },
  { country: "United Kingdom", students: 21, continent: "Europe" },
  { country: "Germany", students: 20, continent: "Europe" },
  { country: "Switzerland", students: 13, continent: "Europe" },
  { country: "Spain", students: 10, continent: "Europe" },
  { country: "Netherlands", students: 9, continent: "Europe" },
  { country: "India", students: 9, continent: "Asia" },
  { country: "Singapore", students: 8, continent: "Asia" },
  { country: "Ireland", students: 8, continent: "Europe" },
  { country: "Sweden", students: 7, continent: "Europe" },
  { country: "Australia", students: 7, continent: "Oceania" },
  { country: "Canada", students: 6, continent: "North America" },
  { country: "Finland", students: 5, continent: "Europe" },
  { country: "Mexico", students: 4, continent: "North America" },
  { country: "Brazil", students: 4, continent: "South America" },
  { country: "Saudi Arabia", students: 3, continent: "Asia" },
  { country: "Romania", students: 3, continent: "Europe" },
  { country: "Philippines", students: 3, continent: "Asia" },
  { country: "New Zealand", students: 3, continent: "Oceania" },
];

const width = 800;
const height = 800;
const margin = { top: 20, right: 20, bottom: 20, left: 110 };

const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

export const Barplot = ({ data: propData }) => {
  const chartData = propData ?? data;

  // D3 for math only
  const yScale = d3.scaleBand()
    .domain(chartData.map((d) => d.country))
    .range([0, innerHeight])
    .padding(0.2);

  const xScale = d3.scaleLinear()
    .domain([0, d3.max(chartData, (d) => d.students)])
    .range([0, innerWidth]);

  const continents = [...new Set(data.map((d) => d.continent))];
 
  const colorScale = d3.scaleOrdinal()
    .domain(continents)
    .range(["#595959", "#5800FF", "#e900ff", "#ffc600", "#00FFD1"]);

  const Legend = () => (
    <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", marginBottom: 12 }}>
      {continents.map((c) => (
        <div key={c} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14 }}>
          <div style={{
            width: 12, height: 12, borderRadius: 2,
            background: colorScale(c), flexShrink: 0
          }} />
          {c}
        </div>
      ))}
    </div>
  );

  return (
    <>
      <Legend />
      
      <svg viewBox={`0 0 ${width} ${height}`} width="100%">
        {/* Shift everything inside by the margin */}
        <g transform={`translate(${margin.left}, ${margin.top})`}>

          {/* Bars + value labels */}
          {chartData.map((d) => (
            <g key={d.country}>
          <path
            d={`
              M ${0},${yScale(d.country)}
              H ${xScale(d.students) - 8}
              Q ${xScale(d.students)},${yScale(d.country)}
                ${xScale(d.students)},${yScale(d.country) + 8}
              V ${yScale(d.country) + yScale.bandwidth() - 8}
              Q ${xScale(d.students)},${yScale(d.country) + yScale.bandwidth()}
                ${xScale(d.students) - 8},${yScale(d.country) + yScale.bandwidth()}
              H ${0}
              Z
            `}
            fill={colorScale(d.continent)}
          />
              {/* Value at the end of each bar */}
              <text
                x={xScale(d.students) + 4}
                y={yScale(d.country) + yScale.bandwidth() / 2}
                dominantBaseline="middle"
                fontSize={14}
                fill="#333"
              >
                {d.students}
              </text>
            </g>
          ))}

          {/* Y axis — country labels */}
          {chartData.map((d) => (
            <text
              key={d.country}
              x={-6}
              y={yScale(d.country) + yScale.bandwidth() / 2}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize={14}
              fill="#333"
            >
              {d.country}
            </text>
          ))}

        </g>
      </svg>
    </>
  );
};