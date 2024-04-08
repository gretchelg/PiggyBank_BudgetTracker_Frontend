import { useContext} from "react";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend,} from "recharts";
import { DataContext } from "../context/DataContext";
import { ThemeContext } from "../context/ThemeContext";
import "../App.css";
import "../components/style/Charts.css";

export default function Charts() {
    const { categories } = useContext(DataContext);
    const { styling } = useContext(ThemeContext);

    const COLORS = [
        "#C80048",
        "#3F2E56",
        "#453F78",
        "#759AAB",
        "#FFA69E",
        "#AA4465",
        "#462255",
        "#FAF2A1",
        "#9CE37D",
    ];

//Percentage labels
    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
        index,
        }) => {
            const radius = innerRadius + (outerRadius - innerRadius) * 1.5;
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
            <text
                x={x}
                y={y}
                fill={styling.txtColor}
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );

    };

    if (categories.length < 1) {
        return (
            <div
                style={{
                    border: styling.borders,
                    backgroundColor: styling.backgroundBoard,
                }}
                className="dash-graph-empty"
            >
            
                <p style={{ color: styling.txtColor }} className="empty-msg">
                    You don't have any spendings yet
                </p>
                
                <Link
                    style={{
                    color: styling.txtColor,
                    border: styling.borders,
                    backgroundColor: styling.backgroundBoard,
                    }}
                    to="/transactions"
                    className="empty-btn"
                >
                    Add now
                </Link>
            </div>
        );

    } else {
        return (
            <Link
                to="/reports"
                className="graph-progress"
                style={{
                border: styling.borders,
                backgroundColor: styling.backgroundBoard,
                }}
            >

                <div className="dash-graph">
                    <h2 style={{ color: styling.txtColor }}>Spendings</h2>
                    <p style={{ color: styling.txtColor }} className="top-spending-title">
                        Top spending :{categories[0]?.name}
                    </p>
                </div>

                <ResponsiveContainer width="100%" height={340} debounce={1}>

                    <PieChart>
                        <Legend
                            align="middle"
                            layout="horizontal"
                            iconSize={10}
                        />

                        <Pie
                            data={categories}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            label={renderCustomizedLabel}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="spent"
                            innerRadius={30}
                            paddingAngle={1}
                            legendType="circle"
                        >

                            {
                                categories?.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))
                            }
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </Link>
        );
    }
}

