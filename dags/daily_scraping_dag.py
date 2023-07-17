from airflow import DAG
from airflow.operators.bash_operator import BashOperator
from datetime import datetime

default_args = {
    'owner': 'scraping_team',
    'start_date': datetime(2023, 1, 1),
    'retries': 3,
    'retry_delay': timedelta(minutes=5),
}

dag = DAG('daily_scraping_dag', default_args=default_args, schedule_interval='0 0 * * *')

scrape_vikings_tv_data = BashOperator(
    task_id='scrape_vikings_tv_data',
    bash_command='node src/scraping/vikings_tv_runner.js',
)

scrape_norsemen_tv_data = BashOperator(
    task_id='scrape_norsemen_tv_data',
    bash_command='node src/scraping/norsemen_tv_runner.js',
)
