TOPIC: [REPLACE THIS WITH THE TOPIC YOU WANT]

Create a researched rabbit hole for my website, Rabbit Hole. Browse to verify the content, then deliver one complete topic JSON file plus useful optional HTML experiments.

## Journey

- Plan a connected train of discoveries before writing. Start with the requested subject, then follow mechanisms, experiments, consequences and surprising connections. Related subjects can stay inside this topic file: messenger pigeons might lead through smell maps, compass experiments and other birds' extraordinary abilities. Choose a route suited to this topic.
- SIX depths minimum, no maximum. Independently choose a satisfying, finite stopping point from the research; six is not a target. Do not pad, impose a cap, ask me for a count or stop mid-journey. You need not exhaust every possible connection.
- Every depth, including the last, must teach a concrete discovery. Explain how mechanisms work in plain language, with specific names, evidence and details. Skip obvious encyclopaedia background, filler, repeated summaries and unanswered-question cards. Explain the evidence and uncertainty behind a claim such as a pigeon's magnetic compass, rather than merely naming it.
- If I later ask to go further, research and append distinct connected depths to the existing JSON. Preserve content and IDs unless corrections are needed; change the previous endpoint's final flag to false and mark only the new last depth true. Return the complete updated file. Extensions need not add six depths: the minimum applies to the whole topic. The endpoint is provisional.

## Objects and space

- Each depth has 1-4 objects in any combination or order. If any text box has multiple paragraphs, the maximum is THREE objects for that depth. Use fewer when needed; the whole depth must fit a screen without scrolling. Never pad to the maximum.
- Supported types: fact (text), image (including maps, diagrams and illustrations), video (YouTube), article, experiment (local interactive HTML). At least one fact.text or article.description per depth must explain the discovery without requiring a click or video. No automatic takeaway or topic-image cards.
- Each object must add distinct information. Do not repeat headlines, facts or media across depths, or paraphrase a fact as another card. A source can support different claims. Captions describe what is shown; article descriptions convey a specific fact, not just "read more".
- Text boxes may have one or several focused paragraphs; encode paragraph breaks as \n\n within JSON strings. Single-paragraph facts normally use 25-50 words, up to 70 for mechanisms. Article descriptions normally use 25-45 words. Multiple paragraphs may exceed these guidelines when needed, subject to the space limits. Keep titles, captions and video notes concise.
- Choose media that explains or reveals something. For the Great Emu War, show a useful contemporary newspaper article or a legible, reusable scan, distinguishing its reporting from established facts. For messenger pigeons, consider a verified map of notable wartime routes or a documented messenger pigeon with its message capsule/equipment. For an animal's unusual trait, use a diagram of its relevant anatomy or mechanism when helpful. Skip generic pictures and obvious explanations of what a pigeon is or looks like. Do not force media into every topic or invent assets.

## Research and media

- Show the evidence itself when it helps the visitor understand or assess a discovery: historical documents, letters, archival photographs, newspaper scans, artefacts, experiment footage, observations or research figures. Use the existing image, video or article types within the object limits. Explain what the evidence shows, its provenance and context, and what it can or cannot establish. Distinguish original records from later retellings or reconstructions, verify reuse permissions where needed, and avoid decorative evidence that adds no insight.
- Open reliable sources before writing; prefer original papers, universities, museums, archives and careful historical scholarship. Verify exact claims, dates, numbers and context. Check recent research where popular explanations may be outdated.
- Every fact needs at least one source supporting its actual text. Use evidence values: documented (established observation/history), experiment (reported test/result), hypothesis (proposed explanation), disputed (contested claim). State important limitations in the object. Distinguish laboratory findings from mechanisms demonstrated in living animals, and contemporary records from later retellings. Avoid unsupported precision, including death tolls.
- Write original prose. Never invent quotations, claims, statistics, source titles, publishers, URLs or media IDs. Use verified HTTPS links. Remove weak content rather than speculate. If browsing is unavailable, disclose that instead of pretending verification.
- YouTube: verify the actual title, channel and 11-character ID; the app derives watch and thumbnail URLs from it. Note language or material caveats. Aim for at least one useful video, but omit videos if none can be verified.
- Images: verify provenance and reusable licensing; provide a direct image URL, accurate alt text, creator/license credit and source-page URL. CSS crops/darkens images: ensure permission and mention that treatment in credit. Identify illustrations, reconstructions and depictions of different events. A cover is required for the topic picker, but is not automatically displayed at each depth.

