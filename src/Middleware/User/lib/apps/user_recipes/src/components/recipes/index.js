import React, {useEffect, useState, useContext} from "react";
import routes from '../../models/routes';
import storage from '../../modules/storage';
import {useNavigate} from "react-router-dom";
import Spinner from "../spinner";
import Pagination from "../pagination";
import {DocumentDuplicateIcon, PlusIcon, TrashIcon} from "@heroicons/react/20/solid";
import user from '../../modules/user';
import headers from '../../modules/headers';
const User = user.get();
import {fetchError} from '../../modules/fetch';
import {GlobalContext} from '../../modules/context';


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
	published: {
		label: 'Veröffentlicht',
		color: 'bg-green-100'
	}
}

export default function Recipes(props) {
	const storageSlug = 'recipesCache' + user.id; // multiple tabs support anyone?
	const localCache = storage.get(storageSlug, {
		recipes: [],
		pagination: {rows: 0, pages: 0, page: 1},
		page: 1,
		limit: 20,
		timestamp: 0,
	});
	
	const { globalMessage, setGlobalMessage } = useContext(GlobalContext);
	const [loading, setLoadingState] = useState(true);
	const [recipes, setRecipes] = useState(localCache.recipes);
	const [pagination, setPagination] = useState(localCache.pagination);
	const [page, setPage] = useState(localCache.page);
	const [limit, setLimit] = useState(localCache.limit);
	const navigate = useNavigate();
	
	useEffect(() => {
		setLoadingState(true);
		
		let route = routes.getRecipes;
		// filter
		route += '?';
		route += 'limit=' + parseInt(limit);
		route += '&page=' + parseInt(page);
		
		fetch(route, {
			headers: headers.get()
		})
			.then(response => !response.ok ? fetchError(response) : response)
			.then(response => response.json())
			.then(data => {
				// sort new to old
				const _sorted = data.items.sort((a, b) => {
					return a.created < b.created ? 1 : -1;
				});
				
				setRecipes(_sorted);
				setPagination({rows: data.totalRows, pages: data.totalPages, page: data.page});
				
				// update the cache with the new data
				storage.set(storageSlug, JSON.stringify({
					recipes: _sorted,
					pagination: {rows: data.totalRows, pages: data.totalPages, page: data.page},
					page: page,
					limit: limit,
					timestamp: Date.now(),
				}));
			}).finally(() => {
			setLoadingState(false);
		});
	}, [page]);
	
	//@todo migrate list items to external component !!
	
	const getDate = (dateString) => {
		const date = new Date(dateString);
		const day = date.getDate().toString().padStart(2, "0");
		const month = (date.getMonth() + 1).toString().padStart(2, "0");
		const year = date.getFullYear().toString();
		const hours = date.getHours().toString().padStart(2, "0");
		const minutes = date.getMinutes().toString().padStart(2, "0");
		return `${day}.${month}.${year} ${hours}:${minutes}`;
	}
	
	const handleCopyCode = (e, c) => {
		e.stopPropagation();
		
		if(typeof c === 'string' && c !== ''){
			navigator.clipboard.writeText(c);
			setGlobalMessage({message: 'Gutschein kopiert!'});
		}
	}
	
	const handleNewRecipe = () => {
		fetch(routes.createRecipe + User.id, {
			method: 'POST',
			cache: 'no-cache',
			headers: {
				'Authorization': 'Bearer ' + storage.get('token'),
			},
			body: JSON.stringify({})
		})
			.then(response => response.json())
			.then(data => {
				navigate('/edit/' + data.uuid)
			});
	}
	
	return (
		<div className="px-4 sm:px-6 lg:px-0">
			<div className="mt-8 flex flex-col">
				<div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
					<div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
						<div className="overflow-hidden shadow">
							<table className="min-w-full divide-y divide-gray-300">
								<thead className="bg-gray-50">
								<tr>
									<th
										scope="col"
										className="w-1/12 py-3.5 pl-4 pr-3 text-left font-semibold text-gray-900 sm:pl-6">
										 { loading ? <Spinner width="4" height="4" align="start"/> : <>#</>}
										
									</th>
									<th
										scope="col"
										className="w-1/12 px-3 py-3.5 text-left font-semibold text-gray-900">
										Status
									</th>
									<th
										scope="col"
										className="w-10/12 py-3.5 pl-4 pr-3 text-left font-semibold text-gray-900 sm:pl-6">
										Rezept
									</th>
									<th
										scope="col"
										className="w-10/12 py-3.5 pl-4 pr-4 text-left font-semibold text-gray-900 sm:pl-6">
										Gutschein
									</th>
								</tr>
								</thead>
								<tbody className="divide-y divide-gray-200 bg-white">
								{recipes.length > 0 ? recipes.map((recipe) => (
									<tr key={recipe.uuid} onClick={() => navigate('/edit/' + recipe.uuid)}
									    className="cursor-pointer hover:bg-gray-100">
										<td className="whitespace-nowrap px-3 py-4 text-gray-500">
											<span
												className="inline-flex rounded-full px-2 text-sm font-semibold leading-5 text-gray-900">
											  {recipe.uuid}
											</span>
										</td>
										<td className="whitespace-nowrap px-3 py-4 text-gray-500">
											<span
												className={"inline-flex rounded-full px-2 text-sm font-semibold leading-5 text-gray-900 " + states[recipe.state].color}>
											  {states[recipe.state].label}
											</span>
										</td>
										<td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
											<div className="flex items-center">
												<div className="h-10 flex-shrink-0">
													{recipe.featured_image.url &&
														<img
															className="h-10 object-cover"
															src={recipe.featured_image.url} alt=""
														/>
													}
												</div>
												<div className="ml-4">
													<div className="font-bold text-gray-900">{recipe.title}</div>
													<div className="text-gray-500">{getDate(recipe.created)}</div>
												</div>
											</div>
										</td>
										<td className="whitespace-nowrap px-4 py-4 text-gray-500">
											{recipe.voucher !== '' &&
												<button
													onClick={e=>handleCopyCode(e, recipe.voucher)}
													title="Code kopieren"
													type="button"
													className="btn secondary">
													<DocumentDuplicateIcon className="stroke-white w-[16px]"/>
													<span className="ml-1">{recipe.voucher}</span>
												</button>
											}
										</td>
									</tr>
								)) :
									<tr>
										<td key="0" className="col-span-4 whitespace-nowrap px-4 py-4 text-gray-500">
											<button
												className="btn"
												role="button"
												onClick={handleNewRecipe}
											>
												<PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true"/>
												<span>Neues Rezept hinzufügen</span>
											</button>
										</td>
									</tr>
								}
								</tbody>
							</table>
							<div className="p-4 border-t border-gray-200">
								<Pagination
									pages={pagination.pages}
									rows={pagination.rows}
									page={pagination.page}
									showingCount={recipes.length}
									onChange={setPage}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}