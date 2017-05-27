precision mediump float;
uniform float time;
uniform vec2  mouse;
uniform vec2  resolution;
uniform sampler2D texture;
#pragma glslify: rotate2D = require(../utils/rotate2d.frag)

// Return YMCK
vec4 k(in vec2 p, in vec2 cellCenter) {
    vec2 pp = rotate2D(cellCenter, -3.141592 * 0.25);
    vec4 i = texture2D(texture, pp / resolution.xy);
    return vec4(
        (i.r * 2. + i.g) * 0.25,
        (i.r + i.b) * 0.25,
        (i.g * 2.+ i.b) * 0.25,
        ((1. - i.r) + (1. - i.g) + (1. - i.b)) / 3.
    );
}

void main (void) {
    vec2 p = gl_FragCoord.xy;
    p = rotate2D(p, 3.141592 * 0.25);
    float cellSize = 8. + sin(time) * 3.;
    vec2 cellCenter = floor(p / cellSize) * cellSize + cellSize * 0.5;

    vec2 ccn = cellCenter + cellSize * vec2(-1, 1);
    vec2 cce = cellCenter + cellSize * vec2(1, 1);
    vec2 ccw = cellCenter + cellSize * vec2(-1, -1);
    vec2 ccs = cellCenter + cellSize * vec2(1, -1);

    vec2 pn = p + cellSize * vec2(-1, 1);
    vec2 pe = p + cellSize * vec2(1, 1);
    vec2 pw = p + cellSize * vec2(-1, -1);
    vec2 ps = p + cellSize * vec2(1, -1);

    vec4 c  = k(p,  cellCenter);
    vec4 cn = k(pn, ccn);
    vec4 ce = k(pe, cce);
    vec4 cw = k(pw, ccw);
    vec4 cs = k(ps, ccs);

    vec2 pcy = p + vec2(-.5, -2.);
    float cy = (
        (1. - step(c.x,  length(pcy - cellCenter) / cellSize)) +
        (1. - step(cn.x, length(pcy - ccn) / cellSize)) +
        (1. - step(ce.x, length(pcy - cce) / cellSize)) +
        (1. - step(cw.x, length(pcy - ccw) / cellSize)) +
        (1. - step(cs.x, length(pcy - ccs) / cellSize))
    );
    vec2 pcm = p + vec2(4, -2.);
    float cm = (
        (1. - step(c.y,  length(pcm - cellCenter) / cellSize)) +
        (1. - step(cn.y, length(pcm - ccn) / cellSize)) +
        (1. - step(ce.y, length(pcm - cce) / cellSize)) +
        (1. - step(cw.y, length(pcm - ccw) / cellSize)) +
        (1. - step(cs.y, length(pcm - ccs) / cellSize))
    );
    vec2 pcc = p + vec2(1., 2.);
    float cc = (
        (1. - step(c.z,  length(pcc - cellCenter) / cellSize)) +
        (1. - step(cn.z, length(pcc - ccn) / cellSize)) +
        (1. - step(ce.z, length(pcc - cce) / cellSize)) +
        (1. - step(cw.z, length(pcc - ccw) / cellSize)) +
        (1. - step(cs.z, length(pcc - ccs) / cellSize))
    );
    float ck = .2 * (
        (1. - step(c.w,  length(p - cellCenter) / cellSize)) +
        (1. - step(cn.w, length(p - ccn) / cellSize)) +
        (1. - step(ce.w, length(p - cce) / cellSize)) +
        (1. - step(cw.w, length(p - ccw) / cellSize)) +
        (1. - step(cs.w, length(p - ccs) / cellSize))
    );

    gl_FragColor = vec4(
        cy + cm - ck,
        cy + cc - ck,
        cm + cc - ck,
        1.
    );
}
