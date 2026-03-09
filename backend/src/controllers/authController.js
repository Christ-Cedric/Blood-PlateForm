const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Hospital = require('../models/Hospital');
const Admin = require('../models/Admin');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    S'inscrire en tant qu'utilisateur (donneur)
// @route   POST /api/auth/register-user
exports.registerUser = async (req, res) => {
    try {
        const { nom, prenom, email, motDePasse, telephone, lieuResidence, groupeSanguin } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'L\'utilisateur existe déjà' });

        const user = await User.create({ nom, prenom, email, motDePasse, telephone, lieuResidence, groupeSanguin });

        res.status(201).json({
            _id: user._id, nom, prenom, email,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    S'inscrire en tant qu'hôpital
// @route   POST /api/auth/register-hospital
exports.registerHospital = async (req, res) => {
    try {
        const { nom, email, motDePasse, numeroAgrement, contact, region, localisation } = req.body;

        const hospitalExists = await Hospital.findOne({ email });
        if (hospitalExists) return res.status(400).json({ message: 'L\'hôpital existe déjà' });

        const hospital = await Hospital.create({
            nom, email, motDePasse, numeroAgrement, contact, region, localisation
        });

        res.status(201).json({
            _id: hospital._id, nom, email,
            token: generateToken(hospital._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Connexion générale (Admin, Hôpital, Utilisateur)
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { email, nomUtilisateur, motDePasse } = req.body;

        let identity;
        if (nomUtilisateur) {
            identity = await Admin.findOne({ nomUtilisateur });
        } else if (email) {
            identity = await User.findOne({ email }) || await Hospital.findOne({ email });
        }

        if (identity && (await identity.matchPassword(motDePasse))) {
            res.json({
                _id: identity._id,
                nom: identity.nom || identity.nomUtilisateur,
                role: identity.role,
                token: generateToken(identity._id)
            });
        } else {
            res.status(401).json({ message: 'Identifiants invalides' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
