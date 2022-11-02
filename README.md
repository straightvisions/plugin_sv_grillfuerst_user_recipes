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

- Download upload /vendor folder in root
- run composer i in root to install phpunit test

