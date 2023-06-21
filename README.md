# Naming Conventions

https://www.php-fig.org/bylaws/psr-naming-conventions/

- Class folders in Pascal Case
- Asset / lib folders in Snake Case

# Autoloader Conventions / Namespace Conventions

https://www.php-fig.org/psr/psr-4/

# Adapters

Abstracted WordPress functions if possible. This allows porting the app to other systems without changing middlewares.

# Middleware

Business logics of the app aka modules and helpers.
- Data: Data Class Objects
- Repository: ORM-Actions (create, update, delete)
- Service: Services, those should be called from the Controller_Middleware class.

Controller(Action) <-> Service <-> Repository <-> Data

# Interfaces

Shareable class interfaces.

# APP DEV ENV
In the corresponding app folder, create a .env.development file with the following content:

```APP_DOMAIN=localhost:3050
APP_DOMAIN_URL=http://localhost:3050
APP_ROOT_URL=http://localhost:3050
API_ROOT_V1_URL=https://DEV_SERVER_DOMAIN/wp-json/sv-grillfuerst-user-recipes/v1
API_KEY=
```
Add your API_KEY to the .env.development file. You can set an API_KEY in your server config file (wp-config.php for WordPress).

# htaccess
development
```SetEnvIf Request_URI ^/wp-json/sv-grillfuerst-user-recipes/* noauth
SetEnvIf Request_URI ^/wp-content/uploads/sv-grillfuerst-user-recipes/recipes/* noauth
SetEnvIf Request_URI ^/wp-json/* noauth
Order Deny,Allow
Deny from all
Allow from env=noauth
Allow from env=REDIRECT_noauth
Satisfy any
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Headers "X-API-KEY"
</IfModule>
```

production
```<IfModule mod_headers.c>
    Header set Access-Control-Allow-Headers "X-API-KEY"
</IfModule>
```

# Hints

- Exclude the root /vendor folder in the root directory from remote uploads! (dev vendors)
- Add new vendors to directly in the /src directory. (build vendors)
- ```composer i``` in root to install phpunit test
- ```composer --ignore-plattform-req=php update``` to prevent PHP 8 warnings

# ERROR FAQS
- admin app recipes list empty / app not loading / CORS 401 -> check your .env.development file - update the token (you can get a new token if you login to wp-admin and navigate to community-rezepte/admin. search for "token" in the site code)
