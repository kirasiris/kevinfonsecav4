import Script from "next/script";

export default function Head({
	auth = {},
	title = ``,
	description = ``,
	favicon = "",
	postImage = ``,
	imageWidth = ``,
	imageHeight = ``,
	videoWidth = "1873",
	videoHeight = "900",
	card = "",
	robots = "",
	category = "",
	canonical = ``,
	url = "",
	author = "Kevin Uriel Azuara Fonseca",
	createdAt = "",
	updatedAt = "",
	locales = "",
	posType = "post",
	sectionClass = "",
	containerClass = "",
	cssLink,
	cssInline,
	jsLink,
	children,
}) {
	return (
		<>
			{title && <title>{title}</title>}
			{description && <meta name="description" content={description} />}
			<meta content="width=device-width, initial-scale=1" name="viewport" />
			<link rel="icon" href={favicon} />
			{canonical && <link rel="canonical" href={`${canonical}`} />}
			{locales?.length > 0 &&
				locales.map((locale, i) => (
					<meta property="og:locale" key={i} content={`${locale}`} />
				))}
			{locales?.length > 0 &&
				locales.map((locale, i) => (
					<link
						rel="alternate"
						href={`${canonical}/${locale}`}
						key={`${locale}`}
						hrefLang={`${locale}`}
					/>
				))}
			{posType && <meta property="og:type" content={`${posType}`} />}
			{title && <meta property="og:title" content={`${title}`} />}
			{description && (
				<meta property="og:description" content={`${description}`} />
			)}
			{canonical && url && (
				<meta property="og:url" content={`${canonical + `/` + url}`} />
			)}
			{title && <meta property="og:site_name" content={`${title}`} />}
			{author && <meta property="article:author" content={`${author}`} />}
			{category && <meta property="article:section" content={`${category}`} />}
			{createdAt && (
				<meta property="article:published_time" content={`${createdAt}`} />
			)}
			{updatedAt && (
				<meta property="article:modified_time" content={`${updatedAt}`} />
			)}
			{updatedAt && (
				<meta property="og:updated_time" content={`${updatedAt}`} />
			)}
			{postImage !== `` && (
				<meta property="og:image" content={`${postImage}`} />
			)}
			{postImage !== `` && (
				<meta property="og:image:secure_url" content={`${postImage}`} />
			)}
			{postImage !== `` && imageWidth && (
				<meta property="og:image:width" content={`${imageWidth}`} />
			)}
			{postImage !== `` && imageHeight && (
				<meta property="og:image:height" content={`${imageHeight}`} />
			)}
			{videoWidth && (
				<meta property="og:video:width" content={`${videoWidth}`} />
			)}
			{videoHeight && (
				<meta property="og:video:height" content={`${videoHeight}`} />
			)}
			{card && <meta name="twitter:card" content={`${card}`} />}
			{description && (
				<meta name="twitter:description" content={`${description}`} />
			)}
			{title && <meta name="twitter:title" content={`${title}`} />}
			<meta name="twitter:site" content={`@kirasiris`} />
			{canonical && url && (
				<meta property="twitter:url" content={`${canonical + `/` + url}`} />
			)}
			{videoWidth && (
				<meta property="twitter:player:width" content={`${videoWidth}`} />
			)}
			{videoHeight && (
				<meta property="twitter:player:height" content={`${videoHeight}`} />
			)}
			{postImage !== `` && (
				<meta name="twitter:image" content={`${postImage}`} />
			)}
			<meta name="twitter:creator" content={`@kirasiris`} />
			{cssLink && (
				<link rel="stylesheet" href={`${cssLink}`} media="all"></link>
			)}
			{/* {jsLink && <script src={`${jsLink}`} crossorigin="anonymous"></script>}
				{cssInline && <style>{cssInline}</style>} */}
			<Script
				src="https://kit.fontawesome.com/4cde37f226.js"
				crossOrigin="anonymous"
				async
			/>
			<Script src="https://code.iconify.design/1/1.0.7/iconify.min.js" async />
		</>
	);
}
