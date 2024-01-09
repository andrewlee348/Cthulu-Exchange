from flask import Blueprint
import json
from pycoingecko import CoinGeckoAPI
from flask import Flask, jsonify, session, abort, redirect, request
import requests
from flask_cors import CORS  # Import the CORS module
from app import cache

publicapi_bp = Blueprint('publicapi_bp', __name__)

cg = CoinGeckoAPI()

@publicapi_bp.route('/')
def hello():
    return jsonify(message='Hello, World!')

@publicapi_bp.route('/get_allcrypto')
def get_allcrypto():
  
  cached_data = cache.get('data')
  if cached_data is not None:
    print(f"returning cached data for get_allcrypto")
    return jsonify(cached_data)

  try:
    data = cg.get_coins_markets(vs_currency='usd')
    
    # Remove binancecoin
    filt = {"binancecoin","staked-ether"}
    filtered_data = list(filter(lambda x : x["id"] not in filt,data))
    
    cache.set('data', filtered_data, timeout=300)  # Store the API response in the cache
    return filtered_data, 200

  except Exception as e:
    return {'error': str(e)}, 500  # Handle exceptions


@publicapi_bp.route('/coins/<string:id>/<string:symbol>', methods=['GET'])
def get_coin_details(id,symbol):
  
  cache_key = f"get_coin_details:{id}"
  cached_data = cache.get(cache_key)
  if cached_data is not None:
    print(f"returning cached data for {id}")
    return jsonify(cached_data), 200
  
  try:
    pageData = cg.get_coin_by_id(id)
    graphData15 = requests.get(f'https://api.kraken.com/0/public/OHLC?pair={symbol}USD&interval=15').json()
    graphData1440 = requests.get(f'https://api.kraken.com/0/public/OHLC?pair={symbol}USD&interval=1440').json()

    Data15 = None
    Data1440 = None
    for key, value in graphData15["result"].items():
      Data15 = value
      break
    for key, value in graphData1440["result"].items():
      Data1440 = value
      break
    
    # graphDataDay = cg.get_coin_market_chart_by_id(id, 'usd', 1)
    # print(graphDataDay)
    # graphDataWeek = cg.get_coin_market_chart_by_id(id, 'usd', 7)
    # graphDataYear = cg.get_coin_market_chart_by_id(id, 'usd', 365)
    pointsDataDay = {
      'data': [[sublist[0]*1000]+[sublist[1:2]] for sublist in Data15[-96:]],
      'name': 'dailyData',
    }
    pointsDataWeek = {
      'data': [[sublist[0]*1000]+[sublist[1:2]] for sublist in Data15[-672:]],
      'name': 'weeklyData',
    }
    pointsDataMonth = {
      'data': [[sublist[0]*1000]+[sublist[1:2]] for sublist in Data1440[-30:]],
      'name': 'monthlyData',
    }
    graphDataQuarter = {
      'data': [[sublist[0]*1000]+[sublist[1:2]] for sublist in Data1440[-90:]],
      'name': 'quarterlyData',
    }
    graphDataHalf = {
      'data': [[sublist[0]*1000]+[sublist[1:2]] for sublist in Data1440[-180:]],
      'name': 'halfData',
    }
    graphDataYear = {
      'data': [[sublist[0]*1000]+[sublist[1:2]] for sublist in Data1440[-365:]],
      'name': 'yearlyData',
    }
    return_data = [pageData, [pointsDataDay, pointsDataWeek, pointsDataMonth, graphDataQuarter, graphDataHalf, graphDataYear]]
    cache.set(cache_key, return_data, timeout=300)
    return return_data, 200
  except Exception as e:
    return {'error': str(e)}, 500