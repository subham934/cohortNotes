import { useEffect, useRef, useState } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

export default function FaceExpression() {
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const streamRef = useRef(null);

  const [expression, setExpression] = useState("Click the button to start");
  const [isStarting, setIsStarting] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const init = async () => {
    if (landmarkerRef.current && streamRef.current) return true;

    try {
      setIsStarting(true);
      setExpression("Starting camera...");

      // Load MediaPipe vision
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
      );

      // Create FaceLandmarker
      landmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          // ✅ FIXED model URL
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task",
        },
        outputFaceBlendshapes: true,
        runningMode: "VIDEO",
        numFaces: 1,
      });

      // Start webcam
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

  const detect = () => {
    if (!landmarkerRef.current || !videoRef.current) return;

    const results = landmarkerRef.current.detectForVideo(
      videoRef.current,
      performance.now(),
    );

    if (results.faceBlendshapes?.length > 0) {
      const blendshapes = results.faceBlendshapes[0].categories;

      const getScore = (name) =>
        blendshapes.find((b) => b.categoryName === name)?.score || 0;

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

  const handleDetectClick = async () => {
    if (isStarting) return;

    const isReady = await init();
    if (!isReady) return;

    setExpression("Checking...");
    detect();
  };

  useEffect(() => {
    return () => {
      // Cleanup model
      if (landmarkerRef.current) {
        landmarkerRef.current.close();
      }

      // Stop camera
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <video
        ref={videoRef}
        style={{
          width: "400px",
          borderRadius: "12px",
          transform: "scaleX(-1)", // mirror view
        }}
        playsInline
        autoPlay
      />

      <h2>{expression}</h2>

      <button
        onClick={handleDetectClick}
        disabled={isStarting}
        style={{
          marginTop: "20px",
          border: "none",
          borderRadius: "999px",
          padding: "14px 28px",
          color: "white",
          cursor: isStarting ? "not-allowed" : "pointer",
          fontSize: "16px",
          fontWeight: 700,
          letterSpacing: "0.3px",
          background:
            "linear-gradient(135deg, #ff7a18 0%, #f04438 48%, #111827 100%)",
          boxShadow: "0 14px 30px rgba(240, 68, 56, 0.35)",
          opacity: isStarting ? 0.7 : 1,
          transform: "translateY(0)",
          transition: "transform 160ms ease, box-shadow 160ms ease",
        }}
        onMouseEnter={(event) => {
          if (isStarting) return;
          event.currentTarget.style.transform = "translateY(-2px)";
          event.currentTarget.style.boxShadow =
            "0 18px 38px rgba(240, 68, 56, 0.42)";
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.transform = "translateY(0)";
          event.currentTarget.style.boxShadow =
            "0 14px 30px rgba(240, 68, 56, 0.35)";
        }}
      >
        {isStarting
          ? "Starting..."
          : isCameraReady
            ? "Detect Again"
            : "Detect Expression"}
      </button>
    </div>
  );
}
