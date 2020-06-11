// @ts-ignore 
const proxy = require('http-proxy-middleware');


function onProxyReq(proxyReq, req, res) {
  proxyReq.setHeader('Cookie', 'token=38ab5f05c54344dd9a35ba98139862d3');
}

module.exports = function(app) {
  


};