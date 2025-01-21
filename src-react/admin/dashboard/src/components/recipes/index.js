import React, {useEffect, useState} from 'react';
import routes from '../../models/routes';
import {useNavigate} from 'react-router-dom';
import Spinner from '../spinner';
import SearchBar from '../search_bar';
import Pagination from '../pagination';
import {Image as ImagePH} from '../placeholder';
import {LinkIcon} from '@heroicons/react/20/solid'
import headers from "../../modules/headers";

const states = {
	draft: {
		label: 'Entwurf',
		color: 'bg-gray-100'
	},
	review_pending: {
		label: 'Eingereicht',
		color: 'bg-yellow-100'
	},
	reviewed: {
		label: 'Feedback',
		color: 'bg-blue-100'
	},
	export_pending: {
		label: 'Export wartend',
		color: 'bg-yellow-100'
	},
	export_running: {
		label: 'Export läuft',
		color: 'bg-yellow-100'
	},
	export_error: {
		label: 'Export Fehler',
		color: 'bg-red-100'
	},
	published: {
		label: 'Veröffentlicht',
		color: 'bg-green-100'
	}
}
//@todo refactor filter system to be less complex and more flexible
export default function Recipes(props) {
	const [recipes, setRecipes] = useState([]);
	const [pagination, setPagination] = useState({rows: 0, pages: 0, page: 1});
	const [loading, setLoadingState] = useState(true);
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(20);
	const navigate = useNavigate();
	const [filter, setFilter] = useState([
		{key: 'limit', value: limit},
		{key: 'page', value: page},
		{key: 'order', value: 'edited desc'},
		{
			key: 'filter', value: [
				{key: 'state', value: 'review_pending'},
			]
		}
	]);
	
	const recipesCount = recipes ? recipes.length : 0;
	
	//@todo refactor filter system to be less complex and more flexible
	useEffect(() => {
		setFilter((prevFilter) => prevFilter.map((item) => {
				if (item.key === 'page') {
					return {...item, value: page};
				}
				return item;
			})
		);
	}, [page]);
	
	useEffect(() => {
		let route = routes.getRecipes;
		setLoadingState(true);
		// filter
		route += '?';
		
		route += new URLSearchParams(filter.map(param => {
			if (Array.isArray(param.value)) {
				return [
					param.key,
					JSON.stringify(param.value.map(subparam => [subparam.key, subparam.value]))
				];
			} else {
				return [param.key, param.value];
			}
		})).toString();
	
		fetch(route, {
			headers: headers.get()
		})
			.then(response => response.json())
			.then(data => {
				setRecipes(data.items);
				setPagination({rows: data.totalRows, pages: data.totalPages, page: data.page});
				setLoadingState(false);
			});
	}, [filter])
	
	if (loading) {
		return (
			<>
				<div className="bg-white px-4 py-12 shadow sm:rounded-lg  h-full">
					<Spinner/>
				</div>
			</>
		
		);
	}
	
	return (
		<>
			<SearchBar id="adminRecipesList" filter={filter} onChange={setFilter}/>
			
			<div className="shadow ring-1 ring-black ring-opacity-5 md:rounded-lg bg-white">
				<table className="min-w-full divide-y divide-gray-300">
					<thead className="bg-gray-50">
					<tr>
						<th
							scope="col"
							className="w-1/12 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
							UUID
						</th>
						<th
							scope="col"
							className="w-1/12 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
							Status
						</th>
						<th
							scope="col"
							className="w-7/12 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
							Rezept
						</th>
						<th
							scope="col"
							className="w-3/12 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
							Autor
						</th>
						<th
							scope="col"
							className="w-10/12 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
							Änderung
						</th>
						<th
							scope="col"
							className="w-10/12 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
							Erstellt
						</th>
						<th
							scope="col"
							className="w-10/12 py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pl-6">
							Link
						</th>
					
					</tr>
					</thead>
					<tbody className="divide-y divide-gray-200 bg-white">
					{recipes && recipes.map((recipe) => (
						<tr className="cursor-pointer hover:bg-gray-50" key={recipe.uuid}
						    onClick={() => navigate('/edit/' + recipe.uuid)}>
							<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
								<span
									className="inline-flex rounded-full px-2 text-xs font-semibold leading-5 text-gray-900">
								  {recipe.uuid}
								</span>
							</td>
							<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
								{states[recipe.state] ?
									<span
										className={"inline-flex rounded-full px-2 text-xs font-semibold leading-5 text-gray-900 " + states[recipe.state].color}>
								    {states[recipe.state].label}
								</span>
									: <span>{recipe.state}</span>
								}
							</td>
							<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
								<div className="flex items-center">
									<div className="h-10 flex-shrink-0 w-[60px] max-h-[40px] overflow-hidden">
										{recipe.featured_image.url ?
											<img
												className="h-10 object-cover"
												src={recipe.featured_image.url} alt=""
											/> : <ImagePH/>
											
										}
									</div>
									<div className="ml-4">
										<div className="font-medium text-gray-900">{recipe.title}</div>
									</div>
								</div>
							</td>
							<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
								{recipe.user_meta && recipe.user_meta.firstname ? recipe.user_meta.firstname + ' ' : '-'}
								{recipe.user_meta && recipe.user_meta.lastname ? recipe.user_meta.lastname : '-'}
							</td>
							<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
								{recipe.edited}
							</td>
							<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
								{recipe.created}
							</td>
							<td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm sm:pl-6">
								{recipe.state === 'published' ?
									<a href={recipe.link} target="_blank" onClick={e => e.stopPropagation()}>
										<LinkIcon className="hover:stroke-black stroke-green-700 w-[20px]"/>
									</a>
									: ''
								}
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
						showingCount={recipesCount}
						onChange={setPage}
					/>
				</div>
			</div>
		</>
	)
}