#ifdef GL_ES
precision mediump float;
#define GLSLIFY 1
#endif

// from https://thebookofshaders.com/07/
float circle(in vec2 pos, in vec2 center, in float radius){
    vec2 dist = pos - center;
    return 1.0 - smoothstep(
        radius - (radius * 0.03),
        radius + (radius * 0.03),
        dot(dist, dist) * 4.0
    );
}

float rect(in vec2 pos, in vec2 begin, in vec2 end){
    return (
        smoothstep(begin.x - 0.001, begin.x, pos.x) *
        smoothstep(begin.y - 0.001, begin.y, pos.y) *
        smoothstep(end.x + 0.001, end.x, pos.x) *
        smoothstep(end.y + 0.001, end.y, pos.y)
    );
}

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main (void) {
    vec2 position = gl_FragCoord.xy / resolution.xy;
    float t = time;

    float r = 0.;
    for (int ri = 0; ri < 10; ri++) {
        r += circle(
            fract(position * 42.7 * t),
            vec2(0.5),
            pow(1.0 - sin(mod(t, float(ri))), 3.0) * 0.1
        ) * fract(t);
    }

    t *= 0.3;
    float g = 0.;
    for (int gi = 0; gi < 10; gi++) {
        g += rect(
            fract(position * float(gi) - 23. * t) - vec2(0.5),
            position * pow(0.9 - sin(mod(t, float(gi))), 10.0) * 0.8,
            position * 10.0 * abs(sin(t * t))
        ) * fract(t) * 0.2;
    }

    float b = 0.;
    for (int bi = 0; bi < 10; bi++) {
        b += circle(
            fract((position - vec2(0.5)) / cos(t + 1.2)),
            vec2(0.5) * t,
            pow(tan(mod(t, float(bi))), 12.0) * 7.1
        ) * abs(cos(t * float(bi))) * 0.1;
    }

    gl_FragColor = vec4(r, g, b, 1.0);
}
