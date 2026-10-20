/**
 * The AI & ML curriculum: its modules.
 *
 * Topics are not listed here. A topic is "published" when a matching
 * content/ai-ml/<module>/<topic>.mdx file exists (lib/ai-ml.ts reads the
 * filesystem), so this file cannot drift out of sync with what is live. The
 * module order here is the order of the track.
 *
 * The track is general AI and machine learning, basics to advanced, with the
 * mathematics treated as a first-class subject. It is not automotive.
 */

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced'

export type AiMlModule = {
  slug: string
  name: string
  blurb: string
  /** lucide-react icon name, resolved in components/ai-ml/module-icon.tsx */
  icon: string
}

export const aiMlModules: AiMlModule[] = [
  {
    slug: 'foundations',
    name: 'Foundations',
    blurb:
      'The vocabulary and mental models everything else leans on: what AI and machine learning are, how a model learns, and the shapes almost every task reduces to.',
    icon: 'Compass',
  },
  {
    slug: 'python-for-ml',
    name: 'Python and the ML toolchain',
    blurb:
      'Everything you need to run the code in this track: Python, environments, notebooks, NumPy, pandas, plotting, scikit-learn, PyTorch, Git and GPUs.',
    icon: 'Terminal',
  },
  {
    slug: 'maths-linear-algebra',
    name: 'Maths: linear algebra',
    blurb:
      'Vectors, matrices and tensors, built up slowly with pictures and code until eigenvectors and the SVD feel natural. This is the language models are written in.',
    icon: 'Sigma',
  },
  {
    slug: 'maths-calculus',
    name: 'Maths: calculus',
    blurb:
      'Derivatives, gradients and the chain rule, and how they become automatic differentiation and backpropagation. The maths of learning from error.',
    icon: 'Calculator',
  },
  {
    slug: 'maths-probability-statistics',
    name: 'Maths: probability and statistics',
    blurb:
      'How to reason about uncertainty: distributions, Bayes, estimation, testing and sampling. The maths behind loss functions and generative models.',
    icon: 'Dices',
  },
  {
    slug: 'maths-optimisation-information',
    name: 'Maths: optimisation and information theory',
    blurb:
      'Gradient descent and its relatives, convexity, constraints, entropy and KL divergence. How a model is actually trained, and why the loss functions look the way they do.',
    icon: 'TrendingDown',
  },
  {
    slug: 'classical-ml',
    name: 'Classical machine learning',
    blurb:
      'Regression, trees, forests, boosting, SVMs, clustering and dimensionality reduction. The methods that still win on tabular data, and the base of everything deeper.',
    icon: 'Workflow',
  },
  {
    slug: 'ml-in-practice',
    name: 'Machine learning in practice',
    blurb:
      'Cleaning data, engineering features, splitting without leaking, choosing metrics, tuning, explaining and tracking experiments. Where real projects succeed or fail.',
    icon: 'ClipboardCheck',
  },
  {
    slug: 'deep-learning',
    name: 'Deep learning',
    blurb:
      'Neurons to deep networks: backpropagation, optimisers, regularisation, normalisation, training loops in PyTorch, and the practical craft of debugging training.',
    icon: 'Layers',
  },
  {
    slug: 'computer-vision',
    name: 'Computer vision',
    blurb:
      'How machines see: convolution, CNNs, detection, segmentation, vision transformers, CLIP and vision-language models, with code for each.',
    icon: 'Eye',
  },
  {
    slug: 'nlp',
    name: 'Natural language processing',
    blurb:
      'Text to numbers and back: tokenisation, embeddings, sequence models, attention, BERT and the classic NLP tasks.',
    icon: 'Languages',
  },
  {
    slug: 'transformers-llms',
    name: 'Transformers and large language models',
    blurb:
      'The transformer in depth, how LLMs are pretrained, aligned, fine-tuned, quantised and served, and what they can and cannot do.',
    icon: 'Sparkles',
  },
  {
    slug: 'llm-engineering',
    name: 'Building with LLMs',
    blurb:
      'Prompt engineering, structured output, embeddings, vector search, RAG, tool use, agents, MCP, evaluation and running models locally.',
    icon: 'Wrench',
  },
  {
    slug: 'generative-models',
    name: 'Generative models',
    blurb:
      'VAEs, GANs, flows and diffusion: how machines learn to create images, audio and video, and how to judge the result.',
    icon: 'Wand2',
  },
  {
    slug: 'reinforcement-learning',
    name: 'Reinforcement learning',
    blurb:
      'Learning by trial and reward: MDPs, Q-learning, policy gradients, PPO and how RL connects to training language models.',
    icon: 'Gamepad2',
  },
  {
    slug: 'other-ml',
    name: 'More ML: time series, recommenders, graphs and beyond',
    blurb:
      'Forecasting, recommendation, graph networks, audio, causal inference, federated and on-device learning, and other corners of the field.',
    icon: 'Boxes',
  },
  {
    slug: 'mlops-deployment',
    name: 'MLOps and deployment',
    blurb:
      'Taking a model from a notebook to a service: system design, serving, export formats, containers, registries, monitoring and cost.',
    icon: 'Rocket',
  },
  {
    slug: 'responsible-ai',
    name: 'Responsible AI',
    blurb:
      'Bias, privacy, security, safety, explainability, governance and the environmental and legal side of building with AI.',
    icon: 'Scale',
  },
  {
    slug: 'practical-tutorials',
    name: 'Practical tutorials',
    blurb:
      'Hands-on projects with open-source tools: local chatbots, image recognition, training and fine-tuning models, RAG, agents and deployment.',
    icon: 'FlaskConical',
  },
  {
    slug: 'research-frontiers',
    name: 'Frontiers',
    blurb:
      'How to read and reproduce papers, and where the field is heading: world models, reasoning models and open problems.',
    icon: 'Telescope',
  },
]

export const aiMlModuleBySlug = new Map(aiMlModules.map((m) => [m.slug, m]))
