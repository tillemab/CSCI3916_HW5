# Assignment Four

- **Student Name:** Braden Tillema
- **Submission Date:** April 6, 2025
- **Class and Section:** CSCI 3916-H01, Web API

## Postman Collection
[<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://app.getpostman.com/run-collection/41591629-ef0921e5-769f-405b-b543-a606977af8c2?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D41591629-ef0921e5-769f-405b-b543-a606977af8c2%26entityType%3Dcollection%26workspaceId%3D08925962-2723-4718-befa-489d24d914d5#?env%5BTillema-HW4%5D=W3sia2V5IjoiUmFuZG9tX05hbWUiLCJ2YWx1ZSI6IiIsImVuYWJsZWQiOnRydWUsInR5cGUiOiJhbnkiLCJzZXNzaW9uVmFsdWUiOiIiLCJjb21wbGV0ZVNlc3Npb25WYWx1ZSI6IiIsInNlc3Npb25JbmRleCI6MH0seyJrZXkiOiJyYW5kb21fdXNlcm5hbWUiLCJ2YWx1ZSI6IiIsImVuYWJsZWQiOnRydWUsInR5cGUiOiJhbnkiLCJzZXNzaW9uVmFsdWUiOiJlZWZ4ampocWNyIiwiY29tcGxldGVTZXNzaW9uVmFsdWUiOiJlZWZ4ampocWNyIiwic2Vzc2lvbkluZGV4IjoxfSx7ImtleSI6InJhbmRvbV9wYXNzd29yZCIsInZhbHVlIjoiIiwiZW5hYmxlZCI6dHJ1ZSwidHlwZSI6ImFueSIsInNlc3Npb25WYWx1ZSI6InZxcndpaW1mdW8iLCJjb21wbGV0ZVNlc3Npb25WYWx1ZSI6InZxcndpaW1mdW8iLCJzZXNzaW9uSW5kZXgiOjJ9LHsia2V5IjoiSldUIiwidmFsdWUiOiIiLCJlbmFibGVkIjp0cnVlLCJ0eXBlIjoiYW55Iiwic2Vzc2lvblZhbHVlIjoiSldULi4uIiwiY29tcGxldGVTZXNzaW9uVmFsdWUiOiJKV1QgZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBaQ0k2SWpZM1pqTTJNRGcyWXpsaVlUWTBaak0yTm1OalkyUTFOU0lzSW5WelpYSnVZVzFsSWpvaVpXVm1lR3BxYUhGamNrQmxiV0ZwYkM1amIyMGlMQ0pwWVhRaU9qRTNORFF3TURNeU1EY3NJbVY0Y0NJNk1UYzBOREF3Tmpnd04zMC5xNDhCbEk2eW5feGgyWTE2OGUtblQzc090ODktb052dGphYTdsQlNCY1ZZIiwic2Vzc2lvbkluZGV4IjozfSx7ImtleSI6Im1vdmllSWQiLCJ2YWx1ZSI6IiIsImVuYWJsZWQiOnRydWUsInR5cGUiOiJhbnkiLCJzZXNzaW9uVmFsdWUiOiI2N2YzNjA4OGM5YmE2NGYzNjZjY2NkN2EiLCJjb21wbGV0ZVNlc3Npb25WYWx1ZSI6IjY3ZjM2MDg4YzliYTY0ZjM2NmNjY2Q3YSIsInNlc3Npb25JbmRleCI6NH0seyJrZXkiOiJyZXZpZXdNb3ZpZUlkIiwidmFsdWUiOiI2N2QzOTc4ZmIzNjcwOTc3YTRkYmU3ODkiLCJlbmFibGVkIjp0cnVlLCJ0eXBlIjoiZGVmYXVsdCIsInNlc3Npb25WYWx1ZSI6IjY3ZDM5NzhmYjM2NzA5NzdhNGRiZTc4OSIsImNvbXBsZXRlU2Vzc2lvblZhbHVlIjoiNjdkMzk3OGZiMzY3MDk3N2E0ZGJlNzg5Iiwic2Vzc2lvbkluZGV4Ijo1fSx7ImtleSI6ImZha2VNb3ZpZUlkIiwidmFsdWUiOiIiLCJlbmFibGVkIjp0cnVlLCJ0eXBlIjoiYW55Iiwic2Vzc2lvblZhbHVlIjoiYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhIiwiY29tcGxldGVTZXNzaW9uVmFsdWUiOiJhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWEiLCJzZXNzaW9uSW5kZXgiOjZ9XQ==)

## Project Explanation

This is an API for a movie website. It contains routes to sign-in, sign-up, use the movies collection, and use the reviews collection.

## Installation and Usage Instructions

1. Install all of the required packages using `npm install`.
2. Run the server using `npm start` or `node server.js`.

## Environment Settings

There are two environment variables needed to run the server.
- `DB` The link to access the MongoDB Cluster.
- `SECRET_KEY` A key used to generate the JWT tokens.
- `PORT` _Optionally,_ set a port number for the server. Defaults to 8080.

## Other Links
- **Assignment Four Render URL:** https://csci3916-hw4-tk7b.onrender.com
- **React App Render Site URL:** https://csci3916-react19.onrender.com
