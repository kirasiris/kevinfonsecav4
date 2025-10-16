"use client";
import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";

const Gallery = ({ objects = [] }) => {
	const images = objects.map((item) => item.location.secure_location);
	const [selectedImage, setSelectedImage] = useState(images[0]);
	const [lightboxOpen, setLightboxOpen] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(0);

	// Handlers
	const handleThumbnailClick = (img, index) => {
		setSelectedImage(img);
		setCurrentIndex(index);
	};

	const openLightbox = (index) => {
		setLightboxOpen(true);
		setCurrentIndex(index);
	};

	const closeLightbox = () => setLightboxOpen(false);

	const showNext = useCallback(() => {
		setCurrentIndex((prev) => (prev + 1) % images.length);
	}, [images.length]);

	const showPrev = useCallback(() => {
		setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
	}, [images.length]);

	// Keyboard navigation
	useEffect(() => {
		if (!lightboxOpen) return;
		const handleKey = (e) => {
			if (e.key === "ArrowRight") showNext();
			if (e.key === "ArrowLeft") showPrev();
			if (e.key === "Escape") closeLightbox();
		};
		window.addEventListener("keydown", handleKey);
		return () => window.removeEventListener("keydown", handleKey);
	}, [lightboxOpen, showNext, showPrev]);

	// Update main image when index changes
	useEffect(() => {
		if (images[currentIndex]) setSelectedImage(images[currentIndex]);
	}, [currentIndex, images]);

	return (
		<>
			<div className="container-fluid py-4">
				<div className="row g-3 align-items-start">
					{/* LEFT: Main image */}
					<div className="col-lg-9 col-md-8 col-12">
						<div
							className="position-relative overflow-hidden rounded-3 shadow-sm"
							style={{ height: "600px", cursor: "pointer" }}
							onClick={() => openLightbox(currentIndex)}
						>
							{selectedImage && (
								<Image
									src={selectedImage}
									alt="Main preview"
									fill
									style={{ objectFit: "cover" }}
									className="rounded-3 fade-image"
									priority
								/>
							)}
						</div>
					</div>

					{/* RIGHT: Thumbnails */}
					<div className="col-lg-3 col-md-4 col-12 d-flex flex-column gap-3">
						{images.slice(0, 4).map((img, index) => (
							<div
								key={index}
								onClick={() => handleThumbnailClick(img, index)}
								className={`position-relative rounded-3 overflow-hidden shadow-sm gallery-thumb ${
									selectedImage === img ? "border border-primary border-3" : ""
								}`}
								style={{ cursor: "pointer", height: "140px" }}
							>
								<Image
									src={img}
									alt={`Thumbnail ${index + 1}`}
									fill
									loading="lazy"
									style={{ objectFit: "cover" }}
									className="rounded-3 thumb-image"
								/>
								{/* Overlay for +x more */}
								{index === 3 && images.length > 4 && (
									<div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center text-white fs-4 fw-bold">
										+{images.length - 4}
									</div>
								)}
							</div>
						))}
					</div>
				</div>

				{/* ------------------------------------------------------- */}
				{/* 🔮 Lightbox Modal */}
				{/* ------------------------------------------------------- */}
				{lightboxOpen && (
					<div
						className="modal fade show d-block bg-dark bg-opacity-90"
						tabIndex="-1"
						onClick={closeLightbox}
						style={{ zIndex: 1055 }}
					>
						<div
							className="modal-dialog modal-fullscreen d-flex justify-content-center align-items-center"
							onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
						>
							<div className="position-relative w-100 h-100 d-flex justify-content-center align-items-center">
								{images.length > 1 && (
									<>
										<button
											className="btn btn-light position-absolute start-0 top-50 translate-middle-y ms-3"
											onClick={showPrev}
										>
											‹
										</button>
										<button
											className="btn btn-light position-absolute end-0 top-50 translate-middle-y me-3"
											onClick={showNext}
										>
											›
										</button>
									</>
								)}

								<div
									className="position-relative"
									style={{ width: "85%", height: "85%" }}
								>
									<Image
										src={images[currentIndex]}
										alt={`Full view ${currentIndex + 1}`}
										fill
										style={{ objectFit: "contain" }}
										className="fade-image"
									/>
								</div>

								<div className="position-absolute bottom-0 mb-3 text-white fs-6 text-center w-100">
									{currentIndex + 1} / {images.length}
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default Gallery;
