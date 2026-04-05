// Demo tier config — set VITE_DEMO_TIER in .env
// medium (default): client-side educational demos, no API cost
// advanced:         live AI responses via /api/demo/* serverless routes
export const demoTier = import.meta.env.VITE_DEMO_TIER === 'advanced' ? 'advanced' : 'medium'
export const isAdvancedDemo = demoTier === 'advanced'
