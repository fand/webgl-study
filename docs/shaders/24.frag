#ifdef GL_ES
precision mediump float;
#define GLSLIFY 1
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 rotate(in vec2 v, in float a) {
    float s = sin(a);
    float c = cos(a);
    mat2 m = mat2(c, -s, s, c);
    return m * v;
}

#define NUM 6.
#define PI 3.141592653

float s (float v) {
    return step(0., v) * 2. - 1.;
}

void main (void) {
    vec2 p =  (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
    p = rotate(p, -PI / 6.);

    const float r3 = sqrt(3.);

    // Triangles
    vec2 pp = vec2(mod(p.x * NUM, 1.), mod(p.y * NUM, 0.5 * r3));  // Tile of (1, 0.5 * r3)
    pp.x -= fract(floor(p.y * NUM / r3 * 2.) * 0.5);

    float l1 = length(pp - vec2(0.5, -0.5 * r3));
    float l2 = length(pp - vec2(2., 0.));
    float l3 = length(pp - vec2(1., 0.));
    float l4 = length(pp - vec2(-0.5, -0.5 * r3));
    float l5 = length(pp - vec2(0., 0.));

    float c = 1.;
    float l = 0.;
    if (l1 < 1.) {
        l = l1;
    }
    else if (l2 < 1.) {
        l = l1;
    }
    else if (l3 < 1.) {
        l = l3;
    }
    else if (l4 < 1.) {
        l = l4;
    }
    else {
        l = l5;
    }
    c = sin((l * NUM - time * 2.) * 2. * PI);

    gl_FragColor = vec4(0., c * 0.5, c * 0.5, 1.);
}
