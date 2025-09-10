"use client";

import NothingFoundAlert from "@/layout/nothingfoundalert";
import { useMemo, useState } from "react";
import { OverlayTrigger, Tooltip, Modal, ListGroup } from "react-bootstrap";

const Timeline = ({ activities = [] }) => {
	// Group by month (e.g. "September 2025")
	const months = {};
	activities.forEach((act) => {
		const date = new Date(act.createdAt);
		const monthKey = date.toLocaleString("default", {
			month: "long",
			year: "numeric",
		});
		if (!months[monthKey]) months[monthKey] = [];
		months[monthKey].push(act);
	});

	// Sort months descending by date
	const sortedMonths = Object.keys(months).sort((a, b) => {
		const da = new Date(a),
			db = new Date(b);
		return db - da;
	});

	return (
		<div className="timeline mt-4">
			{sortedMonths.map((month) => {
				// Group this month's activities by type
				const byType = {};
				months[month].forEach((act) => {
					const type = act.type || act.text.split(" ")[0] || "Other";
					if (!byType[type]) byType[type] = [];
					byType[type].push(act);
				});

				return (
					<div key={month} className="mb-3">
						<h5>
							{month} ({months[month].length})
						</h5>
						{Object.keys(byType).map((type) => (
							<div key={type} className="mb-2">
								<strong>
									{type} ({byType[type].length}):
								</strong>
								<ListGroup className="mt-1">
									{byType[type].map((act, idx) => (
										<ListGroup.Item key={idx}>
											{new Date(act.createdAt).toLocaleDateString()}: {act.text}
										</ListGroup.Item>
									))}
								</ListGroup>
							</div>
						))}
					</div>
				);
			})}
		</div>
	);
};

