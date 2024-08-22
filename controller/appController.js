const mongoose = require("mongoose");
const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const USER = require("../Models/UserModels.js");
const bcrypt = require("bcrypt");

const getAll = async (req, res) => {
  try {
    const user = await USER.find({});
    if (!user) {
      return res.status(404).json({ message: "Aucun utilisateur trouvé" });
    } else {
      console.log("Aucun user trouvé");

      return res.status(200).json({ message: "Utilisateurs trouvés" });
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
        .status(402)
        .send({ message: "Veillez renseigner tous les champs" });
    }

    const user = await USER.findOne({ email });
    // Math.floor(100000 + Math.random()*900000).toString()
    if (user) {
      return res.status(400).send({ message: "Cette utilisateur exites deja" });
    }
  } catch (error) {}
};
module.exports = { getAll, sign };
