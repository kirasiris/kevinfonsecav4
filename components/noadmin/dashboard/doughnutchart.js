"use client";
import { Doughnut } from "react-chartjs-2";
import ChartFrame, { legend } from "@/components/noadmin/dashboard/chartsetup";

const DoughnutChart = ({
	labels = [],
	values = [],
	colors = [],
	height = 240,
	ariaLabel = ``,
}) => {
	const data = {
		labels,
		datasets: [
			{
				data: values,
				backgroundColor: colors,
				borderWidth: 0,
				hoverOffset: 6,
			},
		],
	};

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		cutout: "68%",
		plugins: { legend },
	};

	return (
		<ChartFrame height={height} ariaLabel={ariaLabel}>
			<Doughnut data={data} options={options} />
		</ChartFrame>
	);
};

export default DoughnutChart;
