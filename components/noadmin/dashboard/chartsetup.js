"use client";
import {
	ArcElement,
	BarElement,
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LinearScale,
	LineElement,
	PointElement,
	Tooltip,
} from "chart.js";

ChartJS.register(
	ArcElement,
	BarElement,
	CategoryScale,
	Legend,
	LinearScale,
	LineElement,
	PointElement,
	Tooltip,
);
ChartJS.defaults.font.family =
	'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif';
ChartJS.defaults.color = "#6c757d";
ChartJS.defaults.borderColor = "rgba(108, 117, 125, 0.2)";

export const legend = {
	position: "bottom",
	labels: {
		usePointStyle: true,
		pointStyle: "circle",
		boxWidth: 8,
		boxHeight: 8,
		padding: 16,
	},
};

const ChartFrame = ({ height = 300, ariaLabel = ``, children }) => {
	return (
		<div className="d-grid" style={{ gridTemplateColumns: "minmax(0, 1fr)" }}>
			<div
				className="position-relative w-100"
				style={{ height }}
				role="img"
				aria-label={ariaLabel}
			>
				{children}
			</div>
		</div>
	);
};

export default ChartFrame;
