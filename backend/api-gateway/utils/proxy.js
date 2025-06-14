const {
  createProxyMiddleware,
  fixRequestBody,
} = require("http-proxy-middleware");

const setupServiceProxy = (path, targetUrl) => {
  return createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    pathRewrite: {
      [`^${path}`]: "",
    },
    on: {
      proxyReq: fixRequestBody,
      error: (err, req, res) => {
        console.error(`Proxy error: ${err.message}`);
        res
          .status(500)
          .json({ error: "Proxy error occurred", details: err.message });
      },
    },
  });
};

module.exports = setupServiceProxy;
