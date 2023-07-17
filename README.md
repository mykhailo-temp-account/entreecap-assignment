# Entree Assignment

![showcase](https://raw.githubusercontent.com/mykhailo-temp-account/entreecap-assignment/main/showcase.gif)

## Prerequisites

Make sure you have the following dependencies installed on your system:

- Docker / Docker Compose
- NodeJS / npm

## Running

1. Setup infrastructure:
```bash
docker-compose up postgres redis
```
This will bootstrap local in docker postgres and redis servers as well as required init scripts

2. Data Scraping:
  * Manual execution (note that in this assignment the NFL Vikings has been rejected to avoid repetitiveness and save time)
    ```bash
    npm run scrape-norseman 
    npm run scrape-vikings 
    ```
  * Airflow example. It contains a DAG with 2 tasks `scrape_vikings_tv_data` and `scrape_norsemen_tv_data` which are scheduled to be executed daily and in parallel. This is just an example DAG and a preferred approach for production pipelines. In this example we stay with _Manual execution_ approach 
    ```
    /dags/daily_scraping_dag.py
    ```
    
3. Web application backend
```bash
npm run webapp
```
This will boot up local nodejs server which listens to `4000` port.
The API is available at `/private/api/v1/search`.

4. Web application frontend
```bash
cd frontend
npm run dev
```
This will create a website on `http://localhost:3000/` which you can open in browser and browse application
