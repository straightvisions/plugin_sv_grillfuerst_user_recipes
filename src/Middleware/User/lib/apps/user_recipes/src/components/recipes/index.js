import React, {useEffect, useState, useContext} from "react";
import routes from '../../models/routes';
import storage from '../../modules/storage';
import {useNavigate} from "react-router-dom";
import Spinner from "../spinner";
import Pagination from "../pagination";
import List from "../list";
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
	
	//@todo migrate list items to List + ChildItems instead of writing everything into an array
	const listItems = recipes.map((recipe, index) => {
		return {
			onClick: () => navigate('/edit/' + recipe.uuid),
			columns: [
			<span className="inline-flex rounded-full px-2 text-sm font-semibold leading-5 text-gray-900">{recipe.uuid}</span>,
			<span className={"inline-flex rounded-full px-2 text-sm font-semibold leading-5 text-gray-900 " + states[recipe.state].color}>{states[recipe.state].label}</span>,
			<div className="flex items-center">
				<div className="h-10 flex-shrink-0">
					{recipe.featured_image.url &&
						<img
							className="h-10 object-cover mr-4"
							src={recipe.featured_image.url} alt=""
						/>
					}
				</div>
				<div className="text-sm xl:text-[1rem]">
					<div className="font-bold text-gray-900">{recipe.title !== '' ? recipe.title : <i>Kein Rezeptname</i>}</div>
					<div className="text-gray-500 text-sm">{getDate(recipe.created)}</div>
				</div>
			</div>,
			<>
				{recipe.voucher !== '' &&
					<button
						onClick={e=>handleCopyCode(e, recipe.voucher)}
						title="Code kopieren"
						type="button"
						className="btn secondary">
						<DocumentDuplicateIcon className="stroke-white w-[16px] hidden lg:block"/>
						<span className="ml-1 text-[11px] xl:text-[1rem]">{recipe.voucher}</span>
					</button>
				}
			</>
		]};
	});
	
	return (
		<div className="px-4 sm:px-6 lg:px-0">
			<List
				columns={[
					{label: <>{ loading ? <Spinner width="4" height="4" align="start"/> : <>#</>}</>, width: 'w-full md:w-1/12 md:w-1/12'},
					{label: 'Status', width: 'w-full md:w-2/12 xl:w-1/12'},
					{label: 'Rezept', width: 'w-full md:w-5/12 xl:w-6/12'},
					{label: 'Gutschein', width: 'w-full md:w-3/12 xl:w-3/12'},
				]}
				items={listItems}
				footer={
				<Pagination
					pages={pagination.pages}
					rows={pagination.rows}
					page={pagination.page}
					showingCount={recipes.length}
					onChange={setPage}
				/>
				}
			/>
		</div>
	)
}