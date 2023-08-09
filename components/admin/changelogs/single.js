import DropdownButton from "react-bootstrap/DropdownButton";
import Accordion from "react-bootstrap/Accordion";
import Link from "next/link";
import DeleteModal from "@/layout/deletemodal";

const Single = ({
	object = {},
	handleDelete,
	changelogs,
	setChangelogs,
	setTotalResults,
}) => {
	return (
		<Accordion>
			<Accordion.Item eventKey={object._id} className="rounded-0">
				<Accordion.Header>
					{object.postType.map((c) => (
						<small key={c} className="badge bg-secondary rounded-pill me-3">
							{c}
						</small>
					))}
					{object.title}
				</Accordion.Header>
				<Accordion.Body>
					<DeleteModal
						id={object._id ? object._id : object._id}
						action={handleDelete}
						// classStr={`dropdown-item`}
						objects={changelogs}
						setObjects={setChangelogs}
						setTotalResults={setTotalResults}
					/>
					<hr />
					{object.text}
				</Accordion.Body>
			</Accordion.Item>
		</Accordion>
		// <li className="list-group-item">
		// 	<div className="blog-item__panel">
		// 		<div className="blog-item__detail">
		// 			<div className="blog-item__info"></div>
		// 			<h1 className="blog-item__title">
		// 				<Link
		// 					href={{
		// 						pathname: `/noadmin/chagelogs/update/${object._id}`,
		// 						query: {},
		// 					}}
		// 					passHref
		// 					legacyBehavior
		// 				>
		// 					<a className="blog-item__title-link">{object.title}</a>
		// 				</Link>
		// 			</h1>
		// 			<div className="blog-item__meta">
		// 				<span>{object.text}</span>
		// 				<ul className="blog-action-counts">
		// 					{/* <li>{object.error.statusCode}</li>
		// 					<li>{object.error.status}</li>
		// 					<li>{object.error.isOperacional}</li> */}
		// 				</ul>
		// 			</div>
		// 		</div>
		// 		<div className="blog-actions-ellipsis-menu">
		// 			<span className="ellipsis-menu">
		// 				<DropdownButton variant="secondary">
		// <DeleteModal
		// 	id={object._id ? object._id : object._id}
		// 	action={handleDelete}
		// 	classStr={`dropdown-item`}
		// 	objects={changelogs}
		// 	setObjects={setChangelogs}
		// 	setTotalResults={setTotalResults}
		// />
		// 				</DropdownButton>
		// 			</span>
		// 		</div>
		// 	</div>
		// </li>
	);
};

export default Single;
