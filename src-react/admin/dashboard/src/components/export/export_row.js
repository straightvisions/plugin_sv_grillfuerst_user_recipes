import React, { useState, useEffect } from "react";
import Spinner from "../spinner";
import JobDetailsTable from "./job_details_table";
import headers from "../../modules/headers";
import routes from "../../models/routes";

const exportStates = {
	running: {
		label: "Running",
		color: "bg-yellow-100",
	},
	done: {
		label: "Done",
		color: "bg-green-100",
	},
	error: {
		label: "Error",
		color: "bg-red-100",
	},
};

export default function ExportRow({ exportItem: initialExportItem }) {
	const [expanded, setExpanded] = useState(false);
	const [loading, setLoading] = useState(false);
	const [details, setDetails] = useState(null);
	const [exportItem, setExportItem] = useState(initialExportItem); // Local exportItem state
	const [showConfirmation, setShowConfirmation] = useState(false);
	const [restartLoading, setRestartLoading] = useState(false);
	// Silent fetch every 10 seconds
	useEffect(() => {
		if (expanded) {
			const interval = setInterval(() => {
				fetchDetails(true); // Silent fetch
			}, 10000);
			
			return () => clearInterval(interval); // Cleanup interval on unmount or collapse
		}
	}, [expanded]);
	const toggleRow = () => {
		if (expanded) {
			setExpanded(false);
		} else {
			if (!details) {
				fetchDetails();
			}
			setExpanded(true);
		}
	};
	
	const fetchDetails = () => {
		setLoading(true);
		const route = routes.getExportStatusDetails.replace("{id}", exportItem.uuid);
		fetch(route, { headers: headers.get() })
			.then((response) => response.json())
			.then((data) => {
				setDetails(data);
				if (data.recipe) {
					// Update local exportItem with new recipe data
					setExportItem((prev) => ({
						...prev,
						...data.recipe,
					}));
				}
				setLoading(false);
			})
			.catch((error) => {
				console.error("Error fetching row details:", error);
				setLoading(false);
			});
	};
	
	const handleExportRestart = () => {
		setRestartLoading(true);
		const route = routes.exportRecipe.replace("{id}", exportItem.uuid) + "/restart";
		fetch(route, { headers: headers.get() })
			.then((response) => response.json())
			.then(() => {
				setRestartLoading(false);
				setShowConfirmation(false); // Close confirmation modal
				fetchDetails(); // Fetch updated details
			})
			.catch((error) => {
				console.error("Error restarting export:", error);
				setRestartLoading(false);
			});
	};
	
	return (
		<>
			<tr className="hover:bg-gray-50 cursor-pointer" onClick={toggleRow}>
				<td className="px-3 py-4 text-sm text-gray-500">{exportItem.uuid}</td>
				<td className="px-3 py-4 text-sm text-gray-500">{exportItem.title}</td>
				<td className="px-3 py-4 text-sm text-gray-500">{exportItem.export_date}</td>
				<td className="px-3 py-4 text-sm">
					<span
						className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 text-gray-900 ${
							exportStates[exportItem.export]?.color || "bg-gray-100"
						}`}
					>
						{exportStates[exportItem.export]?.label || exportItem.export}
					</span>
				</td>
				<td className="px-3 py-4 text-sm text-gray-500">
					{exportItem.link ? (
						<a href={exportItem.link} target="_blank" rel="noopener noreferrer" className="text-blue-600">
							🔗
						</a>
					) : (
						"-"
					)}
				</td>
				<td className="px-3 py-4 text-sm text-gray-500">
					<button
						className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex gap-2"
						onClick={(e) => {
							e.stopPropagation(); // Prevent row toggle
							setShowConfirmation(true);
						}}
					>
						Export Restart
					</button>
				</td>
			</tr>
			{expanded && (
				<tr>
					<td colSpan="6" className="px-3 py-4 bg-gray-50">
						{!details ? <Spinner /> : <JobDetailsTable jobs={details?.jobs || []} />}
					</td>
				</tr>
			)}
			{showConfirmation && (
				<div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
					<div className="bg-white p-6 rounded shadow-lg">
						<h4 className="text-lg font-semibold mb-4">Confirm Restart</h4>
						<p>Rezept wirklich erneut exportieren?</p>
						<div className="mt-4 flex justify-end gap-2">
							<button
								className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
								onClick={() => setShowConfirmation(false)}
							>
								Abbrechen
							</button>
							<button
								className={`px-4 py-2 text-white rounded ${
									restartLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
								}`}
								onClick={handleExportRestart}
								disabled={restartLoading}
							>
								{restartLoading ? "Restarting..." : "JA"}
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
