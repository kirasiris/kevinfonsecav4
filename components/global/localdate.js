"use client";
import { useSyncExternalStore } from "react";
import { formatDateWithoutTime } from "befree-utilities";

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

const LocalDate = ({ value }) => {
	const hydrated = useSyncExternalStore(
		subscribe,
		getClientSnapshot,
		getServerSnapshot,
	);
	const date = new Date(value);
	const isValid = !Number.isNaN(date.getTime());

	return (
		<time dateTime={isValid ? date.toISOString() : undefined}>
			{hydrated
				? formatDateWithoutTime(value)
				: date.toLocaleDateString("en-US", { timeZone: "UTC" })}
		</time>
	);
};

export default LocalDate;