const ActivityChart = ({ data = [] }) => {
	const [selectedDay, setSelectedDay] = useState(null);
	const [showModal, setShowModal] = useState(false);

	// 1. Group activities by date
	const activityByDate = useMemo(() => {
		const counts = {};
		data.forEach((item) => {
			const date = new Date(item.createdAt).toISOString().split("T")[0]; // YYYY-MM-DD
			if (!counts[date]) counts[date] = [];
			counts[date].push(item);
		});
		return counts;
	}, [data]);

	// 2. Build 52 weeks of activity
	const today = new Date();
	const weeks = [];
	const monthLabels = {};
	const yearLabels = {};

	for (let w = 0; w < 52; w++) {
		const week = [];
		for (let d = 0; d < 7; d++) {
			const day = new Date(today);
			day.setDate(today.getDate() - (w * 7 + (6 - d)));
			const dateStr = day.toISOString().split("T")[0];
			const month = day.toLocaleString("default", { month: "short" });
			const year = day.getFullYear();

			if (day.getDate() === 1) {
				monthLabels[w] = month;
			}
			if (day.getMonth() === 0 && day.getDate() <= 7) {
				// Show year at the start of January
				yearLabels[w] = year;
			}

			week.push({
				date: dateStr,
				count: activityByDate[dateStr]?.length || 0,
			});
		}
		weeks.unshift(week);
	}

	// 3. Color scale
	const getColorClass = (count) => {
		if (count === 0) return "bg-light border";
		if (count < 2) return "bg-success-subtle";
		if (count < 5) return "bg-success";
		if (count < 10) return "bg-success border";
		return "bg-success fw-bold";
	};

	// Weekday labels
	const weekdayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];

	// 4. Modal Handler
	const handleSquareClick = (date) => {
		setSelectedDay({ date, activities: activityByDate[date] || [] });
		setShowModal(true);
	};
	return (
		<>
			<div className="overflow-auto">
				{/* Year Labels */}
				<div className="d-flex mb-1" style={{ marginLeft: "30px" }}>
					{weeks.map((_, wi) => (
						<div
							key={wi}
							style={{
								width: "14px",
								marginRight: "2px",
								textAlign: "center",
								fontSize: "0.75rem",
								fontWeight: "bold",
								color: "#495057",
							}}
						>
							{yearLabels[wi] || ""}
						</div>
					))}
				</div>
				{/* Month Labels */}
				<div className="d-flex mb-1" style={{ marginLeft: "30px" }}>
					{weeks.map((_, wi) => (
						<div
							key={wi}
							style={{
								width: "14px",
								marginRight: "2px",
								textAlign: "center",
								fontSize: "0.7rem",
								color: "#6c757d",
							}}
						>
							{monthLabels[wi] || ""}
						</div>
					))}
				</div>

				{/* Chart Grid with weekday labels */}
				<div className="d-flex">
					{/* Weekday labels */}
					<div className="d-flex flex-column me-2">
						{weekdayLabels.map((label, i) => (
							<div
								key={i}
								style={{
									height: "14px",
									marginBottom: "2px",
									fontSize: "0.7rem",
									color: "#6c757d",
									textAlign: "right",
									lineHeight: "14px",
								}}
							>
								{label}
							</div>
						))}
					</div>

					{/* Chart */}
					<div className="d-flex">
						{weeks.map((week, wi) => (
							<div key={wi} className="d-flex flex-column me-1">
								{week.map((day, di) => (
									<OverlayTrigger
										key={di}
										placement="top"
										overlay={
											<Tooltip>
												{day.count} activities on {day.date}
											</Tooltip>
										}
									>
										<div
											className={`rounded-1 ${getColorClass(day.count)}`}
											style={{
												width: "14px",
												height: "14px",
												marginBottom: "2px",
												cursor: "pointer",
											}}
											onClick={() => handleSquareClick(day.date)}
										></div>
									</OverlayTrigger>
								))}
							</div>
						))}
					</div>
				</div>

				{/* Color Legend */}
				<div className="d-flex align-items-center mt-3 ms-5">
					<span
						style={{
							fontSize: "0.75rem",
							color: "#6c757d",
							marginRight: "6px",
						}}
					>
						Less
					</span>
					<div
						className="rounded-1 bg-light border me-1"
						style={{ width: "14px", height: "14px" }}
					></div>
					<div
						className="rounded-1 bg-success-subtle me-1"
						style={{ width: "14px", height: "14px" }}
					></div>
					<div
						className="rounded-1 bg-success me-1"
						style={{ width: "14px", height: "14px" }}
					></div>
					<div
						className="rounded-1 bg-success border me-1"
						style={{ width: "14px", height: "14px" }}
					></div>
					<div
						className="rounded-1 bg-success fw-bold me-1"
						style={{ width: "14px", height: "14px" }}
					></div>
					<span
						style={{ fontSize: "0.75rem", color: "#6c757d", marginLeft: "6px" }}
					>
						More
					</span>
				</div>

				{/* Modal */}
				<Modal
					show={showModal}
					onHide={() => setShowModal(!showModal)}
					backdrop={true}
					animation={true}
					size="xl"
					centered
				>
					<Modal.Header closeButton>
						<Modal.Title>Activity on {selectedDay?.date}</Modal.Title>
					</Modal.Header>
					<Modal.Body className="p-0">
						{selectedDay?.activities.length > 0 ? (
							<ul className="list-group list-group-flush">
								{selectedDay.activities.map((act) => (
									<li key={act._id} className="list-group-item">
										<p>{act.text}</p>
										<p>{new Date(act.createdAt).toLocaleString()}</p>
									</li>
								))}
							</ul>
						) : (
							<NothingFoundAlert classList="alert-dark m-0 rounded-0">
								No activity for this day
							</NothingFoundAlert>
						)}
					</Modal.Body>
					<Modal.Footer>
						<button
							className="btn btn-secondary btn-sm"
							onClick={() => setShowModal(!showModal)}
						>
							Close
						</button>
					</Modal.Footer>
				</Modal>
			</div>
			<Timeline activities={data} />
		</>
	);
};

export default ActivityChart;
