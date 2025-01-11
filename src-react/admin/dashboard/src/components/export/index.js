import React, { useEffect, useState, useRef } from "react";
import Spinner from "../spinner";
import SearchBar from "./search_bar";
import Pagination from "../pagination";
import headers from "../../modules/headers";
import routes from "../../models/routes";
import ExportTable from "./export_table";

export default function Export() {
	const [exports, setExports] = useState([]);
	const [pagination, setPagination] = useState({ rows: 0, pages: 0, page: 1 });
	const [loading, setLoadingState] = useState(true); // Controls initial loading animation
	const [page, setPage] = useState(1);
	const [filter, setFilter] = useState([
		{ key: "page", value: page },
		{ key: "limit", value: 20 },
		{ key: "order", value: "created desc" },
		{ key: "state", value: "all" },
		{ key: "query", value: "" },
	]);
	const mountedRef = useRef(true); // Track component mount state
	
	// Main fetch function for data
	const fetchData = (silent = false) => {
		let route = routes.getExportList;
		
		// Convert filter array into query params
		const params = filter.reduce((acc, param) => {
			if (param.key === "filter" && Array.isArray(param.value)) {
				param.value.forEach((subParam) => {
					acc[subParam.key] = subParam.value;
				});
			} else {
				acc[param.key] = param.value;
			}
			return acc;
		}, {});
		
		route += "?" + new URLSearchParams(params).toString();
		
		if (!silent) setLoadingState(true);
		
		fetch(route, { headers: headers.get() })
			.then((response) => response.json())
			.then((data) => {
				if (!mountedRef.current) return;
				setExports(data.items || []);
				setPagination({ rows: data.totalRows, pages: data.totalPages, page: data.page });
				if (!silent) setLoadingState(false);
			})
			.catch((error) => {
				console.error("Error fetching export data:", error);
				if (!silent) setLoadingState(false);
			});
	};
	
	// Update page in filter
	useEffect(() => {
		setFilter((prevFilter) =>
			prevFilter.map((item) => (item.key === "page" ? { ...item, value: page } : item))
		);
	}, [page]);
	
	// Fetch data when filter changes
	useEffect(() => {
		// update data
		fetchData();
	}, [filter]);
	
	// Heartbeat: Fetch data every 10 seconds without showing the loading spinner
	useEffect(() => {
		mountedRef.current = true; // Component is mounted
		const intervalId = setInterval(() => {
			// heartbeat
			fetch(routes.exportHeartbeat, {headers:headers.get()});
			fetchData(true); // Silent fetch
		}, 10000);
		
		return () => {
			mountedRef.current = false; // Component is unmounted
			clearInterval(intervalId);
		};
	}, [filter]);
	
	
	return (
		<div>
			<SearchBar id="exportList" filter={filter} onChange={setFilter} />
			{loading ?
				
				<div className="bg-white px-4 py-12 shadow sm:rounded-lg h-full">
				<Spinner />
				</div>
			
				:
				<>
					<ExportTable exports={exports} />
					<div className="p-4 border-t border-gray-200">
						<Pagination
							pages={pagination.pages}
							rows={pagination.rows}
							page={pagination.page}
							showingCount={exports.length}
							onChange={setPage}
						/>
					</div>
				</>
			}
			
		</div>
	);
}
