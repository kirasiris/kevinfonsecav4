"use client";
import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { RRule } from "rrule";
import "bootstrap/dist/css/bootstrap.min.css";
import { fetchurl } from "@/helpers/setTokenOnServer";

const categoryColors = {
	low: "blue",
	medium: "green",
	urgent: "red",
};

const daysOfWeek = [
	{ id: 0, name: "Sunday" },
	{ id: 1, name: "Monday" },
	{ id: 2, name: "Tuesday" },
	{ id: 3, name: "Wednesday" },
	{ id: 4, name: "Thursday" },
	{ id: 5, name: "Friday" },
	{ id: 6, name: "Saturday" },
];

const Calendar = ({ settings = {}, isAdmin = false }) => {
	console.log(
		"Calendar settings from DB",
		settings.data.calendar.availableDays.join(", ")
	);
	const [events, setEvents] = useState([]);
	const [availableDays, setAvailableDays] = useState([1, 2, 3, 4, 5]); // Default: Monday-Friday
	const [availableTimeRange, setAvailableTimeRange] = useState({
		start: "00:00",
		end: "23:59",
	});

	const fetchEvents = async () => {
		const res = await fetchurl("/events", "GET", "no-cache");
		setEvents(
			res.data.flatMap((task) => {
				if (task.recurrenceRule) {
					// Handle recurring tasks
					const rule = RRule.fromString(task.recurrenceRule);
					return rule.all().map((date) => ({
						id: task._id,
						title: task.title,
						start: date.toISOString(),
						backgroundColor: categoryColors[task.priority],
						borderColor: categoryColors[task.priority],
					}));
				} else {
					// Ensure single-time tasks are properly added
					return {
						id: task._id,
						title: task.title,
						start: `${task.date}T${task.time}`, // Combine date and time
						backgroundColor: categoryColors[task.priority],
						borderColor: categoryColors[task.priority],
					};
				}
			})
		);
	};

	useEffect(() => {
		fetchEvents();
	}, []);

	const handleDateClick = async (info) => {
		const clickedDate = new Date(info.date);
		const dayOfWeek = clickedDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

		// Allow only Monday to Friday
		if (
			![settings?.data?.calendar?.availableDays.join(", ")].includes(dayOfWeek)
		) {
			alert("Tasks can only be added on Monday to Sunday!");
			return;
		}

		const formattedDate = clickedDate.toISOString().split("T")[0]; // Gets YYYY-MM-DD
		const dayName = clickedDate.toLocaleDateString("en-US", {
			weekday: "long",
		});
		const fullDate = `${formattedDate} ${dayName}`; // Example: "2025-03-07 Monday"

		const clickedTime = clickedDate.toTimeString().slice(0, 5); // Format HH:MM

		if (
			clickedTime < availableTimeRange.start ||
			clickedTime > availableTimeRange.end
		) {
			alert(
				`Tasks can only be added between ${availableTimeRange.start} and ${availableTimeRange.end}!`
			);
			return;
		}

		const title = prompt("Enter event title:");
		if (!title) return;

		let text = "";
		if (isAdmin) {
			text = prompt("Enter description of meeting");
		}

		const priority = prompt("Enter priority (low, medium, urgent):");
		if (!["low", "medium", "urgent"].includes(priority)) {
			alert("Invalid priority");
			return;
		}

		const recurrence = confirm("Should this task repeat weekly?");
		const recurrenceRule = recurrence
			? new RRule({
					freq: RRule.WEEKLY,
					dtstart: clickedDate,
			  }).toString()
			: null;

		const newTask = {
			title,
			fullCalendarDateFormat: clickedDate,
			day: fullDate,
			time: clickedTime,
			priority,
			recurrenceRule,
		};

		await fetchurl("/events", "POST", "default", {
			...newTask,
			attendees: [
				{
					name: process.env.NEXT_PUBLIC_WEBSITE_NAME,
					email: process.env.NEXT_PUBLIC_WEBSITE_EMAIL,
					phoneNumber: "682-375-9607",
				},
			],
			text: text || "No description",
		});

		await fetchEvents();
	};

	const toggleDayAvailability = (dayId) => {
		setAvailableDays((prevDays) =>
			prevDays.includes(dayId)
				? prevDays.filter((day) => day !== dayId)
				: [...prevDays, dayId]
		);
	};

	const handleTimeRangeChange = (e) => {
		const { name, value } = e.target;
		setAvailableTimeRange((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	return (
		<div className="container mt-4">
			<h2 className="text-center mb-4">Task Calendar</h2>

			<div className="mb-3">
				<h5>Set Available Days</h5>
				{daysOfWeek.map((day) => (
					<label key={day.id} className="me-3">
						<input
							type="checkbox"
							checked={availableDays.includes(day.id)}
							onChange={() => toggleDayAvailability(day.id)}
						/>{" "}
						{day.name}
					</label>
				))}
			</div>
			<div className="mb-3">
				<h5>Set Available Time Range</h5>
				<label className="me-2">
					Start Time:
					<input
						type="time"
						name="start"
						value={availableTimeRange.start}
						onChange={handleTimeRangeChange}
					/>
				</label>
				<label className="ms-3">
					End Time:
					<input
						type="time"
						name="end"
						value={availableTimeRange.end}
						onChange={handleTimeRangeChange}
					/>
				</label>
			</div>
			<FullCalendar
				plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
				initialView="dayGridMonth"
				headerToolbar={{
					left: "prev,next today",
					center: "title",
					right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
				}}
				events={events}
				editable
				selectable
				nowIndicator
				dateClick={handleDateClick}
				dayCellDidMount={(cell) => {
					const dayName = cell.date.getDay();
					if (
						![settings?.data?.calendar?.availableDays.join(", ")].includes(
							dayName
						)
					) {
						cell.el.style.backgroundColor = "#f0f0f0"; // Gray out
						cell.el.style.pointerEvents = "none"; // Disable clicking

						// Add tooltip
						cell.el.title =
							"Tasks can only be added on " +
							settings?.data?.calendar?.availableDays.join(", ");
					}
				}}
			/>
		</div>
	);
};

export default Calendar;
