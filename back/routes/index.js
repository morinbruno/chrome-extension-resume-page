var express = require('express');
var router = express.Router();
require('dotenv').config()
const TOKEN = process.env.TOKEN

/* GET home page. */
router.post('/resume', async(req, res, next) => {
  const { request } = req.body;

  if (request) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${TOKEN}`);
    myHeaders.append("Cookie", "__cf_bm=0zIqAnn8.QP_Nzp96tFzbY3PPd8ZExOa.CodG_lMMQg-1741630540-1.0.1.1-AUHSb4lnN9qUz6xf.AXRAA78rUrm8t3faG_xIyst9q5djyqyvCvJk7qQw0QF3xoqdqUjNDgpSXWRe57gE8JBSjO04p9hkA6qnkgLBU44tUY");

    const raw = JSON.stringify({
      "model": "mistral-small-latest",
      "messages": [
        {
          "role": "user",
          "content": `Résume moi ce texte en traduisant en français, formate en HTML avec des classes bootstrap, stylise la réponse avec, renvoie juste le résumé sans message en plus et sans les backticks : ${request}`
        }
      ]
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    const result = await fetch("https://api.mistral.ai/v1/chat/completions", requestOptions)
      .then((response) => response.json())
      .then((result) => { return result.choices[0].message.content })
      .catch((error) => console.error(error))

    return res.json({ message: "Voici votre réponse", request: result });
  } else {
    return res.json({ message: "'request' est manquant " })
  }
});

module.exports = router;
