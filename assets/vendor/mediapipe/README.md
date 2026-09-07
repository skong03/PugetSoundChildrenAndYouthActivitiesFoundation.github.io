# Vendored MediaPipe assets

Runtime: Google `@mediapipe/tasks-vision` **0.10.32**, Apache-2.0.
Source: https://registry.npmjs.org/@mediapipe/tasks-vision/-/tasks-vision-0.10.32.tgz

The npm tarball's SHA-512 integrity was checked against its registry metadata before extracting files. `vision_bundle.cjs` is copied unchanged as `vision_bundle.js` so a classic worker can load it with a JavaScript MIME type. The worker provides `self.exports` for the CommonJS export object. Both SIMD and non-SIMD WASM variants are included. Source maps are development-only and omitted.

Pose Landmarker Lite, float16, model version 1:
https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task

Model SHA-256: `59929e1d1ee95287735ddd833b19cf4ac46d29bc7afddbbf6753c459690d574a`

Upstream license is preserved in `LICENSE`.
Implementation reference: https://developers.google.com/edge/mediapipe/solutions/vision/pose_landmarker/web_js

These files are served from the same origin as the game. Camera frames never need to be sent to a server.
