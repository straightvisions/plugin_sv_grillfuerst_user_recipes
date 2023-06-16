const HOST_DOMAIN = process.env.HOST_DOMAIN ?? window.location.origin + '/magazin'; // production domain is domain + subfolder
const HOST_DOMAIN_URL = process.env.HOST_DOMAIN_URL ?? window.location.origin + '/magazin';
const API_ROOT_URL = process.env.API_ROOT_V1_URL ?? HOST_DOMAIN_URL + '/wp-json/sv-grillfuerst-user-recipes/v1';
const APP_ROOT_URL = process.env.APP_ROOT_URL ?? HOST_DOMAIN_URL + '/community-rezepte/admin';

export default {
	config:{
		domain: HOST_DOMAIN,
		domainURL: HOST_DOMAIN_URL,
		appURL: APP_ROOT_URL,
		apiURL: API_ROOT_URL,
	},
	"root": APP_ROOT_URL,
	"login": HOST_DOMAIN_URL + '/wp-admin',
	"isLoggedIn": API_ROOT_URL + '/admin/is_logged_in',
	"getAdminInfo": API_ROOT_URL + '/admin/info',
	"getUserInfoById": API_ROOT_URL + '/users/{id}/info',
	"getRecipes": API_ROOT_URL + '/recipes', // GET
	"getRecipesByUser": API_ROOT_URL + '/recipes/user/', // GET + {user_id}
	"getRecipeByUuid": API_ROOT_URL + '/recipes/', // GET + {recipe_id}
	"updateRecipe": API_ROOT_URL + '/recipes/', // PUT + {recipe_id}
	"exportRecipe": API_ROOT_URL + '/recipes/{id}/export', // PUT + {recipe_id}
	"getIngredients": API_ROOT_URL + '/recipes/ingredients', // GET
	"getMenuTypes": API_ROOT_URL + '/recipes/menutypes', // GET
	"getKitchenStyles": API_ROOT_URL + '/recipes/kitchenstyles', // GET
	"getAccessories": API_ROOT_URL + '/products/accessories', // GET
	"getIngredientsProducts": API_ROOT_URL + '/products/ingredients', // GET
	"uploadMedia": API_ROOT_URL + '/media/upload', // POST
	"updateMedia": API_ROOT_URL + '/media/update', // PUT
}
