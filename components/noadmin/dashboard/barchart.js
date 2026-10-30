"use client";
import { Bar } from "react-chartjs-2";
import ChartFrame, { legend } from "@/components/noadmin/dashboard/chartsetup";

const BarChart = ({
	labels = [],
	series = [],
	stacked = false,
	horizontal = false,
	height = 300,
	ariaLabel = ``,
}) => {
	const data = {
		labels,
		datasets: series.map((s) => ({
			label: s.label,
			data: s.data,
			backgroundColor: s.color,
			borderRadius: 4,
			maxBarThickness: 36,
		})),
	};

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		indexAxis: horizontal ? "y" : "x",
		plugins: { legend: series.length > 1 ? legend : { display: false } },
		scales: {
			x: {
				stacked,
				grid: { display: horizontal },
				ticks: horizontal ? { precision: 0 } : {},
			},
			y: {
				stacked,
				beginAtZero: true,
				grid: { display: !horizontal },
				ticks: horizontal ? {} : { precision: 0 },
			},
		},
	};

	return (
		<ChartFrame height={height} ariaLabel={ariaLabel}>
			<Bar data={data} options={options} />
		</ChartFrame>
	);
};

export default BarChart;
