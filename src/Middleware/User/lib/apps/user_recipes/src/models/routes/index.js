const domain = process.env.REACT_APP_API_DOMAIN ? process.env.REACT_APP_API_DOMAIN : window.location.hostname;
const root = 'https://' + domain + '/wp-json/sv-grillfuerst-user-recipes/v1';
const rootApp = process.env.REACT_APP_ROOT ? process.env.REACT_APP_ROOT : 'https%3A%2F%2F' + domain + '%2Fcommunity-rezepte';

export default {
	"login": root + '/users/login',
	"isLoggedIn": root + '/users/is_logged_in',
	"getUserInfo": root + '/users/info',
	"getUserInfoById": root + '/users/{id}/info',
	"getRecipes": root + '/recipes', // GET
	"getRecipesByUser": root + '/recipes/user/', // GET + {user_id}
	"getRecipeByUuid": root + '/recipes/', // GET + {recipe_id}
	"createRecipe": root + '/recipes/user/', // POST + {user_id}
	"updateRecipe": root + '/recipes/', // PUT + {recipe_id}
	"getIngredients": root + '/recipes/ingredients', // GET
	"getMenuTypes": root + '/recipes/menutypes', // GET
	"getKitchenStyles": root + '/recipes/kitchenstyles', // GET
	"getAccessories": root + '/products/accessories', // GET
	"getIngredientsProducts": root + '/products/ingredients', // GET
	"uploadMedia": root + '/media/upload', // POST
	//
	"rootApp": rootApp,
}
