TOPIC: [REPLACE THIS WITH THE TOPIC YOU WANT]

Create one complete, researched rabbit hole for my website, Rabbit Hole. Use web browsing to verify the content. I will copy the JSON you return directly into my repository.

## What I want to experience

Start at the requested topic and follow an interesting train of thought downward. Build exactly SIX ordered depths. Privately plan the route before writing: after each discovery, consider what it explains, what experiment reveals it, what unexpected consequence it has, or what closely related thing becomes interesting because of it. Choose the next step from those connections. It should feel like following curiosity, rather than reading six headings from an encyclopaedia.

Start with the subject itself and get concrete quickly. Every depth must teach me something. Give names, mechanisms, experiments, observations and surprising details. If you introduce a mechanism, explain how it works in plain language. A headline or an unanswered question does not count as a fact. Avoid filler such as "the mystery gets deeper", "there is more than meets the eye", and repeated summaries of what I already learned.

For example, a pigeon journey could begin with how messenger pigeons actually deliver messages, then follow smell maps and navigation experiments, magnetic detection mechanisms, a sun-compass experiment, a robin's proposed light-sensitive compass, and other impressive birds such as an ocean-crossing godwit or a frigatebird that sleeps in flight. Related birds can be a depth INSIDE the original topic file. The route may broaden naturally; it does not need six depths only about the original animal. Do not force this same sequence onto every topic.

Give me the actual interesting content. "Pigeons have a magnetic compass" is too shallow on its own. Explain the proposed biological detector, the evidence, and what remains unresolved. Do not turn a hypothesis into a certainty to make the story more exciting. Check recent research when an older popular explanation may have changed.

## Objects, not repeated paragraphs

Each depth contains an explicit objects array with between ONE and FOUR objects inclusive. These are the floating things displayed on screen. Use the number and types the material needs. One excellent explanation can stand alone. Do not pad every depth to four objects.

Available types are fact, image, video and article. They can appear in any order or combination. At least one object per depth should deliver a self-contained concrete explanation through a fact's text or an article's description. A video/image can complement it, but the essential discovery should not require leaving the site.

Each object must add something distinct. Do not put a fact in one object and paraphrase it as a takeaway in another. Do not repeat the same headline, fact, image or video at multiple depths. Reusing a source is fine when it supports DIFFERENT claims. A media caption should describe what is actually shown; an article description should explain the specific detail it adds. There is no automatic takeaway card or automatic topic-image card.

Aim for 25-50 words per fact, with up to 70 when a mechanism needs room. Titles should be short, specific statements. An article description should normally be 25-45 words and convey actual information, rather than saying "read more". Keep image captions and video notes concise. The whole depth must fit a screen without scrolling. Prefer two or three good objects to four cramped ones.

The sixth depth must contain a final concrete discovery. It can open an intriguing related direction, but must not consist only of a recap, a vague question, or a lecture about curiosity.

## Research requirements

- Browse and open reliable sources before writing. Prefer original papers, universities, museums, archives and careful historical scholarship. Verify the exact claim, number, date and context, not just the headline.
- Every fact object needs at least one supporting source. Sources must support the text of THAT object.
- Use evidence: documented for established observations/history, experiment for a reported test/result, hypothesis for a proposed explanation, and disputed for a contested claim. Explain any important limitation in the object itself.
- Distinguish a laboratory result from a mechanism demonstrated in a living animal. Distinguish contemporary records from later historical retellings. Do not give a precise death toll when the evidence does not support it.
- Write original prose. Never invent quotations, scientific claims, statistics, titles, publishers, video IDs or URLs. Use HTTPS links you actually verified. Remove a weak object rather than filling it with speculation.
- For a YouTube object, verify its actual title, channel and 11-character video ID. The app constructs both the watch URL and thumbnail URL from that ID. Identify language or a material caveat in note. Aim for at least one useful verified video across the topic, but omit video objects if you cannot verify a suitable one.
- Use reusable images with verifiable provenance and licensing. Give a direct image URL, accurate alt text, creator/license credit and a source-page URL. The app crops/darkens images with CSS; make sure this is allowed and note the treatment. Identify reconstructions, illustrations, or depictions of a different historical event. A topic cover is required for the topic picker; it is not automatically shown at each depth. Add image objects only where they contribute.
- If browsing is unavailable, say so instead of pretending the research is verified. Do not return invented media to make the JSON look complete.

## Exact data contract - version 2

Return only the keys defined here. There is no backend, runtime AI, content API, or database. All data belongs in one static JSON file.

Topic:
- schemaVersion: exactly the number 2.
- id: a unique lowercase kebab-case slug, such as messenger-pigeons.
- title: a concise descriptive topic title.
- category: a short category label.
- hook: one or two concrete introductory sentences for the topic picker.
- image: the cover-image object defined below.
- levels: an array of EXACTLY SIX depth objects in their viewing order.

