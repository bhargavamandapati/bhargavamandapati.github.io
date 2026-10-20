/**
 * The site's changelog — every shipped release, newest first.
 *
 * One entry per calendar day a change actually deployed. Add a new entry at
 * the top of `changelog` whenever content is added or an issue is fixed —
 * that is the entire point of this file existing.
 *
 * When an "added" line is a brand-new page (not an enrichment of an existing
 * one), give it `links` here pointing straight at the page, and add a
 * matching entry to `data/new-content.ts` so its card picks up a "New" badge.
 */

export type ChangeType = 'added' | 'changed' | 'fixed' | 'security'

export type ChangeLink = {
  label: string
  /** Site-relative path, e.g. "/learn/connectivity/esim-provisioning/". */
  href: string
}

export type Change = {
  type: ChangeType
  text: string
  /** Direct links to what an "added" line is describing, so it's one click away. */
  links?: ChangeLink[]
}

export type ChangelogEntry = {
  /** "2026.09.12" — the release's own version, not a date format elsewhere on the site. */
  version: string
  /** ISO date, for sorting and display. */
  date: string
  title: string
  changes: Change[]
}

export const changelog: ChangelogEntry[] = [
  {
    version: '2026.10.20',
    date: '2026-10-20',
    title: 'AI & ML launches as the third track; every Learn, tutorial and SDV topic rewritten; 36 new core-module pages',
    changes: [
      {
        type: 'added',
        text: 'AI & ML is now a full track and no longer “for Automotive”: general AI and machine learning from the mathematics up. The plan covers 20 modules — foundations, the Python toolchain, four maths modules (linear algebra, calculus, probability and statistics, optimisation and information theory), classical ML, ML in practice, deep learning, computer vision, NLP, transformers and LLMs, building with LLMs (prompting, RAG, agents, MCP, local models), generative models, reinforcement learning, MLOps, responsible AI, practical tutorials and research frontiers. Ten new topics are added every hour.',
        links: [{ label: 'AI & ML', href: '/ai-ml/' }],
      },
      {
        type: 'added',
        text: 'A separate access key for AI & ML, set up exactly like Learn AAOS and SDV: every AI & ML topic is locked by default except a short free trial (the first lesson, gradient descent and a first-model tutorial). The article bodies are encrypted at build time, the key is rotated monthly by the access service, and holding a key for one track opens nothing in the others. “AI & ML” now appears in the Access menu and in the request-access form.',
      },
      {
        type: 'added',
        text: 'Mathematics on the page: formulas in AI & ML topics are typeset with KaTeX at build time, so they are plain HTML and survive the encryption like any other text.',
      },
      {
        type: 'added',
        text: 'Interactive diagrams for AI & ML: small widgets you can drag and tweak inside a lesson — a matrix transformation lab, gradient descent on three different curves, a single-neuron playground, a distribution explorer, a least-squares regression lab and a softmax temperature lab. They work inside locked topics too, once the key is entered.',
      },
      {
        type: 'changed',
        text: 'Home page: the “coming soon” AI & ML card is now a full AI & ML section (maths first, interactive diagrams, projects you can run), the library grid gained AI & ML topic and interactive-diagram counts, the hero names the third track, and the access section now describes three separate keys.',
      },
      {
        type: 'changed',
        text: 'Navigation and search: “AI & ML” is a menu with sub-sections instead of a single link, search results are grouped under AI & ML, the sitemap lists the free AI & ML topics, and the AI & ML sidebar shows lock badges the way SDV does.',
      },
      {
        type: 'changed',
        text: 'Learn (116 topics) — every topic rewritten to one anatomy: a short introduction with key terms and a page map, a “what it is” section, “how it works” in numbered parts, a worked example, common mistakes, a conclusion, and a revision card with a self-test. Each page now has at least one diagram and two tables, sentences average under 18 words, and no paragraph runs past 100.',
      },
      {
        type: 'changed',
        text: 'Tutorials (67) — every tutorial rewritten to the tutorial anatomy: the idea in 60 seconds, a step map, numbered steps each with a goal, “if it did not work” notes, a verify section, troubleshooting, a conclusion and revision.',
      },
      {
        type: 'changed',
        text: 'SDV (49 topics) — rewritten to the same anatomy as Learn. Claims about AUTOSAR, SOME/IP, VSS and KUKSA were checked against the official sites where they could be fetched; anything that could not be checked says “not confirmed here”.',
      },
      {
        type: 'changed',
        text: 'Honesty pass — across all three areas, specifics that could not be confirmed against an official source (regulation texts, command forms that differ between pages, version-specific snippets) are now marked “not confirmed here” instead of stated as fact. The open points are tracked in the content review notes.',
      },
      {
        type: 'added',
        text: 'Audio control HAL (new, audio) — the IAudioControl interface that Car Service uses to talk to the vendor audio stack: its seven groups of methods, how focus and gain requests travel in each direction, and why configured gain on a bus goes through a different door.',
        links: [{ label: 'The audio control HAL', href: '/learn/audio/audio-control-hal/' }],
      },
      {
        type: 'added',
        text: 'Bluetooth audio routing (new, audio) — how a connected phone’s audio becomes a device in the audio policy, and how Android decides which output a Bluetooth stream uses. Marks what the author’s grep did and did not cover.',
        links: [{ label: 'Bluetooth audio routing', href: '/learn/audio/bluetooth-audio-routing/' }],
      },
      {
        type: 'added',
        text: 'The volume dialog and its callbacks (new, audio) — the path from a volume key or the dialog to a volume group, the car volume callbacks, and why the shell command takes a percent while the dialog works in steps.',
        links: [{ label: 'The volume dialog and its callbacks', href: '/learn/audio/volume-dialog-and-callbacks/' }],
      },
      {
        type: 'added',
        text: 'The car Dialer app (new, connectivity) — what the car’s Dialer is made of, read from a prebuilt app’s class and string tables, and how it becomes the default phone app that Telecom binds.',
        links: [{ label: 'The car Dialer app', href: '/learn/connectivity/car-dialer-app/' }],
      },
      {
        type: 'added',
        text: 'The Telecom and InCallService chain (new, connectivity) — how a Bluetooth call reaches the screen: the HFP client, the connection service, Telecom, then the InCallServices; the call-state mapping and the 60-second ringing and dialing limit.',
        links: [{ label: 'The Telecom and InCallService chain', href: '/learn/connectivity/telecom-incallservice-chain/' }],
      },
      {
        type: 'added',
        text: 'The HFP client state machine (new, connectivity) — the five link states, the eight call states, and why the call states are built by asking the phone for its call list rather than copied from its indicators; one phone account per phone and why the default Dialer cannot choose between two.',
        links: [{ label: 'The HFP client state machine', href: '/learn/connectivity/hfp-client-state-machine/' }],
      },
      {
        type: 'added',
        text: 'PBAP contacts sync (new, connectivity) — the car pulls the phone book as a PBAP client in vCard 3.0, 250 contacts a batch, into the Contacts Provider under one account per phone; what is confirmed and what is only inferred about the shared in-memory cache.',
        links: [{ label: 'PBAP contacts sync', href: '/learn/connectivity/pbap-contacts-sync/' }],
      },
      {
        type: 'added',
        text: 'Voice dialing in a reference assistant (new, apps and media) — how a spoken “call …” becomes TelecomManager.placeCall, the assistant’s own spoken confirmation, why the Dialer has no voice hook, and the answer-call gap.',
        links: [{ label: 'Voice dialing in a reference assistant', href: '/learn/apps-media/voice-dialing-reference-assistant/' }],
      },
      {
        type: 'added',
        text: 'The navigation state protobuf (new, cluster and displays) — the message tree a navigation app sends to the cluster, the 57 maneuver types by family, distance and cue fallbacks, and the one rule Car Service enforces on the old and new maneuver fields.',
        links: [{ label: 'The navigation state protobuf', href: '/learn/cluster-displays/navigation-state-protobuf/' }],
      },
      {
        type: 'added',
        text: 'The cluster navigation bridge (new, cluster and displays) — the five hops from sendNavigationStateChange to the cluster renderer, the three checks at the front door, the start-up guard that lets only one cluster service run, and the five permissions in a table.',
        links: [{ label: 'The cluster navigation bridge', href: '/learn/cluster-displays/cluster-navigation-bridge/' }],
      },
      {
        type: 'added',
        text: 'Car App Library to the cluster (new, apps and media) — how a templated navigation app reaches the instrument cluster: the Templates Host sits between app and platform, the evidence is the permissions the host holds, and the page separates what is shown from what is inferred. Turn data and the cluster display are two different routes.',
        links: [{ label: 'Car App Library to the cluster', href: '/learn/apps-media/car-app-library-to-cluster/' }],
      },
      {
        type: 'added',
        text: 'Map app selection (new, apps and media) — how the map tile picks an app: plain intent resolution on MAIN plus the maps category, the placeholder at priority -1000 as the last resort, the preferred-list resource, and the terms-of-service gate. There is no setter for a navigation app.',
        links: [{ label: 'Map app selection', href: '/learn/apps-media/map-app-selection/' }],
      },
      {
        type: 'added',
        text: 'The HVAC property surface (new, vehicle data) — the 22 climate properties behind one permission, which 16 are seat-based and which 6 are not, the area types that trip up a loop over all properties, and how the deprecated CarHvacManager relates to CarPropertyManager.',
        links: [{ label: 'The HVAC property surface', href: '/learn/vehicle-data/hvac-property-surface/' }],
      },
      {
        type: 'added',
        text: 'The HVAC panel call chain (new, HMI) — how one tap becomes one property write per real seat area: the panel’s own controller splits the target bitmask, Car Service matches areas exactly, and a widget in the system bar needs its own controller to register.',
        links: [{ label: 'The HVAC panel call chain', href: '/learn/hmi/hvac-panel-call-chain/' }],
      },
      {
        type: 'added',
        text: 'HVAC panel customization points (new, HMI) — eight places to change the climate panel in four layers: vehicle data, resource values, the whole layout, and which code runs. Data and resource changes need no Java edit, and the page says which limits were seen only in the author’s tree.',
        links: [{ label: 'HVAC panel customization points', href: '/learn/hmi/hvac-panel-customization-points/' }],
      },
      {
        type: 'added',
        text: 'The HVAC validation cycle (new, vehicle data) — how to prove a climate property works on the emulator: read the zones, range and configArray, test a value on each side of the limit, and read back after every write; what each step proves and what it leaves open, and why the inject command rejects “-a”.',
        links: [{ label: 'HVAC validation on the emulator', href: '/learn/vehicle-data/hvac-validation-on-the-emulator/' }],
      },
      {
        type: 'added',
        text: 'What sits below CarEvsManager (new, cluster and displays) — the EVS manager daemon, the EVS HAL and the display proxy, the /default and /hw/0 instances, the bypass that steals the camera, a four-check order for a camera that never opens, and a CarEvsManager reference card.',
        links: [{ label: 'EVS below CarEvsManager', href: '/learn/cluster-displays/evs-below-carevsmanager/' }],
      },
      {
        type: 'added',
        text: 'EVS permissions and SELinux (new, security) — two independent gates guard the raw camera path: four signature|privileged permissions in Java and a short HAL-client list in SELinux; why each still protects when the other fails.',
        links: [{ label: 'EVS permissions and SELinux', href: '/learn/security/evs-permissions-and-selinux/' }],
      },
      {
        type: 'added',
        text: 'The notification shade as an overlay window (new, HMI) — the shade as one guest controller in a shared overlay window, how a drag opens it, and the five list jobs in the Notification app: filter, trim, group, split and rank.',
        links: [{ label: 'The notification shade overlay window', href: '/learn/hmi/notification-shade-overlay-window/' }],
      },
      {
        type: 'added',
        text: 'The Quick Controls framework (new, HMI) — the host draws and the provider decides: a parcelable description crosses a ContentProvider call guarded by a package allowlist, the user-id address rewrite, and how a slider follows a hardware knob without polling.',
        links: [{ label: 'The Quick Controls framework', href: '/learn/hmi/quick-controls-framework/' }],
      },
      {
        type: 'added',
        text: 'Driver and passenger keyguard (new, HMI) — the driver’s lock screen is the phone’s bouncer in a thin car wrapper; a passenger’s is a separate pipeline behind three start-up checks; why only the driver’s runs on the emulator product, and the open security question when the flag is off.',
        links: [{ label: 'Driver and passenger keyguard', href: '/learn/hmi/driver-and-passenger-keyguard/' }],
      },
      {
        type: 'added',
        text: 'Why your app’s Toast never appears (new, HMI) — the car’s toast gate drops callers that are not system, privileged or platform-signed or on an allowlist, silently; the lock-screen toast that bypasses it, and a one-minute test.',
        links: [{ label: 'The car toast allowlist', href: '/learn/hmi/car-toast-allowlist/' }],
      },
      {
        type: 'added',
        text: 'System bar button wiring (new, HMI) — one XML element with three independent jobs: what a tap launches, optional controller logic, and when the button lights up by component, package or category; and why launching and highlighting can fail separately.',
        links: [{ label: 'System bar button wiring', href: '/learn/hmi/system-bar-button-wiring/' }],
      },
      {
        type: 'added',
        text: 'car-ui-lib in the source tree (new, HMI) — in the author’s tree the library is four prebuilt files that Soong imports; how to read a screen’s layout to see what it really uses, and why a FocusArea does not mean CarUiRecyclerView.',
        links: [{ label: 'car-ui-lib in the tree', href: '/learn/hmi/car-ui-lib-in-the-tree/' }],
      },
      {
        type: 'added',
        text: 'car-ui-lib: RRO or OEM plugin (new, HMI) — two ways to restyle the library: a resource overlay per app that swaps named values, or a plugin APK that replaces widget code; the gates that switch each on, and what was not confirmed on the running product.',
        links: [{ label: 'car-ui-lib: RRO or OEM plugin', href: '/learn/hmi/car-ui-lib-rro-vs-oem-plugin/' }],
      },
      {
        type: 'added',
        text: 'What “AI” actually means (new, AI & ML, free) — AI, machine learning, deep learning and large language models as nested sets, narrow versus general AI, what to ask of an “AI-powered” claim, and a runnable contrast between a hand-written rule and a learned rule.',
        links: [{ label: 'What AI actually means', href: '/ai-ml/ai-ml/foundations/what-ai-actually-means/' }],
      },
      {
        type: 'added',
        text: 'The history of AI and ML (new, AI & ML) — the waves from Turing and the 1956 workshop to transformers, and why each rose and stalled (data, compute, algorithms, expectations), with a runnable XOR experiment.',
        links: [{ label: 'The history of AI and ML', href: '/ai-ml/ai-ml/foundations/history-of-ai-and-ml/' }],
      },
      {
        type: 'added',
        text: 'The AI landscape map (new, AI & ML) — tasks, data types, method families, applications and roles in one map, a decision flow for where to start, and how to sort real claims from hype.',
        links: [{ label: 'The AI landscape map', href: '/ai-ml/ai-ml/foundations/the-ai-landscape-map/' }],
      },
      {
        type: 'added',
        text: 'A model is a recipe plus a pile of numbers (new, AI & ML) — architecture versus weights, counting parameters by hand and in code, saving and reloading weights, and why a 7-billion-parameter model is a few gigabytes.',
        links: [{ label: 'A model is just weights', href: '/ai-ml/ai-ml/foundations/a-model-is-just-weights/' }],
      },
      {
        type: 'added',
        text: 'Training versus inference (new, AI & ML) — two opposite workloads, measured timings, why training needs about 16 bytes per parameter, latency versus throughput, and why on-device usually means inference only.',
        links: [{ label: 'Training versus inference', href: '/ai-ml/ai-ml/foundations/training-vs-inference/' }],
      },
      {
        type: 'added',
        text: 'Learning paradigms (new, AI & ML) — supervised, unsupervised, semi-supervised, self-supervised and reinforcement learning by the signal each learns from, with real runs of a classifier, k-means and a bandit.',
        links: [{ label: 'Learning paradigms', href: '/ai-ml/ai-ml/foundations/learning-paradigms/' }],
      },
      {
        type: 'added',
        text: 'Classification, regression and generation (new, AI & ML) — the shape of the answer fixes the loss and the metric; scores to probabilities by hand, and how the wrong shape gives a system that runs but answers the wrong question.',
        links: [{ label: 'Classification, regression and generation', href: '/ai-ml/ai-ml/foundations/classification-regression-generation/' }],
      },
      {
        type: 'added',
        text: 'Data, the fuel of ML (new, AI & ML) — examples, features and labels, images and text as numbers, a measured learning curve, label noise and sampling bias, and the train, validation and test idea.',
        links: [{ label: 'Data, the fuel of ML', href: '/ai-ml/ai-ml/foundations/data-the-fuel-of-ml/' }],
      },
      {
        type: 'added',
        text: 'How a model learns, in intuition (new, AI & ML) — the five-step loop of guess, loss, slope, nudge and repeat; a line fitted by gradient descent with real loss values and what the learning rate does.',
        links: [{ label: 'How a model learns', href: '/ai-ml/ai-ml/foundations/how-a-model-learns-intuition/' }],
      },
      {
        type: 'added',
        text: 'Overfitting, in intuition (new, AI & ML) — a polynomial experiment that shows training error falling while test error turns up, the U-shaped curve, the honest train/test split and the first remedies.',
        links: [{ label: 'Overfitting in intuition', href: '/ai-ml/ai-ml/foundations/overfitting-intuition/' }],
      },
      {
        type: 'added',
        text: 'Rotary focus areas under the hood (new, HMI) — RotaryService is an accessibility service in its own app that cannot see your views: it recognises FocusArea and FocusParkingView by the class name each node reports, how direct manipulation works, and the three roads (car-ui-lib, car-rotary-lib, your own class).',
        links: [{ label: 'Rotary focus areas under the hood', href: '/learn/hmi/rotary-focus-areas-under-the-hood/' }],
      },
      {
        type: 'added',
        text: 'car-qc-lib and Quick Controls (new, HMI) — the separate module that owns the Quick Controls panel code, how apps carry their own copy through static_libs, and which edits are source edits in the tree versus overlay or a new prebuilt.',
        links: [{ label: 'car-qc-lib and Quick Controls', href: '/learn/hmi/car-qc-lib-quick-controls/' }],
      },
      {
        type: 'added',
        text: 'Car Java internals (new, car framework) — how createCar waits for Car Service on the modern and legacy paths, the name-keyed manager cache in front of a switch, the reflection fallback, why getCarManager returns null, and the CarManagerBase contract.',
        links: [{ label: 'Car Java internals', href: '/learn/car-framework/car-java-internals/' }],
      },
      {
        type: 'added',
        text: 'Car Service process and the builtin split (new, car framework) — Car Service as a persistent app, how ICarImpl registers as car_service, and why the builtin and Mainline-updatable halves are a class-loading boundary, not a process boundary.',
        links: [{ label: 'Car Service process and builtin split', href: '/learn/car-framework/car-service-process-and-builtin-split/' }],
      },
      {
        type: 'added',
        text: 'The Car Service helper in system_server (new, car framework) — why the helper lives inside system_server, the two contracts and the handshake, the SYSTEM_UID guard, and what belongs in Car Service instead.',
        links: [{ label: 'The Car Service helper', href: '/learn/car-framework/car-service-helper-service/' }],
      },
      {
        type: 'added',
        text: 'Optional car features (new, car framework) — what optional means, the lists and defaults that decide whether a Car Service part is built, the two checks, why a skipped service gives null, and what an app should do about it.',
        links: [{ label: 'Optional car features', href: '/learn/car-framework/car-optional-features/' }],
      },
      {
        type: 'added',
        text: 'Car Service crash recovery (new, car framework) — who reacts when Car Service dies: the Car library, the system_server helper and the activity manager; why managers are never revived and how an app should listen for ready and fetch fresh ones.',
        links: [{ label: 'Car Service crash recovery', href: '/learn/car-framework/car-service-crash-recovery/' }],
      },
      {
        type: 'added',
        text: 'The launcher app grid internals (new, HMI) — who owns the all-apps button, where the list comes from, the persisted drag-to-reorder order file, Pin to Dock across processes, and the recents row that is switched off.',
        links: [{ label: 'Launcher app grid internals', href: '/learn/hmi/car-launcher-app-grid-internals/' }],
      },
      {
        type: 'added',
        text: 'The launcher media card (new, apps and media) — the media card is half of a shared bottom slot with the in-call card, the two flag-selected versions, and how the playing app is found.',
        links: [{ label: 'The launcher media card', href: '/learn/apps-media/launcher-media-card/' }],
      },
      {
        type: 'added',
        text: 'Launcher Recents (new, HMI) — Recents as a contact sheet of stored snapshots fed by the window system, the service that answers the Overview button, and what dismiss and Clear all really do.',
        links: [{ label: 'Launcher Recents', href: '/learn/hmi/car-launcher-recents/' }],
      },
      {
        type: 'added',
        text: 'The launcher architecture (new, HMI) — the CarLauncher home screen as one activity with named containers, how a class-name resource becomes a card, the extension ladder from resources to replacing the launcher, and why a separately installed app cannot add a card. This completes the 36 core-module pages.',
        links: [{ label: 'Launcher architecture', href: '/learn/hmi/car-launcher-architecture/' }],
      },
      {
        type: 'added',
        text: 'The ML project lifecycle (new, AI & ML) — the eight-stage loop from framing the problem to retraining, and a complete small project on a real dataset with a baseline, an honest test score, error analysis and a drift check.',
        links: [{ label: 'The ML project lifecycle', href: '/ai-ml/ai-ml/foundations/the-ml-project-lifecycle/' }],
      },
      {
        type: 'added',
        text: 'The AI vocabulary cheat sheet (new, AI & ML) — about 95 essential terms in grouped tables with a one-line definition, a confusing pair to tell apart and the page to read next, including loss, gradient, softmax, token and epoch with worked numbers.',
        links: [{ label: 'AI vocabulary cheat sheet', href: '/ai-ml/ai-ml/foundations/ai-vocabulary-cheatsheet/' }],
      },
      {
        type: 'added',
        text: 'Python crash course for ML (new, AI & ML) — just the Python an ML reader needs, run with real output: collections, functions, the fit and predict class pattern, reading a traceback, and the common traps.',
        links: [{ label: 'Python crash course for ML', href: '/ai-ml/ai-ml/python-for-ml/python-crash-course-for-ml/' }],
      },
      {
        type: 'added',
        text: 'Environments: venv, conda and uv (new, AI & ML) — what an environment physically is, how to create and rebuild one with venv and pip, conda or mamba, and uv, lock files, and the PyTorch install trap, with commands that were actually run.',
        links: [{ label: 'Environments: venv, conda and uv', href: '/ai-ml/ai-ml/python-for-ml/environments-venv-conda-and-uv/' }],
      },
      {
        type: 'added',
        text: 'Jupyter and Colab (new, AI & ML) — a notebook is a file of cells plus a kernel, the hidden-state bug and why Restart and Run All is the test, magics, Colab, and when to turn a notebook into a script.',
        links: [{ label: 'Jupyter and Colab', href: '/ai-ml/ai-ml/python-for-ml/jupyter-and-colab/' }],
      },
      {
        type: 'added',
        text: 'NumPy essentials (new, AI & ML) — arrays, indexing, views versus copies, broadcasting and the axis argument worked on small shapes, and a measured comparison of a Python loop against a vectorised call.',
        links: [{ label: 'NumPy essentials', href: '/ai-ml/ai-ml/python-for-ml/numpy-essentials/' }],
      },
      {
        type: 'added',
        text: 'pandas essentials (new, AI & ML) — DataFrames, selecting, missing values, groupby, the four join types, the copy trap, and a messy table cleaned end to end, with every output captured.',
        links: [{ label: 'pandas essentials', href: '/ai-ml/ai-ml/python-for-ml/pandas-essentials/' }],
      },
      {
        type: 'added',
        text: 'Visualisation with matplotlib and seaborn (new, AI & ML) — the Figure and Axes model, choosing the right chart for a question, how charts mislead, saving figures and seaborn as a layer on matplotlib, taught through code that was run and the numbers behind each plot.',
        links: [{ label: 'Visualisation with matplotlib and seaborn', href: '/ai-ml/ai-ml/python-for-ml/visualisation-with-matplotlib-and-seaborn/' }],
      },
      {
        type: 'added',
        text: 'The scikit-learn API (new, AI & ML) — the few verbs every estimator shares, the fit-on-train-only rule with a leakage experiment, pipelines, cross-validation, and saving a model safely.',
        links: [{ label: 'The scikit-learn API', href: '/ai-ml/ai-ml/python-for-ml/the-scikit-learn-api/' }],
      },
      {
        type: 'added',
        text: 'PyTorch tensors and autograd (new, AI & ML) — tensors and their link to NumPy, how autograd records operations and fills gradients, checked against hand derivatives and finite differences, and one hand-written training step.',
        links: [{ label: 'PyTorch tensors and autograd', href: '/ai-ml/ai-ml/python-for-ml/pytorch-tensors-and-autograd/' }],
      },
    ],
  },
  {
    version: '2026.10.19',
    date: '2026-10-19',
    title: 'Multi-display, graphics and a complete Foundations section: 50 new pages, with Learn and Tutorials mapped both ways',
    changes: [
      {
        type: 'added',
        text: 'Multi-display foundations (2 tutorials) — the display ↔ occupant zone ↔ user mental model every later tutorial relies on, and the clarification that “zone” means two unrelated things: HVAC zones and occupant zones.',
        links: [
          { label: 'The AAOS multi-display mental model', href: '/tutorials/multi-display/aaos-multi-display-overview/' },
          { label: 'HVAC zones vs. occupant zones', href: '/tutorials/multi-display/hvac-zones-vs-occupant-zones/' },
        ],
      },
      {
        type: 'added',
        text: 'Passenger display (13 tutorials) — enable a second display statically or by hotplug, write the occupant-zone config, then place the launcher and SystemUI on it, control which apps run where, and cover per-display UX restrictions, theming, input routing, cross-zone messaging and what happens to an app when its display disappears. Built and run on the tejas_car_x86_64 product, with confirmed findings kept apart from uncertain ones.',
        links: [
          { label: 'Enabling a passenger display (static)', href: '/tutorials/multi-display/enabling-passenger-display-static/' },
          { label: 'Occupant zone config deep dive', href: '/tutorials/multi-display/occupant-zone-config-deep-dive/' },
          { label: 'What happens when a display disappears', href: '/tutorials/multi-display/app-lifecycle-display-removal/' },
        ],
      },
      {
        type: 'added',
        text: 'Multi-display, multi-user (6 tutorials) — HSUM versus MUMD, assigning a real user to the passenger zone and where it honestly stops, permissions and SELinux, per-user data isolation, audio zones and media per occupant zone.',
        links: [
          { label: 'HSUM vs MUMD', href: '/tutorials/multi-display/mdmu-concepts-hsum-vs-mumd/' },
          { label: 'Assigning a user to the passenger zone', href: '/tutorials/multi-display/per-zone-user-assignment/' },
        ],
      },
      {
        type: 'added',
        text: 'Multi-display build & debug (3 tutorials) — product-config patterns, the adb toolkit for inspecting zones and displays, and a symptom-to-fix troubleshooting guide.',
        links: [
          { label: 'The debugging toolkit', href: '/tutorials/multi-display/debugging-and-adb-toolkit/' },
          { label: 'Common pitfalls and troubleshooting', href: '/tutorials/multi-display/common-pitfalls-and-troubleshooting/' },
        ],
      },
      {
        type: 'added',
        text: 'Every tutorial in the series carries at least one diagram and one reference table — 34 diagrams in all, from the display-to-user mapping to a symptom-to-fix decision tree. The tutorial count on the home page goes from 33 to 57.',
      },
      {
        type: 'changed',
        text: 'The four multi-display tracks are now one track, “Multi-display & multi-user”, in four sections — Foundations, Passenger display, Multi-user (MDMU) and Build & debug — numbered 1 to 24 in reading order. Their addresses moved from /tutorials/passenger-display/…, /tutorials/mdmu/… and /tutorials/multi-display-debugging/… to /tutorials/multi-display/….',
        links: [{ label: 'Multi-display & multi-user', href: '/tutorials/multi-display/aaos-multi-display-overview/' }],
      },
      {
        type: 'added',
        text: 'Learn and Tutorials are now mapped both ways. Every tutorial opens with “Read first in Learn AAOS” — the background topics it assumes, in reading order — and every Learn topic a tutorial builds on ends with “Put it into practice”, listing those tutorials. 57 of the 100 Learn topics have at least one.',
      },
      {
        type: 'changed',
        text: 'The Learn index is grouped by domain — vehicle data, framework and security, HMI and apps, displays and users, connectivity, platform and build, SDV — and each tutorial track names the Learn domain that explains it, so the same subject no longer sits under two unrelated headings.',
        links: [{ label: 'Learn AAOS', href: '/learn/' }],
      },
      {
        type: 'added',
        text: 'Three new guided paths: Adding a passenger display and a second user, Following one signal from the bus to an app, and Building your own OEM product image. Each interleaves Learn topics with tutorials, with a line on why each step follows the last.',
        links: [{ label: 'Guided paths', href: '/learn/start/' }],
      },
      {
        type: 'added',
        text: 'Graphics & compositing (10 tutorials) — what happens between an app drawing a frame and a pixel lighting up: SurfaceFlinger and Hardware Composer across displays, the GPU rendering engine, gralloc and BufferQueue, the four HWC composition backends, protected content, Choreographer, and a real investigation into why a passenger display’s screenshot was black. Per-display VSync, insets and cutouts, and a map of the graphics topics covered elsewhere on the site. Each has a diagram and reference tables, with confirmed findings kept apart from uncertain ones.',
        links: [
          { label: 'SurfaceFlinger and HWC across displays', href: '/tutorials/graphics/surfaceflinger-hwc-multi-display/' },
          { label: 'Why the passenger display screenshot was black', href: '/tutorials/graphics/flag-secure-and-screenshots-per-display/' },
          { label: 'VSync, per display', href: '/tutorials/graphics/vsync-per-display/' },
        ],
      },
      {
        type: 'added',
        text: 'Foundations grows from 8 to 24 topics, in six sections — Orientation, The vehicle around Android, Anatomy, How it runs, Getting hands-on, and Shipping and maintaining. Sixteen are new: why the car is not a big phone, open source and licensing, who is who in a programme, where Android sits in the vehicle, the head-unit hardware, AAOS among other automotive operating systems, safety classes, where the car code lives, partitions and Treble, Android building blocks for embedded engineers, the security sandbox, the services behind android.car, a concept map linking every topic on the site, your first hour on a running device, how to read AOSP source, and living with an AOSP fork. Each has a diagram, reference tables and a worked scenario. Learn topics now support section headings.',
        links: [
          { label: 'The car is not a big phone', href: '/learn/foundations/the-car-is-not-a-big-phone/' },
          { label: 'The AAOS concept map', href: '/learn/foundations/the-aaos-concept-map/' },
          { label: 'Where the car code lives', href: '/learn/foundations/where-the-car-code-lives/' },
          { label: 'Your first hour on a running device', href: '/learn/foundations/your-first-hour-on-a-running-device/' },
        ],
      },
      {
        type: 'changed',
        text: 'The first five pages of a rewrite of every Learn topic and tutorial. Each now follows one structure: an introduction with the terms you need first, a “you are here” map of the stack, a plain-words explanation with diagrams, a worked example, a conclusion, and a revision section with a one-screen summary, self-test questions with hidden answers, and an explain-it-back prompt. Advanced detail sits in collapsed “Go deeper” blocks.',
        links: [
          { label: 'How Binder and AIDL actually work', href: '/learn/car-framework/binder-and-aidl/' },
          { label: 'Logging strategy for a vehicle', href: '/learn/build-test/logging-strategy/' },
          { label: 'Calm Mode', href: '/tutorials/apps-ui/custom-calm-mode/' },
          { label: 'OTA packaging', href: '/tutorials/platform/custom-ota-packaging/' },
          { label: 'Send data between occupant zones', href: '/tutorials/framework/custom-occupant-connection/' },
        ],
      },
    ],
  },
  {
    version: '2026.09.17',
    date: '2026-09-17',
    title: 'Four new developer tools',
    changes: [
      {
        type: 'added',
        text: 'VHAL property ID decoder — paste any 32-bit property ID and see its group, area, type and ordinal broken out, matched against a real property where one exists; or build an ID from scratch by picking the fields. Verified against all 280 properties in VehicleProperty.aidl.',
        links: [{ label: 'VHAL property ID decoder', href: '/learn/vhal-id-decoder/' }],
      },
      {
        type: 'added',
        text: 'Permission lookup — search by property or by permission string to find the exact android.car.permission a property’s read or write access needs, and its protection level. Covers all 118 permissions generated from Car.java and VehiclePropertyIds.java.',
        links: [{ label: 'Permission lookup', href: '/learn/permission-lookup/' }],
      },
      {
        type: 'added',
        text: 'Boot sequence timeline — the nine stages from ignition to home screen as a click-through reference, each with the command that confirms it happened, plus the article’s own debugging order for a head unit that won’t boot.',
        links: [{ label: 'Boot sequence timeline', href: '/learn/boot-timeline/' }],
      },
      {
        type: 'added',
        text: 'VSS ↔ VehicleProperty mapper — Vehicle Signal Specification paths matched to their closest AAOS property, with the real unit, encoding or granularity mismatch each pair has stated plainly rather than assumed away.',
        links: [{ label: 'VSS ↔ VehicleProperty mapper', href: '/learn/vss-mapper/' }],
      },
    ],
  },
  {
    version: '2026.09.16',
    date: '2026-09-16',
    title: 'Full screen for the vehicle property simulator',
    changes: [
      {
        type: 'added',
        text: 'A "Full screen" button on the simulator expands the whole panel — both 3D views and the full controls sidebar, nothing hidden — over the site’s own header, so there’s more room without giving anything up. Exit with the button or Escape.',
        links: [{ label: 'Vehicle property simulator', href: '/learn/vehicle-simulator/' }],
      },
    ],
  },
  {
    version: '2026.09.15',
    date: '2026-09-15',
    title: 'Three upgrades to the vehicle property simulator',
    changes: [
      {
        type: 'added',
        text: 'Guided scenarios — the "things worth trying" list is now a set of interactive scenarios inside the simulator itself. Press play and the real controls step through the same writes, narrated one at a time, instead of asking you to go find and flip them by hand.',
        links: [{ label: 'Vehicle property simulator', href: '/learn/vehicle-simulator/' }],
      },
      {
        type: 'added',
        text: 'Area-ID highlighting — hovering a per-area control (a specific tyre, door, mirror or seat belt) now rings that exact zone in the plan view and shows the real VehicleArea constant, instead of only naming it in a text note.',
      },
      {
        type: 'changed',
        text: 'Tried a Views/Data/Controls tabbed layout for narrow screens and reverted it — the simulator goes back to one plain scroll on mobile, same as before this round of changes.',
      },
      {
        type: 'changed',
        text: 'Telltales, control-group headings and the sidebar’s quick-jump chips now lead with a real icon — a battery, a door, a seatbelt, a parking-brake circle — instead of text alone, the way an actual instrument cluster reads at a glance. The property name stays alongside as the accessible label.',
      },
    ],
  },
  {
    version: '2026.09.14.1',
    date: '2026-09-14',
    title: 'Access-request form fixes, an AI & ML for Automotive waitlist, and a delivery switch',
    changes: [
      {
        type: 'changed',
        text: 'The access-request form now shows "AI & ML for Automotive" as a disabled, coming-soon option instead of a selectable topic, since that track has not launched yet.',
      },
      {
        type: 'fixed',
        text: 'Fixed the "accounts needed" field on the access-request form snapping back to 1 the instant it was cleared, which made it impossible to backspace and type a different number.',
      },
      {
        type: 'changed',
        text: 'Switched the access-request form’s delivery from Web3Forms to FormSubmit — no account or key needed, and the confirmation email sent back to the requester is now built per-submission with the real request details, instead of a fixed dashboard template.',
      },
    ],
  },
  {
    version: '2026.09.14',
    date: '2026-09-14',
    title: 'Nine new SDV topics, version-history diagrams, and a single access-request form',
    changes: [
      {
        type: 'added',
        text: 'Nine new SDV topics: fail-operational design and redundancy, choosing a communication pattern, phone projection as a cockpit service, personalization and profiles, model-based development, calibration and parameter management, secure boot and root of trust across a consolidated stack, threat modeling a software-defined vehicle, and a third end-to-end walkthrough following a new sensor from a bare wire to a shipped feature.',
        links: [
          { label: 'Fail-operational and redundancy', href: '/sdv/architecture/fail-operational-and-redundancy/' },
          { label: 'Choosing a communication pattern', href: '/sdv/communication/choosing-a-communication-pattern/' },
          { label: 'Projection and phone integration', href: '/sdv/ivi/projection-and-phone-integration/' },
          { label: 'Personalization and profiles', href: '/sdv/ivi/personalization-and-profiles/' },
          { label: 'Model-based development', href: '/sdv/delivery/model-based-development/' },
          { label: 'Calibration and parameter management', href: '/sdv/delivery/calibration-and-parameter-management/' },
          { label: 'Secure boot and root of trust', href: '/sdv/safety-security/secure-boot-and-root-of-trust/' },
          { label: 'Threat modeling an SDV', href: '/sdv/safety-security/threat-modeling-an-sdv/' },
          { label: 'End to end: bringing a sensor online', href: '/sdv/end-to-end/bringing-a-sensor-online/' },
        ],
      },
      {
        type: 'added',
        text: 'Two diagrams on the AAOS version history article — a release timeline marking Car UI Library, occupant zones and the HIDL-to-AIDL VHAL migration as the releases that actually change what you build against, and a side-by-side HIDL/AIDL VHAL interface comparison.',
        links: [{ label: 'How AAOS changed, release by release', href: '/learn/foundations/aaos-version-history/' }],
      },
      {
        type: 'changed',
        text: 'Replaced every "request access on LinkedIn or by email" button with a single "Request access" button that opens a short form — name, topics, how long, how many accounts — sent straight to an inbox. Payment still happens off-site; this just replaces two links with one clearer one.',
      },
    ],
  },
  {
    version: '2026.09.13',
    date: '2026-09-13',
    title: 'A third track announced, 41 diagrams fixed, and a broken mobile menu',
    changes: [
      { type: 'fixed', text: 'A full site-wide sweep for diagrams rendering as ASCII-art text instead of an actual diagram — 41 in total across Learn AAOS and SDV, including audio routing, echo cancellation, surround view, eCall triggering, verified/secure boot, vulnerability response, VSS generation, feature entitlements, virtual-ECU/SIL rigs, cockpit hypervisor consolidation, OTA rollout and package generation, AUTOSAR Classic/Adaptive, QNX microkernel isolation, zero-trust segmentation, process and zone trees, gateway filtering, a Perfetto trace view, and SOME/IP sequence exchanges — all now render as real SVG diagrams.' },
      { type: 'fixed', text: 'While auditing every diagram against its declared bounds, found and fixed 6 unrelated diagrams elsewhere on the site where a label silently overflowed and was clipped.' },
      {
        type: 'added',
        text: 'AI & ML for Automotive: a new, separately-subscribed third track alongside Learn AAOS and SDV. Not published yet — a coming-soon page explains what to expect and how to ask about early access.',
        links: [{ label: 'AI & ML for Automotive', href: '/ai-ml/' }],
      },
      {
        type: 'changed',
        text: 'Redesigned the home page around three tracks instead of two, with a dedicated section introducing AI & ML for Automotive.',
      },
      {
        type: 'added',
        text: 'Sixteen more glossary terms, rounding out general Android/AOSP basics (ADB, logcat, fastboot, Perfetto, APK, Intent, Zygote) and automotive standards (OBD-II, DTC, ISO-TP, HUD, eCall, V2X, homologation, ISO 21434, gateway).',
        links: [{ label: 'Glossary', href: '/glossary/' }],
      },
      {
        type: 'added',
        text: 'Ten new glossary terms, covering app focus, TaskMonitor, remote access, CarTelemetryManager, the assistant role, Scalable UI, Variable Update Rate, UDS, SecOC and eSIM.',
        links: [{ label: 'Glossary', href: '/glossary/' }],
      },
      {
        type: 'added',
        text: 'A new Learn AAOS topic on CarAppFocusManager — how the platform arbitrates exclusive roles like navigation between competing apps.',
        links: [{ label: 'App focus arbitration', href: '/learn/car-framework/app-focus-arbitration/' }],
      },
      { type: 'changed', text: 'Enriched 21 existing Learn AAOS articles and one tutorial with further field-notes findings, spanning media apps, voice assistant, notifications, multi-user isolation, UX restrictions, ADAS permissions, audio zone configuration, car property internals, and more.' },
      { type: 'fixed', text: 'The mobile menu trapped page scroll behind it once its own link list grew past screen height — everything below the fold, including About and Projects, was unreachable on a phone.' },
      { type: 'fixed', text: 'The "Start here" guided-paths page still claimed a fixed topic count left over from an earlier stage of the curriculum; it now reads the real number.' },
      { type: 'changed', text: 'Added three of today’s new topics — CAN bus security, CI device flashing, UDS diagnostics — to the embedded-developer guided path; they had shipped without a route pointing at them.' },
      { type: 'added', text: 'Changelog entries for new pages now link straight to them, and their cards carry a "New" badge for a few weeks after they ship.' },
      {
        type: 'added',
        text: 'A new tutorial on registering as the system task monitor with CarActivityManager, and the takeover it causes.',
        links: [{ label: 'Register as the system task monitor', href: '/tutorials/framework/custom-task-monitor/' }],
      },
      { type: 'changed', text: 'Enriched eight existing tutorials and articles with further field-notes findings — fixed-activity display routing, remote-access client registration, Vehicle Map Service layer filtering, watchdog I/O overuse stats, media playback restore ordering, batched async property reads and writes, a permission-grant/enforcement mismatch, and staged-versus-active UX restriction configs.' },
    ],
  },
  {
    version: '2026.09.12',
    date: '2026-09-12',
    title: 'Private content, an installable app, and two security fixes',
    changes: [
      { type: 'changed', text: 'Moved every paywalled article’s source into a private repository — it no longer sits in this public repo’s history regardless of the paywall.' },
      { type: 'added', text: 'The site is now installable as an app, and keeps working offline for pages you’ve already visited.' },
      { type: 'added', text: 'An Android app build, wrapping the site as a Trusted Web Activity.' },
      { type: 'security', text: 'Fixed a paywall bypass: the glossary page’s structured data was exposing every locked term’s definition regardless of access.' },
      { type: 'fixed', text: 'Locked vehicle-property pages were showing their summary before a reader had unlocked them.' },
      { type: 'added', text: 'A branded error page, in place of the framework’s generic one.' },
      { type: 'fixed', text: 'Copy protection extended to the glossary and a tutorial section that had none.' },
      { type: 'fixed', text: 'A glossary notice that kept telling readers they needed a key after they had already unlocked it.' },
      {
        type: 'added',
        text: 'Four new Learn AAOS topics: eSIM provisioning, CAN bus security, the UDS diagnostic protocol underneath OBD-II, and flashing/OTA testing in CI.',
        links: [
          { label: 'eSIM provisioning', href: '/learn/connectivity/esim-provisioning/' },
          { label: 'CAN bus security', href: '/learn/security/can-bus-security/' },
          { label: 'UDS diagnostics', href: '/learn/car-framework/uds-diagnostics/' },
          { label: 'CI device flashing', href: '/learn/platform-build/ci-device-flashing/' },
        ],
      },
      { type: 'fixed', text: 'Content categories are now checked against the curriculum at build time — a mismatch fails the build instead of silently vanishing.' },
      { type: 'changed', text: 'Renamed two curriculum categories that were too easy to confuse with similarly-named parts of the site, and cross-linked both pairs.' },
      { type: 'added', text: 'The SDV section now has the same sub-navigation Learn AAOS has, instead of one flat link.' },
      { type: 'added', text: 'Articles can now show when they were last updated.' },
      { type: 'added', text: 'This changelog.' },
    ],
  },
  {
    version: '2026.09.11',
    date: '2026-09-11',
    title: 'SEO fixes, and 20 new tutorials and articles',
    changes: [
      { type: 'added', text: '11 new tutorials and 2 new Learn AAOS articles, from a full field-notes analysis pass.' },
      { type: 'changed', text: 'Enriched 37 existing articles with additional field-notes findings.' },
      { type: 'security', text: 'Fixed the site’s biggest SEO risk: paywalled pages were indexable as thin content.' },
      { type: 'changed', text: 'Removed the GitHub profile link — the public repo’s history could otherwise expose paywalled content.' },
      { type: 'changed', text: 'Homepage stats are now computed from the actual content instead of hardcoded.' },
      { type: 'fixed', text: 'Closed legal-readiness gaps found in a subscription-terms audit.' },
    ],
  },
  {
    version: '2026.09.10',
    date: '2026-09-10',
    title: 'Safety disclosures',
    changes: [
      { type: 'changed', text: 'Added safety context and content disclosures to hardware-modification tutorials.' },
    ],
  },
  {
    version: '2026.09.09',
    date: '2026-09-09',
    title: 'Learn AAOS expands to 89 topics',
    changes: [
      { type: 'added', text: '11 new Learn AAOS topics (78 → 89), woven into the guided learning paths.' },
      { type: 'added', text: '24 more vehicle properties wired into the property simulator.' },
      { type: 'added', text: 'A get/set architecture-flow diagram, rolled out across all 264 public-API properties.' },
      { type: 'added', text: 'Real screenshots on the homepage, not just stats.' },
      { type: 'fixed', text: 'The Java/Kotlin code toggle on unlocked vehicle properties.' },
      { type: 'fixed', text: 'Technical errors, broken navigation and content gaps across the curriculum.' },
      { type: 'changed', text: 'Redesigned the simulator’s controls panel around finding a property fast.' },
      { type: 'changed', text: 'Scoped the content licence away from the premium tracks.' },
    ],
  },
  {
    version: '2026.08.30',
    date: '2026-08-30',
    title: 'First posts, image watermarking',
    changes: [
      { type: 'added', text: 'The first four blog posts — Android Automotive vs. Android Auto, VHAL, AAOS as open source, and the hidden Android system service.' },
      { type: 'added', text: 'Automatic watermarking of uploaded images at build time.' },
      { type: 'fixed', text: 'Cover images not updating when replaced — added cache-busting fingerprints.' },
      { type: 'changed', text: 'Extended the copy deterrent to images and post titles.' },
      { type: 'fixed', text: 'Post filenames restricted to plain ASCII, to stop broken links.' },
    ],
  },
  {
    version: '2026.09.08',
    date: '2026-09-08',
    title: 'The premium access system',
    changes: [
      { type: 'added', text: 'A two-tier premium system — a free trial’s worth of content open to everyone, the rest encrypted until unlocked.' },
      { type: 'added', text: 'A global unlock control in the header, reachable from any page.' },
      { type: 'changed', text: 'Rebuilt the home page around Learn AAOS as the main destination.' },
      { type: 'fixed', text: 'A “Request access” button that was effectively invisible; added an email option alongside LinkedIn.' },
      { type: 'fixed', text: 'Lock badges and disabled rows not clearing once a reader actually held a valid key.' },
    ],
  },
  {
    version: '2026.08.29',
    date: '2026-08-29',
    title: 'Launch: interactive tools, search and the writing pipeline',
    changes: [
      { type: 'added', text: 'An interactive 3D vehicle property simulator, with inside and outside views.' },
      { type: 'added', text: 'A cockpit zones and multi-display simulator.' },
      { type: 'added', text: 'Site-wide search.' },
      { type: 'added', text: 'Guided learning paths with on-device progress tracking.' },
      { type: 'added', text: 'A read-aloud player for every article, tutorial and post, using the browser’s own neural voices.' },
      { type: 'changed', text: 'Reorganized the CV under /about/ and dropped former-employer names.' },
      { type: 'security', text: 'Added a deterrent against copying written material — code and property data stay freely copyable.' },
      { type: 'changed', text: 'Licensed the code and writing explicitly, with AOSP material properly attributed.' },
    ],
  },
]
