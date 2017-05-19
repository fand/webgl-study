#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backBuffer;

#define PI 3.14159265358979323846

#pragma glslify: smoothwave = require(../utils/smoothwave.frag)

vec2 rotate2D(vec2 _st, float _angle){
    _st -= 0.5;
    _st =  mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle)) * _st;
    _st += 0.5;
    return _st;
}

vec2 tile(vec2 _st, float _zoom){
    _st *= _zoom;
    return fract(_st);
}

float box(vec2 _st, vec2 _size, float _smoothEdges){
    _size = vec2(0.5) - _size * 0.5;
    vec2 aa = vec2(_smoothEdges * 0.5);
    vec2 uv = smoothstep(_size, _size + aa, _st);
    uv *= smoothstep(_size, _size + aa, vec2(1.0) - _st);
    return uv.x * uv.y;
}

void main(void){
    vec2 st = gl_FragCoord.xy / resolution.xy;
    float t = time * 2.;

    st.x += smoothwave(t * 0.5 + 0.5 * PI, 10.) * 0.125;
    st.y += smoothwave(t * 0.5 + 1.0 * PI, 10.) * 0.125;
    st = tile(st, 4.);  // Divide the space in 4

    float w = smoothwave(t, 4.) * 0.2 + 0.2;
    float c = box(st, vec2(.97 + w * 1.3), 0.01);

    w = smoothwave(t + PI, 4.) * 0.2 + 0.2;
    c *= smoothstep(0.01, 0.011, abs(st.x - 0.5) + w);
    c *= smoothstep(0.01, 0.011, abs(st.y - 0.5) + w);

    st = rotate2D(st, PI * 0.25);

    w = smoothwave(t, 4.) * 0.2 + 0.2;
    w *= 2.3;
    c += box(st, vec2(1.14 - w), 0.01) - box(st, vec2(1.2 - w), 0.01);
    c -= box(st, vec2(1.2 - w), 0.01) - c;

    c = 1.0 - c;

    gl_FragColor = vec4(c, c, c, 1.0);
}
