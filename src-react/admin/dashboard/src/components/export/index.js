import React, { useEffect, useState } from 'react';
import Spinner from '../spinner';
import SearchBar from './search_bar';
import Pagination from '../pagination';
import headers from '../../modules/headers';
import routes from '../../models/routes';

const exportStates = {
	pending: {
		label: 'Pending',
		color: 'bg-yellow-100',
	},
	done: {
		label: 'Done',
		color: 'bg-green-100',
	},
	failed: {
		label: 'Failed',
		color: 'bg-red-100',
	},
};

export default function Export() {
	const [exports, setExports] = useState([]);
	const [pagination, setPagination] = useState({ rows: 0, pages: 0, page: 1 });
	const [loading, setLoadingState] = useState(true);
	const [page, setPage] = useState(1);
	const [filter, setFilter] = useState([
		{ key: 'page', value: page },
		{ key: 'limit', value: 20 },
		{ key: 'order', value: 'created desc' },
	]);
	
	// Fetch export data
	const fetchData = () => {
		let route = routes.getExportList;
		route += '?' + new URLSearchParams(
			filter.map((param) => {
				return Array.isArray(param.value)
					? [param.key, JSON.stringify(param.value.map((subparam) => [subparam.key, subparam.value]))]
					: [param.key, param.value];
			})
		).toString();
		
		setLoadingState(true);
		fetch(route, { headers: headers.get() })
			.then((response) => response.json())
			.then((data) => {
				setExports(data.items || []);
				setPagination({ rows: data.totalRows, pages: data.totalPages, page: data.page });
				setLoadingState(false);
			})
			.catch((error) => {
				console.error('Error fetching export data:', error);
				setLoadingState(false);
			});
	};
	
	// Update page in filter
	useEffect(() => {
		setFilter((prevFilter) =>
			prevFilter.map((item) => (item.key === 'page' ? { ...item, value: page } : item))
		);
	}, [page]);
	
	// Fetch data when filter changes
	useEffect(() => {
		fetchData();
	}, [filter]);
	
	if (loading) {
		return (
			<div className="bg-white px-4 py-12 shadow sm:rounded-lg h-full">
				<Spinner />
			</div>
		);
	}
	
	return (
		<div>
			<SearchBar id="exportList" filter={filter} onChange={setFilter} />
			
			<div className="shadow ring-1 ring-black ring-opacity-5 md:rounded-lg bg-white">
				<table className="min-w-full divide-y divide-gray-300">
					<thead className="bg-gray-50">
					<tr>
						<th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">UUID</th>
						<th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Title</th>
						<th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">State</th>
						<th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Export</th>
						<th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Link</th>
					</tr>
					</thead>
					<tbody className="divide-y divide-gray-200 bg-white">
					{exports.map((exportItem) => (
						<tr key={exportItem.uuid} className="hover:bg-gray-50">
							<td className="px-3 py-4 text-sm text-gray-500">{exportItem.uuid}</td>
							<td className="px-3 py-4 text-sm text-gray-500">{exportItem.title}</td>
							<td className="px-3 py-4 text-sm">
                  <span
	                  className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 text-gray-900 ${
		                  exportStates[exportItem.export]?.color || 'bg-gray-100'
	                  }`}
                  >
                    {exportStates[exportItem.export]?.label || exportItem.export}
                  </span>
							</td>
							<td className="px-3 py-4 text-sm text-gray-500">
								{exportItem.link ? (
									<a href={exportItem.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
										Open
									</a>
								) : (
									'-'
								)}
							</td>
						</tr>
					))}
					</tbody>
				</table>
				<div className="p-4 border-t border-gray-200">
					<Pagination
						pages={pagination.pages}
						rows={pagination.rows}
						page={pagination.page}
						showingCount={exports.length}
						onChange={setPage}
					/>
				</div>
			</div>
		</div>
	);
}
