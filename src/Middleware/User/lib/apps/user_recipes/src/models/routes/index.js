// host domain and url
const domain = process.env.REACT_APP_DOMAIN ? process.env.REACT_APP_DOMAIN : window.location.hostname;
const domainURL = process.env.REACT_APP_DOMAIN_URL ? process.env.REACT_APP_DOMAIN_URL : window.location.origin + '/magazin';
const appURL = process.env.REACT_APP_APP_URL ? process.env.REACT_APP_APP_URL : domainURL + '/community-rezepte/';
const apiURL = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL + '/wp-json/sv-grillfuerst-user-recipes/v1' : domainURL + '/wp-json/sv-grillfuerst-user-recipes/v1';

export default {
	config:{
		domain,
		domainURL,
		appURL,
		apiURL,
	},
	// check current url without params
	isAppRoot: () => appURL.replace(/\/$/, '') === window.location.origin + window.location.pathname.replace(/\/$/, ''),
	isRegister: () => appURL.replace(/\/$/, '') + '/register' === window.location.origin + window.location.pathname.replace(/\/$/, ''),
	isReset: () => appURL.replace(/\/$/, '') + '/reset' === window.location.origin + window.location.pathname.replace(/\/$/, ''),
	getUrl: (path) => appURL.replace(/\/$/, '') + path,
	// api urls
	"login": apiURL + '/users/login',
	"isLoggedIn": apiURL + '/users/is_logged_in',
	"getUserInfo": apiURL + '/users/info',
	"getUserInfoById": apiURL + '/users/{id}/info',
	"getRecipes": apiURL + '/recipes', // GET
	"getRecipesByUser": apiURL + '/recipes/user/', // GET + {user_id}
	"getRecipeByUuid": apiURL + '/recipes/', // GET + {recipe_id}
	"createRecipe": apiURL + '/recipes/user/', // POST + {user_id}
	"updateRecipe": apiURL + '/recipes/', // PUT + {recipe_id}
	"getIngredients": apiURL + '/recipes/ingredients', // GET
	"getMenuTypes": apiURL + '/recipes/menutypes', // GET
	"getKitchenStyles": apiURL + '/recipes/kitchenstyles', // GET
	"getAccessories": apiURL + '/products/accessories', // GET
	"getIngredientsProducts": apiURL + '/products/ingredients', // GET
	"uploadMedia": apiURL + '/media/upload', // POST
	
}
