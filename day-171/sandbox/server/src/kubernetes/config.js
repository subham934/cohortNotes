import * as K8sApi from '@kubernetes/client-node';

const kc = new K8sApi.KubeConfig();
kc.loadFromDefault();

export const k8sCoreV1Api = kc.makeApiClient(K8sApi.CoreV1Api);

// with the help of k8sCoreV1Api we can create a pod, service.