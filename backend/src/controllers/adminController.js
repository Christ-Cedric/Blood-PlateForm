const Hospital = require('../models/Hospital');
const User = require('../models/User');

// @desc    Valider un compte d'hôpital
// @route   PUT /api/admin/verify-hospital/:id
exports.verifyHospital = async (req, res) => {
    try {
        const hospital = await Hospital.findById(req.params.id);
        if (!hospital) return res.status(404).json({ message: 'Hôpital non trouvé' });

        hospital.verified = true;
        await hospital.save();
        res.json({ message: 'Compte hôpital validé avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Supprimer un compte (Utilisateur ou Hôpital)
// @route   DELETE /api/admin/account/:id?type=User|Hospital
exports.deleteAccount = async (req, res) => {
    try {
        const { type } = req.query;
        let model = type === 'Hospital' ? Hospital : User;

        const deleted = await model.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Compte non trouvé' });

        res.json({ message: 'Compte supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Obtenir des statistiques globales
// @route   GET /api/admin/stats
exports.getStats = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const hospitalCount = await Hospital.countDocuments();
        const verifiedHospitals = await Hospital.countDocuments({ verified: true });

        res.json({
            utilisateurs: userCount,
            hopitaux: hospitalCount,
            hopitauxVerifies: verifiedHospitals
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
