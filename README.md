# Journal Application

The Journal Application is allowing to keep an online journal of activity. It allows to enter a description of daily activities, things already done and things to do.

The application is live on Heroku :

https://journalgraphqlserver.herokuapp.com/

The application is built with three components:

- the database server, with a relational database schema deployed on Heroku PostgreSQL service
- the GraphQL server, built with the latest Express, Apollo and Prisma ORM packages : live at : https://journalgraphqlserver.herokuapp.com/
- the frontend application, built with ReactJS, Redux and Material-UI, relaying on the graphql server to communicate with the database
