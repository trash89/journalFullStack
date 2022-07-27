# Journal Application

The Journal Application is allowing to keep an online journal of activity. You can enter a description of daily activities and things to do.

The application is live on Netlify :

https://myjournalwebapp.netlify.app/

The application is built with three components:

- the database server, with a relational database schema deployed on Heroku PostgreSQL service
- the GraphQL server, built with the latest Express, Apollo and Prisma ORM packages : live at : https://journalgraphqlserver.herokuapp.com/
- the frontend application, built with ReactJS, ReduxToolkit and Material-UI, relaying on the graphql server to communicate with the database.

This repository contains the frontend application with an Apollo client querying the GraphQL server deployed on Heroku.
