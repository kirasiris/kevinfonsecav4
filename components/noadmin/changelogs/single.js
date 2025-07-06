"use client";
import Accordion from "react-bootstrap/Accordion";
import DeleteModal from "@/components/global/deletemodal";
import ParseHtml from "@/layout/parseHtml";

const Single = ({
	object = {},
	handleDelete = () => {},
	objects = [],
	setObjects = () => {},
	setTotalResults = () => {},
}) => {
	return (
		<Accordion>
			<Accordion.Item eventKey={object?._id} className="rounded-0">
				<Accordion.Header>
					{object?.postType?.map((c) => (
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
						objects={objects}
						setObjects={setObjects}
						setTotalResults={setTotalResults}
					/>
					<hr />
					<ParseHtml text={object?.text} />
				</Accordion.Body>
			</Accordion.Item>
		</Accordion>
	);
};

export default Single;
