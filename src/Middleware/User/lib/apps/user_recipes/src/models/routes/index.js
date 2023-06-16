const subFolder = window.location.hostname === 'www.grillfuerst.de' ? '/magazin' : '';

const domain = process.env.HOST_DOMAIN ? process.env.HOST_DOMAIN : window.location.hostname + subFolder;
const domainURL = process.env.HOST_DOMAIN_URL ? process.env.HOST_DOMAIN_URL : window.location.origin + subFolder;
const appURL = process.env.APP_ROOT_URL ? process.env.APP_ROOT_URL : domainURL + '/community-rezepte';
const appPath = process.env.APP_ROOT_PATH ? process.env.APP_ROOT_PATH : subFolder + '/community-rezepte';
const apiURL = process.env.API_ROOT_V1_URL ? process.env.API_ROOT_V1_URL : domainURL + '/wp-json/sv-grillfuerst-user-recipes/v1';

export default {
	config:{
		domain,
		domainURL,
		appURL,
		appPath,
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
