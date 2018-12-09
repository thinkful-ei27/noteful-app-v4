# Noteful App

## Rationale:

### Project Structure

* Separate starting the express server configuring the app so the app can be loaded independently in tests

* `server.js` entry point creates http server and listens . similar to `bin/www` in express generator
    * use `server.js` instead of `bin/www` since it is more common, easier to understand and the default for `nodemon`

* app.js loads and configures middleware

### Config variables:

* `PORT` - User on Travis and Heroku
* `MONGODB_URI` - User for mLab add-on on Heroku
* `TEST_MONGODB_URI` - custom
* `JWT_SECRET` - custom
* `JWT_EXPIRY` - custom

### Error Handling

* User Input errors are POJO.
    * They don't need a stack trace
    * Easier to check in `.catch` and other error handlers
    * Easier to separate user errors from runtime errors

* Prefer double quotes in JS
    * Easier to distinguish between double quotes and backticks
    * Alows single quotes to be used inside messages instead of backticks
        * backticks inside messages are easily confused with string templates
    * Quoted string values easily used in JSON

### TODOs

> When in doubt use GitHub API as guide

* [X] FolderId required
* [X] Use findOneAndDelete instead of findOneAndModify
* [X] Separate `app.js` from `server.js`
* [_] Remove `'use  strict';`
* [_] Move logger to middlewares
* [_] Ditch Passport use custom middleware
* [_] Move Registration Validation to middleware
* [_] Add tests to repo to each solution branch
* [_] Consistent username/password for seed users
* [_] Fix slides and demos: `.remove` is deprecated in favor of `deleteOne()`, `deleteMany()`
* [_] Fix slides and demos: `.update` is deprecated in favor of  `updateOne()`, `updateMany()`, and `replaceOne()`

* [X] Clean up the error handling objects (POJO or CustomError)
* [X] [Error Status](https://tools.ietf.org/html/rfc7231)
    * 400 Bad Request We use as generic bad request
    * 401 Authentication error UN/PW supplied but invalid
    * 403 Forbidden - Authenticated but not authorized (use for admin resources)
    * 409 Conflict - Request violates a unique contraint on resource
    * 422 Unprocessable Entity - RFC7231 dropped the syntax restriction on 400. 422 no longer needed