## Optional interactive experiments

Create a simple experiment when interaction makes a concept easier to understand; there is no quota. Example: a pigeon navigation map where changing available smell, sun or landmark clues changes an illustrative flight path. Explain what changes and why; label simplified models, hypothetical routes and uncertainty. Do not present invented outputs as measured scientific predictions.

Deliver complete standalone files at diagrams/<topic-id>-<concept>.html, with embedded CSS, JavaScript and graphics. They must work locally and offline without a server, build step, API key or CDN. Include clearly labelled controls, a clear initial state, reset, mobile and keyboard usability, a brief explanation, verified source links and important model limitations.

I will download the HTML into diagrams/. Connect each file using an experiment object at the relevant depth (see below), counting it within the same 4/3-object limits. Also give a placement note outside the JSON: topic ID, depth ID, filename and learning outcome. The website opens the HTML from its experiment card; do not put HTML in an image field.

## Exact JSON contract (version 2)

Use only the fields below. This is static content with no backend, runtime AI, content API or database; experiments are separate HTML files. The following is a schema reference, not final content. Replace all illustrative values.

Topic fields:
- schemaVersion: 2
- id: unique lowercase kebab-case topic slug
- title: a concise, captivating statement of a surprising, verified capability, feat or event. For an ability, describe what the relevant animals or subjects can do in general, rather than framing it as one individual's anecdote: "Homing pigeons can find home from over 1,600 km away." Convey the supported extent without implying every individual achieves it. Use "up to" only for an established upper range or limit; a recorded feat alone does not establish the maximum. Avoid generic how/why questions, unsupported numbers, implied nonstop flight, exaggeration and empty clickbait.
- category: exactly one category below
- hook: at most 101 characters, including spaces and punctuation. Complement the title with a vivid clue, unexpected connection or compelling stakes that makes the rabbit hole sound worth exploring. Reveal just enough to spark curiosity without repeating the title, summarising the journey or promising more than the evidence supports.
- image: cover object with exactly url, alt, credit, sourceUrl
- levels: ordered array of at least six depths, without an upper limit

Depth fields:
- id: kebab-case ID unique within the topic
- title: short, specific discovery heading
- objects: 1-4 objects (maximum three with any multi-paragraph text box)
- final: false except for the actual last depth, which is true

Choose one overall category by the topic's main appeal, independently of fact evidence badges:
- Explained: extraordinary subject with an established scientific mechanism; disclose unsettled secondary details.
- Unsolved: genuine mystery with competing hypotheses; show evidence and disagreement without manufacturing uncertainty.
- Mind-bending: challenges intuition, even if well explained, such as a brainless organism solving a maze.
- Dark & disturbing: unsettling aspects are central, such as parasites, disasters or gruesome history.

Use exact spelling/capitalisation. Never combine categories, assign them per depth or use "All" (a website filter). Categories determine matching topic selections; do not include filter state in JSON.

Each object has exactly the fields shown for its type. Interactive HTML uses this additional supported type; file must be a local diagrams/<kebab-case-name>.html path, not an HTTPS URL:

```json
{"type":"experiment","id":"experiment-id","title":"Try the experiment","file":"diagrams/topic-concept.html","description":"What the interaction helps explain"}
```

```json
{"type":"fact","id":"object-id","title":"Specific claim","text":"Self-contained explanation","evidence":"documented","sources":[{"title":"Actual source title","publisher":"Actual publisher","url":"https://verified-source"}]}
```

```json
{"type":"image","id":"object-id","title":"What is shown","image":{"url":"https://verified-direct-image","alt":"Accurate description","credit":"Creator, license and display treatment","sourceUrl":"https://verified-source-page"},"caption":"Specific context"}
```

```json
{"type":"video","id":"object-id","title":"Actual video title","channel":"Actual channel","youtubeId":"REAL_ID_HERE","note":"Useful context, language or caveat"}
```

```json
{"type":"article","id":"object-id","title":"Specific reading title","publisher":"Actual publisher","url":"https://verified-article","description":"Self-contained detail from the article"}
```

The cover uses the same four fields as image.image. All strings must be nonempty and all URLs HTTPS. IDs contain only lowercase letters/numbers separated by single hyphens; object IDs are unique within each depth. Do not use null, extra fields, Markdown inside strings or old fields such as body, takeaway, eyebrow, depth-level sources/videos/image.

