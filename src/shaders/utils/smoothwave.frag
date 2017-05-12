float smoothwave(in float n) {
    float c = cos(x);
    float s = sign(c);
    return (pow(c - sign(c), 7.0) -1.) * sign(c);
}

