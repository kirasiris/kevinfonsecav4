import Image from "next/image";
import Link from "next/link";

const Single = ({
	object = {},
	handleDelete,
	objects,
	setObjects,
	setTotalResults,
}) => {
	const imgObj = ({ object }) => {
		return (
			<figure title={object.title}>
				<Image
					src={
						object?.location?.secure_location ||
						`https://source.unsplash.com/random/188x188`
					}
					alt={object.title}
					width={`188`}
					height={`188`}
					onClick={() => {
						setObjects({
							...objects,
							selected: object,
							showMediaModal: false,
						});
					}}
				/>
			</figure>
		);
	};

	const pdfObj = ({ object }) => {
		return <figure title={object.title}>{object.title}</figure>;
	};

	const vidObj = ({ object }) => {
		return <figure title={object.title}>{object.title}</figure>;
	};

	return (
		<Link
			href={{
				pathname: `/noadmin/files/update/${object._id}`,
			}}
			passHref
			legacyBehavior
		>
			<a className="blog-gallery-item col">
				{object.format_type === "image" && imgObj({ object })}
				{object.format_type === "application" && pdfObj({ object })}
				{object.format_type === "video" && vidObj({ object })}
				{/* <button
										className="btn btn-danger btn-sm"
										onClick={() =>
											handleDelete(object._id, object.location.public_id)
										}
										type="button"
									>
										Delete
									</button> */}
			</a>
		</Link>
	);
};

export default Single;
