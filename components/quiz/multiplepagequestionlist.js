"use client";
import { useEffect, useState } from "react";
import NumericPagination from "@/layout/numericpagination";
import Single from "./questionsingle";
import { useRouter } from "next/navigation";
import { fetchurl } from "@/helpers/setTokenOnServer";

const List = ({
	object = {},
	objects = [],
	params = [],
	searchParams = {},
}) => {
	const router = useRouter();
	const [selectedOptionsData, setSelectedOptionsData] = useState({
		name: "",
		email: "",
		chosen: [],
	});

	const [timer, setTimer] = useState(object.data.duration);
	const [secondsLeft, setSecondsLeft] = useState(0);
	const [timesUp, setTimesUp] = useState(false);

	const formatTime = (totalSeconds) => {
		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const seconds = totalSeconds % 60;

		return `${hours.toString().padStart(2, "0")}:${minutes
			.toString()
			.padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
	};

	useEffect(() => {
		setTimer(timer * 3600);
		const interval = setInterval(() => {
			setTimer((prevTimer) => {
				if (prevTimer > 0) {
					setSecondsLeft(prevTimer - 1); // Update secondsLeft based on previous timer value
					return prevTimer - 1; // Update timer value correctly
				} else {
					setTimesUp(true);
					clearInterval(interval); // Stop the interval when timer reaches 0
					return 0;
				}
			});
		}, 1000);

		return () => clearInterval(interval); // Cleanup interval on component unmount
	}, []);

	const addScore = async (e) => {
		e.preventDefault();
		try {
			const res = await fetchurl(`/quizresults`, "POST", "no-cache", {
				...selectedOptionsData,
				resourceId: params.id,
				onModel: "Quiz",
				website: "beFree",
			});
			router.push(`/quiz/results/${res?.data?._id}`);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		objects?.data?.length > 0 && (
			<>
				<h2>
					Time&nbsp;left(in HH:MM:SS)&nbsp;-&nbsp;{formatTime(secondsLeft)}
				</h2>
				<form onSubmit={addScore}>
					{objects?.data?.map((question) => (
						<Single
							key={question._id}
							object={question}
							objectData={selectedOptionsData}
							setObjectData={setSelectedOptionsData}
						/>
					))}
					{objects?.pagination?.current === 1 && (
						<>
							<h1>
								My brother in Christ, please enter your name before continuing
								with the following question!
							</h1>
							<div className="row g-2">
								<div className="col-md">
									<div className="form-floating">
										<input
											id="name"
											name="name"
											className="form-control mb-3"
											type="text"
											onChange={(e) => {
												setSelectedOptionsData({
													...selectedOptionsData,
													name: e.target.value,
												});
											}}
											value={selectedOptionsData.name}
										/>
										<label htmlFor="name">Type&nbsp;your&nbsp;name</label>
									</div>
								</div>
								<div className="col-md">
									<div className="form-floating">
										<input
											id="email"
											name="email"
											className="form-control mb-3"
											type="email"
											onChange={(e) => {
												setSelectedOptionsData({
													...selectedOptionsData,
													email: e.target.value,
												});
											}}
											value={selectedOptionsData.email}
										/>
										<label htmlFor="email">Type&nbsp;your&nbsp;email</label>
									</div>
								</div>
							</div>
						</>
					)}
					{objects?.countAll === objects?.pagination?.current && (
						<button
							className="btn btn-secondary btn-sm w-100 mt-3"
							type="submit"
							disabled={
								selectedOptionsData.name.length > 0 &&
								selectedOptionsData.email.length > 0
									? !true
									: !false
							}
						>
							Submit
						</button>
					)}
				</form>
				<NumericPagination
					totalPages={
						objects?.pagination?.totalpages ||
						Math.ceil(objects?.data?.length / searchParams.limit)
					}
					searchParams={searchParams}
					siblings={1}
				/>
			</>
		)
	);
};

export default List;
