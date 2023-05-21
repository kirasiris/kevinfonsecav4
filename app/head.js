export default function Head({
	title = `No title`,
	description = `No description`,
}) {
	return (
		<>
			{title && <title>{title}</title>}
			{description && <meta name="description" content={description} />}
			<meta content="width=device-width, initial-scale=1" name="viewport" />
			<link rel="icon" href="/favicon.ico" />
			<script
				src="https://kit.fontawesome.com/4cde37f226.js"
				crossOrigin="anonymous"
				async
			></script>
			<script
				async
				src="https://code.iconify.design/1/1.0.7/iconify.min.js"
			></script>
		</>
	);
}
