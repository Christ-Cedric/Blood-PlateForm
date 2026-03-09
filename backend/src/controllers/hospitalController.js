const BloodRequest = require('../models/BloodRequest');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Soumettre une demande urgente
// @route   POST /api/hospitals/request
exports.createRequest = async (req, res) => {
    try {
        const { groupeSanguin, quantitePoches, niveauUrgence, description } = req.body;

        const request = await BloodRequest.create({
            hospitalId: req.user._id,
            groupeSanguin,
            quantitePoches,
            niveauUrgence,
            description
        });

        // Simuler l'envoi de notification aux donneurs du même groupe
        const potentialDonors = await User.find({ groupeSanguin, statutDonneur: 'actif' });

        for (let donor of potentialDonors) {
            await Notification.create({
                destinataire: donor._id,
                typeDestinataire: 'User',
                message: `URGENT: Besoin de sang ${groupeSanguin} à l'Hôpital ${req.user.nom}`,
                type: 'demande_urgence'
            });
        }

        res.status(201).json(request);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Consulter l'historique des demandes
// @route   GET /api/hospitals/my-requests
exports.getMyRequests = async (req, res) => {
    try {
        const requests = await BloodRequest.find({ hospitalId: req.user._id });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
