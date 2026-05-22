---
name: visao-lote
description: Use quando o usuario pedir edicoes em lote, mudancas em varios lugares, ou "visao". Leia o arquivo INTEIRO primeiro, planeie TODAS as edicoes necessarias, execute de uma vez, e so depois va pro proximo arquivo.
---

# Visão em Lote — Batch Edit Skill

## Quando usar

- Usuario pede "faca X" que envolve mudar varias partes do mesmo arquivo
- Usuario menciona "visao", "lote", "batch", "de uma vez"
- Ha necessidade de entender o contexto completo antes de editar

## Regras

1. **LEIA o arquivo inteiro** antes de qualquer edicao
2. **PLANEIE todas as mudancas** — enumere mentalmente cada edicao
3. **EXECUTE todas** no mesmo arquivo antes de tocar em outro
4. So **AVANCE** pro proximo arquivo quando o atual estiver 100% pronto

## Exemplo de fluxo

```
LER src/App.jsx → planejar edits 1-5 → aplicar edit 1,2,3,4,5 → PRONTO
LER src/index.css → planejar edits 1-3 → aplicar edit 1,2,3 → PRONTO
```

Nada de editar 1 linha, perguntar, editar outra, perguntar. Tudo de uma vez.
