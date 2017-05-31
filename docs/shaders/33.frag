precision mediump float;
#define GLSLIFY 1
uniform float time;
uniform vec2  mouse;
uniform vec2  resolution;
uniform sampler2D texture;
uniform sampler2D spectrum;
uniform sampler2D samples;
uniform float volume;

void main (void) {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 color = texture2D(texture, uv);
    float freq = texture2D(spectrum, vec2(0.7, .5)).r;

    // Seed value
    float v = freq * freq;

    // Prepare for chromatic Abbreveation
    vec2 focus = vec2(0.5, 0.2);
    float d = v * 0.06;
    vec2 ruv = focus + (uv - focus) * (1. - d);
    vec2 guv = focus + (uv - focus) * (1. - 2. * d);
    vec2 buv = focus + (uv - focus) * (1. - 3. * d);

    // Random Glitch
    if (v > 0.1) {
        // Randomize y
        float y = floor(uv.y * 13. * sin(35. * time)) + 1.;
        if (sin(36. * y * v) > 0.9) {
            ruv.x = fract(uv.x + sin(76. * y) * 0.1);
            guv.x = fract(uv.x + sin(34. * y) * 0.1);
            buv.x = fract(uv.x + sin(199. * y) * 0.1);
        }

        // RGB Shift
        v = pow(v * 1.5, 2.) * 0.15;
        color.r = texture2D(texture, vec2(uv.x + sin(time * 123.45) * v, uv.y)).r;
        color.g = texture2D(texture, vec2(uv.x + sin(time * 457.67) * v, uv.y)).g;
        color.b = texture2D(texture, vec2(uv.x + sin(time * 923.67) * v, uv.y)).b;
    }

    // Compose Chromatic Abbreveation
    color.r = color.r * 0.5 + color.r * texture2D(texture, ruv).r;
    color.g = color.g * 0.5 + color.g * texture2D(texture, guv).g;
    color.b = color.b * 0.5 + color.b * texture2D(texture, buv).b;

    gl_FragColor = color;

}
