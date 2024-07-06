import Image from "next/image";
import ParseHtml from "@/layout/parseHtml";

const Single = ({ object = {}, objectData = {}, setObjectData = () => {} }) => {
	return (
		<div className="row">
			<div className={`col ${object?._id}`}>
				<figure>
					<Image
						src={
							object?.files?.avatar?.location?.secure_location ||
							`https://source.unsplash.com/random/300x200`
						}
						className="img-fluid w-100 rounded-0"
						alt={`${object?.title}'s featured image`}
						width={`300`}
						height={`200`}
					/>
				</figure>
				<ParseHtml text={object?.text} />
			</div>
			<div className="col-lg-8">
				<div className="card">
					<div className="card-header">{object?.title}</div>
					<ul className="list-group list-group-flush">
						{Object.entries(object?.answers).map(([key, value]) => (
							<li key={key} className="list-group-item">
								<input
									id={key}
									name="correctAnswer"
									type="radio"
									value={key}
									onChange={() => {
										// Find existing record
										const updatedChosen = objectData.chosen.map((item) => {
											if (item.question === object?._id) {
												return {
													question: object?._id,
													correctanswer: object?.correctAnswer,
													answerbyuser: key,
												};
											}
											return item;
										});

										// Otherwise replace with new record
										const isNewQuestion = !objectData.chosen.some(
											(item) => item.question === object?._id
										);

										setObjectData({
											...objectData,
											chosen: isNewQuestion
												? [
														...updatedChosen,
														{
															question: object?._id,
															correctanswer: object?.correctAnswer,
															answerbyuser: key,
														},
												  ]
												: updatedChosen,
										});
									}}
									defaultChecked={objectData.chosen.some(
										(item) =>
											item.question === object?._id && item.answerbyuser === key
									)}
								/>
								&nbsp;
								<label htmlFor={key}>{value}</label>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
};

export default Single;
