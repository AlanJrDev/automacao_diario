---
name: responsividade
description: Garante que TODO projeto seja responsivo em mobile, tablet e desktop. Aplica breakpoints consistentes, layouts fluidos e touch-friendly.
---

# Responsividade Mobile-First

## Breakpoints Padrão

- **Mobile**: < 640px — 1 coluna, sidebar overlay, fontes 14px, padding 16px
- **Tablet**: 640px–1024px — 2 colunas, sidebar collapsible, fontes 15px, padding 24px
- **Desktop**: > 1024px — layout completo, sidebar fixa, fontes 16px+

## Regras Obrigatórias

1. **Mobile-first**: comece com layout mobile, expanda com `min-width` media queries
2. **`em`/`rem`** para fontes e espaçamentos, não `px` (exceto bordas 1px)
3. **Grid fluido**: `grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))` em vez de colunas fixas
4. **Tabelas**: wrapper `overflow-x: auto` em telas < 768px, ou converta para cards
5. **Sidebar**: em mobile usar overlay com `position: fixed` + backdrop
6. **Touch targets**: botões/links > 44px de altura mínima
7. **Overflow**: telas < 640px nunca devem ter overflow-x horizontal

## Verificação

- Testar em 320px, 375px, 768px, 1024px
- Nada de `window.innerWidth` no JS — use CSS media queries + className
- Nada de horizontal scroll no mobile
- `max-width: 100vw` em qualquer elemento posicionado fixo

## Checklist por Tela

- [ ] Sidebar fecha automaticamente em mobile
- [ ] Tabelas têm scroll horizontal ou viram cards
- [ ] Gráficos (Recharts) usam `ResponsiveContainer`
- [ ] Botões têm padding mínimo de 12px vertical
- [ ] Formulários ocupam 100% da largura
- [ ] Chatbot ocupa 100vw em mobile
- [ ] Navegação por abas é scrollável horizontalmente
