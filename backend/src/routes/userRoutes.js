
/**
 * @swagger
 * tags:
 *   name: User
 *   description: Routes utilisateur
 */
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { updateDonorStatus, getMyDonations } = require('../controllers/userController');

/**
 * @swagger
 * /api/users/status:
 *   put:
 *     summary: Changer le statut du donneur (Actif/Inactif)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               statutDonneur: { type: string, enum: ['actif', 'inactif'] }
 *     responses:
 *       200:
 *         description: Statut mis à jour
 */
router.put('/status', protect, updateDonorStatus);

/**
 * @swagger
 * /api/users/my-donations:
 *   get:
 *     summary: Consulter l'historique de ses propres dons
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des dons retournée
 */
router.get('/my-donations', protect, getMyDonations);

module.exports = router;
