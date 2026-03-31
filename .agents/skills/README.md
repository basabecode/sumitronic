Las skills canonicas del proyecto viven en `.claude/skills/`.

En `.agents/skills/` se exponen wrappers ligeros para que otras IAs puedan descubrirlas con la estructura esperada y seguir la ruta fuente real.

Si una skill existe en ambos lugares, la fuente de verdad es `.claude/skills/<skill>/`.
