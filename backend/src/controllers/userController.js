const User = require('../models/User');
const Donation = require('../models/Donation');

// @desc    Gérer le profil / Changer statut donneur
// @route   PUT /api/users/status
exports.updateDonorStatus = async (req, res) => {
    try {
        const { statutDonneur } = req.body;
        const user = await User.findById(req.user._id);

        user.statutDonneur = statutDonneur;
        await user.save();

        res.json({ message: `Votre statut est maintenant : ${statutDonneur}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Consulter l'historique des dons
// @route   GET /api/users/my-donations
exports.getMyDonations = async (req, res) => {
    try {
        const donations = await Donation.find({ userId: req.user._id }).populate('hospitalId', 'nom');
        res.json(donations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
