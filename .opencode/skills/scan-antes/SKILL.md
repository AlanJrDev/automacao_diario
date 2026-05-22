---
name: scan-antes
description: Use ANTES de ler arquivos. De preferencia use glob/grep pra localizar conteudo exato em vez de ler arquivo inteiro. So leia o arquivo completo se realmente necessario.
---

# Scan Antes de Ler

- Use glob pra achar arquivos por nome.
- Use grep pra achar conteudo especifico sem ler o arquivo todo.
- Leia somente as linhas necessarias (Read com offset/limit em vez do arquivo inteiro).
- preguiçoso é inteligente: menos tokens = mais rapido.
