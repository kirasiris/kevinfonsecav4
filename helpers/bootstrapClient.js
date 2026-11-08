"use client";

import { useEffect } from "react";

export function BootstrapClient() {
	useEffect(() => {
		import("@/src/js/bootstrap.js");
	}, []);

	return null;
}
