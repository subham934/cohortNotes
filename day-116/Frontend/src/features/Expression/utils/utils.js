import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

export const init = async ({
  landmarkerRef,
  videoRef,
  streamRef,
  setExpression,
  setIsStarting,
  setIsCameraReady,
}) => {
  if (landmarkerRef.current && streamRef.current) return true;

  try {
    setIsStarting(true);
    setExpression("Starting camera...");

    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
    );

    landmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task",
      },
      outputFaceBlendshapes: true,
      runningMode: "VIDEO",
      numFaces: 1,
    });

    streamRef.current = await navigator.mediaDevices.getUserMedia({
      video: true,
    });

    videoRef.current.srcObject = streamRef.current;
    await videoRef.current.play();

    setIsCameraReady(true);
    return true;
  } catch (err) {
    console.error("Initialization error:", err);
    setExpression("Could not start detection");
    return false;
  } finally {
    setIsStarting(false);
  }
};

export const detect = ({ landmarkerRef, videoRef, setExpression }) => {
  if (!landmarkerRef.current || !videoRef.current) return;

  const results = landmarkerRef.current.detectForVideo(
    videoRef.current,
    performance.now(),
  );

  if (results.faceBlendshapes?.length > 0) {
    const blendshapes = results.faceBlendshapes[0].categories;

    const getScore = (name) => {
      const blendshape = blendshapes.find(
        (item) => item.categoryName === name,
      );

      return blendshape?.score ?? 0;
    };

    // Extract values
    const smileLeft = getScore("mouthSmileLeft");
    const smileRight = getScore("mouthSmileRight");
    const jawOpen = getScore("jawOpen");
    const browUp = getScore("browInnerUp");
    const frownLeft = getScore("mouthFrownLeft");
    const frownRight = getScore("mouthFrownRight");

    let currentExpression = "🙂 Neutral";

    if (smileLeft > 0.5 && smileRight > 0.5) {
      currentExpression = "😄 Happy";
    } else if (jawOpen > 0.005 && browUp > 0.005) {
      currentExpression = "😲 Surprised";
    } else if (frownLeft > 0.0001 && frownRight > 0.0001) {
      currentExpression = "😢 Sad";
    }

    setExpression(currentExpression);
  } else {
    setExpression("No face detected");
  }
};

export const cleanupFaceExpressionDetection = ({
  landmarkerRef,
  streamRef,
}) => {
  if (landmarkerRef.current) {
    landmarkerRef.current.close();
    landmarkerRef.current = null;
  }

  if (streamRef.current) {
    streamRef.current.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }
};
