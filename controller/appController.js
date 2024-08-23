const mongoose = require("mongoose");
const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const USER = require("../Models/UserModels.js");
const bcrypt = require("bcrypt");
// const genratatoken = require("../util/generateToken.js");
const getAll = async (req, res) => {
  try {
    const user = await USER.find({});
    if (!user) {
      return res.status(404).json({ message: "Aucun utilisateur trouvé" });
    } else {
      console.log(user);

      return res.status(200).json({ message: user });
    }
  } catch (error) {
    return res
      .status(500)
      .jsaon({ message: "une erreur s'est produite: ", error });
    console.log("Une erreur s'est produite: ", error);
  }
};

const generateToken = (userId) => {
  const token = jwt.sign({ id: userId }, process.env.SECRET, {
    expiresIn: 60 * 60 * 24 * 7, // 1 semaine
  });
  return token;
};

const sign = async (req, res) => {
  try {
    const { name, email, pwd } = req.body;
    if (!name || !email || !pwd) {
      return res
        .status(400)
        .send({ message: "Veuillez renseigner tous les champs" });
    }

    const exist_user = await USER.findOne({ email });
    if (exist_user) {
      return res.status(400).send({ message: "Cet utilisateur existe déjà" });
    }

    const hash = await bcrypt.hash(pwd, 10);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const user = await USER.create({
      name,
      email,
      pwd: hash,
      verificationToken,
      verifyTokenexpiredAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
    });

    console.log(user);

    // Générer le token après que l'utilisateur a été créé
    const token = generateToken(user._id);
    const sendVerificationMail = await sendMail(user.email, verificationToken);

    // Envoie la réponse ici
    return res.status(201).json({
      message: "Utilisateur enregistré avec succès",
      token,
      user: { ...user._doc }, // Évite d'inclure le mot de passe
    });
  } catch (error) {
    console.error(error);
    // Envoie une réponse d'erreur si une exception se produit
    return res.status(500).send({
      message: "Erreur lors de l'enregistrement de l'utilisateur",
      error,
    });
  }
};

module.exports = { getAll, sign };
