# To Do App Demo

This is a simple demo application of an To Do list. It uses a ASP.NET backend, written with minimal APIs, and a React frontend, written with MUI components.

The app has been deployed to Azure since they provide free credits. It uses a web app for the backend and a static website for the frontend.

Since this is just a demo project, there are some shortcuts taken:

- Bypassing CORS checks
- Using a very simple check to create the Sqlite database and table if they don't exist

## Running locally

To run the site locally, you can use `runLocal.sh`. This will start the backend and frontend in parallel. Press ctrl+c twice to exit both.

## Accessing the deployed app

The deployed app can be found here:
https://black-moss-006d92a1e.5.azurestaticapps.net/
