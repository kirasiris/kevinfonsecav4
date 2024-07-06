"use client";
import { useState } from "react";
import NumericPagination from "@/layout/numericpagination";
import Single from "./questionsingle";
import { useRouter } from "next/navigation";
import { fetchurl } from "@/helpers/setTokenOnServer";

const List = ({ objects = [], params = [], searchParams = {} }) => {
	const router = useRouter();
	const [selectedOptionsData, setSelectedOptionsData] = useState({
		name: "",
		chosen: [],
	});

	const addScore = async (e) => {
		e.preventDefault();
		try {
			const res = await fetchurl(`/quizresults`, "POST", "no-cache", {
				...selectedOptionsData,
				resourceId: params.id,
				onModel: "Quiz",
			});
			router.push(
				`/quiz/${params.id}/${params.categoryid}/${params.categoryslug}/${params.slug}/results/${res?.data?._id}`
			);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		objects?.data?.length > 0 && (
			<>
				<form onSubmit={addScore}>
					{objects?.data?.map((question) => (
						<Single
							key={question._id}
							object={question}
							objectData={selectedOptionsData}
							setObjectData={setSelectedOptionsData}
						/>
					))}
					{objects?.countAll === objects?.pagination?.current && (
						<>
							<label htmlFor="name">Type your name</label>
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
							<button className="btn btn-secondary btn-sm w-100" type="submit">
								Submit
							</button>
						</>
					)}
				</form>
				<NumericPagination
					totalPages={
						objects?.pagination?.totalpages ||
						Math.ceil(objects?.data?.length / searchParams.limit)
					}
					page={searchParams.page}
					limit={1}
					keyword={searchParams.keyword}
					sortby="-createdAt"
					decrypt={false}
					siblings={1}
					postType=""
					isAdmin={false}
				/>
			</>
		)
	);
};

export default List;
