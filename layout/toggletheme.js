"use client";
import { useEffect, useState } from "react";

const Toggletheme = () => {
	const [appearanceData, setAppearanceData] = useState({
		themeColor: "ligth-mode",
	});

	let { themeColor } = appearanceData;

	useEffect(() => {
		const newColor = localStorage.getItem("themeColor");
		if (newColor !== undefined && newColor !== null) {
			document.body.classList.add(newColor);
			setAppearanceData({
				themeColor: newColor,
			});
		}
	}, []);

	const changeTheme = (color) => {
		if (color === "dark-mode") {
			localStorage.setItem("themeColor", color);
			document.body.classList.remove(`ligth-mode`);
			document.body.classList.add(`${color}`);
			setAppearanceData({
				themeColor: color,
			});
		}
		if (color === "ligth-mode") {
			localStorage.setItem("themeColor", color);
			document.body.classList.remove(`dark-mode`);
			document.body.classList.add(`${color}`);
			setAppearanceData({
				themeColor: color,
			});
		}
	};

	return (
		<button
			className="btn btn-secondary btn-sm"
			onClick={() =>
				changeTheme(themeColor === "ligth-mode" ? "dark-mode" : "ligth-mode")
			}
			type="button"
		>
			{themeColor === `ligth-mode` ? <>🌞</> : <>🌕</>}
		</button>
	);
};

export default Toggletheme;
