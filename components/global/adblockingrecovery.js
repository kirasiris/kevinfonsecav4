"use client";
import { useEffect } from "react";

const AdBlockingRecovery = () => {
	useEffect(() => {
		const signalGooglefcPresent = () => {
			if (!window.frames["googlefcPresent"]) {
				if (document.body) {
					const iframe = document.createElement("iframe");
					iframe.style.width = "0";
					iframe.style.height = "0";
					iframe.style.border = "none";
					iframe.style.zIndex = "-1000";
					iframe.style.left = "-1000px";
					iframe.style.top = "-1000px";
					iframe.style.display = "none";
					iframe.name = "googlefcPresent";
					document.body.appendChild(iframe);
				} else {
					setTimeout(signalGooglefcPresent, 0);
				}
			}
		};

		signalGooglefcPresent();
	}, []);

	return null;
};

export default AdBlockingRecovery;
