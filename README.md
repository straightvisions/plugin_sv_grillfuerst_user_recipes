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

# Hints

- Exclude the root /vendor folder in the root directory from remote uploads! (dev vendors)
- Add new vendors to directly in the /src directory. (build vendors)
- ```composer i``` in root to install phpunit test
- ```composer --ignore-plattform-req=php update``` to prevent PHP 8 warnings

