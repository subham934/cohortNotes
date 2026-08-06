import { useEffect, useRef, useState } from "react";
import { cleanupFaceExpressionDetection, detect, init } from "../utils/utils";

export default function FaceExpression() {
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const streamRef = useRef(null);

  const [expression, setExpression] = useState("Click the button to start");
  const [isStarting, setIsStarting] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const handleDetectClick = async () => {
    if (isStarting) return;

    const isReady = await init({
      landmarkerRef,
      videoRef,
      streamRef,
      setExpression,
      setIsStarting,
      setIsCameraReady,
    });

    if (!isReady) return;

    setExpression("Checking...");
    detect({
      landmarkerRef,
      videoRef,
      setExpression,
    });
  };

  useEffect(() => {
    return () =>
      cleanupFaceExpressionDetection({
        landmarkerRef,
        streamRef,
      });
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
