import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Un fichero .md en src/content/casos/ = una mini página pública.
// El schema es el guardián: si a un caso le falta `titulo`, `version`,
// `fecha` o `estado`, el build falla en vez de publicar una página rota.
const casos = defineCollection({
  loader: glob({ base: './src/content/casos', pattern: '**/*.md' }),
  schema: z.object({
    titulo: z.string(),
    version: z.string(),
    fecha: z.string(),
    estado: z.enum(['publicado', 'borrador']),
    evidencia: z.string().optional(),
    limite: z.string().optional(),
  }),
});

export const collections = { casos };
