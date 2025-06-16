const {
  createProxyMiddleware,
  fixRequestBody,
} = require("http-proxy-middleware");

const setupServiceProxy = (path, targetUrl) => {
  return createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    pathRewrite: {
      "^/": `${path}`,
    },
    on: {
      proxyReq: (proxyReq, req, res) => {
        if (req.user) {
          proxyReq.setHeader("X-User", JSON.stringify(req.user));
        }
        fixRequestBody(proxyReq, req, res);
      },
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
