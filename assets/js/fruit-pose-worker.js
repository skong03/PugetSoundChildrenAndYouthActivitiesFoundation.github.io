/* Classic worker: MediaPipe's WASM loader uses importScripts. Keep inference off the game thread. */
"use strict";
self.exports = {};
let detector = null;
let busy = false;
self.onmessage = async ({ data }) => {
  if (data.type === "init") {
    try {
      importScripts("../vendor/mediapipe/vision_bundle.js");
      const { FilesetResolver, PoseLandmarker } = self.exports;
      const files = await FilesetResolver.forVisionTasks(new URL("../vendor/mediapipe/wasm", self.location.href).href);
      detector = await PoseLandmarker.createFromOptions(files, {
        baseOptions: { modelAssetPath: new URL("../vendor/mediapipe/pose_landmarker_lite.task", self.location.href).href, delegate: "CPU" },
        canvas: new OffscreenCanvas(640, 480),
        runningMode: "VIDEO", numPoses: 1,
        minPoseDetectionConfidence: .5, minPosePresenceConfidence: .5, minTrackingConfidence: .5,
        outputSegmentationMasks: false,
      });
      self.postMessage({ type: "ready" });
    } catch (error) { self.postMessage({ type: "error", message: String(error.message || error) }); }
  }
  if (data.type === "frame") {
    if (!detector || busy) { data.bitmap.close(); self.postMessage({ type: "result", landmarks: [], time: data.time }); return; }
    busy = true;
    try {
      const result = detector.detectForVideo(data.bitmap, data.time);
      self.postMessage({ type: "result", landmarks: result.landmarks[0] || [], time: data.time });
    } catch (error) { self.postMessage({ type: "error", message: String(error.message || error) }); }
    finally { data.bitmap.close(); busy = false; }
  }
};
