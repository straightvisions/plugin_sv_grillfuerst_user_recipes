const subFolder = window.location.hostname === 'www.grillfuerst.de' ? '/magazin' : '';

const domain = process.env.HOST_DOMAIN ? process.env.HOST_DOMAIN : window.location.hostname + subFolder;
const domainURL = process.env.HOST_DOMAIN_URL ? process.env.HOST_DOMAIN_URL : window.location.origin + subFolder;
const appURL = process.env.APP_ROOT_URL ? process.env.APP_ROOT_URL : domainURL + '/community-rezepte/admin';
const appPath = process.env.APP_ROOT_PATH ? process.env.APP_ROOT_PATH : subFolder + '/community-rezepte/admin';
const apiURL = process.env.API_ROOT_V1_URL ? process.env.API_ROOT_V1_URL : domainURL + '/wp-json/sv-grillfuerst-user-recipes/v1';

export default {
	config:{
		domain,
		domainURL,
		appURL,
		appPath,
		apiURL,
	},
	"root": appURL,
	"login": domainURL + '/wp-admin',
	"isLoggedIn": apiURL + '/admin/is_logged_in',
	"getAdminInfo": apiURL + '/admin/info',
	"getUserInfoById": apiURL + '/users/{id}/info',
	"getRecipes": apiURL + '/recipes', // GET
	"getRecipesByUser": apiURL + '/recipes/user/', // GET + {user_id}
	"getRecipeByUuid": apiURL + '/recipes/', // GET + {recipe_id}
	"updateRecipe": apiURL + '/recipes/', // PUT + {recipe_id}
	"deleteRecipe": apiURL + '/recipes/', // DELETE + {recipe_id}
	"exportRecipe": apiURL + '/recipes/{id}/export', // PUT + {recipe_id}
	"getIngredients": apiURL + '/recipes/ingredients', // GET
	"getMenuTypes": apiURL + '/recipes/menutypes', // GET
	"getKitchenStyles": apiURL + '/recipes/kitchenstyles', // GET
	"getAccessories": apiURL + '/products/accessories', // GET
	"getIngredientsProducts": apiURL + '/products/ingredients', // GET
	"uploadMedia": apiURL + '/media/upload', // POST
	"updateMedia": apiURL + '/media/update', // PUT
}