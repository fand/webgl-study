#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backBuffer;

#define PI 3.141592

// [0,1) の乱数を返す
float rand (float v) {
    return sin(v * 123.4567) * 0.5 + 0.5;
}

void main( void ) {
    vec2 p = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y) ;

    // 同心円を36個作る
    float l = length(p);
    l *= 36.;

    float freq = floor(rand(floor(l)) * 3. + 2.);  // [2, 5)の整数
    float a = atan(p.y, p.x) * 2. ;  // [0, 2pi)
    float speed = rand(floor(l) * 3.) - 0.5; // [-0.5, 0.5)。freqとずらすために3倍している
    speed *= speed * speed * 30. + 2.; // 速度調整

    // 複数の波を組み合わせる
    float c = (
        sin((a / 4.) * freq + speed * time) *
        abs(sin((a / 4.) * freq + time * 3. + floor(l) * 2.)) *
        abs(cos((a / 0.25) * freq + speed * time * 6. + floor(l)))
    );
    c = step(0.4, c) / l / 0.05;

    // 残像を追加
    float d = texture2D(backBuffer, gl_FragCoord.xy / resolution.xy).r;
    c = c + 0.9 * d;

    gl_FragColor = vec4(c, c, c, 1.0);
}
