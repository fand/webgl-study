precision mediump float;
uniform float time;
uniform vec2  mouse;
uniform vec2  resolution;
uniform sampler2D texture;

void main (void) {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 color = texture2D(texture, uv);

    if (sin(time * 10034.) < -0.9) {
        color.r = texture2D(texture, vec2(uv.x + sin(time * 123.45) * 0.2, uv.y)).r;
        color.g = texture2D(texture, vec2(uv.x + sin(time * 457.67) * 0.2, uv.y)).g;
        color.b = texture2D(texture, vec2(uv.x + sin(time * 9123.67) * 0.2, uv.y)).b;
    }

    gl_FragColor = color;
}
