#pragma glslify: snoise3 = require(glsl-noise/simplex/3d) 

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vMatCapUV;

uniform sampler2D uMatCap;
uniform float uSpecterSize;
uniform float uWaveBorder;
uniform float uWaveSpeed;
uniform vec3 uBorderColor;
uniform float uTime;

void main() {

    float n3 = snoise3(vec3(vPosition.xz * 2., uTime * 0.01)) * 1.;

    float w = sin(vPosition.y * 2. - uTime*uWaveSpeed);

    float borderMask = step(w, n3 - uSpecterSize);
    borderMask -= step(w, n3 - (uSpecterSize + uWaveBorder));
    vec4 borderOut = vec4(uBorderColor * borderMask, borderMask);

    float mcMask = step(w, n3 - uSpecterSize);

    vec4 matCap = texture2D(uMatCap, vMatCapUV);
    vec4 matCapOut = vec4(matCap.rgb, mcMask);

    float opMask = 1. - vPosition.y * 0.3;
    vec4 opMaskOut = vec4(1., 1., 1., opMask);

    vec4 col = matCapOut + borderOut;
    col *= opMaskOut;

    gl_FragColor = vec4(col);
}