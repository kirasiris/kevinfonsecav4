"use client";
import { Line } from "react-chartjs-2";
import ChartFrame, { legend } from "@/components/noadmin/dashboard/chartsetup";

const LineChart = ({
	labels = [],
	series = [],
	height = 300,
	ariaLabel = ``,
}) => {
	const data = {
		labels,
		datasets: series.map((s) => ({
			label: s.label,
			data: s.data,
			borderColor: s.color,
			backgroundColor: s.color,
			borderWidth: 2,
			pointRadius: 0,
			pointHoverRadius: 4,
			tension: 0.3,
		})),
	};

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		interaction: { mode: "index", intersect: false },
		plugins: { legend },
		scales: {
			x: { grid: { display: false }, ticks: { maxTicksLimit: 8 } },
			y: { beginAtZero: true, ticks: { precision: 0 } },
		},
	};

	return (
		<ChartFrame height={height} ariaLabel={ariaLabel}>
			<Line data={data} options={options} />
		</ChartFrame>
	);
};

export default LineChart;
