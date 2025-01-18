"use client";

const UseProgress = ({ percentage }) => {
	return (
		<div className={`progress mb-3`}>
			<div
				className={`progress-bar progress-bar-striped bg-success`}
				role={`progressbar`}
				style={{ width: `${percentage}%` }}
			>
				{percentage}%
			</div>
		</div>
	);
};

export default UseProgress;
