---
name: fullstack-senior
description: Padroes fullstack senior abrangendo backend seguro, frontend performatico, design system consistente e responsividade. Zero tech debt, zero comentarios no codigo.
---

# Fullstack Senior — Padrões de Qualidade

## Design System

- Paleta de cores via CSS custom properties (`:root`)
- Componentes reutilizáveis com props de variante (ex: `variant="primary"|"ghost"`)
- Tipografia consistente (font-family, scale 1.25x)
- Espaçamento em múltiplos de 4px (4, 8, 12, 16, 20, 24, 32, 40, 48, 64)
- Sombras e bordas padronizadas
- Animações centralizadas no CSS, não inline

## Backend / Integração

- `fetchWithRetry` com backoff exponencial (já existe no projeto)
- Tratamento de erro em 3 camadas: catch → fallback UI → log
- Timeout em todas as requisições externas
- Validação de dados antes de enviar ao servidor
- Separação entre dados mock → cache → live (fallback progressivo)
- Nunca expor API keys no client (usar `import.meta.env.VITE_*`)

## Performance

- Lazy loading de componentes pesados (Recharts, GSAP)
- IntersectionObserver para animações de entrada (já implementado)
- `React.memo` em listas grandes
- Debounce em inputs de busca
- Cache local (`localStorage`) com chave por período/turma

## Responsividade (integrado)

- Aplicar a skill `responsividade` em toda tela nova
- `@media (max-width: 640px)`, `@media (min-width: 641px) and (max-width: 1024px)`, `@media (min-width: 1025px)`
- Sidebar overlay em mobile, collapsible em tablet, fixa em desktop
- Tabelas responsivas com `overflow-x: auto`
- Grids com `auto-fit` e `minmax`

## Código Limpo

- Zero comentários explicativos
- Nomes semânticos (ex: `handleSubmit` em vez de `salvarDados`)
- Constantes em maiúsculo com SNAKE_CASE
- Inline styles só quando dinâmico; CSS classes para o resto
- Components puros e previsíveis