## Delivery and checks

Return topics/<id>.json followed by ONE complete JSON code block with every depth. No placeholders, ellipses, omitted levels, comments or trailing commas. For each useful experiment, also provide a downloadable HTML file (or a complete, filename-labelled HTML code block) and its placement note, not just an idea or pseudocode.

Before delivery, check the schema, six-depth minimum, natural endpoint, object/space limits including reserved experiment slots, unique IDs, only-last final flag, distinct content and verified sources/media. For extensions, also check preservation of earlier content. Check HTML controls, reset, offline operation and mobile/keyboard usability when tools permit; accurately state any verification limitations. Never claim repository commands or other tests were run unless they were.

I will save the JSON as UTF-8; the app discovers topic files automatically. With direct repository access, save topics/<id>.json and any diagrams/*.html files, then run npm run validate:topics. Otherwise return the complete copyable files. Rebuilding/deploying includes the topic in production.

## Complete example

The following example demonstrates four different object types and varying object counts, including a depth containing only one explanation. Its particular length is illustrative, not a required count, limit or default. Follow its STRUCTURE, not its number of depths. Research a new route and new content for the TOPIC specified at the start of this prompt. Do not copy pigeon content into an unrelated topic.

```json
{
  "schemaVersion": 2,
  "id": "messenger-pigeons",
  "title": "Homing pigeons can find home from over 1,600 km away.",
  "category": "Mind-bending",
  "hook": "Their routes home involve smell maps, a sun compass and senses scientists still debate.",
  "image": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/f/fd/Rock_pigeon_or_common_pigeon_%28Columba_livia%29.jpg",
    "alt": "A rock pigeon with an iridescent neck, the species from which homing pigeons descend.",
    "credit": "Bramans · CC BY-SA 4.0 · cropped and darkened for display",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Rock_pigeon_or_common_pigeon_(Columba_livia).jpg"
  },
  "levels": [
    {
      "id": "the-living-postal-system",
      "title": "A pigeon delivers the message by going home.",
      "objects": [
        {
          "type": "fact",
          "id": "home-is-the-address",
          "title": "The destination is its own loft",
          "text": "A messenger pigeon is carried away from its home and released with a message. It returns to its own loft, rather than choosing an address. Sending a reply requires a bird whose home is at the other end.",
          "evidence": "documented",
          "sources": [
            {
              "title": "Homing pigeon: how pigeon post works",
              "publisher": "Encyclopaedia overview",
              "url": "https://en.wikipedia.org/wiki/Homing_pigeon"
            }
          ]
        },
        {
          "type": "video",
          "id": "navigation-film",
          "title": "How Pigeons Always Find Their Way Home",
          "channel": "Real Science",
          "youtubeId": "4DkMVCzvgRg",
          "note": "An introduction to homing, historical uses, and competing navigation mechanisms. Read the later-depth studies for newer evidence."
        },
        {
          "type": "fact",
          "id": "wartime-network",
          "title": "The army used this biological delivery route",
          "text": "The US Army Signal Corps used pigeons in both World Wars to carry strategic information. A bird could transport a written message without a wire connecting the sender to the receiving loft.",
          "evidence": "documented",
          "sources": [
            {
              "title": "Rock Pigeon: natural history and cool facts",
              "publisher": "Cornell Lab of Ornithology",
              "url": "https://www.allaboutbirds.org/guide/Rock_Pigeon/overview"
            }
          ]
        },
        {
          "type": "image",
          "id": "the-familiar-bird",
          "title": "The city bird is the same species",
          "image": {
            "url": "https://upload.wikimedia.org/wikipedia/commons/f/fd/Rock_pigeon_or_common_pigeon_%28Columba_livia%29.jpg",
            "alt": "A rock pigeon with an iridescent neck, the species from which homing pigeons descend.",
            "credit": "Bramans · CC BY-SA 4.0 · cropped and darkened for display",
            "sourceUrl": "https://commons.wikimedia.org/wiki/File:Rock_pigeon_or_common_pigeon_(Columba_livia).jpg"
          },
          "caption": "Homing pigeons are domestic rock pigeons, Columba livia. The familiar urban pigeon belongs to this species too."
        }
      ],
      "final": false
    },
    {
      "id": "a-map-in-the-air",
      "title": "The landscape has a smell, and the bird learns it.",
      "objects": [
        {
          "type": "fact",
          "id": "wind-map",
          "title": "Wind can teach a pigeon where smells come from",
          "text": "A pigeon can associate environmental odours at its loft with the winds carrying them. At an unfamiliar release site, the mixture of odours may help locate the bird relative to home. This is the olfactory-map hypothesis.",
          "evidence": "hypothesis",
          "sources": [
            {
              "title": "How pigeons may smell their way home",
              "publisher": "European Geosciences Union",
              "url": "https://www.egu.eu/news/81/how-pigeons-may-smell-their-way-home/"
            }
          ]
        },
        {
          "type": "fact",
          "id": "filtered-air",
          "title": "Artificial smells did not replace the real landscape",
          "text": "Researchers transported pigeons 53 or 61 kilometres from home using natural air, filtered air, or filtered air plus artificial odours. Birds deprived of natural environmental smells navigated poorly during the first hour; adding arbitrary scents did not rescue them.",
          "evidence": "experiment",
          "sources": [
            {
              "title": "Homing pigeons only navigate in air with intact environmental odours",
              "publisher": "Gagliardo et al. · PLOS ONE, 2011",
              "url": "https://pubmed.ncbi.nlm.nih.gov/21857925/"
            }
          ]
        },
        {
          "type": "article",
          "id": "road-tracks",
          "title": "Near home, a pigeon can follow a road",
          "publisher": "Current Biology · GPS tracking study",
          "url": "https://www.sciencedirect.com/science/article/pii/S0960982204005160",
          "description": "An analysis of 216 recorded flight tracks found evidence of pigeons following roads and being attracted to highway exits. Familiar landmarks provide another kind of navigation information."
        }
      ],
      "final": false
    },
    {
      "id": "the-magnetic-sense",
      "title": "A magnetic sense needs a biological detector.",
      "objects": [
        {
          "type": "fact",
          "id": "inner-ear-induction",
          "title": "One proposed detector sits in the inner ear",
          "text": "Moving conductive fluid through a magnetic field can induce electrical signals. A brain-mapping study found magnetic responses in pigeon balance-related circuits and specialised inner-ear cells consistent with this mechanism. The researchers support an induction model; they have not settled every step of the sensory pathway.",
          "evidence": "hypothesis",
          "sources": [
            {
              "title": "A global screen for magnetically induced neuronal activity in the pigeon brain",
              "publisher": "Nordmann et al. · Science, 2026 (online 2025)",
              "url": "https://pubmed.ncbi.nlm.nih.gov/41264677/"
            }
          ]
        },
        {
          "type": "fact",
          "id": "liver-macrophages",
          "title": "Another experiment points to iron-rich immune cells",
          "text": "A 2026 study found magnetically responsive macrophages in pigeon livers. Depleting macrophages disrupted orientation under overcast skies, but not when the sun was visible. The authors propose a role in magnetic direction-finding; exactly how a signal reaches the nervous system remains unresolved.",
          "evidence": "experiment",
          "sources": [
            {
              "title": "Homing pigeon navigation relies on superparamagnetic macrophages under overcast conditions",
              "publisher": "Lisowski et al. · Science, 2026",
              "url": "https://pubmed.ncbi.nlm.nih.gov/42207892/"
            }
          ]
        },
        {
          "type": "article",
          "id": "beak-correction",
          "title": "Why the old \"magnetic beak\" explanation is too tidy",
          "publisher": "Treiber et al. · Nature, 2012",
          "url": "https://www.nature.com/articles/nature11046",
          "description": "Cells once described as magnetosensitive neurons in the upper beak were identified as iron-rich macrophages instead. Finding iron in tissue does not, by itself, identify a working compass."
        }
      ],
      "final": false
    },
    {
      "id": "tricking-the-sun-compass",
      "title": "Reset the bird's clock, and you can bend its route.",
      "objects": [
        {
          "type": "fact",
          "id": "clock-shift",
          "title": "The sun gives direction only if you know the time",
          "text": "The sun moves across the sky, so its position is not a fixed compass bearing. Pigeons combine it with an internal clock. In clock-shift experiments, altered day-night schedules changed their initial departure directions under sun, as predicted for a time-compensated sun compass. Under overcast skies, they could still orient using other cues.",
          "evidence": "experiment",
          "sources": [
            {
              "title": "Orientation by pigeons: is the sun necessary?",
              "publisher": "William T. Keeton · Science, 1969",
              "url": "https://pubmed.ncbi.nlm.nih.gov/17777007/"
            }
          ]
        }
      ],
      "final": false
    },
    {
      "id": "a-robin-and-quantum-chemistry",
      "title": "A robin may read direction through light-sensitive chemistry.",
      "objects": [
        {
          "type": "fact",
          "id": "radical-pairs",
          "title": "Blue light can start a magnetically sensitive reaction",
          "text": "In a proposed robin compass, blue light triggers electron transfers in the protein cryptochrome, creating pairs of radicals with unpaired electrons. Magnetic fields can influence their spin dynamics and reaction outcomes, potentially turning field direction into a biological signal.",
          "evidence": "hypothesis",
          "sources": [
            {
              "title": "Magnetic sensitivity of cryptochrome 4 from a migratory songbird",
              "publisher": "Xu et al. · Nature, 2021",
              "url": "https://www.nature.com/articles/s41586-021-03618-9"
            },
            {
              "title": "How birds sense the magnetic field of the Earth to help them navigate",
              "publisher": "University of Oxford",
              "url": "https://www.ox.ac.uk/news/2021-06-24-how-birds-sense-the-magnetic-field-of-the-earth-to-help-them-navigate"
            }
          ]
        },
        {
          "type": "fact",
          "id": "isolated-protein",
          "title": "The laboratory result is real; the complete compass is not yet proven",
          "text": "Researchers showed that isolated robin cryptochrome 4 responds to magnetic fields, more strongly than the pigeon and chicken versions tested. Those experiments used stronger fields than Earth's and did not demonstrate a complete compass operating inside a living bird's eye.",
          "evidence": "experiment",
          "sources": [
            {
              "title": "Magnetic sensitivity of cryptochrome 4 from a migratory songbird",
              "publisher": "Xu et al. · Nature, 2021",
              "url": "https://www.nature.com/articles/s41586-021-03618-9"
            },
            {
              "title": "How birds sense the magnetic field of the Earth to help them navigate",
              "publisher": "University of Oxford",
              "url": "https://www.ox.ac.uk/news/2021-06-24-how-birds-sense-the-magnetic-field-of-the-earth-to-help-them-navigate"
            }
          ]
        }
      ],
      "final": false
    },
    {
      "id": "beyond-the-pigeon",
      "title": "Other birds take these abilities across entire oceans.",
      "objects": [
        {
          "type": "fact",
          "id": "godwit-journey",
          "title": "One young godwit flew for 11 days without landing",
          "text": "In October 2022, a satellite-tracked juvenile bar-tailed godwit flew from Alaska to Tasmania in an uninterrupted journey lasting 11 days. Its transmitter revealed the route while the bird crossed the Pacific on its first migration.",
          "evidence": "documented",
          "sources": [
            {
              "title": "750 miles per day for 11 days, no rest",
              "publisher": "University of Alaska Fairbanks Geophysical Institute",
              "url": "https://www.gi.alaska.edu/alaska-science-forum/750-miles-day-11-days-no-rest"
            }
          ]
        },
        {
          "type": "fact",
          "id": "sleeping-frigatebirds",
          "title": "Frigatebirds can sleep while they are still flying",
          "text": "Brain recordings from great frigatebirds showed sleep during ocean flights, sometimes in one hemisphere and sometimes in both. This is direct evidence of sleep in flight, not an assumption that every long-distance bird sleeps the same way.",
          "evidence": "experiment",
          "sources": [
            {
              "title": "Evidence that birds sleep in mid-flight",
              "publisher": "Rattenborg et al. · Nature Communications, 2016",
              "url": "https://www.nature.com/articles/ncomms12468"
            }
          ]
        },
        {
          "type": "article",
          "id": "sleep-study",
          "title": "About 42 minutes of sleep per day in the air",
          "publisher": "Nature Communications, 2016",
          "url": "https://www.nature.com/articles/ncomms12468",
          "description": "The frigatebirds studied averaged 0.69 hours of sleep daily during flight: roughly 42 minutes, and only 7.4% of their sleep time on land. Sleeping airborne did not mean obtaining their usual amount of sleep."
        }
      ],
      "final": true
    }
  ]
}
```
