"use client";
import Link from "next/link";

const DynamicCards = ({
	title = ``,
	text = ``,
	bgcolor = ``,
	txtcolor = ``,
	myLink = "#!",
	myQuery = {},
}) => {
	return (
		<div className="col-lg-3 mb-3">
			<div className={`card ${bgcolor} ${txtcolor}`}>
				<div className="card-header">{title}</div>
				<div className="card-body">
					<p className="display-1 m-0">{text}</p>
				</div>
				<div className="card-footer">
					<Link
						href={{
							pathname: myLink,
							query: myQuery,
						}}
						passHref
						legacyBehavior
					>
						<a className="btn btn-link btn-sm">View all</a>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default DynamicCards;
