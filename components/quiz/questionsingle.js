import ParseHtml from "@/layout/parseHtml";

const Single = ({ object = {}, objectData = {}, setObjectData = () => {} }) => {
	return (
		<div className="row">
			<div className={`col-lg-12 ${object?._id}`}>
				<div className="card">
					<div className="card-header">{object?.title}</div>
					<div className="card-body">
						<ParseHtml text={object?.text} />
					</div>
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
													questionanswers: object?.answers,
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
															questionanswers: object?.answers,
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
								<label htmlFor={key}>{value.text}</label>{" "}
								{/* Access the `text` property */}
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
};

export default Single;
