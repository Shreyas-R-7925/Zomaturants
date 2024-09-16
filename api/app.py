from flask import Flask, jsonify, request
from flask_cors import CORS
import pymysql 
import requests
import math 
import os
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
import tempfile

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})


# Database connection configuration
def get_db_connection():
    return pymysql.connect(
        charset="utf8mb4",
        connect_timeout=10,
        cursorclass=pymysql.cursors.DictCursor,
        db="defaultdb",
        host="mysql-1f820137-shrer7925-4272.e.aivencloud.com",
        password="*****", # this is not the password
        port=26757,
        user="avnadmin"
    )

# The following route gets Restaurant by ID
@app.route('/restaurant/<int:restaurant_id>', methods=['GET'])
def get_restaurant_by_id(restaurant_id):
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            sql = "SELECT * FROM zomato_restaurants WHERE Restaurant_ID = %s"
            cursor.execute(sql, (restaurant_id,))
            restaurant = cursor.fetchone()
            if restaurant:
                return jsonify(restaurant)
            else:
                return jsonify({'error': 'Restaurant not found'}), 404
    finally:
        connection.close()

# The following route gets a list of restaurants
@app.route('/restaurants', methods=['GET'])
def get_list_of_restaurants():
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 100))
    offset = (page - 1) * per_page

    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            sql = "SELECT * FROM zomato_restaurants LIMIT %s OFFSET %s"
            cursor.execute(sql, (per_page, offset))
            restaurants = cursor.fetchall()
            return jsonify(restaurants)
    finally:
        connection.close()


API_KEY = os.getenv('FOODVISOR_API_KEY')
FOODVISOR_API_URL = 'https://vision.foodvisor.io/api/1.0/en/analysis/'



@app.route("/upload", methods=["POST"])
def upload_image():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file:
        # Secure the filename
        filename = secure_filename(file.filename)
        
        # Send the file to the Foodvisor API and get the response
        response = send_to_foodvisor(file)
        return jsonify(response)

def send_to_foodvisor(file):
    # Headers for the Foodvisor API request
    headers = {
        'Authorization': f'Api-Key {API_KEY}'  
    }

    files = {
        'image': (file.filename, file.read(), 'multipart/form-data')  
    }

    try:
        # Send request to the Foodvisor API
        response = requests.post(FOODVISOR_API_URL, headers=headers, files=files)
        response.raise_for_status()

        return response.json()
    
    except requests.exceptions.RequestException as e:
        return {"error": str(e)}


@app.route('/getRestaurantByCuisine', methods=['POST'])
def get_restaurant_by_cuisine():
    data = request.get_json()
    cuisine = data.get('cuisine', '')

    if not cuisine:
        return jsonify({"error": "Cuisine parameter is missing."}), 400

    # Convert the detected cuisine to lowercase for better matching
    cuisine = cuisine.lower()

    # SQL query to find restaurants with the specified cuisine in a comma-separated list
    query = """
    SELECT Restaurant_ID, Restaurant_Name, Address, City, Aggregate_Rating, Cuisines
    FROM zomato_restaurants
    WHERE LOWER(Cuisines) LIKE %s
    """

    
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            # Use wildcards to allow partial matching (e.g., "%pizza%" will match "Pizza")
            cursor.execute(query, (f'%{cuisine}%',))
            results = cursor.fetchall()

            if not results:
                return jsonify({"message": "No restaurants found for the specified cuisine."})

            restaurants = [{"id": row["Restaurant_ID"], "name": row["Restaurant_Name"], "address": row["Address"], "city": row["City"], "rating": row["Aggregate_Rating"], "cuisines": row["Cuisines"] } for row in results]

        return jsonify(restaurants)
    
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "An error occurred while processing your request."}), 500


# this route lists all the restaurants which are nearby to the user specified latitude and longitude.
@app.route('/restaurants/nearby', methods=['GET'])
def get_nearby_restaurants():
    lat = float(request.args.get('latitude'))
    lng = float(request.args.get('longitude'))
    radius = float(request.args.get('radius', 3))  # Default to 3 km if not provided

    def haversine(lat1, lon1, lat2, lon2):
        R = 6371  # Radius of Earth in km
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return R * c

    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            sql = "SELECT Restaurant_ID, Restaurant_Name, Address, City, Latitude, Longitude, Cuisines, Aggregate_Rating FROM zomato_restaurants"
            cursor.execute(sql)
            restaurants = cursor.fetchall()

            nearby_restaurants = [
                {
                    'id': r['Restaurant_ID'],
                    'name': r['Restaurant_Name'],
                    'address': r['Address'],
                    'city': r['City'],
                    'cuisines': r['Cuisines'],
                    'rating': r['Aggregate_Rating']
                }
                for r in restaurants
                if haversine(float(lat), float(lng), float(r['Latitude']), float(r['Longitude'])) <= radius
            ]

            return jsonify(nearby_restaurants)
    finally:
        connection.close()


if __name__ == '__main__':
    app.run(debug=True)