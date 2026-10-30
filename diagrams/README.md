# Interactive experiments

Place downloaded standalone HTML experiments here, named `<topic-id>-<concept>.html`.

Each file should include its CSS, JavaScript and graphics so it works locally and offline. Open the HTML file in a browser to try it.

Connect the file by adding an experiment object to the appropriate topic depth:

```json
{"type":"experiment","id":"cavitation-lab","title":"Try the cavitation lab","file":"diagrams/pistol-shrimp-cavitation-lab.html","description":"Explore a simplified model of bubble formation and collapse."}
```

The card opens the experiment in a large dialog. It counts toward the depth's object limit. Files referenced this way are included in production builds; topic validation checks that they exist.
