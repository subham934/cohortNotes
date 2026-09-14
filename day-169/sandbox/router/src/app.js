import express from "express";
import morgan from "morgan";
import { createProxyMiddleware } from "http-proxy-middleware";


const app = express();
app.use(morgan("combined"));

app.get('/api/status/healthz', (req, res) => {
    res.status(200).json({ status: 'ok' });
})

app.get('/api/status/readyz', (req, res) => {
    res.status(200).json({ status: 'ready' });
})

// this middleware will forward the request to the user-service, the request that comes to router-server, comes from pod1.preview.localhost, so we need to extract `pod1`, because this will be ID. 


app.use((req, res, next)=>{
    const host = req.headers.host;
    const sandboxId = host.split(".")[0]; // we are extracting the sandboxId from the host
    
    const target = `http://sandbox-service-${sandboxId}`; // we are forwarding the request to the user-service which is running on the sandbox namespace in the kubernetes cluster
    
    return createProxyMiddleware({
        target,
        changeOrigin: true,
        ws: true,
    })(req, res, next);

});

export default app;