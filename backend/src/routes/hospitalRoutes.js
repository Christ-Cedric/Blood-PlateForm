
/**
 * @swagger
 * tags:
 *   name: Hospital
 *   description: Routes hôpital
 */
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const { createRequest, getMyRequests } = require('../controllers/hospitalController');

/**
 * @swagger
 * /api/hospitals/request:
 *   post:
 *     summary: Créer une demande de sang urgente
 *     tags: [Hospital]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               groupeSanguin: { type: string, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] }
 *               quantitePoches: { type: number }
 *               niveauUrgence: { type: string, enum: ['normal', 'urgent', 'critique'] }
 *               description: { type: string }
 *     responses:
 *       201:
 *         description: Demande créée et notifications envoyées
 */
router.post('/request', protect, authorize('hospital'), createRequest);

/**
 * @swagger
 * /api/hospitals/my-requests:
 *   get:
 *     summary: Consulter l'historique des demandes de l'hôpital
 *     tags: [Hospital]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des demandes
 */
router.get('/my-requests', protect, authorize('hospital'), getMyRequests);

module.exports = router;
