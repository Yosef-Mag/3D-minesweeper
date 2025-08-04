// vertex.glsl
#ifdef GL_ES
precision highp float;
#endif

// existing varyings
varying vec2 csm_vUv;

// new: world‐pos
varying vec2 vWorldPos;

void main() {
  // uv for any local detail
  csm_vUv = uv;
  
  // world position: transform your local position into world space
  vec4 worldP = modelMatrix * vec4(position, 1.0);
  vWorldPos = worldP.xz;        // grab X and Z
  
  // standard projection
  gl_Position = projectionMatrix * viewMatrix * worldP;
}
