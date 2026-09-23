/**
 * The AI & ML for Automotive curriculum.
 *
 * This is the planned shape of the track, reviewed module by module before
 * each lesson gets written. A topic here is "published" once a matching
 * content/ai-ml/<module>/<topicSlug>.mdx file exists — lib/ai-ml.ts and
 * app/ai-ml/page.tsx check the filesystem directly rather than tracking a
 * separate status flag, so this file can't drift out of sync with what's
 * actually live.
 *
 * First module is deliberately generic ML/AI foundations, not automotive —
 * readers with no ML background need the vocabulary before anything about
 * the vehicle makes sense.
 */

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced'

export type AiMlModule = {
  slug: string
  name: string
  blurb: string
  /** lucide-react icon name, resolved in components/ai-ml/module-icon.tsx */
  icon: string
}

export type AiMlTopicPlan = {
  topicSlug: string
  moduleSlug: string
  title: string
  description: string
  difficulty: Difficulty
}

export const aiMlModules: AiMlModule[] = [
  {
    slug: 'foundations',
    name: 'Foundations',
    blurb:
      'The vocabulary and mental model this whole track leans on — what a model is, how it learns, and the handful of shapes almost every ML task reduces to. No vehicle yet.',
    icon: 'Compass',
  },
]

export const aiMlModuleBySlug = new Map(aiMlModules.map((m) => [m.slug, m]))

export const aiMlTopicPlan: AiMlTopicPlan[] = [
  {
    topicSlug: 'what-ai-actually-means',
    moduleSlug: 'foundations',
    title: 'What "AI" actually means',
    description:
      'Narrowing a marketing word into the handful of concrete techniques it gets used for, and where "machine learning" and "artificial intelligence" actually part ways.',
    difficulty: 'Beginner',
  },
  {
    topicSlug: 'model-weights-and-parameters',
    moduleSlug: 'foundations',
    title: 'A model is just weights',
    description:
      'What a trained model physically is — a fixed architecture plus a large set of numbers — and why "training" produces a file, not a program.',
    difficulty: 'Beginner',
  },
  {
    topicSlug: 'training-vs-inference',
    moduleSlug: 'foundations',
    title: 'Training vs. inference',
    description:
      'Two completely different workloads with different hardware, latency and cost — and why "runs on-device" almost always means inference only.',
    difficulty: 'Beginner',
  },
  {
    topicSlug: 'learning-paradigms',
    moduleSlug: 'foundations',
    title: 'Supervised, unsupervised and reinforcement learning',
    description:
      'The three basic setups a model gets trained under, a concrete example of each, and how to tell which one a given system is actually using.',
    difficulty: 'Beginner',
  },
  {
    topicSlug: 'prediction-shapes',
    moduleSlug: 'foundations',
    title: 'Classification, regression and generation',
    description:
      'The three shapes almost every ML task reduces to, and why picking the wrong one gives you a system that runs fine but answers the wrong question.',
    difficulty: 'Beginner',
  },
  {
    topicSlug: 'neural-networks-basics',
    moduleSlug: 'foundations',
    title: 'Neural networks, from one neuron up',
    description:
      'Layers, weights and activation functions built up from a single neuron, and why "deep" in deep learning just means "more layers."',
    difficulty: 'Intermediate',
  },
  {
    topicSlug: 'how-a-model-learns',
    moduleSlug: 'foundations',
    title: 'How a model learns',
    description:
      'Loss functions, gradients and backpropagation at a plain-language level — why training takes so much compute, and why it happens once, offline.',
    difficulty: 'Intermediate',
  },
  {
    topicSlug: 'overfitting-and-evaluation',
    moduleSlug: 'foundations',
    title: 'Overfitting and evaluation',
    description:
      'Why a model reporting 99% accuracy can still be useless in production, and the train / validation / test split that exists to catch it.',
    difficulty: 'Intermediate',
  },
  {
    topicSlug: 'architecture-families',
    moduleSlug: 'foundations',
    title: 'CNNs, RNNs and Transformers',
    description:
      'The three architecture families that matter, what each is actually good at, and why transformers ended up eating almost everything.',
    difficulty: 'Intermediate',
  },
  {
    topicSlug: 'model-size-and-quantization',
    moduleSlug: 'foundations',
    title: 'Model size, precision and quantization',
    description:
      'Why "7B parameters," "fp16" and "int8" show up constantly the moment a model has to run somewhere other than a data-center GPU — the on-ramp to the automotive-specific modules that follow.',
    difficulty: 'Intermediate',
  },
]

export function topicsForModule(moduleSlug: string): AiMlTopicPlan[] {
  return aiMlTopicPlan.filter((t) => t.moduleSlug === moduleSlug)
}
