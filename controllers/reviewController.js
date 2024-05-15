const tags = require("../public/assets/tag.js");
const jwt = require("jsonwebtoken");
const { httpRequest } = require('../utils/httpRequest.js');
const http = require('http');



module.exports = {

  reportCheck: async (req, res) => {
    const reportResult = {}

    reportResult.rv_id = req.params.rv_id;
    reportResult.result = 0;
    
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
      const reportCount =response.body.length;
    
      if(reportCount >= 7) reportResult.result = 1;
      else reportResult.result = 0;

      return res.json(reportResult);
      
    });
  },

  getAvgRate: async (req, res) =>{
    let result={};
    result.ra_regno = req.params.ra_regno;

    const getOptions = {
      host: "stop_bang_review_DB",
      port: process.env.PORT,
      path: `/db/review/findAllByRegno/${req.params.ra_regno}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    httpRequest(getOptions).then((response) => {
      const reviewCount = response.body.length;
      result.count=reviewCount;
      
      if (reviewCount>0){
        let ratingSum = 0;

        for (let review of response.body){
          ratingSum += review.rating
        }

        result.avg = (ratingSum/reviewCount);
    
        return res.json(result);
      }else{ 
        result.avg = 0;
        return res.json(result);
      }

    });

  }
}

