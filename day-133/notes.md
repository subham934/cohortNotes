Linting and Settings

Make sure we write consistent code
no-console.log
search eslint docs, you will find the rules about how to write code.


Settings::
we create folder named .vscode  inside this folder we have settings.json file
here, we do team management. that means we apply same linting rule to all the developers.


devDependencies::
it include packages which are used for development purpose. eg. eslint, prettier, nodemon, typescript
these are not required for running application. these are only required for development purpose.

dependencies::
it include packages which are required for running application. eg. react, react-dom, express, mongoose
it is required for running application. without these packages, application will not run.


Logging and Observability:: Add log lines where things can fail (not entire codebase)
only log where there is error. error inside catch (only error). log error and rethrow the error.


Git is your save-game:: commit early, commit often.

Pull request Etiquette:: Write good commit messages. Pull request should be small. Pull request should be reviewd by 2 developers before merging.


Review Checklist:: 
runs locally? tests exist? no console.logs? proper commit message? edge cases handled?

Conflict handling::
rebase or merge - keep history readable.