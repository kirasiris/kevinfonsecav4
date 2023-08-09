import DropdownButton from "react-bootstrap/DropdownButton";
import Link from "next/link";
import DeleteModal from "@/layout/deletemodal";
import Image from "next/image";

const Single = ({
	object = {},
	handleDelete,
	themes,
	setThemes,
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
								pathname: `/noadmin/themes/update/${object._id}`,
								query: {},
							}}
							passHref
							legacyBehavior
						>
							<a className="blog-item__title-link">{object.title}</a>
						</Link>
					</h1>
					<div className="blog-item__meta">
						<span className="blog-item__meta-time-status">{object.text}</span>
					</div>
				</div>
				<div className="blog-type-list__blog-thumbnail-wrapper has-image">
					<Link
						href={{
							pathname: `/noadmin/themes/update/${object._id}`,
							query: {},
						}}
						passHref
						legacyBehavior
					>
						<a className="blog-type-list__blog-thumbnail-link">
							<Image
								src="https://i0.wp.com/befreebucket-for-outputs.s3.amazonaws.com/2023/04/Changelog.jpg?ssl=1&h=160"
								className="blog-type-list__blog-thumbnail"
								alt="Blog titles image"
								width="83"
								height="63"
							/>
						</a>
					</Link>
				</div>
				<div className="blog-actions-ellipsis-menu">
					<span className="ellipsis-menu">
						<DropdownButton variant="secondary">
							<DeleteModal
								id={object._id ? object._id : object._id}
								action={handleDelete}
								classStr={`dropdown-item`}
								objects={themes}
								setObjects={setThemes}
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
