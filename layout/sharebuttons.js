"use client";

// REACT-SHARE
import {
	FacebookShareButton,
	TwitterShareButton,
	RedditShareButton,
	FacebookIcon,
	TwitterIcon,
	RedditIcon,
} from "react-share";

const ShareButtons = ({
	linkToShare = ``,
	dataToEmbed = {},
	iconSize = "45",
}) => {
	return (
		<>
			<FacebookShareButton
				url={linkToShare}
				title={
					dataToEmbed.title
						? `beFree - ` + dataToEmbed.title
						: `beFree - ` + dataToEmbed._id
				}
			>
				<FacebookIcon size={iconSize} />
			</FacebookShareButton>
			<TwitterShareButton
				url={linkToShare}
				title={
					dataToEmbed.title
						? `beFree - ` + dataToEmbed.title
						: `beFree - ` + dataToEmbed._id
				}
			>
				<TwitterIcon size={iconSize} />
			</TwitterShareButton>
			<RedditShareButton
				url={linkToShare}
				title={
					dataToEmbed.title
						? `beFree - ` + dataToEmbed.title
						: `beFree - ` + dataToEmbed._id
				}
			>
				<RedditIcon size={iconSize} />
			</RedditShareButton>
		</>
	);
};

export default ShareButtons;
