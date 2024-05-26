const tags = require("../public/assets/tag.js");
const jwt = require("jsonwebtoken");
const { httpRequest } = require('../utils/httpRequest.js');
const http = require('http');

module.exports = {

  createReview: async (req, res) => {
    const getOptions = {
      host: 'stop_bang_review_DB',
      port: process.env.PORT,
      path: `/db/review/findAllByRegnoAndUserId/${req.params.sys_regno}/${req.headers.id}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    };
    const result = await httpRequest(getOptions);

    return res.json(result.body);
  },

  //후기 추가 DB 반영
  creatingReview: (req, res) => {
  /* msa */
  const postOptionsResident = {
    host: 'stop_bang_auth_DB',
    port: process.env.PORT,
    path: `/db/resident/findById`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  };
  const requestBody = {username: req.body.username};
  httpRequest(postOptionsResident, requestBody)
  .then(() => {
    /* 포인트 지급 */
    // 작성된 후기가 첫 후기인지 체크
    const getOptionsReview = {
    host: 'stop_bang_review_DB',
    port: process.env.PORT,
    path: `/db/review/findAllByRegno/${req.params.sys_regno}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      }
    };
    httpRequest(getOptionsReview).then((response) => {
      const postOptionsPoint = {
        host: 'stop_bang_auth_DB',
        port: process.env.PORT,
        path: `/db/resident/updatePoint`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      };
      let requestBodyPoint = {
      username: req.body.username,
      r_point: 0,
    };
    
    const counts = response.body.length;

    if(counts > 0)
      requestBodyPoint.r_point=3
    else 
      requestBodyPoint.r_point=5

    return httpRequest(postOptionsPoint, requestBodyPoint);
  }).then(()=> {
      /* 후기 db에 반영 */
      const postOptionsReview = {
        host: 'stop_bang_review_DB',
        port: process.env.PORT,
        path: `/db/review/create`,
        method: 'POST',
        headers: {
         'Content-Type': 'application/json',
        }
      };
      const requestBody = {
        ...
        req.body,
        r_id: req.body.id,
        ra_regno: req.params.sys_regno,
      };

      return httpRequest(postOptionsReview, requestBody);
    });
  return res.json({});
  })
},

updateReview: (req, res) => {
  /* msa */
  const getOptions = {
    host: 'stop_bang_review_DB',
    port: process.env.PORT,
    path: `/db/review/findAllByReviewId/${req.params.rv_id}`,
    method: 'GET',
    headers: {
      ...req.headers,
    }
  };

  httpRequest(getOptions)
  .then((response)=> {
    return res.json(response.body[0]);
  });
},

//후기 수정 DB 반영
updatingReview: async (req, res) => {
  /* msa */
  const postOptions = {
    host: 'stop_bang_review_DB',
    port: process.env.PORT,
    path: `/db/review/update`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const requestBody = {
    ...
    req.body,
    rv_id: req.params.rv_id
  };
  await httpRequest(postOptions, requestBody);
  return res.json({});
},

reportCheck: async (req, res) => {
    const reportResult = {}
    const rv_id = req.params.rv_id;

    reportResult.rv_id = req.params.rv_id;
    reportResult.result = 0;
    
    const getOptions = {
      host: 'stop_bang_sub_DB',
      port: process.env.PORT,
      path: `/db/report/findAllByID/${rv_id}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    }

    try {
      const response = await httpRequest(getOptions);
      const reportCount = response.body.length;

      if (reportCount >= 7) reportResult.result = 1;
      else reportResult.result = 0;

      res.json(reportResult);
    } catch (error) {
      console.error("Error while fetching report data:", error);
      // 오류가 발생하면 오류 메시지를 클라이언트로 보냄
      res.status(500).json({ error: "Internal Server Error" });
    }
    
  },

  getAvgRate: async (req, res) =>{
    let result={};
    result.ra_regno = req.params.sys_regno;

    const getOptions = {
      host: "stop_bang_review_DB",
      port: process.env.PORT,
      path: `/db/review/findAllByRegno/${req.params.sys_regno}`,
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

