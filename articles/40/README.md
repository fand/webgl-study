## 40. Bankohan / 3D Metaballs Mod

藤崎竜の封神演義に登場する武器「盤古旛」をイメージした。
ボールの粘りはsmoothMinでは表現できなかったので、以下の手順で計算している。

- レイの先端をP, 結合するボールの中心をC1, C2とする
- `max(dot(P - C2, C1 - C2), 0.0)` により、連結箇所に近づくにつれて大きくなる値を求める
- Pを上の値に応じてC2に近づける