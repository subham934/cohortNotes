import express from 'express';
import morgan from 'morgan';
import { createPod } from './kubernetes/pod.js';
import { createService } from './kubernetes/service.js';
import { v7 as uuid } from 'uuid';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/sandbox/health', (req, res) => {
  res.status(200).json({
    message: 'Sandbox API is healthy',
    status: 'ok',
  });
});

app.post('/api/sandbox/start', async (req, res) => {
  const sandboxId = uuid();

  await Promise.all([createPod(sandboxId), createService(sandboxId)]);

  // we have created an API called /api/sandbox/start, when user requests to this API, we generate a sandboxId and with this Id we will create a POD and a SERVICE for that user. The POD will have the image called "template" which we created earlier, and this image will have the vite-development-server running. The SERVICE will forward the request to the POD, so that user can access the preview URL and terminal URL. The preview URL will be like "sandboxId.preview.localhost" and the terminal URL will be like "sandboxId.terminal.localhost". The ingress will forward the request to the service, and the service will forward the request to the pod.

  res.status(200).json({
    message: 'Sandbox environment created successfully',
    status: 'ok',
    sandboxId,
    previewUrl: `http://${sandboxId}.preview.localhost`,
  });
});

export default app;
