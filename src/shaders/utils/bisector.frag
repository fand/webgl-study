highp vec2 bisector(highp vec2 a, highp vec2 b) {
  return normalize(length(b) * a + length(a) * b);
}

#pragma glslify: export(bisector)
