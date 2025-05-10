"use client";
import Image from "next/image";
import Link from "next/link";
import {
	FaFacebook,
	FaInstagram,
	FaLinkedin,
	FaSteam,
	FaTwitter,
	FaXbox,
	FaYoutube,
} from "react-icons/fa";
import ParseHtml from "@/layout/parseHtml";

const AuthorBox = ({ author = {}, imageWidth = "64", imageHeight = "64" }) => {
	return (
		<div className="d-flex my-4" id={`media comment-${author?._id}`}>
			<div className="flex-shrink-0">
				<Link href={`/profile/${author?._id}/${author?.username}`}>
					<Image
						src={
							author?.files?.avatar?.location?.secure_location ||
							`https://source.unsplash.com/random/64x64`
						}
						alt={`${author?.username}'s featured image`}
						width={imageWidth}
						height={imageHeight}
						className="img-hover"
						style={{
							objectFit: "cover",
						}}
					/>
				</Link>
			</div>
			<div className="flex-grow-1 ms-3" style={{ marginTop: "-6px" }}>
				<Link href={`/profile/${author?._id}/${author?.username}`}>
					{author?.username}
				</Link>
				<ParseHtml text={author?.bio} />
				{author?.social?.facebook !== "" &&
					author?.social?.facebook !== undefined &&
					author?.social?.facebook !== null && (
						<a
							href={author?.social?.facebook}
							target="_blank"
							rel="noreferrer noopener"
							className="btn btn-link btn-sm me-1"
						>
							<FaFacebook />
						</a>
					)}
				{author?.social?.instagram !== "" &&
					author?.social?.instagram !== undefined &&
					author?.social?.instagram !== null && (
						<a
							href={author?.social?.instagram}
							target="_blank"
							rel="noreferrer noopener"
							className="btn btn-link btn-sm me-1"
						>
							<FaInstagram />
						</a>
					)}
				{author?.social?.linkedIn !== "" &&
					author?.social?.linkedIn !== undefined &&
					author?.social?.linkedIn !== null && (
						<a
							href={author?.social?.linkedIn}
							target="_blank"
							rel="noreferrer noopener"
							className="btn btn-link btn-sm me-1"
						>
							<FaLinkedin />
						</a>
					)}
				{author?.social?.steamId !== "" &&
					author?.social?.steamId !== undefined &&
					author?.social?.steamId !== null && (
						<a
							href={author?.social?.steamId}
							target="_blank"
							rel="noreferrer noopener"
							className="btn btn-link btn-sm me-1"
						>
							<FaSteam />
						</a>
					)}
				{author?.social?.twitter !== "" &&
					author?.social?.twitter !== undefined &&
					author?.social?.twitter !== null && (
						<a
							href={author?.social?.twitter}
							target="_blank"
							rel="noreferrer noopener"
							className="btn btn-link btn-sm me-1"
						>
							<FaTwitter />
						</a>
					)}
				{author?.social?.xboxId !== "" &&
					author?.social?.xboxId !== undefined &&
					author?.social?.xboxId !== null && (
						<a
							href={author?.social?.xboxId}
							target="_blank"
							rel="noreferrer noopener"
							className="btn btn-link btn-sm me-1"
						>
							<FaXbox />
						</a>
					)}
				{author?.social?.youtube !== "" &&
					author?.social?.youtube !== undefined &&
					author?.social?.youtube !== null && (
						<a
							href={author?.social?.youtube}
							target="_blank"
							rel="noreferrer noopener"
							className="btn btn-link btn-sm me-1"
						>
							<FaYoutube />
						</a>
					)}
			</div>
		</div>
	);
};

export default AuthorBox;
