float smoothwave(in float x, in float n) {
    float c = cos(x);
    float s = sign(c);
    return (pow(c - sign(c), n) -1.) * sign(c);
}

#pragma glslify: export(smoothwave)
