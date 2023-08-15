import Accordion from "react-bootstrap/Accordion";
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
	);
};

export default Single;
