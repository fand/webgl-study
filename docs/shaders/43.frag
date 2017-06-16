#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable
#define GLSLIFY 1

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float t(){
    return pow(mod(time * 2., 24.) + 2., 3.);
}

vec2 rot(in vec2 p, in float t) {
    return mat2(cos(t), -sin(t), sin(t), cos(t)) * p;
}

void main( void ) {
    vec2 p = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
    p = rot(p, floor(length(p) * 38.) * 2.08);
    p = rot(p, time);
    p.x -= t() * 1.53007;
    p /= t();

    vec2 z = p.xy;
    float count = 0.;

    for (int i = 0; i < 64; i++) {
        z = vec2(z.x * z.x - z.y * z.y, 2. * z.x * z.y) + p;
        count = float(i);
        if (length(z) > 2.) {
            break;
        }
    }

    vec3 rgb = hsv2rgb(vec3(count  / 2., 1., 1.));

    gl_FragColor = vec4(rgb, 1.);
}
