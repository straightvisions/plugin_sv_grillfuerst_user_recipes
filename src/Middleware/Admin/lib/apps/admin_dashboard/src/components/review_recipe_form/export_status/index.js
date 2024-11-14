import React, { useEffect, useState } from 'react';
import routes from "../../../models/routes";
import Spinner from "../../spinner";

const ExportStatus = (props) => {
	const {
		attributes,
		setAttributes
	} = props;
	const {data} = attributes;
	const [jobs, setJobs] = useState([]);
	const [exportStatus, setExportStatus] = useState('');
	const [exportLink, setExportLink] = useState(null);
	const [loading, setLoading] = useState(false);
	const fetchJobs = async () => {
		try {
			const route = routes.exportRecipe.replace('{id}', data.uuid);
			const response = await fetch(route + '/status');
			const result = await response.json();
			setJobs(result.data);
			setExportStatus(result.export_status);
			setExportLink(result.export_link);
			setLoading(false);
		
		} catch (error) {
			console.error('Error fetching jobs:', error);
			setLoading(false);
		}
	};
	
	useEffect(() => {
		fetchJobs();
		// Set up interval to fetch jobs every 5 seconds
		const intervalId = setInterval(fetchJobs, 5000);
		// Clean up interval on component unmount
		return () => clearInterval(intervalId);
	}, [attributes.data.uuid]);
	
	const handleRestart = async () => {
		setLoading(true);
		try {
			const route = routes.exportRecipe.replace('{id}', data.uuid) + '/restart';
			const response = await fetch(route, { method: 'GET' }); // assuming restart is a POST request
			if (response.ok) {
				fetchJobs();
			}
		} catch (error) {
			console.error('Error restarting job:', error);
			alert('Error restarting job');
			setLoading(false);
		}
	};
	
	const dataExportJobs = jobs.filter(job => job.type === 'recipe' || job.type === 'recipe_media_merge');
	const mediaExportJobs = jobs.filter(job => job.type === 'media');
	const linkMediaJobs = jobs.filter(job => job.data && job.data._type === 'step');
	
	return (
			<div className="mt-5 bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6 mb-4">
				<div className="flex justify-between items-center mb-4">
					{exportStatus === 'done' ?
						<h3 className="text-lg font-medium leading-6 text-gray-900">Export Status: <span
							className="text-green-700">Erfolgreich</span></h3>
						:
						<h3 className="text-lg font-medium leading-6 text-gray-900">Export Status</h3>
					}
					
					<button
						onClick={handleRestart}
						className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex gap-2"
					>
						{loading && <Spinner/>} Restart Export
					</button>
				</div>
				{exportStatus === 'done' &&
					<a href={exportLink} className="text-green-700"
					   target="_blank">{exportLink}</a>
				}
				{exportStatus !== 'done' &&
					<div className="flex gap-6">
						<div>
							<h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">Data</h3>
							<ul>
								{dataExportJobs.map(job => (
									<li key={job.id}>ID: {job.id}, Status: {job.status}</li>
								))}
							</ul>
						</div>
						
						<div>
							<h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">Media</h3>
							<ul>
								{mediaExportJobs.map(job => (
									<li key={job.id}>ID: {job.id}, Status: {job.status}</li>
								))}
							</ul>
						</div>
						
						<div>
							<h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">Link Media</h3>
							<ul>
								{linkMediaJobs.map(job => (
									<li key={job.id}>ID: {job.id}, Title: {job.data.title},
										Status: {job.status}</li>
								))}
							</ul>
						</div>
					</div>
				}
			</div>
	);
};

export default ExportStatus;
