import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', (req, res) => {
  // TODO: GET weather data from city name
  router.get('/', async (req, res) => {
    const { city } = req.query;
    const weather = await WeatherService.getWeather(city);
    res.json(weather);
  });
  // TODO: save city to search history
  router.post('/history', async (req, res) => {
    const { city } = req.body;
    const history = await HistoryService.saveCity(city);
    res.json(history);
  });
});

// TODO: GET search history
router.get('/history', async (req, res) => {});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {});

export default router;
