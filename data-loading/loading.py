import pymysql
import pandas as pd  
import numpy as np

try:
    df = pd.read_csv('../dataset/zomato.csv', encoding='utf-8')
except UnicodeDecodeError:
    df = pd.read_csv('../dataset/zomato.csv', encoding='latin1')

df.replace({np.nan: None}, inplace=True)

timeout = 10
connection = pymysql.connect(
  charset="utf8mb4",
  connect_timeout=timeout,
  cursorclass=pymysql.cursors.DictCursor,
  db="defaultdb",
  host="mysql-1f820137-shrer7925-4272.e.aivencloud.com",
  password="*****", # this is not the password
  read_timeout=timeout,
  port=26757,
  user="avnadmin",
  write_timeout=timeout,
)
  
try:
    cursor = connection.cursor()
  
    createTable = """
    CREATE TABLE IF NOT EXISTS zomato_restaurants (
        Restaurant_ID INT PRIMARY KEY,
        Restaurant_Name VARCHAR(255),
        Country_Code INT,
        City VARCHAR(255),
        Address VARCHAR(255),
        Locality VARCHAR(255), 
        Locality_verbose VARCHAR(255), 
        Longitude DECIMAL(10, 6), 
        Latitude DECIMAL(10, 6), 
        Cuisines VARCHAR(255),
        Avg_cost_two INT,
        Currency VARCHAR(255), 
        hasTableBooking CHAR(3),
        hasOnlineDelivery CHAR(3), 
        isDeliveringNow CHAR(3), 
        switchToOrderMenu CHAR(3), 
        Price_Range INT,
        Aggregate_Rating DECIMAL(1,1),
        Rating_color VARCHAR(255), 
        Rating_text VARCHAR(255), 
        Votes INT
    )
    """ 

    cursor.execute(createTable)  

    alterTable = """
    ALTER TABLE zomato_restaurants
    MODIFY Aggregate_Rating VARCHAR(10)
    """
    cursor.execute(alterTable) 

    for index, row in df.iterrows():
        insert_query = """
        INSERT INTO zomato_restaurants (Restaurant_ID, Restaurant_Name, Country_Code, City, Address, Locality, Locality_verbose, Longitude, Latitude, Cuisines, Avg_cost_two, Currency, hasTableBooking, hasOnlineDelivery, isDeliveringNow, switchToOrderMenu, Price_Range, Aggregate_Rating, Rating_color, Rating_text, Votes)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(insert_query, (
            row['Restaurant ID'], 
            row['Restaurant Name'], 
            row['Country Code'], 
            row['City'], 
            row['Address'],
            row['Locality'], 
            row['Locality Verbose'],
            row['Longitude'], 
            row['Latitude'], 
            row['Cuisines'],
            row['Average Cost for two'], 
            row['Currency'], 
            row['Has Table booking'],
            row['Has Online delivery'],
            row['Is delivering now'], 
            row['Switch to order menu'],
            row['Price range'],  
            row['Aggregate rating'], 
            row['Rating color'], 
            row['Rating text'],  
            row['Votes']
        ))
    
    connection.commit() 

    print("Insertion of data into database done successfully.")
  
finally:
  connection.close() 

print("end of file")