Each depth:
- id: a kebab-case ID unique within this topic.
- title: a short, specific discovery heading.
- objects: an array of 1-4 typed objects, using only the fields of that object's type.
- tangents: exactly {"left": null, "right": null}, or replace a null with a valid tangent object.
- final: false for depths 1-5; true for depth 6 only.

A fact object has exactly:
{ "type": "fact", "id": "unique-object-id", "title": "Specific claim", "text": "The factual explanation", "evidence": "documented", "sources": [{ "title": "Actual source title", "publisher": "Actual publisher", "url": "https://a-verified-source" }] }

An image object has exactly:
{ "type": "image", "id": "unique-object-id", "title": "What the image shows", "image": { "url": "https://a-verified-direct-image", "alt": "Accurate image description", "credit": "Creator, license and display treatment", "sourceUrl": "https://the-verified-image-source-page" }, "caption": "Specific context or a factual detail about the image" }

A video object has exactly:
{ "type": "video", "id": "unique-object-id", "title": "Actual video title", "channel": "Actual channel", "youtubeId": "THE_REAL_11_CHARACTER_ID", "note": "Useful context, language or caveat" }

An article object has exactly:
{ "type": "article", "id": "unique-object-id", "title": "A specific reading title", "publisher": "Actual publisher", "url": "https://a-verified-article", "description": "A self-contained fact or explanation from the linked article" }

The topic cover uses exactly the same four image fields as an image object's nested image: url, alt, credit and sourceUrl.

All strings must be nonempty, all URLs must use HTTPS, and all IDs must contain only lowercase letters/numbers separated by single hyphens. Object IDs must be unique within their depth. Every fact has at least one source. Do not include body, takeaway, eyebrow, level-level sources, level-level videos, or a level-level image; those belong to the old format. Do not use null for required object fields or add unused fields from other object types.

## Tangent rules

Tangents are currently disabled in the app. For every new depth, always use {"left": null, "right": null}. The contract below is retained for future use; do not generate tangent links while this feature is disabled.

A non-null tangent has exactly:
{ "topicId": "an-existing-topic-id", "level": 1, "label": "A concise connection", "reason": "Why these discoveries are connected" }

The level is an integer from 1 to 6 and is ONE-BASED. Tangents can point to another known topic or a meaningful depth of this same topic. Do not force connections, create fake destination topics, or add links merely to duplicate the next/back controls. The app handles the return path automatically.

If I have not supplied the repository's current topic IDs and content, leave both tangent slots null. A factual aside about another animal or event can still be an ordinary depth/object in the new topic. It does not need a separate topic file or a tangent.

## Output and installation

Return the intended filename, topics/<id>.json, followed by ONE complete JSON code block containing the topic. Return all six depths with real researched content. No ellipses, comments, placeholder values, omitted levels, Markdown inside strings, or trailing commas. The illustrative field placeholders above must never appear in the final JSON.

Before answering, check the structure, count six depths, count 1-4 objects per depth, check the final flags, check IDs, remove duplicate information, and verify that every source/media link is real. Do not claim to have run repository commands unless you actually have that access.

I will save your JSON as UTF-8 at topics/<id>.json. The app discovers topic files automatically. If you have direct access to my repository instead of ordinary ChatGPT, save the file there and use the existing topic validator; otherwise return the full copyable JSON. The local installation command is npm run validate:topics; rebuilding/deploying includes the new topic in the production site.

## Complete six-depth example

The following is a real format example from this repo, not a script to retell verbatim. It demonstrates four different object types and varying object counts, including a depth containing only one explanation. Follow its STRUCTURE. Research a new route and new content for the TOPIC specified at the start of this prompt. Do not copy pigeon content into an unrelated topic.

```json
{
  "schemaVersion": 2,
  "id": "messenger-pigeons",
  "title": "A pigeon can find a home it cannot see.",
  "category": "Animal navigation",
  "hook": "Follow a messenger pigeon from its loft into invisible maps, magnetic senses, and birds that cross oceans without landing.",
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
      "tangents": {
        "left": null,
        "right": null
      },
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
      "tangents": {
        "left": null,
        "right": {
          "topicId": "messenger-pigeons",
          "level": 4,
          "label": "The sun is another compass",
          "reason": "Smells may provide location information; a sun compass helps the bird hold a direction."
        }
      },
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
      "tangents": {
        "left": null,
        "right": {
          "topicId": "messenger-pigeons",
          "level": 5,
          "label": "A compass made from light",
          "reason": "Migratory robins offer a different candidate mechanism: magnetically sensitive chemistry in an eye protein."
        }
      },
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
      "tangents": {
        "left": null,
        "right": null
      },
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
      "tangents": {
        "left": null,
        "right": null
      },
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
      "tangents": {
        "left": {
          "topicId": "messenger-pigeons",
          "level": 5,
          "label": "Back to the robin's compass",
          "reason": "Revisit the chemistry that may help a migrating songbird hold its heading."
        },
        "right": null
      },
      "final": true
    }
  ]
}
```
