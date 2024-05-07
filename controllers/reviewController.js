const tags = require("../public/assets/tag.js");
const jwt = require("jsonwebtoken");
const { httpRequest } = require('../utils/httpRequest.js');
const http = require('http');



module.exports = {

  reportCheck: async (req, res) => {
    const reportResult = {}

    reportResult.rv_id = req.params.rv_id;
    reportResult.resultInt = 0;
    
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
    
      if(repoCount >= 1) reportResult.resultInt = 1;
      else reportResult.resultInt = 0;

      return res.json(reportResult);
      
    });
  },
  
}