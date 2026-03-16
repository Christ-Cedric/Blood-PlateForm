const BloodRequest = require('../models/BloodRequest');
const Notification = require('../models/Notification');
const User = require('../models/User');
const Hospital = require('../models/Hospital');
const Donation = require('../models/Donation');

// @desc    Soumettre une demande urgente
// @route   POST /api/hospitals/request
exports.createRequest = async (req, res) => {
    try {
        console.log('--- DEBUG CREATE REQUEST ---');
        console.log('User:', req.user);
        console.log('Body:', req.body);
        const { groupeSanguin, quantitePoches, niveauUrgence, description } = req.body;

        const request = await BloodRequest.create({
            hospitalId: req.user._id,
            groupeSanguin,
            quantitePoches,
            niveauUrgence,
            description
        });

        console.log('Request created:', request._id);

        // Simuler l'envoi de notification aux donneurs du même groupe
        const potentialDonors = await User.find({ groupeSanguin, statutDonneur: 'actif' });
        console.log(`Found ${potentialDonors.length} potential donors`);

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
        console.error('ERROR IN createRequest:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mettre à jour le profil de l'hôpital
// @route   PUT /api/hospitals/profile
exports.updateProfile = async (req, res) => {
    try {
        const { nom, contact, region, localisation } = req.body;
        const hospital = await Hospital.findById(req.user._id);

        if (nom) hospital.nom = nom;
        if (contact) hospital.contact = contact;
        if (region) hospital.region = region;
        if (localisation) hospital.localisation = localisation;

        await hospital.save();
        res.json({ message: "Profil mis à jour avec succès", hospital });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Confirmer qu'un don a été effectué
// @route   PUT /api/hospitals/confirm-donation/:donationId
exports.confirmDonation = async (req, res) => {
    try {
        const { donationId } = req.params;
        const donation = await Donation.findById(donationId);

        if (!donation) {
            return res.status(404).json({ message: "Don non trouvé" });
        }

        // Vérifier que c'est bien l'hôpital concerné
        if (donation.hospitalId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Action non autorisée pour cet hôpital" });
        }

        // --- RÈGLE DES 3 MOIS (Sécurité hôpital) ---
        const lastDonation = await Donation.findOne({
            userId: donation.userId,
            statut: 'complete',
            _id: { $ne: donationId } // Ne pas compter le don actuel s'il était déjà marqué complete (cas bord)
        }).sort({ dateDon: -1 });

        if (lastDonation) {
            const threeMonthsInMs = 3 * 30 * 24 * 60 * 60 * 1000;
            const timeSinceLastDonation = Date.now() - new Date(lastDonation.dateDon).getTime();
            
            if (timeSinceLastDonation < threeMonthsInMs) {
                return res.status(400).json({ 
                    message: `Impossible de valider ce don. Le dernier don de ce donneur date de moins de 3 mois (${new Date(lastDonation.dateDon).toLocaleDateString('fr-FR')}).`
                });
            }
        }
        // -------------------------------------------

        donation.statut = 'complete';
        donation.dateDon = Date.now();
        await donation.save();

        // Notifier le donneur
        await Notification.create({
            destinataire: donation.userId,
            typeDestinataire: 'User',
            message: `Félicitations ! Votre don à l'Hôpital ${req.user.nom} a été validé. Vous avez sauvé des vies !`,
            type: 'don_valide'
        });

        res.json({ message: "Don confirmé avec succès", donation });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Consulter l'historique des demandes
// @route   GET /api/hospitals/my-requests
exports.getMyRequests = async (req, res) => {
    try {
        const requests = await BloodRequest.find({ hospitalId: req.user._id })
            .populate('hospitalId', 'nom region localisation')
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Consulter les statistiques de l'hôpital
// @route   GET /api/hospitals/stats
exports.getStats = async (req, res) => {
    try {
        const hospitalId = req.user._id;

        const totalRequests = await BloodRequest.countDocuments({ hospitalId });
        const confirmedDonations = await Donation.countDocuments({ hospitalId, statut: 'complete' });
        
        // Trouver le nombre de donneurs uniques
        const uniqueDonors = await Donation.distinct('userId', { hospitalId, statut: 'complete' });

        res.json({
            totalRequests,
            confirmedDonations,
            uniqueDonors: uniqueDonors.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Obtenir les donneurs ayant répondu à une demande spécifique
// @route   GET /api/hospitals/request-responses/:requestId
exports.getRequestResponses = async (req, res) => {
    try {
        const { requestId } = req.params;
        const Message = require('../models/Message');
        const responses = await Donation.find({ requestId })
            .populate('userId', 'nom prenom telephone groupeSanguin')
            .sort({ createdAt: -1 });
        
        // Pour chaque réponse, on cherche s'il y a un message initial
        const responsesWithMessages = await Promise.all(responses.map(async (donation) => {
            const message = await Message.findOne({ donationId: donation._id, senderType: 'User' }).sort({ createdAt: 1 });
            return {
                ...donation.toObject(),
                message: message ? message.content : null
            };
        }));

        res.json(responsesWithMessages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Consulter les notifications de l'hôpital
// @route   GET /api/hospitals/notifications
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ 
            destinataire: req.user._id,
            typeDestinataire: 'Hospital'
        }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mettre à jour le statut d'une demande
// @route   PUT /api/hospitals/request/:requestId
exports.updateRequestStatus = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { statut } = req.body;
        
        const request = await BloodRequest.findById(requestId);
        if (!request) return res.status(404).json({ message: "Demande non trouvée" });

        if (request.hospitalId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Non autorisé" });
        }

        request.statut = statut;
        await request.save();
        res.json(request);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
