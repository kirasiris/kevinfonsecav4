import DropdownButton from "react-bootstrap/DropdownButton";
import Link from "next/link";
import DeleteModal from "@/layout/deletemodal";

const Single = ({
	object = {},
	handleDelete,
	newsletters,
	setNewsletters,
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
								pathname: `/noadmin/newsletters/update/${object._id}`,
								query: {},
							}}
							passHref
							legacyBehavior
						>
							<a className="blog-item__title-link">{object.email}</a>
						</Link>
					</h1>
					<div className="blog-item__meta">
						<span className="blog-item__meta-time-status">
							{object.registeredFrom}
						</span>
					</div>
				</div>
				<div className="blog-actions-ellipsis-menu">
					<span className="ellipsis-menu">
						<DropdownButton title="Options" variant="secondary">
							<DeleteModal
								id={object._id ? object._id : object._id}
								action={handleDelete}
								classStr={`dropdown-item`}
								objects={newsletters}
								setObjects={setNewsletters}
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
