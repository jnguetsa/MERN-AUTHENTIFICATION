const mongoose = require("mongoose");
const express = require("express");
require("dotenv").config();
const USER = require("../Models/UserModels.js");
const bcrypt = require("bcrypt");
const {
  sendEmail,
  sendMailwelcome,
  sendMailforgotPwd,
} = require("../mailtrap/emails.js");

const { generateToken } = require("../util/generatoken.js");

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
      verifyTokenexpiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });

    console.log(user);

    const token = generateToken(user._id);
    await sendEmail(user.email, verificationToken); // Correction ici

    return res.status(201).json({
      message: "Utilisateur enregistré avec succès",
      token,
      user: { ...user._doc }, // Évite d'inclure le mot de passe
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Erreur lors de l'enregistrement de l'utilisateur ",
      error,
    });
  }
};

const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await USER.findOne({
      verificationToken: code,
      verifyTokenexpiredAt: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification code" });
    }

    (user.isverify = true),
      (user.verificationToken = undefined),
      (user.verifyTokenexpiredAt = undefined),
      await user.save();

    await sendMailwelcome(user.email, user.name);
    res.status(200).send({
      message: "Email envoyé avec succès",
      user: { ...user._doc },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Erreur lors de la vérification de l'email",
      error,
    });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Déconnexion réussie" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Une erreur est survenue lors de la déconnexion" });
  }
};

const login = async (req, res) => {
  const { email, pwd } = req.body;
  try {
    const user = await USER.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "L'utilisateur n'existe pas" });
    }
    const isPasswordCorrect = await bcrypt.compare(pwd, user.pwd);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }
    generateToken(user._id);
    (user.lastLogin = new Date()), await user.save();
    res
      .status(200)
      .json({ message: "Connexion réussie", user: { ...user._doc } });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Une erreur est survenue lors de la connexion" });
  }
};

const forgotPwd = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await USER.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "L'utilisateur n'existe pas" });
    }
    resetpwdExpireAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetpwdToken = token;
    user.resetpwdExpireAt = resetpwdExpireAt;
    await user.save();

    await sendMailforgotPwd(
      user.email,
      `${process.env.MAIL_SEND_FORGOTPWD}/forgotPwd/${token}`
    );
    res
      .status(200)
      .json({ message: "Cliquer sur le lien de reinitialisation" });
    return res.status(200).json({
      message: "Email envoyé avec succès",
      token,
      user: { ...user._doc },
    });
  } catch (error) {}
};

const resetpwd = async (req, res) => {
  try {
  } catch (error) {}
};

module.exports = {
  getAll,
  sign,
  verifyEmail,
  logout,
  login,
  forgotPwd,
  resetpwd,
};
