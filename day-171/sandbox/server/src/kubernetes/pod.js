import { k8sCoreV1Api } from './config.js';

export async function createPod(sandboxId) {
  const podManifest = {
    metadata: {
      name: `sandbox-pod-${sandboxId}`,
      labels: {
        app: 'sandbox',
        sandboxId: sandboxId,
      },
    },
    spec: {
      // with this code, we have created a volume named 'workspace-volume', we have not synced it yet, till now, `vite-dev-server` /workspace is different and the `agent` /workspace is different, now we need to sync it
      volumes: [
        {
          name: 'workspace-volume',
          emptyDir: {},
        },
      ],
      initContainers: [
        {
          name: 'init-container', // name of the init container
          image: 'template', // this is the image which we use 
          imagePullPolicy: 'IfNotPresent', 
          command: ['sh', '-c', 'cp -r /workspace/. /seed/'],
          volumeMounts: [
            {
              name: 'workspace-volume',
              mountPath: '/seed',
            },
          ],
        },
      ],
      containers: [
        {
          image: 'template', // this is the image name called "template"
          imagePullPolicy: 'IfNotPresent',
          name: 'sandbox-container',
          ports: [{ containerPort: 5173, name: 'http' }],
          resources: {
            limits: { cpu: '500m', memory: '1Gi' },
            requests: { cpu: '250m', memory: '500Mi' },
          },
          volumeMounts: [
            {
              name: 'workspace-volume',
              mountPath: '/workspace',
            },
          ],
        },
        // with this code, the `agent` container will be created, along with the `template` container
        {
          image: 'agent',
          imagePullPolicy: 'IfNotPresent',
          name: 'agent-container',
          ports: [{ containerPort: 3000, name: 'http' }],
          resources: {
            limits: { cpu: '500m', memory: '1Gi' },
            requests: { cpu: '250m', memory: '500Mi' },
          },
          volumeMounts: [
            {
              name: 'workspace-volume',
              mountPath: '/workspace',
            },
          ],
        },
      ],
    },
  };

  const response = await k8sCoreV1Api.createNamespacedPod({
    namespace: 'default',
    body: podManifest,
  });

  return response;
}



