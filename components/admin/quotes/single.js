import DropdownButton from "react-bootstrap/DropdownButton";
import Link from "next/link";
import DeleteModal from "@/layout/deletemodal";

const Single = ({
	object = {},
	handleDelete,
	quotes,
	setQuotes,
	setTotalResults,
}) => {
	return (
		<li className="list-group-item">
			<div className="blog-item__panel">
				<div className="blog-item__detail">
					<div className="blog-item__info"></div>
					<h1 className="blog-item__title">
						<Link
							href={{
								pathname: `/noadmin/quotes/update/${object._id}`,
								query: {},
							}}
							passHref
							legacyBehavior
						>
							<a className="blog-item__title-link">{object.authorName}</a>
						</Link>
					</h1>
					<div className="blog-item__meta">
						<span>{object.text}</span>
					</div>
				</div>
				<div className="blog-actions-ellipsis-menu">
					<span className="ellipsis-menu">
						<DropdownButton title="Options" variant="secondary">
							<DeleteModal
								id={object._id ? object._id : object._id}
								action={handleDelete}
								classStr={`dropdown-item`}
								objects={quotes}
								setObjects={setQuotes}
								setTotalResults={setTotalResults}
							/>
						</DropdownButton>
					</span>
				</div>
			</div>
		</li>
	);
};

export default Single;
