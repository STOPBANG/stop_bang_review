const tags = require("../public/assets/tag.js");
const jwt = require("jsonwebtoken");
const { httpRequest } = require('../utils/httpRequest.js');
const http = require('http');



module.exports = {

  reportCheck: async (req, res) => {
    let resultInt = 0;
    
    const getOptions = {
      host: 'stop_bang_sub_DB',
      port: process.env.PORT,
      path: `/db/report/findAllByID/${req.params.rv_id}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    }

    httpRequest(getOptions)
    .then(response => {
      const repoCount =response.body.length;
    
      if(repoCount >= 7) resultInt = 1;
      else resultInt = 0;

      const result = {
        rv_id: req.params_rv_id,
        result: resultInt
      };
      
      return res.json(result);
      
    });
  },
  
}