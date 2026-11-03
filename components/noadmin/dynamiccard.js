"use client";
import Link from "next/link";

const DynamicCard = ({
	colClass = `col-lg-3`,
	title = ``,
	text = ``,
	subtext = ``,
	bgcolor = ``,
	txtcolor = ``,
	myLink = "#!",
	myQuery = {},
	textClass = `display-1`,
}) => {
	return (
		<div className={`${colClass} mb-3`}>
			<div className={`card h-100 ${bgcolor} ${txtcolor}`}>
				<div className="card-header">{title}</div>
				<div className="card-body">
					<p className={`${textClass} m-0`}>{text}</p>
					{subtext && <p className="small mb-0">{subtext}</p>}
				</div>
				<div className="card-footer">
					<Link
						href={{
							pathname: myLink,
							query: myQuery,
						}}
						className="btn btn-link btn-sm"
					>
						View all
					</Link>
				</div>
			</div>
		</div>
	);
};

export default DynamicCard;
