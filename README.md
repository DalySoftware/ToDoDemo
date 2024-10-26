# To Do App Demo

![image](https://github.com/user-attachments/assets/8c54351d-5133-43a1-bc2c-4a801c45a46e)

This is a simple demo application of a To Do list. It uses an ASP.NET backend, written with minimal APIs, and a React frontend, written with MUI components.

The app has been deployed to Azure since they provide free credits. It uses a web app for the backend and a static website for the frontend. These are automatically deployed to the latest main commit via a Github action.

Since this is just a demo project, there are some shortcuts taken:

- Bypassing some CORS checks.
- Using a very simple check to create the Sqlite database and table if they don't exist. It doesn't handle migrations.
- Using a simple method of authentication based on cookies
  - This is similar to something like Wordle. If you change browser, you'll be treated as a different user.

## Running locally

To run the site locally, you can use `runLocal.sh`. This will start the backend and frontend in parallel. Press ctrl+c twice to exit both.

## Accessing the deployed app

The deployed app can be found here:
https://black-moss-006d92a1e.5.azurestaticapps.net/

As noted above, this is not a very secure site so please don't store any sensitive info!
