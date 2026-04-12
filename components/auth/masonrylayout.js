"use client";
import Image from "next/image";

const MasonryLayout = ({ setNewAvatar = () => {}, objects = [] }) => {
	return (
		<div className="masonry-container">
			{objects.map((object) => (
				<div key={object._id} className="masonry-item position-relative">
					<Image
						src={object.location.secure_location}
						alt={object.location.filename}
						width={object.dimensions.width}
						height={object.dimensions.height}
						className="w-100 h-auto"
						style={{
							display: "block",
							// borderRadius: "12px",
						}}
						unoptimized
						loading="eager"
					/>
					<div className="position-absolute top-0 end-0 p-2 d-flex gap-1">
						<button
							className="btn btn-primary btn-sm"
							onClick={() => setNewAvatar(object._id)}
						>
							Set Avatar
						</button>
					</div>
				</div>
			))}
		</div>
	);
};

export default MasonryLayout;
