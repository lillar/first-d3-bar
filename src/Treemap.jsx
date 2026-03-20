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

const width = 600;
const height = 600;

// ── Color scale (shared with Barplot) ────────────────────
const continents = [...new Set(data.map((d) => d.continent))];

export const colorScale = d3.scaleOrdinal()
  .domain(continents)
  .range(["#595959", "#5800FF", "#e900ff", "#ffc600", "#00FFD1"]);


// ── Treemap ──────────────────────────────────────────────
export const Treemap = ({ data: propData }) => {
  const chartData = propData ?? data;

  // Build hierarchy: root > continent > country
  const root = d3.hierarchy({
    name: "root",
    children: continents.map((continent) => ({
      name: continent,
      children: chartData
        .filter((d) => d.continent === continent)
        .map((d) => ({ name: d.country, value: d.students })),
    })),
  }).sum((d) => d.value);

  // Compute treemap layout
  d3.treemap()
    .size([width, height])
    .padding(3)
    .paddingTop(18)   // room for continent label
    (root);

  const leaves = root.leaves();
  const continentNodes = root.children;

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%"
        style={{ display: "block", overflow: "visible", maxWidth: 1000, margin: "0 auto" }}>

        {/* Continent group backgrounds */}
        {continentNodes.map((node) => (
          <g key={node.data.name}>
            <rect
              x={node.x0}
              y={node.y0}
              width={node.x1 - node.x0}
              height={node.y1 - node.y0}
              fill={colorScale(node.data.name)}
              fillOpacity={0.12}
              rx={1}
            />
            <text
              x={node.x0 + 6}
              y={node.y0 + 12}
              fontSize={9}
              fontWeight={600}
              fill={colorScale(node.data.name)}
              style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}
            >
              {node.data.name}
            </text>
          </g>
        ))}

        {/* Country leaves */}
        {leaves.map((node) => {
          const w = node.x1 - node.x0;
          const h = node.y1 - node.y0;
          const r = Math.min(8, w / 2, h / 2);
          const continent = node.parent.data.name;

          return (
            <g key={node.data.name}>
              <path
                d={`
                  M ${node.x0},${node.y0}
                  H ${node.x1 - r}
                  Q ${node.x1},${node.y0} ${node.x1},${node.y0 + r}
                  V ${node.y1 - r}
                  Q ${node.x1},${node.y1} ${node.x1 - r},${node.y1}
                  H ${node.x0 + r}
                  Q ${node.x0},${node.y1} ${node.x0},${node.y1 - r}
                  V ${node.y0 + r}
                  Q ${node.x0},${node.y0} ${node.x0 + r},${node.y0}
                  Z
                `}
                fill={colorScale(continent)}
                fillOpacity={0.85}
              />

              {/* Only render text if the cell is wide/tall enough */}
              {w > 30 && h > 20 && (
                <text
                  x={node.x0 + w / 2}
                  y={node.y0 + h / 2 - (h > 28 ? 6 : 0)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={Math.min(11, w / 6)}
                  fill="white"
                  fontWeight={500}
                >
                  {node.data.name}
                </text>
              )}
              {w > 30 && h > 28 && (
                <text
                  x={node.x0 + w / 2}
                  y={node.y0 + h / 2 + 8}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={Math.min(10, w / 7)}
                  fill="white"
                  fillOpacity={0.8}
                >
                  {node.data.value}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};